"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Circle,
  PhoneCall,
  PhoneOff,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage, { Message } from "./_components/ChatMessage";
import VoiceRecorder from "./_components/VoiceRecorder";
import Vapi from "@vapi-ai/web";

type DoctorData = {
  id?: number;
  specialist?: string;
  image?: string;
  agentPrompt?: string;
  voiceId?: string;
};

type Session = {
  id: number;
  notes: string;
  sessionId: string;
  doctorAgent?: DoctorData;
  selectedDocter?: DoctorData;
  conversation?: Message[];
  createdOn?: string;
};

export default function MedicalVoiceAgentPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = (params?.sessionId || params?.sesstionId) as string;

  const [session, setSession] = useState<Session | null>(null);
  const [doctor, setDoctor] = useState<DoctorData>({
    specialist: "AI Medical Specialist",
    image: "/doctor1.png",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState<{
    role: "user" | "assistant";
    transcript: string;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    }
  }, []);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Timer effect
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  // Load session
  useEffect(() => {
    if (sessionId) {
      getSessionDetails();
    }
  }, [sessionId]);

  const getSessionDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`/api/session-chat?sessionId=${sessionId}`);

      if (res.data) {
        setSession(res.data);
        const doctorInfo =
          res.data.selectedDoctor || res.data.doctorAgent || res.data.selectedDocter || {};
        setDoctor({
          id: doctorInfo.id,
          specialist: doctorInfo.specialist || "AI Medical Specialist",
          image: doctorInfo.image || "/doctor1.png",
          agentPrompt: doctorInfo.agentPrompt,
          voiceId: doctorInfo.voiceId,
        });

        if (
          Array.isArray(res.data.conversation) &&
          res.data.conversation.length > 0
        ) {
          setMessages(res.data.conversation);
        } else {
          // Default greeting
          const initialGreeting: Message = {
            role: "assistant",
            content: `Hello! I am your ${
              doctorInfo.specialist || "AI Doctor"
            }. I have reviewed your notes. How can I assist you with your health today?`,
          };
          setMessages([initialGreeting]);
        }
      }
    } catch (err) {
      console.error("Error fetching session:", err);
      setError("Failed to load consultation details.");
    } finally {
      setIsLoading(false);
    }
  };

  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Preload TTS voices — they load asynchronously in Chrome/Safari
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const speakText = (text: string, messageIndex?: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const preferredVoice = voicesRef.current.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Daniel"))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsDoctorSpeaking(true);
      if (messageIndex !== undefined) setSpeakingMessageIndex(messageIndex);
    };
    utterance.onend = () => {
      setIsDoctorSpeaking(false);
      setSpeakingMessageIndex(null);
    };
    utterance.onerror = () => {
      setIsDoctorSpeaking(false);
      setSpeakingMessageIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopDoctorSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsDoctorSpeaking(false);
    setSpeakingMessageIndex(null);
  };

  const saveConversation = async (newMessages: Message[]) => {
    try {
      await axios.put("/api/session-chat", {
        sessionId,
        conversation: newMessages,
      });
    } catch (err) {
      console.error("Error updating conversation in DB:", err);
    }
  };

  const handleSendMessage = async (userText?: string) => {
    stopDoctorSpeech();
    const textToSend = userText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: Message = { role: "user", content: textToSend.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsSending(true);

    try {
      const res = await axios.post("/api/ai-chat", {
        messages: updatedMessages,
        doctorPrompt: doctor.agentPrompt,
        notes: session?.notes || "",
      });

      const aiReplyText =
        res.data?.result || "I apologize, could you repeat that?";
      const aiMsg: Message = { role: "assistant", content: aiReplyText };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveConversation(finalMessages);

      if (isAudioEnabled) {
        speakText(aiReplyText);
      }
    } catch (err) {
      console.error("Error sending message to AI:", err);
      const errorMsg: Message = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceTranscript = (transcriptText: string) => {
    if (transcriptText) {
      setInputMessage((prev) => {
        const trimmedNew = transcriptText.trim();
        if (!prev) return trimmedNew;
        if (prev.toLowerCase().includes(trimmedNew.toLowerCase())) return prev;
        return `${prev} ${trimmedNew}`;
      });
    }
  };

  const StartCall = () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID;
    if (vapiRef.current && assistantId) {
      setIsConnecting(true);
      try {
        vapiRef.current.start(assistantId);
      } catch (err) {
        console.error("Error starting Vapi call:", err);
        setIsConnecting(false);
      }

      vapiRef.current.on("call-start", () => {
        console.log("Call started");
        setIsConnecting(false);
        setCallStarted(true);
        setIsCallActive(true);
        setActiveTranscript(null);
      });

      vapiRef.current.on("call-end", () => {
        console.log("Call ended");
        setIsConnecting(false);
        setCallStarted(false);
        setIsCallActive(false);
        setActiveTranscript(null);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapiRef.current.on("message", (message: any) => {
        if (message.type === "transcript") {
          const role: "user" | "assistant" =
            message.role === "user" ? "user" : "assistant";
          const text = message.transcript;

          if (!text) return;

          if (message.transcriptType === "partial") {
            setActiveTranscript({ role, transcript: text });
          } else if (
            message.transcriptType === "final" ||
            !message.transcriptType
          ) {
            setActiveTranscript(null);
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === role && lastMsg.content === text) {
                return prev;
              }
              const updated: Message[] = [...prev, { role, content: text }];
              saveConversation(updated);
              return updated;
            });
          }
        }
      });
    } else {
      setIsConnecting(false);
      setCallStarted(true);
      setIsCallActive(true);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (vapiRef.current) {
      try {
        vapiRef.current.setMuted(nextMute);
      } catch (err) {
        console.error("Error setting Vapi mute state:", err);
      }
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch (err) {
        console.error("Error stopping Vapi call:", err);
      }
    }
    setIsConnecting(false);
    setCallStarted(false);
    setIsCallActive(false);
    setIsMuted(false);
    setActiveTranscript(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-700 font-medium">
          Preparing AI Consultation Room...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-6rem)] bg-white rounded-2xl border border-gray-200/80 shadow-xs">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div className="flex items-center gap-3">
            <Image
              src={doctor.image || "/doctor1.png"}
              alt={doctor.specialist || "Doctor Avatar"}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover border border-primary/30 shadow-xs"
            />
            <div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                {doctor.specialist}
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Session ID: {sessionId.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Audio toggle button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            title={isAudioEnabled ? "Mute Voice Output" : "Enable Voice Output"}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </Button>

          {/* Call timer status badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-2xs bg-slate-100 text-slate-700 border-slate-200">
            {isConnecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="text-amber-700 font-medium animate-pulse">
                  Connecting...
                </span>
              </>
            ) : isCallActive ? (
              <>
                <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-mono font-bold">
                  {formatTime(callDuration)}
                </span>
              </>
            ) : (
              <>
                <Circle className="w-2.5 h-2.5 fill-slate-400 text-slate-400" />
                <span className="text-slate-600 font-medium">Idle</span>
              </>
            )}
          </div>

          {/* Call toggle & Mic Mute button */}
          {isConnecting ? (
            <Button
              disabled
              className="bg-amber-600 text-white font-semibold shadow-xs flex items-center gap-2 px-4 cursor-not-allowed opacity-90"
            >
              <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
            </Button>
          ) : !callStarted && !isCallActive ? (
            <Button
              onClick={StartCall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs flex items-center gap-2 px-4"
            >
              <PhoneCall className="w-4 h-4" /> Start Call
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={toggleMute}
                className={
                  isMuted
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 shadow-xs"
                }
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-600" />
                )}
              </Button>

              <Button
                onClick={endCall}
                variant="destructive"
                className="flex items-center gap-2 px-4 font-semibold shadow-xs"
              >
                <PhoneOff className="w-4 h-4" /> Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Patient notes callout (if present) */}
      {session?.notes && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 flex items-center gap-2 shadow-2xs">
          <FileText className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <div>
            <span className="font-bold text-amber-950">
              Patient Note Context:
            </span>{" "}
            <span className="text-amber-900 font-medium">{session.notes}</span>
          </div>
        </div>
      )}

      {/* Main Conversation Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-xl p-4 bg-slate-100/70 border border-slate-200 shadow-inner">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            doctorImage={doctor.image}
            doctorSpecialist={doctor.specialist}
            onSpeak={(text) => speakText(text, index)}
            onStopSpeaking={stopDoctorSpeech}
            isSpeaking={speakingMessageIndex === index}
          />
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-gray-500 text-xs italic py-2 pl-2 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            {doctor.specialist} is thinking...
          </div>
        )}
        {/* Real-time partial transcript preview during Vapi call */}
        {activeTranscript && (
          <div
            className={`flex items-start gap-3 my-3 ${
              activeTranscript.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-shrink-0">
              {activeTranscript.role === "user" ? (
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/40">
                  You
                </div>
              ) : (
                <Image
                  src={doctor.image || "/doctor1.png"}
                  alt={doctor.specialist || "Doctor"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-400 shadow-2xs"
                />
              )}
            </div>
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs border transition-all ${
                activeTranscript.role === "user"
                  ? "bg-primary text-white border-primary rounded-tr-none"
                  : "bg-emerald-50 text-emerald-950 border-emerald-200/90 rounded-tl-none"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1 text-[11px] opacity-90">
                <span>
                  {activeTranscript.role === "user"
                    ? "You (Speaking...)"
                    : `${doctor.specialist} (Speaking...)`}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </div>
              <p className="italic font-medium">{activeTranscript.transcript}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2.5">
        <VoiceRecorder
          onTranscript={handleVoiceTranscript}
          disabled={isSending || isDoctorSpeaking}
          isProcessing={isSending}
        />

        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Ask ${doctor.specialist || "Doctor"} anything about your symptoms...`}
          disabled={isSending}
          className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-primary focus-visible:border-primary text-sm h-10 shadow-2xs"
        />

        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isSending}
          className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-xs h-10 px-4"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
