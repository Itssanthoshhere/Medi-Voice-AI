"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheck,
  Info,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      richColors
      closeButton
      duration={3500}
      visibleToasts={2}
      className="toaster group"
      icons={{
        success: <CircleCheck className="w-4 h-4" />,
        info: <Info className="w-4 h-4" />,
        warning: <AlertTriangle className="w-4 h-4" />,
        error: <XCircle className="w-4 h-4" />,
        loading: <Loader2 className="w-4 h-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          padding: "12px 16px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "500",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
          zIndex: 99999,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
