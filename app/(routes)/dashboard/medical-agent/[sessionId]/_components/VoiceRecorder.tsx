"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export default function VoiceRecorder({
  onTranscript,
  disabled = false,
  isProcessing = false,
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          setInterimText("");
          onTranscript(finalTranscript.trim());
          stopListening();
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setInterimText("");
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        title="Speech recognition is not supported in this browser"
      >
        <MicOff className="w-4 h-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      {isListening && (
        <div className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
      )}
      <Button
        type="button"
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        variant="ghost"
        size="icon"
        className={`relative z-10 transition-all border shadow-xs ${
          isListening
            ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
        }`}
        title={isListening ? "Stop Listening" : "Speak to Doctor"}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        ) : isListening ? (
          <Mic className="w-5 h-5 animate-pulse text-white" />
        ) : (
          <Mic className="w-5 h-5 text-rose-700" />
        )}
      </Button>
      {interimText && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-md border border-gray-700 z-30">
          "{interimText}"
        </span>
      )}
    </div>
  );
}
