'use client';

import React from 'react';
import { ChatSession } from '@/types/chat';
import { PERSONAS } from '@/lib/defaultPrompts';
import {
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  Code2,
  Bug,
  Layers,
  PanelLeftClose,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  selectedPersonaId: string;
  onSelectPersona: (personaId: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const personaIcons: Record<string, React.ReactNode> = {
  'coding-assistant': <Code2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />,
  debugger: <Bug className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />,
  architect: <Layers className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />,
  'friendly-mentor': <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />,
};

export function Sidebar({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
  selectedPersonaId,
  onSelectPersona,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const handleNewChatClick = () => {
    onNewChat();
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleSelectPersonaClick = (id: string) => {
    onSelectPersona(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        onClick={onToggle}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 h-full flex flex-col bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-white/[0.07] transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
          isOpen
            ? 'w-72 sm:w-80 md:w-64 translate-x-0 shadow-2xl md:shadow-none'
            : '-translate-x-full md:translate-x-0 w-72 sm:w-80 md:w-0 md:border-r-0'
        }`}
      >
        {/* Fixed inner width container to avoid text wrapping glitches during transition */}
        <div className="w-72 sm:w-80 md:w-64 h-full flex flex-col shrink-0">
          {/* Top header & actions */}
          <div className="p-3 border-b border-slate-200 dark:border-white/[0.07] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 dark:text-sky-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 tracking-tight">
                AI Assistant
              </span>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3 pb-2">
            <button
              onClick={handleNewChatClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-white dark:text-slate-100 text-xs font-medium border border-sky-600/20 dark:border-white/[0.08] shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white dark:text-sky-400" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Persona selector list */}
          <div className="px-3 py-2 border-b border-slate-200 dark:border-white/[0.06]">
            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
              Persona
            </div>
            <div className="space-y-0.5">
              {PERSONAS.map((p) => {
                const isSelected = selectedPersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPersonaClick(p.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border border-sky-200/80 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="shrink-0">{personaIcons[p.id] || <Sparkles className="w-3.5 h-3.5" />}</span>
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sessions history list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              History
            </div>

            {sessions.length === 0 ? (
              <div className="px-2 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                No conversations yet
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-all ${
                      isActive
                        ? 'bg-slate-100 border border-slate-200/80 text-slate-900 font-medium dark:bg-white/[0.08] dark:border-transparent dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate flex-1">{s.title || 'New Chat'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-white/[0.08] transition-all cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Theme Toggle & Clear History */}
          <div className="p-2 border-t border-slate-200 dark:border-white/[0.06] space-y-1">
            {/* Light / Dark Mode Toggle button in sidebar */}
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.04] text-xs transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400">
                {theme}
              </span>
            </button>

            {sessions.length > 0 && (
              <button
                onClick={onClearAll}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
