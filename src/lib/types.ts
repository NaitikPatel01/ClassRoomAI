import type { ReactNode } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
  audio?: string;
  isLoading?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  timestamp: string;
  icon: React.ElementType;
};
