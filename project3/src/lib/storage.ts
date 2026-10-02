import { ChatSession, ChatSettings } from '@/types/chat';

const SESSIONS_KEY = 'project3_ai_chat_sessions';
const SETTINGS_KEY = 'project3_ai_chat_settings';
const THEME_KEY = 'project3_theme';

export type ThemeMode = 'dark' | 'light';

export const DEFAULT_SETTINGS: ChatSettings = {
  apiKey: '',
  selectedModel: 'gemini-3.5-flash',
  selectedPersonaId: 'coding-assistant',
  customSystemInstruction: '',
  temperature: 0.7,
};

const DEPRECATED_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];

export function loadTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme to storage:', err);
  }
}

export function loadSettings(): ChatSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const settings = { ...DEFAULT_SETTINGS, ...parsed };
    // Automatically migrate users away from deprecated models
    if (DEPRECATED_MODELS.includes(settings.selectedModel)) {
      settings.selectedModel = 'gemini-3.5-flash';
    }
    return settings;
  } catch (err) {
    console.error('Failed to load chat settings from storage:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ChatSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save chat settings to storage:', err);
  }
}

export function loadSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Migrate deprecated models in existing sessions
    return parsed.map((s) => {
      if (DEPRECATED_MODELS.includes(s.model)) {
        return { ...s, model: 'gemini-3.5-flash' };
      }
      return s;
    });
  } catch (err) {
    console.error('Failed to load chat sessions from storage:', err);
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save chat sessions to storage:', err);
  }
}

export function createNewSession(personaId = 'coding-assistant', model = 'gemini-3.5-flash'): ChatSession {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: 'New Conversation',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
    personaId,
    model: DEPRECATED_MODELS.includes(model) ? 'gemini-3.5-flash' : model,
  };
}
