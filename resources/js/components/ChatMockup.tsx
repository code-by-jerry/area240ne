import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const ChatMockup = () => {
    const [messages, setMessages] = useState<
        { role: 'ai' | 'user'; content: any; options?: string[] }[]
    >([
        {
            role: 'ai',
            content:
                "Hello! I'm your Area 24 expert consultant. Looking for architecture, interiors, or a new property?",
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasInteracted = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Demo Sequence
    const demoStarted = useRef(false);

    useEffect(() => {
        if (demoStarted.current) return;
        demoStarted.current = true;

        const typeText = async (text: string) => {
            for (let i = 0; i <= text.length; i++) {
                if (hasInteracted.current) break;
                setInputValue(text.slice(0, i));
                await new Promise((r) => setTimeout(r, 40));
            }
        };

        const runDemo = async () => {
            // Initial delay before user typing starts
            await new Promise((r) => setTimeout(r, 2000));
            if (hasInteracted.current) return;

            // Simulate User Typing
            await typeText('I want to build a modern villa in the suburbs.');
            if (hasInteracted.current) {
                setInputValue('');
                return;
            }

            await new Promise((r) => setTimeout(r, 500));
            if (hasInteracted.current) return;

            // Send Message
            setMessages((prev) => [
                ...prev,
                {
                    role: 'user',
                    content: 'I want to build a modern villa in the suburbs.',
                },
            ]);
            setInputValue('');
            setIsTyping(true);

            // AI Thinking
            await new Promise((r) => setTimeout(r, 1500));
            if (hasInteracted.current) {
                setIsTyping(false);
                return;
            }

            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'ai',
                    content: (
                        <>
                            Perfect. I can help coordinate between{' '}
                            <strong className="text-brand-primary dark:text-white">
                                Atha Construction
                            </strong>{' '}
                            and{' '}
                            <strong className="text-brand-primary dark:text-white">
                                Nesthetix Design
                            </strong>
                            . May I know your preferred budget range?
                        </>
                    ),
                    options: ['Modern Villa', 'Sustainable', 'Classic'],
                },
            ]);
        };

        runDemo();
    }, []);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        hasInteracted.current = true;
        setMessages((prev) => [...prev, { role: 'user', content: inputValue }]);
        setInputValue('');
        setIsTyping(true);

        // Generic AI Response for interaction
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'ai',
                    content:
                        "That sounds exciting! Let's get more details to tailor the perfect solution for you.",
                },
            ]);
        }, 1000);
    };

    const handleOptionClick = (option: string) => {
        hasInteracted.current = true;
        setMessages((prev) => [...prev, { role: 'user', content: option }]);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'ai',
                    content:
                        'Excellent choice. We have specialized teams for that. Shall we start the full consultation?',
                },
            ]);
        }, 1000);
    };

    return (
        <div className="flex h-[400px] w-full max-w-[340px] flex-col overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md ring-1 ring-white/20">
            {/* Top Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white/20">
                        AI
                        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white/20 bg-green-500"></span>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white leading-none">
                            Area 24 Consultant
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                            <span className="h-1 w-1 animate-pulse rounded-full bg-green-500"></span>
                            <span className="text-[9px] font-semibold tracking-wider text-white/60 uppercase">
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-white/10 flex-1 space-y-4 overflow-y-auto bg-transparent p-4"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex animate-in flex-col duration-500 fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-xl p-3 text-[12px] leading-snug font-medium shadow-sm ${msg.role === 'user'
                                ? 'rounded-tr-none bg-brand-primary/80 text-white backdrop-blur-sm border border-white/20'
                                : 'rounded-tl-none border border-white/10 bg-white/10 text-white backdrop-blur-sm'
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.options && (
                            <div className="scrollbar-hide mt-2 flex max-w-full gap-1.5 overflow-x-auto pb-1">
                                {msg.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOptionClick(opt)}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold text-white whitespace-nowrap transition-all hover:bg-white/20 hover:border-[#C7A14A]/50 hover:shadow-sm"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex w-12 animate-in items-center gap-1 rounded-xl rounded-tl-none border border-white/10 bg-white/5 p-3 fade-in backdrop-blur-sm">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"></div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="shrink-0 border-t border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="relative flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            hasInteracted.current = true;
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-10 text-[11px] font-medium text-white placeholder:text-white/40 focus:border-[#C7A14A]/50 focus:outline-none focus:ring-1 focus:ring-[#C7A14A]/50 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatMockup;
