import { useState } from "react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toast: (props: ToastProps) => void;
}

export function useToast(): ToastState {
  const [, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    // For now, we'll just use console.log as a placeholder
    // In a real implementation, we would use a proper toast library
    console.log(`${props.title}: ${props.description}`);
  };

  return { toast };
}
