import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, LogIn, LogOut, MessageSquare, Mic, Plus, Send, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const BG_IMAGE = 'https://ik.imagekit.io/area24onestorage/Chat%20UI/ChatGPT%20Image%20Apr%2016,%202026,%2004_39_52%20PM.png';
const ROBOT_ICON = 'https://ik.imagekit.io/area24onestorage/Chat%20UI/robot.png';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
    highlight?: boolean;
    requires_input?: boolean;
}

interface ChatSession {
    id: string;
    title: string;
    updated_at: string;
}

function parseText(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, idx) => {
        if (urlRegex.test(part)) {
            return (
                <a key={idx} href={part} target="_blank" rel="noopener noreferrer"
                    className="text-[#C7A14A] underline underline-offset-2 hover:opacity-80">
                    {new URL(part).hostname.replace('www.', '')}
                </a>
            );
        }
        return part.replace(/\*\*(.*?)\*\*/g, '$1').split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
        ));
    });
}

export default function ChatApp() {
    const { auth } = usePage<SharedData>().props;
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (auth.user) fetchHistory();
        if (!initRef.current && !sessionId) {
            initRef.current = true;
            fetchBotResponse('', null);
        }
    }, [auth.user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/chat/history');
            setHistory(res.data);
        } catch {}
    };

    const loadSession = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/chat/session/${id}`);
            setSessionId(res.data.id);
            setMessages(res.data.messages.map((m: any) => ({
                sender: m.sender, text: m.message, options: m.options,
            })));
            setSidebarOpen(false);
        } catch {}
        finally { setLoading(false); }
    };

    const startNewChat = () => {
        setSessionId(null);
        setMessages([]);
        fetchBotResponse('', null);
        setSidebarOpen(false);
    };

    const fetchBotResponse = async (msg: string, sid: string | null) => {
        setLoading(true);
        try {
            const res = await axios.post('/chat', { message: msg, session_id: sid });
            setMessages(prev => {
                if (prev.length > 0 && prev[prev.length - 1].sender === 'bot' && prev[prev.length - 1].text === res.data.reply) return prev;
                return [...prev, {
                    sender: 'bot',
                    text: res.data.reply,
                    options: res.data.options,
                    highlight: res.data.highlight ?? false,
                }];
            });
            if (res.data.session_id) {
                setSessionId(res.data.session_id);
                if (auth.user) fetchHistory();
            }
        } catch (err: any) {
            const status = axios.isAxiosError(err) ? err.response?.status : 0;
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: status === 419 ? 'Session expired. Please refresh.' : 'Connection error. Please try again.',
            }]);
        } finally { setLoading(false); }
    };

    const deleteSession = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this chat?')) return;
        await axios.delete(`/chat/session/${id}`);
        if (sessionId === id) { setSessionId(null); setMessages([]); fetchBotResponse('', null); }
        fetchHistory();
    };

    const handleSend = async (e?: React.FormEvent, manual?: string) => {
        e?.preventDefault();
        const msg = manual || input;
        if (!msg.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: msg }]);
        setInput('');
        await fetchBotResponse(msg, sessionId);
    };

    return (
        <>
            <Head title="Chat — Area24One AI" />

            {/* Full-screen BG */}
            <div className="fixed inset-0 z-0">
                <img src={BG_IMAGE} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-white/30" />
            </div>

            <div className="relative z-10 flex h-screen overflow-hidden font-sans">

                {/* ── SIDEBAR ─────────────────────────────────── */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 flex w-72 flex-col
                    border-r border-white/20 bg-white/20 backdrop-blur-2xl
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0 lg:w-64
                `}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/20 px-4 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A1628] p-1">
                                <img src="https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/main%20logo.png"
                                    alt="Area24One" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-sm font-bold text-[#0A1628]">Area24 AI</span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-slate-500 hover:bg-white/50 lg:hidden">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* New Chat */}
                    <div className="px-3 pt-3">
                        <button onClick={startNewChat}
                            className="flex w-full items-center gap-2 rounded-xl border border-white/30 bg-white/30 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/50">
                            <Plus className="h-4 w-4" />
                            New chat
                        </button>
                    </div>

                    {/* History */}
                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        {auth.user ? (
                            <>
                                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">History</p>
                                {history.length === 0 ? (
                                    <p className="px-1 text-xs text-slate-400">No previous chats.</p>
                                ) : history.map(s => (
                                    <div key={s.id} className="group relative mb-1">
                                        <button onClick={() => loadSession(s.id)}
                                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2.5 pr-8 text-left text-sm transition-colors ${sessionId === s.id ? 'bg-white/40 font-medium text-[#0A1628]' : 'text-slate-600 hover:bg-white/30'}`}>
                                            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                            <span className="truncate">{s.title || 'Untitled Chat'}</span>
                                        </button>
                                        <button onClick={e => deleteSession(e, s.id)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 opacity-0 hover:text-red-500 group-hover:opacity-100">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="rounded-xl border border-white/50 bg-white/50 p-4 text-center">
                                <p className="mb-3 text-xs text-slate-500">Log in to save history</p>
                                <Link href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1628] px-3 py-1.5 text-xs font-semibold text-white">
                                    <LogIn className="h-3 w-3" /> Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/20 px-3 py-3">
                        {auth.user ? (
                            <div className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/30">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1628] text-xs font-bold text-white">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="truncate text-sm font-medium text-slate-700">{auth.user.name}</span>
                                </div>
                                <button onClick={() => router.post('/logout')} title="Logout"
                                    className="rounded p-1 text-slate-400 hover:text-red-500">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/" className="flex items-center gap-2 px-2 py-2 text-sm text-slate-500 hover:text-[#0A1628]">
                                <ArrowLeft className="h-4 w-4" /> Back to Home
                            </Link>
                        )}
                    </div>
                </aside>

                {/* Sidebar overlay on mobile */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ── MAIN ────────────────────────────────────── */}
                <div className="flex flex-1 flex-col overflow-hidden">

                    {/* Top bar */}
                    <header className="flex items-center justify-between border-b border-white/40 bg-white/60 px-4 py-3 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-1.5 text-slate-600 hover:bg-white/60 lg:hidden">
                                <MessageSquare className="h-5 w-5" />
                            </button>
                            <img src={ROBOT_ICON} alt="AI" className="h-8 w-8 object-contain" />
                            <div>
                                <p className="text-sm font-bold text-[#0A1628]">Area24 AI</p>
                                <p className="text-[10px] text-slate-400">Powered by AI</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-xs font-medium text-slate-500">Online</span>
                        </div>
                    </header>

                    {/* Messages */}
                    <main className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-8">
                        <div className="mx-auto max-w-2xl space-y-5 pb-4">

                            {/* Empty state */}
                            {messages.length === 0 && !loading && (
                                <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm backdrop-blur-md">
                                    <div className="mb-4 flex items-center gap-3">
                                        <img src={ROBOT_ICON} alt="AI" className="h-14 w-14 object-contain" />
                                        <div>
                                            <p className="text-sm text-slate-500">I help you with</p>
                                            <p className="text-xl font-bold text-[#0A1628] leading-tight">
                                                Construction, Interiors,<br />Real Estate & more.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['🏗️ Build a Villa', '🎨 Design Interiors', '🏢 Buy Property', '🌱 Land Development', '🎉 Plan an Event'].map(opt => (
                                            <button key={opt} onClick={() => handleSend(undefined, opt)}
                                                className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white hover:shadow-md">
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        {/* Avatar */}
                                        {msg.sender === 'bot' && (
                                            <img src={ROBOT_ICON} alt="AI" className="h-7 w-7 shrink-0 self-end object-contain" />
                                        )}

                                        {/* Bubble */}
                                        <div className={`w-fit max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words shadow-sm ${
                                            msg.sender === 'user'
                                                ? 'rounded-br-sm bg-[#C7A14A]/20 text-[#0A1628] ring-1 ring-[#C7A14A]/30'
                                                : msg.highlight
                                                    ? 'rounded-bl-sm bg-red-50 ring-2 ring-red-400 whitespace-pre-wrap'
                                                    : 'rounded-bl-sm bg-white/80 text-slate-800 ring-1 ring-white/60 backdrop-blur-sm whitespace-pre-wrap'
                                        }`}>
                                            {parseText(msg.text)}
                                        </div>
                                    </div>

                                    {/* Quick reply options */}
                                    {msg.sender === 'bot' && msg.options && idx === messages.length - 1 && (
                                        <div className="ml-10 flex flex-wrap gap-2">
                                            {msg.options.map((opt, oi) => (
                                                <button key={oi} type="button"
                                                    onClick={() => handleSend(undefined, opt)}
                                                    disabled={loading}
                                                    className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-white hover:shadow-md disabled:opacity-50">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {loading && (
                                <div className="flex items-end gap-2.5">
                                    <img src={ROBOT_ICON} alt="AI" className="h-7 w-7 shrink-0 object-contain" />
                                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/80 px-4 py-3 shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </main>

                    {/* Input bar */}
                    <div className="shrink-0 border-t border-white/40 bg-white/70 px-4 py-3 backdrop-blur-md md:px-8">
                        <div className="mx-auto max-w-2xl">
                            <form onSubmit={handleSend}
                                className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-2.5 shadow-lg ring-1 ring-slate-200/50 focus-within:ring-[#C7A14A]/40">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    autoComplete="off"
                                    className="flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                />
                                <button type="button" aria-label="Voice input"
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                    <Mic className="h-4 w-4" />
                                </button>
                                <button type="submit" disabled={!input.trim() || loading} aria-label="Send"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A1628] text-white shadow-md transition-all hover:bg-[#C7A14A] active:scale-95 disabled:opacity-30">
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                            <p className="mt-1.5 text-center text-[10px] text-slate-400">
                                🔒 Your data is safe & confidential
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
