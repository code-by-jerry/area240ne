import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Globe, MessageCircle, X, Send } from 'lucide-react';

const WIDGET_SESSION_KEY = 'area24_chat_session_id';

function getStoredSessionId(): string | null {
    try {
        return sessionStorage.getItem(WIDGET_SESSION_KEY);
    } catch {
        return null;
    }
}

function setStoredSessionId(id: string | null) {
    try {
        if (id) sessionStorage.setItem(WIDGET_SESSION_KEY, id);
        else sessionStorage.removeItem(WIDGET_SESSION_KEY);
    } catch {
        //
    }
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
}

function parseTextWithLinks(text: string): React.ReactNode {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
        <>
            {parts.map((part, idx) => {
                if (/^https?:\/\//.test(part) || /^www\./.test(part)) {
                    const url = part.startsWith('http') ? part : `https://${part}`;
                    const displayText = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
                    return (
                        <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
                        >
                            <Globe className="h-3 w-3 shrink-0" />
                            {displayText}
                        </a>
                    );
                }
                return (
                    <React.Fragment key={idx}>
                        {part.replace(/\*\*(.*?)\*\*/g, '$1').split('\n').map((line, i, arr) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < arr.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                );
            })}
        </>
    );
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(() => getStoredSessionId());
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hello! looking for Real Estate, Construction, or Interior Design?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent, option?: string) => {
        e?.preventDefault();
        const userMsg = option ?? input.trim();
        if (!userMsg) return;

        if (!option) setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const response = await axios.post('/chat', {
                message: userMsg,
                session_id: sessionId || undefined,
            });
            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: response.data.reply,
                    options: response.data.options ?? undefined,
                },
            ]);

            const newSessionId = response.data.session_id;
            if (newSessionId) {
                setSessionId(newSessionId);
                setStoredSessionId(newSessionId);
            }

            if (response.data.redirect) {
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 2000);
            }
        } catch (err: unknown) {
            const status = axios.isAxiosError(err) ? err.response?.status : 0;
            const text = status === 419
                ? 'Session expired. Please refresh the page and try again.'
                : 'Sorry, I am having trouble connecting right now.';
            setMessages(prev => [...prev, { sender: 'bot', text }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
            {/* Chat Body - mobile: full screen; sm: floating card */}
            {isOpen && (
                <div className="flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl animate-in fade-in slide-in-from-bottom-10
                    w-[calc(100vw-2rem)] max-w-[22rem] h-[85dvh] max-h-[32rem] rounded-2xl mb-3
                    sm:w-80 sm:h-96 sm:mb-4
                    min-h-[280px]">
                    {/* Header - touch target */}
                    <div className="bg-brand-primary text-white px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pr-4 pb-3 pl-4 sm:p-4 flex justify-between items-center shrink-0">
                        <span className="font-semibold text-sm sm:text-base">Area24One Assistant</span>
                        <button type="button" onClick={() => setIsOpen(false)} className="touch-manipulation p-2 -m-2 rounded-lg hover:bg-white/20 active:bg-white/30" aria-label="Close">
                            <X className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950/50 overscroll-contain">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user'
                                        ? 'bg-brand-primary text-white rounded-br-none'
                                        : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm'
                                        }`}>
                                        {parseTextWithLinks(msg.text)}
                                    </div>
                                </div>
                                {msg.sender === 'bot' && msg.options && msg.options.length > 0 && idx === messages.length - 1 && !loading && (
                                    <div className="flex flex-wrap gap-1.5 justify-start">
                                        {msg.options.map((opt, oi) => (
                                            <button
                                                key={oi}
                                                type="button"
                                                onClick={() => handleSend(undefined, opt)}
                                                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full px-4 py-2 text-xs text-zinc-500 animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input - safe area for mobile keyboard */}
                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 shrink-0 pb-[env(safe-area-inset-bottom)]">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 min-w-0 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-3 text-base focus:ring-2 focus:ring-brand-primary outline-none sm:py-2 sm:text-sm [touch-action:manipulation]"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-brand-primary text-white p-3 rounded-full hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation shrink-0 sm:p-2"
                            aria-label="Send"
                        >
                            <Send className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button - touch friendly */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-brand-primary hover:bg-zinc-800 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 touch-manipulation"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}
