'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession, ChatSettings } from '@/types/chat';
import { PERSONAS } from '@/lib/defaultPrompts';
import {
  loadSessions,
  saveSessions,
  loadSettings,
  saveSettings,
  createNewSession,
  loadTheme,
  saveTheme,
  ThemeMode,
  DEFAULT_SETTINGS,
} from '@/lib/storage';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { QuickPrompts } from './QuickPrompts';
import { SettingsModal } from './SettingsModal';
import { Sparkles, ArrowDown } from 'lucide-react';

export function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize data and responsive states on mount
  useEffect(() => {
    // Initial theme
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Default sidebar to closed on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    const loadedSettings = loadSettings();
    setSettings(loadedSettings);

    const loadedSessions = loadSessions();
    if (loadedSessions.length > 0) {
      setSessions(loadedSessions);
      setActiveSessionId(loadedSessions[0].id);
    } else {
      const initial = createNewSession(loadedSettings.selectedPersonaId, loadedSettings.selectedModel);
      setSessions([initial]);
      setActiveSessionId(initial.id);
      saveSessions([initial]);
    }

    // Check server health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasConfiguredKey) {
          setHasEnvKey(true);
        }
      })
      .catch(() => {});
  }, []);

  // Save sessions when they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activePersona = PERSONAS.find((p) => p.id === (activeSession?.personaId || settings.selectedPersonaId)) || PERSONAS[0];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeSessionId]);

  useEffect(() => {
    if (isStreaming) {
      scrollToBottom('smooth');
    }
  }, [activeSession?.messages, isStreaming]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 120;
    setShowScrollBottom(!isNearBottom);
  };

  const handleNewChat = () => {
    if (isStreaming) handleStop();
    const newSession = createNewSession(settings.selectedPersonaId, settings.selectedModel);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    if (isStreaming && activeSessionId === id) handleStop();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fresh = createNewSession(settings.selectedPersonaId, settings.selectedModel);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all conversation history?')) {
      if (isStreaming) handleStop();
      const fresh = createNewSession(settings.selectedPersonaId, settings.selectedModel);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    }
  };

  const handleSelectPersona = (personaId: string) => {
    const updatedSettings = { ...settings, selectedPersonaId: personaId };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);

    if (activeSession) {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, personaId } : s))
      );
    }
  };

  const handleSaveSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    if (activeSession && activeSession.messages.length === 0) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, personaId: newSettings.selectedPersonaId, model: newSettings.selectedModel }
            : s
        )
      );
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isStreaming || !activeSession) return;

    setInput('');

    const userMessage: Message = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
      status: 'done',
    };

    const assistantPlaceholderId = `msg_${Date.now() + 1}_a`;
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      status: 'streaming',
    };

    const shouldUpdateTitle = activeSession.messages.length === 0 || activeSession.title === 'New Conversation';
    const newTitle = shouldUpdateTitle
      ? trimmed.length > 32
        ? `${trimmed.substring(0, 32)}...`
        : trimmed
      : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage, assistantMessage];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle,
              updatedAt: Date.now(),
              messages: updatedMessages,
            }
          : s
      )
    );

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const systemInstruction = [
        activePersona.systemInstruction,
        settings.customSystemInstruction,
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: [...activeSession.messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: activeSession.model || settings.selectedModel,
          systemInstruction,
          apiKey: settings.apiKey,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        accumulated += chunkText;

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? { ...m, content: accumulated, status: 'streaming' }
                  : m
              ),
            };
          })
        );
      }

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === assistantPlaceholderId
                ? { ...m, content: accumulated, status: 'done' }
                : m
            ),
          };
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? { ...m, status: 'done' }
                  : m
              ),
            };
          })
        );
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error during request';
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? {
                      ...m,
                      content: m.content || 'An error occurred while generating a response.',
                      status: 'error',
                      error: errorMsg,
                    }
                  : m
              ),
            };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const hasApiKey = Boolean(settings.apiKey.trim() || hasEnvKey);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSession?.id || ''}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
        selectedPersonaId={activePersona.id}
        onSelectPersona={handleSelectPersona}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          activePersona={activePersona}
          selectedModel={activeSession?.model || settings.selectedModel}
          hasApiKey={hasApiKey}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Chat message list */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-4 px-2 sm:px-4"
        >
          {activeSession && activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4 text-center my-auto py-8">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 dark:text-sky-400 mb-3 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2 tracking-tight">
                What can I help you build?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-2 leading-relaxed">
                Your AI coding assistant powered by Google Gemini. Ask for code, debugging, or architecture advice.
              </p>

              <QuickPrompts
                persona={activePersona}
                onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {activeSession?.messages.map((msg, index) => {
                const isLast = index === activeSession.messages.length - 1;
                return (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    personaName={activePersona.name}
                    isStreaming={isLast && isStreaming && msg.role === 'assistant'}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-20 right-6 z-20 p-2.5 rounded-full bg-white hover:bg-slate-100 dark:bg-[#141f36] dark:hover:bg-[#1b2b4d] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.1] shadow-lg transition-all cursor-pointer"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Chat input */}
        <div className="shrink-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-[#090d16] dark:via-[#090d16]/95 dark:to-transparent pt-3 transition-colors duration-200">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            onStop={handleStop}
            isStreaming={isStreaming}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
