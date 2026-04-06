import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Globe,
    LogIn,
    LogOut,
    Menu,
    MessageSquare,
    Plus,
    Send,
    Sparkles,
    Trash2,
    User,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
    brand?: any;
    type?: string;
    meta?: Record<string, unknown> | null;
    highlight?: boolean;
    requires_input?: boolean;
}

interface ChatSession {
    id: string;
    title: string;
    updated_at: string;
}

declare function route(name: string, params?: any): string;

// Helper: Parse text and convert URLs to clickable links
function parseTextWithLinks(text: string) {
    // URL regex pattern to match http, https, and www URLs
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, idx) => {
        if (urlRegex.test(part)) {
            const url = part.startsWith('http') ? part : `https://${part}`;
            // Shorten the display text
            const displayText = new URL(url).hostname.replace('www.', '');
            return (
                <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <Globe className="h-3 w-3" />
                    {displayText}
                </a>
            );
        }
        // Convert markdown-style bold to actual bold
        return part
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .split('\n')
            .map((line, i) => (
                <React.Fragment key={i}>
                    {line}
                    {i < part.split('\n').length - 1 && <br />}
                </React.Fragment>
            ));
    });
}

export default function ChatApp() {
    const { auth } = usePage<SharedData>().props;

    // State
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initRef = useRef(false);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Initial Load
    useEffect(() => {
        // Fetch history if user is logged in
        if (auth.user) {
            fetchHistory();
        }

        // Start a new chat automatically if no session
        if (!initRef.current && !sessionId) {
            initRef.current = true;
            fetchBotResponse('', null);
        }
    }, [auth.user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/chat/history');
            setHistory(res.data);
        } catch (e) {
            console.error('Failed to load history', e);
        }
    };

    const loadSession = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/chat/session/${id}`);
            const sessionData = res.data;
            setSessionId(sessionData.id);

            // Transform messages
            const loadedMessages: Message[] = sessionData.messages.map(
                (m: any) => ({
                    sender: m.sender,
                    text: m.message,
                    options: m.options,
                    type: m.type,
                    meta: m.meta,
                }),
            );

            setMessages(loadedMessages);
            if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile select
        } catch (e) {
            console.error('Failed to load session', e);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setSessionId(null);
        setMessages([]);
        fetchBotResponse('', null); // Init call
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const fetchBotResponse = async (
        msg: string,
        currentSessionId: string | null,
    ) => {
        setLoading(true);
        try {
            const response = await axios.post('/chat', {
                message: msg,
                session_id: currentSessionId,
            });

            // Only add bot message if it's different from the last message or if there are no messages yet
            setMessages((prev) => {
                // Check if last message is identical (prevent duplicates)
                if (
                    prev.length > 0 &&
                    prev[prev.length - 1].sender === 'bot' &&
                    prev[prev.length - 1].text === response.data.reply
                ) {
                    return prev; // Don't add duplicate
                }
                return [
                    ...prev,
                    {
                        sender: 'bot',
                        text: response.data.reply,
                        options: response.data.options,
                        type: response.data.type,
                        meta: response.data.meta,
                        highlight: response.data.highlight ?? false,
                        requires_input: response.data.requires_input ?? false,
                    },
                ];
            });

            if (response.data.session_id) {
                setSessionId(response.data.session_id);
                // Refresh history whenever bot responds to keep titles fresh (if logged in)
                if (auth.user) fetchHistory();
            }

            if (response.data.redirect) {
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 2000);
            }
        } catch (err: unknown) {
            const status = axios.isAxiosError(err) ? err.response?.status : 0;
            const text =
                status === 419
                    ? 'Session expired. Please refresh the page and try again.'
                    : 'Sorry, connection error.';
            setMessages((prev) => [...prev, { sender: 'bot', text }]);
        } finally {
            setLoading(false);
        }
    };

    const deleteSession = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            await axios.delete(`/chat/session/${id}`);
            if (sessionId === id) {
                setSessionId(null);
                setMessages([]);
                fetchBotResponse('', null);
            }
            fetchHistory();
        } catch (e) {
            console.error('Failed to delete session', e);
        }
    };

    const handleSend = async (e?: React.FormEvent, manualMsg?: string) => {
        e?.preventDefault();
        const msgToSend = manualMsg || input;

        if (!msgToSend.trim()) return;

        setMessages((prev) => [...prev, { sender: 'user', text: msgToSend }]);
        setInput('');

        await fetchBotResponse(msgToSend, sessionId);
    };

    const isWelcomeMessage = (msg: Message, idx: number) =>
        msg.sender === 'bot' &&
        idx === 0 &&
        messages.length > 0 &&
        msg.type === 'welcome';

    return (
        <>
            <Head title="Chat" />
            <div className="flex h-screen overflow-hidden bg-brand-surface font-sans text-brand-text dark:bg-brand-dark dark:text-zinc-50">
                {/* Sidebar (ChatGPT Style) */}
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-brand-border bg-brand-surface text-brand-muted transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-brand-primary ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
                >
                    <div className="flex h-full flex-col p-4">
                        {/* Brand Logo & Label */}
                        <Link
                            href="/"
                            className="group mb-6 flex items-center gap-3 px-2 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent p-1 shadow-sm ring-1 ring-zinc-200">
                                <img
                                    src="https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/main%20logo.png"
                                    alt="Area 24 One Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </Link>

                        {/* New Chat Button */}
                        <button
                            onClick={startNewChat}
                            className="mb-4 flex w-full items-center gap-2 rounded-lg border border-zinc-200 p-3 text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                New chat
                            </span>
                        </button>

                        {/* History List */}
                        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
                            {auth.user ? (
                                <>
                                    <h3 className="mb-2 px-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                        History
                                    </h3>
                                    {history.length > 0 ? (
                                        <div className="space-y-1">
                                            {history.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="group relative"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            loadSession(
                                                                session.id,
                                                            )
                                                        }
                                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-3 pr-10 text-sm transition-colors ${sessionId === session.id ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'} `}
                                                    >
                                                        <MessageSquare className="h-4 w-4 shrink-0" />
                                                        <span className="truncate text-left">
                                                            {session.title ||
                                                                'Untitled Chat'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={(e) =>
                                                            deleteSession(
                                                                e,
                                                                session.id,
                                                            )
                                                        }
                                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-700 hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="px-2 text-xs text-zinc-600">
                                            No previous chats.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="rounded-lg bg-zinc-50 p-4 text-center ring-1 ring-zinc-200 dark:bg-zinc-800/50 dark:ring-zinc-700">
                                    <p className="mb-3 text-sm text-zinc-500">
                                        Log in to save your chat history.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                                    >
                                        <LogIn className="h-3 w-3" /> Login
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-700">
                            {auth.user ? (
                                <div className="group flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-brand-primary font-bold text-white dark:bg-white dark:text-black">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                                            {auth.user.name}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="rounded-md p-1.5 text-zinc-500 transition-all group-hover:opacity-100 hover:bg-zinc-700 hover:text-white lg:opacity-0"
                                        title="Log out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 p-2 text-sm hover:text-white"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Back to
                                    Home
                                </Link>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="relative flex h-full flex-1 flex-col">
                    {/* Header (Mobile Toggle) */}
                    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/80 p-4 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            {sidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-0.5 shadow-sm ring-1 ring-zinc-200">
                                <img
                                    src="/image/Area 24 one logo black.png"
                                    alt=""
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="text-sm font-bold tracking-tighter uppercase">
                                Area 24{' '}
                                <span className="font-medium text-zinc-500">
                                    one
                                </span>
                            </span>
                        </div>
                        <div className="w-8" />
                    </header>

                    {/* Chat Area - mobile first */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4 md:p-8">
                        <div className="mx-auto max-w-3xl space-y-6 pb-24 sm:space-y-8 sm:pb-20">
                            {/* Empty State / Welcome */}
                            {messages.length === 0 && !loading && (
                                <div className="flex h-[50vh] flex-col items-center justify-center text-center opacity-50">
                                    <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                                        <Sparkles className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold">
                                        How can I help you today?
                                    </h2>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${msg.sender === 'user' ? 'bg-white dark:border-zinc-700 dark:bg-zinc-800' : 'border-transparent bg-brand-primary text-white dark:bg-white dark:text-black'}`}
                                        >
                                            {msg.sender === 'user' ? (
                                                <User className="h-5 w-5 text-brand-muted" />
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                        </div>

                                        <div
                                            className={`flex max-w-[85%] flex-col gap-2 lg:max-w-[75%]`}
                                        >
                                            <div
                                                className={`prose prose-zinc dark:prose-invert rounded-2xl px-4 py-2 text-base leading-7 break-words whitespace-pre-wrap ${
                                                    msg.sender === 'user'
                                                        ? 'bg-white ring-1 ring-zinc-200 dark:bg-zinc-800/80 dark:ring-zinc-700'
                                                        : isWelcomeMessage(
                                                                msg,
                                                                idx,
                                                            )
                                                          ? 'bg-gradient-to-br from-white to-zinc-50 px-5 py-4 shadow-sm ring-1 ring-zinc-200/80 dark:from-zinc-900 dark:to-zinc-950 dark:ring-zinc-800'
                                                          : msg.highlight
                                                            ? 'animate-pulse bg-red-50 font-semibold ring-2 ring-red-500 dark:bg-red-900/20 dark:ring-red-500'
                                                            : 'bg-transparent'
                                                } `}
                                            >
                                                {parseTextWithLinks(msg.text)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Reply Options - touch friendly on mobile */}
                                    {msg.sender === 'bot' && msg.options && (
                                        <div className="ml-10 flex flex-wrap gap-2 sm:ml-12">
                                            {msg.options.map(
                                                (option, optIdx) => (
                                                    <button
                                                        key={optIdx}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSend(
                                                                undefined,
                                                                option,
                                                            )
                                                        }
                                                        disabled={
                                                            loading ||
                                                            idx !==
                                                                messages.length -
                                                                    1
                                                        }
                                                        className={`min-h-[44px] touch-manipulation rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 ${idx !== messages.length - 1 ? 'cursor-not-allowed opacity-50' : ''} `}
                                                    >
                                                        {option}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white dark:bg-white dark:text-black">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></span>
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 delay-75"></span>
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>

                    <footer className="absolute right-0 bottom-0 left-0 w-full bg-transparent p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
                        <div className="mx-auto max-w-3xl">
                            <form
                                onSubmit={(e) => handleSend(e)}
                                className="relative flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-xl shadow-zinc-200/50 focus-within:ring-2 focus-within:ring-brand-primary/50 sm:rounded-3xl sm:p-3 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
                            >
                                <input
                                    className="min-w-0 flex-1 [touch-action:manipulation] resize-none border-0 bg-transparent px-3 py-3 text-base placeholder:text-zinc-400 focus:ring-0 focus:outline-none sm:py-3 dark:text-white"
                                    placeholder="Message Area24One..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="shrink-0 touch-manipulation rounded-xl bg-brand-primary p-3 text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-30 sm:mb-1 sm:rounded-2xl sm:p-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    aria-label="Send"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                            <p className="mt-2 text-center text-[10px] text-zinc-400">
                                AI can make mistakes. Consider checking
                                important information.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
