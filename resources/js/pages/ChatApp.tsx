import { Head, Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { Send, User, Bot, Sparkles, ArrowLeft, Plus, MessageSquare, History, Menu, X, LogIn, Trash2, LogOut } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { type SharedData } from '@/types';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
}

interface ChatSession {
    id: string;
    title: string;
    updated_at: string;
}

declare function route(name: string, params?: any): string;

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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            console.error("Failed to load history", e);
        }
    };

    const loadSession = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/chat/session/${id}`);
            const sessionData = res.data;
            setSessionId(sessionData.id);

            // Transform messages
            const loadedMessages: Message[] = sessionData.messages.map((m: any) => ({
                sender: m.sender,
                text: m.message,
                options: m.options
            }));

            setMessages(loadedMessages);
            if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile select
        } catch (e) {
            console.error("Failed to load session", e);
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

    const fetchBotResponse = async (msg: string, currentSessionId: string | null) => {
        setLoading(true);
        try {
            const response = await axios.post('/chat', {
                message: msg,
                session_id: currentSessionId
            });

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: response.data.reply,
                options: response.data.options
            }]);

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
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, connection error.' }]);
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
            console.error("Failed to delete session", e);
        }
    };

    const handleSend = async (e?: React.FormEvent, manualMsg?: string) => {
        e?.preventDefault();
        const msgToSend = manualMsg || input;

        if (!msgToSend.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: msgToSend }]);
        setInput('');

        await fetchBotResponse(msgToSend, sessionId);
    };

    return (
        <>
            <Head title="Chat" />
            <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">

                {/* Sidebar (ChatGPT Style) */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-30 w-64 transform bg-white text-zinc-600 transition-transform duration-300 ease-in-out dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:relative lg:translate-x-0
                    `}
                >
                    <div className="flex h-full flex-col p-4">
                        {/* Brand Logo & Label */}
                        <Link href="/" className="mb-6 flex items-center gap-3 px-2 transition-opacity hover:opacity-80 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-zinc-200">
                                <img
                                    src="/image/Area 24 one logo black.png"
                                    alt="Area 24 One Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
                                Area 24 <span className="font-medium text-zinc-500">one</span>
                            </span>
                        </Link>

                        {/* New Chat Button */}
                        <button
                            onClick={startNewChat}
                            className="mb-4 flex w-full items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">New chat</span>
                        </button>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {auth.user ? (
                                <>
                                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">History</h3>
                                    {history.length > 0 ? (
                                        <div className="space-y-1">
                                            {history.map((session) => (
                                                <div key={session.id} className="group relative">
                                                    <button
                                                        onClick={() => loadSession(session.id)}
                                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm transition-colors pr-10
                                                            ${sessionId === session.id ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}
                                                        `}
                                                    >
                                                        <MessageSquare className="h-4 w-4 shrink-0" />
                                                        <span className="truncate text-left">{session.title || 'Untitled Chat'}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => deleteSession(e, session.id)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="px-2 text-xs text-zinc-600">No previous chats.</p>
                                    )}
                                </>
                            ) : (
                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center ring-1 ring-zinc-200 dark:ring-zinc-700">
                                    <p className="mb-3 text-sm text-zinc-500">Log in to save your chat history.</p>
                                    <Link href="/login" className="inline-flex items-center gap-2 rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black">
                                        <LogIn className="h-3 w-3" /> Login
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-700 pt-4">
                            {auth.user ? (
                                <div className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 group">
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-900 text-white font-bold dark:bg-white dark:text-black">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                                            {auth.user.name}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-md transition-all lg:opacity-0 group-hover:opacity-100"
                                        title="Log out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/" className="flex items-center gap-2 p-2 text-sm hover:text-white">
                                    <ArrowLeft className="h-4 w-4" /> Back to Home
                                </Link>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col h-full relative">
                    {/* Header (Mobile Toggle) */}
                    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/80 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 lg:hidden">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-zinc-100 rounded dark:hover:bg-zinc-800">
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-0.5 shadow-sm ring-1 ring-zinc-200">
                                <img src="/image/Area 24 one logo black.png" alt="" className="h-full w-full object-contain" />
                            </div>
                            <span className="font-bold tracking-tighter uppercase text-sm">Area 24 <span className="font-medium text-zinc-500">one</span></span>
                        </div>
                        <div className="w-8" />
                    </header>

                    {/* Chat Area */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        <div className="mx-auto max-w-3xl space-y-8 pb-20">
                            {/* Empty State / Welcome */}
                            {messages.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-50">
                                    <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                                        <Sparkles className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold">How can I help you today?</h2>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${msg.sender === 'user' ? 'bg-white dark:bg-zinc-800 dark:border-zinc-700' : 'bg-zinc-900 text-white border-transparent dark:bg-white dark:text-black'}`}>
                                            {msg.sender === 'user' ? <User className="h-5 w-5 text-zinc-500" /> : <Sparkles className="h-4 w-4" />}
                                        </div>

                                        <div className={`flex flex-col gap-2 max-w-[85%] lg:max-w-[75%]`}>
                                            <div className={`
                                                prose prose-zinc dark:prose-invert break-words text-base leading-7 rounded-2xl px-4 py-2
                                                ${msg.sender === 'user' ? 'bg-white dark:bg-zinc-800/80 ring-1 ring-zinc-200 dark:ring-zinc-700' : ''}
                                            `}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Reply Options */}
                                    {msg.sender === 'bot' && msg.options && (
                                        <div className="ml-12 flex flex-wrap gap-2">
                                            {msg.options.map((option, optIdx) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleSend(undefined, option)}
                                                    disabled={loading || idx !== messages.length - 1}
                                                    className={`rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 shadow-sm
                                                        ${idx !== messages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black">
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

                    <footer className="p-4 bg-transparent absolute bottom-0 w-full">
                        <div className="mx-auto max-w-3xl">
                            <form onSubmit={(e) => handleSend(e)} className="relative flex items-end gap-2 rounded-3xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-200/50 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                                <input
                                    className="flex-1 resize-none border-0 bg-transparent px-3 py-3 text-base placeholder:text-zinc-400 focus:ring-0 focus:outline-none dark:text-white"
                                    placeholder="Message Area24One..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="mb-1 rounded-2xl bg-black p-2 text-white hover:bg-zinc-800 disabled:opacity-30 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                            <p className="mt-2 text-center text-[10px] text-zinc-400">
                                AI can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
