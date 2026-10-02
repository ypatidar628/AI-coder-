import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Agent Chat Assistant | Project 3',
  description: 'AI Agent for chat assistance powered by Google Gemini',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('project3_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
