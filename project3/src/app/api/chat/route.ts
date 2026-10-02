import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

interface IncomingMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const DEPRECATED_MODEL_MAP: Record<string, string> = {
  'gemini-2.5-flash': 'gemini-3.5-flash',
  'gemini-2.5-pro': 'gemini-3.8-flash',
  'gemini-1.5-flash': 'gemini-3.5-flash',
  'gemini-1.5-pro': 'gemini-3.8-flash',
};

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      model: requestedModel = 'gemini-3.5-flash',
      systemInstruction = '',
      apiKey: clientApiKey = '',
      temperature = 0.7,
    } = body;

    const apiKey = (clientApiKey && clientApiKey.trim().length > 0)
      ? clientApiKey.trim()
      : process.env.GEMINI_API_KEY || '';

    // If no API key is available, provide helpful guidance and a rich fallback response
    if (!apiKey) {
      const lastUserMsg = messages.length > 0
        ? messages[messages.length - 1].content
        : 'Hello';

      const fallbackText = getFallbackResponse(lastUserMsg);

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const chunks = fallbackText.match(/.{1,12}/g) || [fallbackText];
          for (const piece of chunks) {
            controller.enqueue(encoder.encode(piece));
            await new Promise((r) => setTimeout(r, 20));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Initialize Google GenAI with API key
    const ai = new GoogleGenAI({ apiKey });

    // Format chat contents for Gemini (role must be 'user' or 'model')
    const formattedContents = messages
      .filter((m: IncomingMessage) => m.role === 'user' || m.role === 'assistant')
      .map((m: IncomingMessage) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Hello' }],
      });
    }

    // Normalize model name (map deprecated models)
    let activeModel = DEPRECATED_MODEL_MAP[requestedModel] || requestedModel || 'gemini-3.5-flash';

    // Model fallback sequence
    const modelsToTry = [
      activeModel,
      ...CANDIDATE_MODELS.filter((m) => m !== activeModel),
    ];

    let responseStream = null;
    let lastError: Error | null = null;

    for (const currentModel of modelsToTry) {
      try {
        responseStream = await ai.models.generateContentStream({
          model: currentModel,
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature: typeof temperature === 'number' ? temperature : 0.7,
          },
        });
        break; // Stream acquired successfully
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`Model ${currentModel} failed: ${lastError.message}. Trying next candidate...`);
      }
    }

    if (!responseStream) {
      throw lastError || new Error('All model candidates failed to generate a response.');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamErr: unknown) {
          const errorMsg = streamErr instanceof Error ? streamErr.message : 'Error during stream generation';
          controller.enqueue(encoder.encode(`\n\n> ❌ **Stream error**: ${errorMsg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: errorMsg }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function getFallbackResponse(query: string): string {
  const lower = query.toLowerCase();
  let topicHelp = '';

  if (lower.includes('auth') || lower.includes('login') || lower.includes('jwt')) {
    topicHelp = `
### Quick Guide: Authentication in Next.js

1. **Recommended Solutions**:
   - **Auth.js (NextAuth v5)**: Built specifically for Next.js App Router with OAuth, Credentials, and session tokens.
   - **Supabase Auth / Clerk**: Managed, turn-key authentication with built-in UI components.
2. **Server-Side Session Pattern**:
\`\`\`tsx
import { auth } from '@/auth';

export async function ProtectedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return <div>Welcome {session.user.name}</div>;
}
\`\`\`
`;
  } else if (lower.includes('hook') || lower.includes('useeffect') || lower.includes('state')) {
    topicHelp = `
### React Hooks & State Management Tips

- **\`useEffect\`**: Use for synchronization with external systems, not for computing derived state.
- **Derived State**: Always calculate directly during render if possible:
\`\`\`tsx
const filteredItems = useMemo(() => items.filter(i => i.active), [items]);
\`\`\`
- **Custom Hooks**: Extract stateful logic into isolated reusable functions prefixed with \`use\`.
`;
  } else if (lower.includes('bug') || lower.includes('error') || lower.includes('fail')) {
    topicHelp = `
### Debugging Strategy Checklist

1. **Check Browser Console & Terminal Output**: Inspect the exact stack trace and error code.
2. **Hydration Mismatch**: Ensure client and server render the same initial DOM (avoid \`Date.now()\` or \`window\` directly in JSX without \`useEffect\`).
3. **Network Tab**: Inspect failed HTTP requests, payload headers, and CORS responses.
4. **State Isolation**: Log the exact state transitions before the error triggers.
`;
  } else {
    topicHelp = `
### How I Can Help You

- **Code Review & Refactoring**: Share any snippet in TypeScript, JavaScript, Python, or CSS.
- **Framework Guidance**: Assistance with Next.js App Router, React 19, Tailwind CSS, Node.js, and Express.
- **Architectural Advice**: Structuring full-stack apps, database modeling, and state management.
- **Bug Resolution**: Paste error logs or unexpected behavior to diagnose step-by-step.
`;
  }

  return `> 💡 **Offline/Demo Mode**: No Gemini API key was detected. To enable live AI reasoning with Google Gemini, click the **Settings (gear icon)** at the top right to paste your API key, or set \`GEMINI_API_KEY\` in your \`.env.local\` file.

---

### Response to your question:
You asked: *"**${query.replace(/[*_`]/g, '')}**"*

${topicHelp}

*Tip: Add your Gemini API key anytime to unlock full real-time streaming answers powered by Gemini 3.5 Flash!*`;
}
