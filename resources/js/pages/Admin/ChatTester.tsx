import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface TesterMessage {
    sender: 'user' | 'bot';
    text: string;
    type?: string | null;
    meta?: Record<string, unknown> | null;
    options?: string[] | null;
}

interface ChatReply {
    reply: string;
    options?: string[] | null;
    type?: string | null;
    meta?: Record<string, unknown> | null;
    redirect?: string | null;
    highlight?: boolean;
    requires_input?: boolean;
    session_id?: string | null;
}

export default function ChatTester() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<TesterMessage[]>([]);
    const [lastResponse, setLastResponse] = useState<ChatReply | null>(null);

    const send = async (manualMessage?: string) => {
        const message = (manualMessage ?? input).trim();
        if (!message && sessionId) return;

        setLoading(true);

        if (message) {
            setMessages((prev) => [...prev, { sender: 'user', text: message }]);
            setInput('');
        }

        try {
            const { data } = await axios.post<ChatReply>('/chat', {
                message,
                session_id: sessionId,
            });

            setLastResponse(data);
            if (data.session_id) {
                setSessionId(data.session_id);
            }

            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: data.reply,
                    type: data.type,
                    meta: data.meta,
                    options: data.options,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const resetSession = () => {
        setSessionId(null);
        setMessages([]);
        setLastResponse(null);
        setInput('');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Tester', href: '/admin/chat-tester' }]}>
            <Head title="Chat Tester" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chat Tester</h1>
                    <p className="text-muted-foreground">
                        Test the live assistant runtime, inspect response metadata, and validate flows without using the public chat screen.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Conversation</CardTitle>
                            <CardDescription>
                                Start with an empty send to trigger the welcome message, or type a prompt directly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button onClick={() => send()} disabled={loading} variant="outline">
                                    Load Welcome
                                </Button>
                                <Button onClick={resetSession} disabled={loading} variant="outline">
                                    Reset Session
                                </Button>
                                <Badge variant="secondary">Session: {sessionId ?? 'new'}</Badge>
                            </div>

                            <div className="rounded-xl border bg-background p-4">
                                <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-2">
                                    {messages.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No test messages yet. Use <span className="font-medium">Load Welcome</span> or send a prompt below.
                                        </p>
                                    ) : (
                                        messages.map((message, index) => (
                                            <div key={index} className="space-y-2 rounded-lg border p-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge variant={message.sender === 'user' ? 'default' : 'secondary'}>
                                                        {message.sender}
                                                    </Badge>
                                                    {message.type && <Badge variant="outline">{message.type}</Badge>}
                                                </div>
                                                <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                                                {message.options && message.options.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.options.map((option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => send(option)}
                                                                disabled={loading}
                                                                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Textarea
                                    rows={4}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Try prompts like: pricing for construction, I want interiors in Mysore, or tell me about event planning timelines."
                                />
                                <div className="flex justify-end">
                                    <Button onClick={() => send(input)} disabled={loading || !input.trim()}>
                                        {loading ? 'Sending...' : 'Send Test Message'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Last Response</CardTitle>
                                <CardDescription>
                                    This is the raw payload the frontend receives from the chat endpoint.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                                    {JSON.stringify(lastResponse, null, 2) || 'No response yet'}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>What To Check</CardTitle>
                                <CardDescription>
                                    Use this page to confirm the database-driven assistant is behaving as expected.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>1. Welcome output should use chat settings and service chips.</p>
                                <p>2. Admin chat intents should return `type: intent_match` with intent metadata.</p>
                                <p>3. Knowledge entries should return `type: knowledge_match`.</p>
                                <p>4. Service qualification should return `type: qualification_prompt` until complete.</p>
                                <p>5. Final qualification summary should return `type: qualification_complete`.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

