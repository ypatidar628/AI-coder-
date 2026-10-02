import { NextResponse } from 'next/server';

export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return NextResponse.json({
    status: 'ok',
    service: 'project3-ai-chat-agent',
    hasConfiguredKey: hasEnvKey,
    timestamp: new Date().toISOString(),
  });
}
