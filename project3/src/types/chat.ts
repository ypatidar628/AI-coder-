export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status?: 'sending' | 'streaming' | 'done' | 'error';
  error?: string;
}

export interface Persona {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  systemInstruction: string;
  suggestedStarters: string[];
}

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  personaId: string;
  model: string;
}

export interface ChatSettings {
  apiKey: string;
  selectedModel: string;
  selectedPersonaId: string;
  customSystemInstruction: string;
  temperature: number;
}
