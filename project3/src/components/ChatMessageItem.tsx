'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sparkles, Copy, Check, AlertCircle } from 'lucide-react';

interface ChatMessageItemProps {
  message: Message;
  personaName?: string;
  isStreaming?: boolean;
}

export function ChatMessageItem({ message, personaName = 'AI Assistant', isStreaming }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(message.createdAt || Date.now()));

  if (isUser) {
    return (
      <div className="flex justify-end group px-2 sm:px-4">
        <div className="max-w-[88%] sm:max-w-[80%] rounded-2xl rounded-tr-xs bg-sky-600 text-white px-4 py-3 shadow-xs border border-sky-500/30">
          <div className="flex items-center justify-between gap-3 mb-1 text-[11px] text-sky-100">
            <span className="font-semibold">You</span>
            <div className="flex items-center gap-1.5">
              <span>{formattedTime}</span>
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white cursor-pointer"
                title="Copy message"
                aria-label="Copy message"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-2 sm:px-4 py-2 group">
      <div className="shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 dark:text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{personaName}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{formattedTime}</span>
          </div>

          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded cursor-pointer"
            title="Copy response"
            aria-label="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {message.status === 'error' && (
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 p-2.5 rounded-xl mb-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{message.error || 'Failed to complete generation'}</span>
          </div>
        )}

        <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
