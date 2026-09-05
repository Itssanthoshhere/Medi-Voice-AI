"use client";

import Image from "next/image";
import { User, Bot, Volume2, Square } from "lucide-react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

interface ChatMessageProps {
  message: Message;
  doctorImage?: string | null;
  doctorSpecialist?: string;
  onSpeak?: (text: string) => void;
  onStopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export default function ChatMessage({
  message,
  doctorImage,
  doctorSpecialist = "AI Specialist",
  onSpeak,
  onStopSpeaking,
  isSpeaking = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      onStopSpeaking?.();
    } else {
      onSpeak?.(message.content);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 my-3.5 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 shadow-xs">
            <User className="w-5 h-5 text-primary" />
          </div>
        ) : doctorImage ? (
          <Image
            src={doctorImage}
            alt={doctorSpecialist}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-white text-gray-900 border border-gray-200/90 rounded-tl-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-black/5 dark:border-white/10 pb-1">
          <span
            className={`text-xs font-bold ${
              isUser ? "text-white/90" : "text-gray-700"
            }`}
          >
            {isUser ? "You (Patient)" : doctorSpecialist}
          </span>
          {!isUser && (onSpeak || onStopSpeaking) && (
            <button
              onClick={handleSpeakerClick}
              className={`transition-colors p-1 rounded-full ${
                isSpeaking
                  ? "text-red-500 hover:text-red-700 hover:bg-red-50 animate-pulse"
                  : "text-gray-500 hover:text-primary hover:bg-gray-100"
              }`}
              title={isSpeaking ? "Stop speaking" : "Listen to response"}
              type="button"
            >
              {isSpeaking ? (
                <Square className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        <div
          className={`whitespace-pre-wrap ${
            isUser ? "text-white" : "text-gray-800 font-normal"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

