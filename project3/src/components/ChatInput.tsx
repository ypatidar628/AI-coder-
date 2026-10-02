'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 42), 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend(input);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) {
      onStop();
    } else if (input.trim()) {
      onSend(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4">
      <div className="relative flex items-end gap-2 bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/[0.1] focus-within:border-sky-500 dark:focus-within:border-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-2xl p-2 shadow-sm dark:shadow-lg transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask a question or describe code to generate..."
          rows={1}
          className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 max-h-[160px] leading-relaxed"
        />

        <div className="shrink-0 flex items-center mb-0.5 mr-0.5">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
              title="Stop generation"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold shadow-xs"
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400 dark:text-slate-500">
        <span>Google Gemini 3.5 Flash</span>
        <span className="hidden sm:inline">Enter to send · Shift+Enter for new line</span>
      </div>
    </form>
  );
}
