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
  CheckCircle2,
  Paperclip,
  Upload,
  AlertTriangle,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage, { Message } from "./_components/ChatMessage";
import VoiceRecorder from "./_components/VoiceRecorder";
import Vapi from "@vapi-ai/web";
import { AIDoctorAgents } from "@/shared/list";
import MedicalReportDialog, {
  MedicalReportData,
} from "../_components/MedicalReportDialog";
import { toast } from "sonner";
import {
  checkEmergencySymptoms,
  checkMentalHealthCrisis,
} from "../_utils/emergencyDetector";
import EmergencyAlertModal from "../_components/EmergencyAlertModal";
import MentalHealthCrisisModal from "../_components/MentalHealthCrisisModal";
import ReportAnalysisCard, {
  AnalyzedReportData,
} from "../_components/ReportAnalysisCard";
import TestRecommendationsCard, {
  RecommendedTest,
} from "../_components/TestRecommendationsCard";

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
  report?: MedicalReportData;
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
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [medicalReport, setMedicalReport] = useState<MedicalReportData | null>(
    null,
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyMatchedTerms, setEmergencyMatchedTerms] = useState<string[]>(
    [],
  );
  const [isMentalHealthCrisisModalOpen, setIsMentalHealthCrisisModalOpen] =
    useState(false);
  const [mentalHealthMatchedTerms, setMentalHealthMatchedTerms] = useState<
    string[]
  >([]);
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);
  const [analyzedReport, setAnalyzedReport] =
    useState<AnalyzedReportData | null>(null);
  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const reportGeneratedRef = useRef(false);
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
          res.data.selectedDoctor ||
          res.data.doctorAgent ||
          res.data.selectedDocter ||
          {};
        const matched = AIDoctorAgents.find(
          (d) =>
            d.id === doctorInfo.id ||
            d.specialist?.toLowerCase() ===
              doctorInfo.specialist?.toLowerCase(),
        );
        const validVapiVoices = [
          "Elliot",
          "Savannah",
          "Clara",
          "Layla",
          "Emma",
          "Sid",
          "Nico",
          "Neil",
          "Naina",
          "Kai",
        ];

        const candidateVoice = doctorInfo.voiceId?.trim();
        const validMatch = validVapiVoices.find(
          (v) => v.toLowerCase() === candidateVoice?.toLowerCase(),
        );
        const resolvedVoice = validMatch || matched?.voiceId || "Elliot";

        setDoctor({
          id: doctorInfo.id ?? matched?.id,
          specialist:
            doctorInfo.specialist ||
            matched?.specialist ||
            "AI Medical Specialist",
          image: doctorInfo.image || matched?.image || "/doctor1.png",
          agentPrompt: doctorInfo.agentPrompt || matched?.agentPrompt,
          voiceId: resolvedVoice,
        });

        if (res.data.notes) {
          runSafetyAndCrisisChecks(res.data.notes);
          checkSymptomsForTests(res.data.notes);
        }

        if (
          Array.isArray(res.data.conversation) &&
          res.data.conversation.length > 0
        ) {
          setMessages(res.data.conversation);
          res.data.conversation.forEach((m: Message) => {
            if (m.content) {
              runSafetyAndCrisisChecks(m.content);
              checkSymptomsForTests(m.content);
            }
          });
        } else {
          // Default greeting
          const initialGreeting: Message = {
            role: "assistant",
            content: `Hello, thank you for connecting! I am your ${
              doctorInfo.specialist || "AI Doctor"
            }. Could you please tell me your name and age before we begin?`,
          };
          setMessages([initialGreeting]);
        }

        if (res.data.report) {
          setMedicalReport(res.data.report);
          reportGeneratedRef.current = true;
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
          v.name.includes("Daniel")),
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

  const runSafetyAndCrisisChecks = (text: string) => {
    if (!text || typeof text !== "string") return;

    // 1. Check physical medical emergency symptoms (911 / ER)
    const emergencyCheck = checkEmergencySymptoms(text);
    if (emergencyCheck.isEmergency) {
      setEmergencyMatchedTerms(emergencyCheck.matchedTerms);
      setIsEmergencyModalOpen(true);
      return;
    }

    // 2. Check mental health crisis / self-harm / suicidal thoughts (988 / Helpline)
    const mentalHealthCheck = checkMentalHealthCrisis(text);
    if (mentalHealthCheck.isCrisis) {
      setMentalHealthMatchedTerms(mentalHealthCheck.matchedTerms);
      setIsMentalHealthCrisisModalOpen(true);
    }
  };

  const checkSymptomsForTests = (text: string) => {
    // Skip medical lab test prompts during mental health counselling sessions
    if (doctor.specialist === "Mental Health Counsellor") return;

    const lower = text.toLowerCase();
    const newTests: RecommendedTest[] = [];

    if (
      lower.includes("fatigue") ||
      lower.includes("tired") ||
      lower.includes("weakness") ||
      lower.includes("energy") ||
      lower.includes("exhausted")
    ) {
      newTests.push({
        testName: "Vitamin D (25-OH) & B12 Panel",
        rationale:
          "Indicated for persistent fatigue, low energy, and muscle weakness to evaluate potential vitamin deficiency.",
        priority: "Recommended",
      });
      newTests.push({
        testName: "Complete Blood Count (CBC)",
        rationale:
          "Evaluates red blood cell count, hemoglobin concentration, and rules out anemia.",
        priority: "Recommended",
      });
    }

    if (
      lower.includes("weight") ||
      lower.includes("chilly") ||
      lower.includes("hair loss") ||
      lower.includes("thyroid") ||
      lower.includes("sluggish")
    ) {
      newTests.push({
        testName: "Thyroid Profile (TSH, Free T3/T4)",
        rationale: "Evaluates thyroid gland activity and metabolic regulation.",
        priority: "Recommended",
      });
    }

    if (
      lower.includes("joint") ||
      lower.includes("bone") ||
      lower.includes("stiff") ||
      lower.includes("aching")
    ) {
      newTests.push({
        testName: "Serum Calcium & Uric Acid Test",
        rationale:
          "Assesses bone mineralization, electrolyte status, and joint inflammatory markers.",
        priority: "Recommended",
      });
    }

    if (
      lower.includes("throat") ||
      lower.includes("tonsil") ||
      lower.includes("cough") ||
      lower.includes("cold") ||
      lower.includes("swallowing") ||
      lower.includes("fever")
    ) {
      newTests.push({
        testName: "Rapid Strep A & Throat Swab Culture",
        rationale:
          "Indicated for sore throat, tonsil enlargement, or painful swallowing to rule out bacterial streptococcal infection.",
        priority: "Recommended",
      });
      newTests.push({
        testName: "Complete Blood Count (CBC) with Differential",
        rationale:
          "Evaluates white blood cell count (leukocytes) to distinguish between viral and bacterial throat infections.",
        priority: "Recommended",
      });
    }

    if (newTests.length > 0) {
      setRecommendedTests((prev) => {
        const existingNames = new Set(prev.map((t) => t.testName));
        const filtered = newTests.filter((t) => !existingNames.has(t.testName));
        return [...prev, ...filtered];
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingReport(true);
    const toastId = toast.loading("Analyzing Medical Report...", {
      description: `Processing ${file.name} with AI pathology engine...`,
    });

    try {
      let reportText = "";
      let fileData = "";

      if (file.type.startsWith("image/") || file.type.includes("pdf")) {
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        reportText = await file.text();
      }

      const res = await axios.post("/api/analyze-report", {
        reportText: reportText || file.name,
        fileData: fileData || "",
        fileName: file.name,
      });

      if (res.data?.report) {
        const report: AnalyzedReportData = res.data.report;
        setAnalyzedReport(report);

        toast.success("Medical Report Analyzed!", {
          id: toastId,
          description: "Test levels and clinical recommendations updated.",
        });

        const systemReportMsg: Message = {
          role: "assistant",
          content: `📄 **Medical Report Uploaded (${file.name})**\n\n**Clinical Summary:** ${report.patientSummary || "Lab parameters extracted successfully."}\n\n**Findings & Deficiencies:**\n${(report.deficienciesOrAbnormalities || []).map((d) => `• ${d}`).join("\n") || "No critical deficiencies detected."}\n\n⚠️ *Reminder: All AI interpretations and supplementation notes MUST be confirmed with your doctor.*`,
        };

        const updatedMessages = [...messages, systemReportMsg];
        setMessages(updatedMessages);
        saveConversation(updatedMessages);

        if (isAudioEnabled) {
          speakText(
            "I have analyzed your medical test report. Let's review the findings together.",
          );
        }
      } else {
        toast.error("Could not parse medical report file.", { id: toastId });
      }
    } catch (err) {
      console.error("Error analyzing medical report file:", err);
      toast.error("Failed to analyze report file. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsAnalyzingReport(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSendMessage = async (userText?: string) => {
    stopDoctorSpeech();
    const textToSend = userText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    // Check emergency and mental health crisis keywords immediately
    runSafetyAndCrisisChecks(textToSend);

    // Check symptom-based lab test recommendations
    checkSymptomsForTests(textToSend);

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
      // Check emergency symptoms and mental health crisis in live voice transcript
      runSafetyAndCrisisChecks(transcriptText);

      checkSymptomsForTests(transcriptText);

      setInputMessage((prev) => {
        const trimmedNew = transcriptText.trim();
        if (!prev) return trimmedNew;
        if (prev.toLowerCase().includes(trimmedNew.toLowerCase())) return prev;
        return `${prev} ${trimmedNew}`;
      });
    }
  };

  const StartCall = async () => {
    setIsConnecting(true);

    // Stop any existing call before starting a new one
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch {}
    }

    // Ensure microphone permission is granted before connecting to Daily/Vapi
    if (
      typeof window !== "undefined" &&
      navigator?.mediaDevices?.getUserMedia
    ) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        console.warn("Microphone permission check:", micErr);
      }
    }

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    vapiRef.current = vapi;

    const validVapiVoices = [
      "Elliot",
      "Savannah",
      "Clara",
      "Layla",
      "Emma",
      "Sid",
      "Nico",
      "Neil",
      "Naina",
      "Kai",
    ];
    const candidateVoice = doctor?.voiceId?.trim();
    const doctorVoiceId =
      validVapiVoices.find(
        (v) => v.toLowerCase() === candidateVoice?.toLowerCase(),
      ) || "Elliot";
    const specialistName = doctor?.specialist || "Medical Specialist";

    const promptContent = `You are a friendly and empathetic AI ${specialistName}.
CONVERSATION FLOW:
1. Greet the user warmly and first ask for their name and age if not yet provided.
2. Acknowledge their name and age politely.
3. Once their name and age are established, ask about the symptoms or health concerns they are experiencing.
4. Provide safe, concise, clear, and reassuring guidance appropriate for a ${specialistName}.
5. Keep answers short and natural for a voice conversation.${
      doctor?.agentPrompt
        ? `\nSpecialist guidelines: ${doctor.agentPrompt}`
        : ""
    }${session?.notes ? `\nPatient initial notes: ${session.notes}` : ""}`;

    const VapiAgentConfig = {
      name: `AI ${specialistName} Voice Agent`,
      firstMessage: `Hello, thank you for connecting! I am your AI ${specialistName}. Could you please tell me your name and age before we begin?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: doctorVoiceId,
      },
      model: {
        provider: "anthropic",
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content: promptContent,
          },
        ],
      },
      variableValues: {
        specialist: specialistName,
        patientNotes: session?.notes || "",
      },
    };

    const assistantId = process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID;

    // Attach call listeners
    vapi.on("call-start", () => {
      console.log("Call started");
      setIsConnecting(false);
      setCallStarted(true);
      setIsCallActive(true);
      setActiveTranscript(null);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setIsConnecting(false);
      setCallStarted(false);
      setIsCallActive(false);
      setActiveTranscript(null);
      const msgs =
        messagesRef.current.length > 0 ? messagesRef.current : messages;
      if (msgs.length >= 2) {
        GenerateReport();
      } else {
        toast.info("Consultation Ended", {
          description: "Returning to dashboard...",
        });
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on("message", (message: any) => {
      console.log("Vapi message:", message);
      if (message.type === "transcript") {
        const role: "user" | "assistant" =
          message.role === "user" ? "user" : "assistant";
        const text = message.transcript;

        if (!text) return;

        // Run Emergency, Crisis & Diagnostic Test Checks on live voice transcripts
        runSafetyAndCrisisChecks(text);
        checkSymptomsForTests(text);

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
            messagesRef.current = updated;
            saveConversation(updated);
            return updated;
          });
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on("call-start-failed", (event: any) => {
      console.error("Vapi call-start-failed:", event);
      setIsConnecting(false);
      setIsCallActive(false);
      setCallStarted(false);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapi.on("error", (err: any) => {
      // Ignore benign "ejected" / "Meeting has ended" errors — Daily fires these after every call ends normally
      const errStr =
        typeof err === "object" ? JSON.stringify(err) : String(err);
      if (
        err?.type === "ejected" ||
        err?.type === "daily-error" ||
        errStr.includes("Meeting has ended") ||
        errStr.includes("ejected")
      ) {
        console.log("Call session cleaned up (normal post-call event).");
        return;
      }
      const errorMsg =
        err?.error?.message ||
        err?.message ||
        (typeof err === "object" ? JSON.stringify(err) : String(err));
      console.error("Vapi call error:", errorMsg, err);
      setIsConnecting(false);
      setIsCallActive(false);
      setCallStarted(false);
    });

    try {
      if (assistantId) {
        // @ts-ignore
        await vapi.start(assistantId, VapiAgentConfig);
      } else {
        // @ts-ignore
        await vapi.start(VapiAgentConfig);
      }
    } catch (err) {
      console.error("Error starting Vapi call:", err);
      setIsConnecting(false);
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

  const GenerateReport = async (forcedMessages?: Message[]) => {
    const msgs =
      forcedMessages ||
      (messagesRef.current.length > 0 ? messagesRef.current : messages);

    if (msgs.length < 2) {
      toast.warning("Not enough conversation", {
        description:
          "Please share symptoms or converse with the doctor before generating a report.",
      });
      return;
    }

    if (reportGeneratedRef.current && !forcedMessages) return;
    reportGeneratedRef.current = true;
    setIsGeneratingReport(true);

    const toastId = toast.loading("Generating Medical Report...", {
      description: "Analyzing your consultation transcript with AI...",
    });

    try {
      const res = await axios.post("/api/medical-report", {
        sessionId,
        sessionDetail: {
          specialist: doctor.specialist,
          image: doctor.image,
        },
        messages: msgs,
      });
      console.log("Medical report generated:", res.data);
      if (res.data?.report) {
        setMedicalReport(res.data.report);
        toast.success("Medical Report Generated Successfully!", {
          id: toastId,
          description: "Your consultation summary is ready on the dashboard.",
          duration: 4000,
        });
        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);
      } else {
        toast.error("Could not parse medical report.", { id: toastId });
      }
    } catch (err) {
      console.error("Error generating medical report:", err);
      toast.error("Failed to generate medical report. Please try again.", {
        id: toastId,
      });
      // Allow retry on failure
      reportGeneratedRef.current = false;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const endCall = async () => {
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

    const currentMsgs =
      messagesRef.current.length > 0 ? messagesRef.current : messages;
    if (currentMsgs.length >= 2) {
      await GenerateReport();
    } else {
      toast.info("Consultation Ended", {
        description: "Returning to dashboard...",
      });
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
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
          {/* Medical Report Action Button */}
          {medicalReport ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              className="border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs gap-1.5 h-8.5 px-3 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">View</span> Report
            </Button>
          ) : messages.length >= 2 && !isCallActive && !callStarted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => GenerateReport()}
              disabled={isGeneratingReport}
              className="border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold text-xs gap-1.5 h-8.5 px-3 shadow-2xs"
            >
              {isGeneratingReport ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-blue-700" />
              )}
              <span className="hidden sm:inline">Generate</span> Report
            </Button>
          ) : null}

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

      {/* Completed Report Ready Banner */}
      {medicalReport && !isGeneratingReport && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-xs text-emerald-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">
                Medical Consultation Summary is ready.
              </span>{" "}
              <span className="text-emerald-800 hidden sm:inline">
                Review your chief concern, symptoms, and doctor recommendations.
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsReportModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-7 px-3 flex items-center gap-1.5 ml-2 flex-shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            View Report
          </Button>
        </div>
      )}

      {/* Report generation status */}
      {isGeneratingReport && (
        <div className="mb-4 p-3.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-xs text-blue-900 flex items-center gap-2 shadow-2xs animate-pulse">
          <Loader2 className="w-4 h-4 text-blue-700 flex-shrink-0 animate-spin" />
          <div>
            <span className="font-bold text-blue-950">
              Generating Medical Report...
            </span>{" "}
            <span className="text-blue-900 font-medium">
              Analyzing consultation transcript and preparing your summary.
            </span>
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
              <p className="italic font-medium">
                {activeTranscript.transcript}
              </p>
            </div>
          </div>
        )}

        {/* Analyzed Medical Lab Report Breakdown */}
        {analyzedReport && <ReportAnalysisCard data={analyzedReport} />}

        {/* Symptom-Indicated Diagnostic Test Recommendations */}
        {recommendedTests.length > 0 && (
          <TestRecommendationsCard tests={recommendedTests} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hidden Medical Report File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Input controls */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending || isAnalyzingReport}
          title="Upload Medical Report (Image / PDF / Text)"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 shrink-0 h-10 w-10 shadow-2xs"
        >
          {isAnalyzingReport ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Paperclip className="w-4 h-4 text-gray-600" />
          )}
        </Button>

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

      {/* Medical Report Dialog */}
      <MedicalReportDialog
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        report={medicalReport}
        doctorSpecialist={doctor.specialist}
        doctorImage={doctor.image}
      />

      {/* Emergency Alert Safety Modal Overlay */}
      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        matchedTerms={emergencyMatchedTerms}
      />

      {/* Mental Health Crisis Support Modal Overlay */}
      <MentalHealthCrisisModal
        isOpen={isMentalHealthCrisisModalOpen}
        onClose={() => setIsMentalHealthCrisisModalOpen(false)}
        matchedTerms={mentalHealthMatchedTerms}
      />
    </div>
  );
}
