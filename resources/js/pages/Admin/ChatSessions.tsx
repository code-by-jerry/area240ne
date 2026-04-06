import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SessionUser {
    id: number;
    name: string;
    email: string;
}

interface SessionMessage {
    id: number;
    sender: 'user' | 'bot';
    message: string;
    type?: string | null;
    meta?: Record<string, unknown> | null;
    options?: string[] | null;
    created_at: string;
}

interface SessionItem {
    id: string;
    title: string;
    state: string;
    user_id?: number | null;
    lead_id?: number | null;
    data?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    messages_count?: number;
    user?: SessionUser | null;
}

interface SelectedSession extends SessionItem {
    messages: SessionMessage[];
}

interface MessageTypeStat {
    type: string;
    total: number;
}

interface Props {
    sessions: SessionItem[];
    selectedSession?: SelectedSession | null;
    filters: {
        q?: string;
        session?: string;
    };
    stats: {
        total_sessions: number;
        open_sessions: number;
        qualifying_sessions: number;
        qualified_sessions: number;
        today_sessions: number;
        total_messages: number;
        user_messages: number;
        bot_messages: number;
    };
    topMessageTypes: MessageTypeStat[];
}

export default function ChatSessions({ sessions, selectedSession, filters, stats, topMessageTypes }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    const applySearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/chat-sessions', { q, session: filters.session }, { preserveState: true, replace: true });
    };

    const selectSession = (id: string) => {
        router.get('/admin/chat-sessions', { q, session: id }, { preserveState: true, replace: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Sessions', href: '/admin/chat-sessions' }]}>
            <Head title="Chat Sessions" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chat Sessions</h1>
                        <p className="text-muted-foreground">
                            Inspect live chat history, message types, and stored session data to debug routing and qualification behavior.
                        </p>
                    </div>
                    <form onSubmit={applySearch} className="flex items-center gap-2">
                        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, state, or user" className="w-72" />
                        <Button type="submit" variant="outline">Search</Button>
                    </form>
                </div>

                <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Sessions</p><p className="text-2xl font-semibold">{stats.total_sessions}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Today</p><p className="text-2xl font-semibold">{stats.today_sessions}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open</p><p className="text-2xl font-semibold">{stats.open_sessions}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Qualifying</p><p className="text-2xl font-semibold">{stats.qualifying_sessions}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Qualified</p><p className="text-2xl font-semibold">{stats.qualified_sessions}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Messages</p><p className="text-2xl font-semibold">{stats.total_messages}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">User Msgs</p><p className="text-2xl font-semibold">{stats.user_messages}</p></CardContent></Card>
                    <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Bot Msgs</p><p className="text-2xl font-semibold">{stats.bot_messages}</p></CardContent></Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Sessions</CardTitle>
                                <CardDescription>Showing the latest 50 sessions matching your search.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {sessions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No sessions found.</p>
                                ) : sessions.map((session) => (
                                    <button
                                        key={session.id}
                                        type="button"
                                        onClick={() => selectSession(session.id)}
                                        className={`w-full rounded-lg border p-3 text-left transition-colors ${filters.session === session.id ? 'border-primary bg-muted' : 'hover:bg-muted/60'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium">{session.title || 'Untitled Chat'}</p>
                                            <Badge variant="secondary">{session.state}</Badge>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {session.user?.name || 'Guest'} · {session.messages_count ?? 0} messages
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Updated {new Date(session.updated_at).toLocaleString()}
                                        </p>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Bot Message Types</CardTitle>
                                <CardDescription>Useful for seeing what the assistant is doing most often.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {topMessageTypes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No typed bot messages yet.</p>
                                ) : topMessageTypes.map((item) => (
                                    <div key={item.type} className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="font-medium">{item.type}</span>
                                        <Badge variant="secondary">{item.total}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Detail</CardTitle>
                                <CardDescription>
                                    {selectedSession ? `Session ${selectedSession.id}` : 'Select a session from the list.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!selectedSession ? (
                                    <p className="text-sm text-muted-foreground">No session selected.</p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">User</p>
                                                <p className="font-medium">{selectedSession.user?.name || 'Guest'}</p>
                                                <p className="text-sm text-muted-foreground">{selectedSession.user?.email || 'No account linked'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">State</p>
                                                <p className="font-medium">{selectedSession.state}</p>
                                                <p className="text-sm text-muted-foreground">Updated {new Date(selectedSession.updated_at).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs uppercase text-muted-foreground">Session Data</p>
                                            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                                                {JSON.stringify(selectedSession.data ?? {}, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Messages</CardTitle>
                                <CardDescription>Inspect sender, type, options, and metadata for each message.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!selectedSession || selectedSession.messages.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No messages in this session yet.</p>
                                ) : selectedSession.messages.map((message) => (
                                    <div key={message.id} className="rounded-lg border p-4">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <Badge variant={message.sender === 'user' ? 'default' : 'secondary'}>{message.sender}</Badge>
                                            {message.type && <Badge variant="outline">{message.type}</Badge>}
                                            <span className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="whitespace-pre-wrap text-sm leading-6">{message.message}</p>
                                        {message.options && message.options.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {message.options.map((option) => (
                                                    <span key={option} className="rounded-md border px-2 py-1 text-xs text-muted-foreground">{option}</span>
                                                ))}
                                            </div>
                                        )}
                                        {message.meta && Object.keys(message.meta).length > 0 && (
                                            <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs leading-6 text-zinc-100">
                                                {JSON.stringify(message.meta, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
