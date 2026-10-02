'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-[#0c1220] shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 dark:bg-[#080d17] border-b border-slate-800 dark:border-white/[0.06] text-xs font-mono text-slate-400">
        <span className="uppercase tracking-wider text-[11px] font-semibold text-sky-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-[13px] font-mono leading-relaxed text-slate-200">
        <pre>
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, isStreaming }: MarkdownRendererProps) {
  return (
    <div className="text-slate-800 dark:text-slate-200 text-[14px] leading-relaxed space-y-2.5 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06] font-mono text-xs text-sky-700 dark:text-sky-300 font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : ''}
                value={String(children).replace(/\n$/, '')}
              />
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-6">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-white/[0.08]">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-semibold text-slate-900 dark:text-white mt-3.5 mb-1.5">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm font-semibold text-sky-600 dark:text-sky-300 mt-3 mb-1">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-6">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-sky-500 pl-3 py-1 my-2 bg-sky-50 dark:bg-sky-500/[0.04] rounded-r-lg text-slate-700 dark:text-slate-300 text-[13px]">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 dark:border-white/[0.08]">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-white/[0.08] text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return <th className="px-3 py-2 bg-slate-100 dark:bg-white/[0.04] font-semibold text-slate-800 dark:text-slate-200">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-2 border-t border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-3 border-slate-200 dark:border-white/[0.08]" />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && <span className="cursor-blink" />}
    </div>
  );
}
