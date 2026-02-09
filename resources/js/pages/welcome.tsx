import { ConsultationModal } from '@/components/ConsultationModal';
import { Marquee } from '@/components/MagicMarquee';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Hammer,
    Heart,
    Home,
    MapPin,
    Map,
    Menu,
    MessageSquare,
    PaintBucket,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type DiscoveryOptions = {
    service:
    | 'construction'
    | 'interiors'
    | 'real-estate'
    | 'development'
    | 'events'
    | '';
    timeline: 'immediate' | '1-3' | '3-6' | '6-12' | '';
    budget: 'under-10L' | '10-50L' | '50L-2Cr' | '2Cr+' | '';
};

const ChatMockup = () => {
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
            // Redirect to full chat after a delay if needed, or just leave it
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
        <div className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl ring-1 shadow-zinc-200/50 ring-zinc-200 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/50 dark:ring-zinc-800">
            {/* Top Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/50 px-6 py-5 backdrop-blur-md dark:border-zinc-800 dark:bg-black/50">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-sm ring-4 ring-zinc-50 dark:bg-white dark:text-black dark:ring-zinc-900">
                        AI
                        <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900"></span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-brand-primary dark:text-white">
                            Area 24 Consultant
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 flex-1 space-y-6 overflow-y-auto bg-zinc-50/50 p-6 dark:bg-black/20"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex animate-in flex-col duration-500 fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed font-medium shadow-sm ${msg.role === 'user'
                                ? 'rounded-tr-none bg-brand-primary text-white shadow-brand-primary/10 dark:bg-white dark:text-black'
                                : 'rounded-tl-none border border-zinc-100 bg-white text-zinc-600 dark:border-zinc-700/50 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.options && (
                            <div className="scrollbar-hide mt-3 flex max-w-full gap-2 overflow-x-auto pb-2">
                                {msg.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOptionClick(opt)}
                                        className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all hover:border-[#C7A14A] hover:text-[#C7A14A] hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex w-16 animate-in items-center gap-1 rounded-2xl rounded-tl-none border border-zinc-100 bg-white p-4 fade-in dark:border-zinc-700/50 dark:bg-zinc-800">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            hasInteracted.current = true;
                            setInputValue(e.target.value);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-brand-primary transition-all placeholder:text-zinc-400 focus:border-[#C7A14A] focus:ring-2 focus:ring-[#C7A14A]/30 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-[#C7A14A]"
                    />
                    <button
                        onClick={handleSend}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white transition-opacity hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-white dark:text-black"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const heroSlides = [
    {
        tag: 'The Future of Consultation',
        title: 'One Platform. Five Expert Brands.',
        highlight: 'One Smart Consultant.',
        description:
            'Plan, validate, and execute your property decisions — construction, interiors, real estate, development, and events — through one intelligent platform.',
        image: '/image/area 24 one.png',
        hero: '/image/hero/area 24 one.png',
        color: 'brand-primary',
    },
    {
        tag: 'Construction Excellence',
        title: 'Built to Last. Precision Engineered.',
        highlight: 'Atha Construction',
        description:
            'From foundation to finish, we deliver construction excellence with modern techniques and transparent workflows.',
        image: '/image/atha.png',
        hero: '/image/hero/atha  logo mockup.png',
        color: 'amber-500',
    },
    {
        tag: 'Luxury Interiors',
        title: 'Spaces that Inspire. Designs that Speak.',
        highlight: 'Nesthetix Design',
        description:
            'Bespoke interior design solutions that blend luxury, functionality, and your unique personality.',
        image: '/image/nesthetix.png',
        hero: '/image/hero/Nesthetix logo mockup.png',
        color: 'purple-500',
    },
    {
        tag: 'Premium Real Estate',
        title: 'Find Your Future. Own Your Legacy.',
        highlight: 'Area24 Realty',
        description:
            'Expert real estate consulting to help you find the perfect property that aligns with your lifestyle and goals.',
        image: '/image/area 24 realty.png',
        hero: '/image/hero/Area24 realty  logo mockup.png',
        color: 'blue-500',
    },
    {
        tag: 'Visionary Development',
        title: 'Developing Dreams. Shaping Communities.',
        highlight: 'Area24 Developers',
        description:
            'Innovative residential and commercial development projects that redefine the standards of modern living.',
        image: '/image/hero/Area24 developers  logo mockup.png',
        hero: '/image/hero/Area24 developers  logo mockup.png',
        color: 'emerald-500',
    },
    {
        tag: 'Memorable Experiences',
        title: 'Stages that Captivate. Moments that Matter.',
        highlight: 'The Stage 365',
        description:
            'Creating extraordinary events and immersive experiences that leave a lasting impression.',
        image: '/image/STAGE 365.png',
        hero: '/image/hero/The stage 365  logo mockup.png',
        color: 'rose-500',
    },
];

/** Base path for brand logos (public/image/brands material/) */
const BRANDS_IMAGE_BASE = '/image/brands%20material';

type MarqueeBrand = { name: string; logo: string };

function MarqueeBrandCard({ brand }: { brand: MarqueeBrand }) {
    const [imgError, setImgError] = useState(false);
    const showLogo = brand.logo && !imgError;
    return (
        <div
            className="group flex h-28 w-32 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-gray-50 p-5 shadow-sm transition-all duration-300 hover:border-[#C7A14A]/50 hover:shadow-lg hover:shadow-[#C7A14A]/10 dark:border-zinc-600 dark:bg-zinc-100 dark:hover:border-[#C7A14A]/50"
            title={brand.name}
        >
            {showLogo ? (
                <img
                    src={brand.logo}
                    alt=""
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-400">
                    {brand.name.charAt(0)}
                </span>
            )}
        </div>
    );
}

/** Brand logos from public/image/brands material/ — logo only, no name/category. */
const MARQUEE_BRANDS: MarqueeBrand[] = [
    { name: 'TATA TMT', logo: `${BRANDS_IMAGE_BASE}/tata-tiscon-logo.png` },
    { name: 'JSW', logo: `${BRANDS_IMAGE_BASE}/jsw-steel.jpeg` },
    { name: 'Ultratech', logo: `${BRANDS_IMAGE_BASE}/ultratech-cement.png` },
    { name: 'ACC', logo: `${BRANDS_IMAGE_BASE}/ACC.svg` },
    { name: 'Birla', logo: `${BRANDS_IMAGE_BASE}/birla-logo.jpg` },
    { name: 'Dalmia', logo: `${BRANDS_IMAGE_BASE}/dalmia-cement.svg` },
    { name: 'Zuari', logo: `${BRANDS_IMAGE_BASE}/Zuari%20cement.jpg` },
    { name: 'Bharathi', logo: `${BRANDS_IMAGE_BASE}/bharathi-logo.png` },
    { name: 'Kohler', logo: `${BRANDS_IMAGE_BASE}/kohler.svg` },
    { name: 'Jaquar', logo: `${BRANDS_IMAGE_BASE}/jaquar.svg` },
    { name: 'Parryware', logo: `${BRANDS_IMAGE_BASE}/parryware-brand.png` },
    { name: 'Cera', logo: `${BRANDS_IMAGE_BASE}/cera-logo.gif` },
    { name: 'Havells', logo: `${BRANDS_IMAGE_BASE}/Havells_Logo.svg` },
    { name: 'Finolex', logo: `${BRANDS_IMAGE_BASE}/Finolex%20logo.png` },
    { name: 'Legrand', logo: `${BRANDS_IMAGE_BASE}/legrand.webp` },
    { name: 'Schneider', logo: `${BRANDS_IMAGE_BASE}/schneider.svg` },
    { name: 'APL Apollo', logo: `${BRANDS_IMAGE_BASE}/apl_apollo.png` },
    { name: 'Ashirwad', logo: `${BRANDS_IMAGE_BASE}/ashirvad-logo.png` },
    { name: 'Jindal', logo: `${BRANDS_IMAGE_BASE}/jindal-steel.svg` },
    { name: 'Sintex', logo: `${BRANDS_IMAGE_BASE}/sintex.png` },
    { name: 'Sunvik TMT', logo: `${BRANDS_IMAGE_BASE}/Sunvik%20TMT.png` },
    { name: 'Kamadhenu', logo: `${BRANDS_IMAGE_BASE}/Kamadhenu.png` },
    { name: 'Orbit', logo: `${BRANDS_IMAGE_BASE}/orbit-logo.webp` },
    { name: 'Indus', logo: `${BRANDS_IMAGE_BASE}/Indus-logo.svg` },
    { name: 'Vguard', logo: `${BRANDS_IMAGE_BASE}/vguard-logo.jpg` },
];

export default function Welcome({
    canLogin = true,
    canRegister = true,
}: {
    canLogin?: boolean;
    canRegister?: boolean;
}) {
    const { auth } = usePage<{ auth: any }>().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [discovery, setDiscovery] = useState<DiscoveryOptions>({
        service: '',
        timeline: '',
        budget: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string>('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const expertiseRef = useRef<HTMLElement>(null);

    // Process Section Parallax
    const processRef = useRef(null);
    const { scrollYProgress: processProgress } = useScroll({
        target: processRef,
        offset: ['start end', 'end start'],
    });
    const processBgY = useTransform(processProgress, [0, 1], ['0%', '30%']);

    // Why Us Section Parallax
    const whyUsRef = useRef(null);
    const { scrollYProgress: whyUsProgress } = useScroll({
        target: whyUsRef,
        offset: ['start end', 'end start'],
    });
    const whyUsBgY1 = useTransform(whyUsProgress, [0, 1], ['0%', '25%']);
    const whyUsBgY2 = useTransform(whyUsProgress, [0, 1], ['0%', '-25%']);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const handleDiscoveryChange = (
        key: keyof DiscoveryOptions,
        value: string,
    ) => {
        const updated = { ...discovery, [key]: value };
        setDiscovery(updated);

        // Only navigate if all fields are selected
        if (Object.values(updated).every(Boolean)) {
            router.visit(
                `/chat?service=${updated.service}&timeline=${updated.timeline}&budget=${updated.budget}`,
            );
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        {
            id: 'construction',
            icon: <Building2 className="h-6 w-6" />,
            logo: '/image/atha.png',
            hero: '/image/hero/construction.jpg',
            title: 'Atha Construction',
            desc: 'Specializing in high-end residential and commercial projects, we offer a seamless journey from architectural blueprints to turnkey construction solutions. Explore our portfolio of precision-engineered structures.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '01',
            url: 'https://athaconstruction.in/',
        },
        {
            id: 'interiors',
            icon: <PaintBucket className="h-6 w-6" />,
            logo: '/image/nesthetix.png',
            hero: '/image/hero/interior.jpg',
            title: 'Nesthetix Design',
            desc: 'Our award-winning designers craft bespoke interiors that blend opulence with functionality. We tailor every detail to your lifestyle, creating spaces that are both inspiring and timeless. Discover your design aesthetic.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '02',
            url: 'https://nesthetixdesigns.com/',
        },
        {
            id: 'real-estate',
            icon: <Home className="h-6 w-6" />,
            logo: '/image/area 24 realty.png',
            hero: '/image/hero/realty.jpg',
            title: 'Area24 Realty',
            desc: 'Access exclusive listings and data-driven market insights. Our consultants provide strategic advice for discerning buyers, sellers, and investors in the premium property market. Find your next opportunity.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '03',
            url: 'https://area24developers.com/',
        },
        {
            id: 'development',
            icon: <Hammer className="h-6 w-6" />,
            logo: '/image/area 24 developers.png',
            hero: '/image/hero/developer.jpg',
            title: 'Area24 Developers',
            desc: 'We conceptualize and execute landmark residential and commercial developments. Our focus is on creating sustainable communities and innovative spaces that shape the future of urban living. View our master plans.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '04',
            url: 'https://area24developers.com/',
        },
        {
            id: 'events',
            icon: <Sparkles className="h-6 w-6" />,
            logo: '/image/stage 365.png',
            hero: '/image/hero/event.jpg',
            title: 'The Stage 365',
            desc: 'From corporate galas to immersive brand activations, we produce extraordinary events. Our team handles everything from conceptual design to flawless execution, ensuring a memorable experience. Plan your next event.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '05',
            url: 'https://thestage365.com/',
        },
    ];

    return (
        <>
            <Head title="Area 24 One | Intelligent Consultation" />
            <div className="font-inter scroll-smooth min-h-screen bg-brand-surface text-brand-text selection:bg-brand-primary selection:text-white dark:bg-brand-dark dark:text-zinc-50">
                {/* Navbar */}
                <nav
                    className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'border-b border-zinc-200 bg-white/90 py-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-black/90' : 'bg-transparent py-6'}`}
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                className="group flex cursor-pointer items-center gap-4"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary p-1 shadow-lg shadow-brand-primary/10 transition-transform duration-500 group-hover:scale-105 dark:bg-white">
                                    <img
                                        src="/image/area 24 one.png"
                                        alt="Logo"
                                        className="h-full w-full object-contain invert dark:invert-0"
                                    />
                                </div>
                                <span className="font-display text-2xl font-extrabold tracking-tighter text-brand-primary uppercase dark:text-white">
                                    Area 24{' '}
                                    <span className="font-medium text-brand-muted">
                                        one
                                    </span>
                                </span>
                            </Link>

                            <div className="hidden items-center gap-8 md:flex">
                                {['What We Do', 'Expertise', 'Process', 'Why Us', 'FAQ'].map(
                                    (item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="text-sm font-medium text-brand-muted transition-all duration-300 hover:scale-105 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:text-zinc-400 dark:hover:text-white"
                                        >
                                            {item}
                                        </a>
                                    ),
                                )}
                                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-semibold transition-opacity hover:opacity-70"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-6">
                                        <Link
                                            href="/login"
                                            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-primary dark:text-zinc-400 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-7 font-display text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C7A14A] hover:shadow-lg hover:shadow-[#C7A14A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-[#C7A14A] dark:hover:text-white dark:focus-visible:ring-white"
                                        >
                                            Start Consultation
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <button
                                className="rounded-lg p-2 text-brand-primary transition-colors hover:bg-zinc-100 md:hidden dark:text-white dark:hover:bg-zinc-900"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 animate-in bg-brand-surface p-6 pt-24 duration-300 fade-in md:hidden dark:bg-brand-dark">
                        <div className="flex flex-col gap-6 font-display text-2xl font-bold text-brand-primary dark:text-white">
                            <a
                                href="#what-we-do"
                                onClick={() => setMobileMenuOpen(false)}
                                className="transition-colors hover:text-brand-accent"
                            >
                                What We Do
                            </a>
                            <a
                                href="#expertise"
                                onClick={() => setMobileMenuOpen(false)}
                                className="transition-colors hover:text-brand-accent"
                            >
                                Expertise
                            </a>
                            <a
                                href="#process"
                                onClick={() => setMobileMenuOpen(false)}
                                className="transition-colors hover:text-brand-accent"
                            >
                                Process
                            </a>
                            <a
                                href="#why-us"
                                onClick={() => setMobileMenuOpen(false)}
                                className="transition-colors hover:text-brand-accent"
                            >
                                Why Us
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className="transition-colors hover:text-brand-accent"
                            >
                                FAQ
                            </a>
                            <div className="mt-4 h-px bg-zinc-200 dark:bg-zinc-800" />
                            <Link
                                href="/chat"
                                className="flex items-center gap-2 text-lg font-bold text-brand-muted uppercase transition-colors hover:text-brand-primary dark:hover:text-white"
                            >
                                Start Consultation{' '}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-20 md:min-h-screen md:pt-32 lg:min-h-[900px]">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(199,161,74,0.05),transparent_70%)]" />

                    {/* Background Accents (Animated based on slide) */}
                    <div
                        className={`animate-pulse-slow absolute top-[-10%] right-[-5%] -z-10 h-[600px] w-[600px] rounded-full mix-blend-multiply blur-[120px] transition-all duration-1000 dark:mix-blend-screen ${currentSlide === 1
                            ? 'bg-amber-500/10'
                            : currentSlide === 2
                                ? 'bg-purple-500/10'
                                : currentSlide === 3
                                    ? 'bg-blue-500/10'
                                    : currentSlide === 4
                                        ? 'bg-emerald-500/10'
                                        : currentSlide === 5
                                            ? 'bg-rose-500/10'
                                            : 'bg-brand-primary/10'
                            }`}
                    />
                    <div
                        className={`absolute bottom-[-10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full mix-blend-multiply blur-[100px] transition-all duration-1000 dark:mix-blend-screen ${currentSlide === 1
                            ? 'bg-amber-600/10'
                            : currentSlide === 2
                                ? 'bg-purple-600/10'
                                : currentSlide === 3
                                    ? 'bg-blue-600/10'
                                    : currentSlide === 4
                                        ? 'bg-emerald-600/10'
                                        : currentSlide === 5
                                            ? 'bg-rose-600/10'
                                            : 'bg-[#C7A14A]/10'
                            }`}
                    />

                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                        <div
                            className="relative h-[800px] sm:h-[700px] lg:h-[650px]"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                        >
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'z-30 opacity-100' : 'pointer-events-none z-10 opacity-0'}`}
                                >
                                    <div className="grid w-full items-center gap-16 lg:grid-cols-12">
                                        <div className="relative lg:col-span-7">
                                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold tracking-widest uppercase shadow-sm transition-all duration-500 dark:border-zinc-800 dark:bg-zinc-900">
                                                <Sparkles className="h-4 w-4 text-[#C7A14A]" />
                                                <span className="text-zinc-600 dark:text-zinc-300">
                                                    {slide.tag}
                                                </span>
                                            </div>
                                            <h1 className="mb-6 text-4xl leading-[1.1] font-bold tracking-tight text-brand-primary sm:text-5xl lg:text-6xl dark:text-white">
                                                {slide.title}
                                                <br />
                                                <span className="bg-gradient-to-r from-brand-primary via-zinc-500 to-brand-primary bg-clip-text text-transparent dark:from-white dark:via-zinc-400 dark:to-white">
                                                    {slide.highlight}
                                                </span>
                                            </h1>
                                            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                                {slide.description}
                                            </p>

                                            <div className="mt-10 flex flex-wrap items-center gap-5">
                                                <Link
                                                    href="/chat"
                                                    className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-brand-primary px-8 font-display text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#C7A14A] hover:shadow-xl hover:shadow-[#C7A14A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-[#C7A14A] dark:hover:text-white dark:focus-visible:ring-white"
                                                >
                                                    <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                                                    <MessageSquare className="relative z-10 h-5 w-5" />
                                                    <span className="relative z-10">
                                                        Start Consultation
                                                    </span>
                                                </Link>
                                                <a
                                                    href="#expertise"
                                                    className="group flex h-14 items-center gap-2 px-6 font-display text-base font-semibold text-brand-primary transition-colors hover:text-[#C7A14A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:text-white dark:hover:text-[#C7A14A]"
                                                >
                                                    Explore Our Expertise
                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="relative h-[400px] md:h-[500px] lg:col-span-5 lg:h-[650px]">
                                            <div className="absolute inset-0 -z-10 scale-105 rounded-[2.5rem] bg-gradient-to-tr from-zinc-200/30 via-transparent to-transparent opacity-50 blur-3xl dark:from-[#C7A14A]/10" />
                                            {index === 0 ? (
                                                <ChatMockup />
                                            ) : (
                                                <div className="relative flex h-full w-full items-center justify-center">
                                                    {/* Background hero art */}
                                                    {/* Attempt to load hero image; if it fails it will be hidden and fallback gradient will remain visible */}
                                                    {slide.hero ? (
                                                        <img
                                                            src={slide.hero}
                                                            alt=""
                                                            decoding="async"
                                                            onError={(e) => {
                                                                // hide broken image so fallback is visible
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).style.display =
                                                                    'none';
                                                            }}
                                                            className="absolute inset-0 -z-10 h-full w-full rounded-[2.5rem] object-cover brightness-100 contrast-110 saturate-105"
                                                        />
                                                    ) : null}

                                                    {/* Fallback gradient (visible if image not loaded) */}
                                                    <div className="absolute inset-0 -z-11 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-100 to-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Slider Controls */}
                        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-12 bg-brand-primary dark:bg-white' : 'w-4 bg-zinc-300 dark:bg-zinc-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust/Authority Strip */}
                <section className="relative overflow-hidden border-y border-zinc-800 bg-zinc-950 py-16 dark:bg-black">
                    {/* Textured Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '32px 32px',
                            }}
                        />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-zinc-950 to-transparent dark:from-black" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-zinc-950 to-transparent dark:from-black" />

                    {/* Accent Glow */}
                    <div className="absolute top-1/2 left-1/2 h-[200px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-[100px]" />

                    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
                        <Marquee
                            className="[--duration:50s] [--gap:6rem]"
                            pauseOnHover
                        >
                            {[
                                {
                                    icon: <ShieldCheck className="h-7 w-7" />,
                                    text: '10+ Years Experience',
                                },
                                {
                                    icon: <Zap className="h-7 w-7" />,
                                    text: 'End-to-End Solutions',
                                },
                                {
                                    icon: <CheckCircle2 className="h-7 w-7" />,
                                    text: 'Verified Consultants',
                                },
                                {
                                    icon: <Users className="h-7 w-7" />,
                                    text: 'Smart Lead Guidance',
                                },
                                {
                                    icon: <Star className="h-7 w-7" />,
                                    text: 'Premium Partners',
                                },
                                {
                                    icon: <MessageSquare className="h-7 w-7" />,
                                    text: '24/7 AI Support',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group mx-6 flex cursor-default items-center gap-4 text-zinc-400"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition-all duration-500 group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-black group-hover:shadow-brand-accent/20 dark:border-zinc-900 dark:bg-zinc-950">
                                        {item.icon}
                                    </div>
                                    <span className="font-display text-lg font-bold tracking-wider whitespace-nowrap text-white uppercase transition-colors duration-500 [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)] group-hover:text-brand-accent group-hover:[text-shadow:_0_0_20px_rgb(199_161_74_/_60%)]">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </section>

                {/* What We Do & Who It's For - Customer-driven, compact bento */}
                <section
                    id="what-we-do"
                    className="relative overflow-hidden border-y border-zinc-100 bg-white py-14 dark:border-zinc-800 dark:bg-brand-dark/50 md:py-16"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(199,161,74,0.04),_transparent_50%)]" />
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        {/* Mission + Who Is This For: single compact header row */}
                        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5">
                                    <Heart className="h-3.5 w-3.5 text-brand-primary dark:text-[#C7A14A]" />
                                    <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                        What we're building for you
                                    </span>
                                </div>
                                <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-primary sm:text-3xl dark:text-white">
                                    One conversation.{' '}
                                    <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-zinc-500">
                                        Five brands. Zero runaround.
                                    </span>
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    Tell us once — vision, budget, timeline — we connect you to the right specialist. <strong className="text-brand-primary dark:text-white">Clarity before commitment.</strong>
                                </p>
                            </div>
                            <Link
                                href="/chat"
                                className="shrink-0 inline-flex items-center gap-2 rounded-full border-2 border-brand-primary bg-transparent px-4 py-2.5 text-xs font-semibold text-brand-primary transition-all duration-300 hover:bg-brand-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:border-[#C7A14A] dark:text-[#C7A14A] dark:hover:bg-[#C7A14A] dark:hover:text-white"
                            >
                                Start conversation
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {/* Who Is This For – bento grid: left col 2 stacked, right 2x2 */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                            {[
                                { title: 'Building a home or villa', desc: 'Design to turnkey — one place to plan and execute.', icon: <Building2 className="h-4 w-4" />, large: true },
                                { title: 'Designing or renovating interiors', desc: 'Bespoke interiors aligned with your taste and budget.', icon: <PaintBucket className="h-4 w-4" />, large: true },
                                { title: 'Buying or selling property', desc: 'Expert guidance and curated opportunities.', icon: <Home className="h-4 w-4" />, large: false },
                                { title: 'Developing land or projects', desc: 'Residential & commercial with clear roadmaps.', icon: <Hammer className="h-4 w-4" />, large: false },
                                { title: 'Planning an event', desc: 'Corporate, weddings, brand experiences — end to end.', icon: <Sparkles className="h-4 w-4" />, large: false },
                                { title: 'Not sure where to start', desc: 'AI consultant clarifies goals and suggests the right path.', icon: <MessageSquare className="h-4 w-4" />, large: false },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-20px' }}
                                    transition={{ duration: 0.35, delay: i * 0.05 }}
                                    className={`group flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3.5 transition-all duration-300 hover:border-[#C7A14A]/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-[#C7A14A]/40 sm:p-4 ${item.large ? 'sm:col-span-1' : ''}`}
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-[#C7A14A] group-hover:text-white dark:bg-[#C7A14A]/10 dark:text-[#C7A14A] dark:group-hover:bg-[#C7A14A] dark:group-hover:text-white">
                                        {item.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-display text-sm font-bold text-brand-primary dark:text-white sm:text-base">
                                            {item.title}
                                        </h3>
                                        <p className="mt-0.5 text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section
                    ref={expertiseRef}
                    id="expertise"
                    className="relative overflow-hidden py-16 md:py-24"
                >
                    {/* Background Collage Image Overlay */}
                    <div className="absolute inset-0 -z-20">
                        <img
                            src="/image/collage poster.png"
                            alt=""
                            className="h-full w-full object-cover opacity-10 dark:opacity-5 grayscale-[0.3]"
                        />
                        <div className="absolute inset-0 bg-white/90 dark:bg-brand-dark/90" />
                    </div>

                    <div className="absolute top-0 right-0 -z-10 h-[320px] w-[320px] rounded-full bg-brand-primary/5 blur-[80px]" />
                    <div className="absolute bottom-1/4 left-0 -z-10 h-[240px] w-[240px] rounded-full bg-[#C7A14A]/5 blur-[60px]" />

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-12 text-center md:mb-16">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-[#C7A14A]" />
                                <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                    Our Expertise
                                </span>
                            </div>
                            <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-primary sm:text-4xl md:text-5xl dark:text-white">
                                Five brands.{' '}
                                <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-zinc-400">
                                    One platform.
                                </span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
                                Construction, interiors, real estate, development, and events — start a consultation from any card.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {services.map((service, i) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-24px' }}
                                    transition={{ duration: 0.35, delay: i * 0.06 }}
                                    onClick={() => {
                                        setSelectedService(service.id);
                                        setIsModalOpen(true);
                                    }}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-[#C7A14A]/50 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#C7A14A]/50"
                                >
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-[#C7A14A]/20 group-hover:text-[#C7A14A] dark:bg-white/10 dark:text-[#C7A14A] dark:group-hover:bg-[#C7A14A]/20">
                                            {service.icon}
                                        </div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <img src={service.logo} alt="" className="h-6 w-auto object-contain opacity-80" />
                                            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500">
                                                {service.step}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-lg font-bold leading-tight text-brand-primary dark:text-white">
                                            {service.title}
                                        </h3>
                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 line-clamp-3 dark:text-zinc-400">
                                            {service.desc}
                                        </p>
                                        <a
                                            href={service.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-[#C7A14A] dark:text-[#C7A14A] dark:hover:text-white"
                                        >
                                            <span>Explore Now</span>
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-center gap-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-6 py-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50 md:flex-row md:gap-8 md:py-10">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <CheckCircle2 className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    Free consultation
                                </span>
                                <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <Zap className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    Expert matching
                                </span>
                                <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <Target className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    Quick response
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedService('');
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#C7A14A] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Start consultation
                                </button>
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-all hover:border-brand-primary/50 hover:bg-brand-primary/5 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:border-[#C7A14A]/50 dark:hover:bg-[#C7A14A]/10"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Open chat
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Auto Sliding Images Section */}
                <section className="relative overflow-hidden bg-black py-12 dark:bg-zinc-950">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 -z-10">
                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(199, 161, 74, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(199, 161, 74, 0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px',
                            }}
                        />
                        {/* Gradient Orbs */}
                        <div className="pointer-events-none absolute top-1/4 left-0 h-96 w-96 rounded-full bg-brand-primary/10 blur-[150px]" />
                        <div className="pointer-events-none absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-brand-accent/10 blur-[150px]" />
                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-primary/5 blur-[120px]" />
                    </div>

                    <div className="relative z-10 mx-auto mb-8 max-w-7xl px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-brand-primary" />
                                <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">
                                    Visual Gallery
                                </span>
                            </div>
                            <h2 className="mb-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
                                Our Services
                                <br />
                                <span className="bg-gradient-to-r from-white to-brand-accent bg-clip-text text-transparent">
                                    in Motion
                                </span>
                            </h2>
                            <p className="max-w-xl text-sm leading-relaxed text-zinc-300">
                                Explore the comprehensive range of services we
                                offer through our platform.
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        {/* Enhanced Gradient Masks */}
                        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-30 w-32 bg-gradient-to-r from-black via-black/50 to-transparent md:w-48 dark:from-zinc-950" />
                        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-30 w-32 bg-gradient-to-l from-black via-black/50 to-transparent md:w-48 dark:from-zinc-950" />

                        <style>{`
                            @keyframes slide-left {
                                0% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-100%);
                                }
                            }

                            .slide-container {
                                animation: slide-left 150s linear infinite;
                            }

                            .slide-container:hover {
                                animation-play-state: paused;
                            }
                        `}</style>

                        {/* Slide Wrapper */}
                        <div className="mx-auto max-w-7xl overflow-hidden px-6 lg:px-8">
                            <div className="slide-container flex gap-12">
                                {[
                                    '/image/storyset/2.1.svg',
                                    '/image/storyset/2.2 .svg',
                                    '/image/storyset/2.3.svg',
                                    '/image/storyset/2.4.svg',
                                    '/image/storyset/3.0 .svg',
                                    '/image/storyset/3.1.svg',
                                    '/image/storyset/3.2.svg',
                                    '/image/storyset/3.3.svg',
                                    '/image/storyset/3.4.svg',
                                    '/image/storyset/3.5.svg',
                                    '/image/storyset/3.6.svg',
                                    '/image/storyset/3.7.svg',
                                    '/image/storyset/4.0 .svg',
                                    '/image/storyset/4.1.svg',
                                    '/image/storyset/4.2.svg',
                                    '/image/storyset/4.3.svg',
                                    '/image/storyset/5.0 .svg',
                                    '/image/storyset/5.1 .svg',
                                    '/image/storyset/5.2.svg',
                                    '/image/storyset/5.3.svg',
                                    '/image/storyset/6.0.svg',
                                    '/image/storyset/6.1.svg',
                                    '/image/storyset/6.2.svg',
                                    '/image/storyset/7.1.svg',
                                    '/image/storyset/7.2.svg',
                                    '/image/storyset/7.3.svg',
                                    '/image/storyset/7.4.svg',
                                    '/image/storyset/7.5.svg',
                                    '/image/storyset/8.1.svg',
                                    '/image/storyset/8.2.svg',
                                    '/image/storyset/8.3.svg',
                                    '/image/storyset/9.1.svg',
                                    '/image/storyset/9.2.svg',
                                    '/image/storyset/9.3.svg',
                                    '/image/storyset/9.4.svg',
                                ].map((src, idx) => (
                                    <div
                                        key={idx}
                                        className="h-48 w-56 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-black transition-all duration-300 hover:border-brand-primary/50 sm:h-52 sm:w-60 md:h-56 md:w-64"
                                    >
                                        <img
                                            src={src}
                                            alt={`Gallery item ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.background =
                                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
                                                e.currentTarget.src = '';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works (Strategic Process) */}
                <section
                    ref={processRef}
                    id="process"
                    className="relative overflow-hidden bg-white py-16 dark:bg-black"
                >
                    {/* Strategic Grid Background Pattern */}
                    <motion.div
                        style={{ y: processBgY }}
                        className="absolute inset-0 -z-10 bg-white dark:bg-black"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.3] dark:opacity-[0.25]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(199, 161, 74, 0.2) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(199, 161, 74, 0.2) 1px, transparent 1px),
                                    radial-gradient(circle at center, rgba(199, 161, 74, 0.4) 1.5px, transparent 1.5px)
                                `,
                                backgroundSize:
                                    '20px 20px, 20px 20px, 20px 20px',
                                backgroundPosition: '0 0, 0 0, 0 0',
                            }}
                        />
                        {/* Gradient Masks for Depth */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
                    </motion.div>

                    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/10 bg-brand-primary/5 px-3 py-1 text-[10px] font-bold tracking-widest text-[#C7A14A] uppercase dark:border-white/10 dark:bg-white/5">
                                <Sparkles className="h-3 w-3" />
                                <span>The Area24 Process</span>
                            </div>
                            <h3 className="mb-4 font-display text-3xl leading-tight font-extrabold tracking-tight text-brand-primary sm:text-4xl dark:text-white">
                                Simple. Seamless.{' '}
                                <span className="bg-gradient-to-r from-[#C7A14A] to-zinc-500 bg-clip-text text-transparent">
                                    Strategic.
                                </span>
                            </h3>
                            <p className="mx-auto max-w-xl text-base leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
                                Most people waste weeks talking to vendors. We
                                start with clarity — then route you correctly.
                            </p>
                        </div>

                        <div className="relative mx-auto max-w-5xl">
                            {/* Central Path (Desktop Only) */}
                            <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C7A14A]/30 to-transparent lg:block" />

                            <div className="space-y-16">
                                {[
                                    {
                                        num: '01',
                                        title: 'The Discovery Session',
                                        desc: 'Engage with our strategic AI consultant. In one structured conversation, we map your entire project horizon—budget, timeline, and architectural requirements.',
                                        icon: (
                                            <MessageSquare className="h-6 w-6" />
                                        ),
                                        align: 'left',
                                        badge: 'Intelligence',
                                    },
                                    {
                                        num: '02',
                                        title: 'Strategic Blueprinting',
                                        desc: 'Our platform validates your vision against market data and technical feasibility, generating a clear starting point for the specialized brands.',
                                        icon: (
                                            <ShieldCheck className="h-6 w-6" />
                                        ),
                                        align: 'right',
                                        badge: 'Accuracy',
                                    },
                                    {
                                        num: '03',
                                        title: 'Seamless Integration',
                                        desc: "Finally, we connect you to the precise expert team Best for your project—whether it's construction, interiors, or events—ensuring zero data loss.",
                                        icon: <Zap className="h-6 w-6" />,
                                        align: 'left',
                                        badge: 'Execution',
                                    },
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: step.align === 'right' ? 50 : -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-100px' }}
                                        transition={{ duration: 0.6, delay: i * 0.2 }}
                                        className={`relative flex items-center gap-8 ${step.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                                    >
                                        {/* Step Content Card */}
                                        <div className="w-full lg:w-[45%]">
                                            <div className="group relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-[#C7A14A]/50 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                                                <div className="absolute -top-5 left-8 z-20 flex h-10 items-center justify-center rounded-xl bg-[#C7A14A] px-4 font-display text-xs font-bold tracking-widest text-white uppercase shadow-lg">
                                                    Step {step.num}
                                                </div>

                                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 text-[#C7A14A] transition-all duration-300 group-hover:bg-[#C7A14A] group-hover:text-white dark:border-white/10 dark:bg-zinc-800/50">
                                                    {step.icon}
                                                </div>

                                                <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#C7A14A] uppercase opacity-60">
                                                    Phase: {step.badge}
                                                </div>

                                                <h4 className="mb-3 font-display text-lg leading-tight font-bold text-brand-primary dark:text-white">
                                                    {step.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Desktop-only Connection Element */}
                                        <div className="relative hidden w-[10%] justify-center lg:flex">
                                            <div className="z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#C7A14A]/10 bg-white shadow-lg transition-transform group-hover:scale-110 dark:bg-black">
                                                <div className="h-2 w-2 animate-pulse rounded-full bg-[#C7A14A]" />
                                            </div>
                                        </div>

                                        <div className="hidden w-[45%] lg:block" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Process CTA */}
                            <div className="relative z-20 mt-16 text-center">
                                <div className="absolute top-1/2 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7A14A]/20 blur-[100px]" />
                                <button
                                    onClick={() => {
                                        setSelectedService('');
                                        setIsModalOpen(true);
                                    }}
                                    className="group relative inline-flex items-center gap-3 rounded-full bg-brand-primary px-10 py-4 font-display text-base font-bold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-lg active:scale-95 dark:bg-[#C7A14A]"
                                >
                                    <span>Start Consultation</span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </button>
                                <p className="mt-4 text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                                    Experience integrated consultation
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Materials & brands we use — Marquee (after Process, enhanced) */}
                <section
                    id="materials-brands"
                    className="relative overflow-hidden border-y border-zinc-200 bg-white py-20 dark:border-zinc-700 dark:bg-white"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,161,74,0.06),_transparent_60%)]" />
                    <div className="absolute inset-0 -z-10 bg-[length:24px_24px] bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)]" />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5 }}
                            className="mb-12 text-center"
                        >
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-2">
                                <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
                                <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase">
                                    Materials & brands we use
                                </span>
                            </div>
                            <h3 className="font-display text-2xl font-bold tracking-tight text-brand-accent sm:text-3xl lg:text-4xl">
                                Trusted partners across our construction packages
                            </h3>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                                Quality materials from recognised brands — see package details for full specifications.
                            </p>
                            <p className="mt-2 text-xs font-medium text-zinc-400">
                                Scroll to explore · Pause on hover
                            </p>
                        </motion.div>
                        <div className="relative">
                            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-white" />
                            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-white" />
                            <Marquee
                                className="[--duration:70s] [--gap:2.5rem] py-2"
                                pauseOnHover
                            >
                                {MARQUEE_BRANDS.map((brand, i) => (
                                    <MarqueeBrandCard key={i} brand={brand} />
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </section>

                {/* Why Platform (Differentiator) */}
                <section
                    ref={whyUsRef}
                    id="why-us"
                    className="relative overflow-hidden bg-zinc-50 py-32 dark:bg-zinc-950/50"
                >
                    <div className="absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-20">
                        <motion.div
                            style={{ y: whyUsBgY1 }}
                            className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-primary/10 blur-[120px]"
                        />
                        <motion.div
                            style={{ y: whyUsBgY2 }}
                            className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-brand-accent/10 blur-[120px]"
                        />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid items-start gap-16 lg:grid-cols-12">
                            {/* Content Side */}
                            <div className="lg:col-span-7">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span>The Strategic Advantage</span>
                                </div>
                                <h3 className="mb-8 font-display text-4xl leading-tight font-extrabold tracking-tight text-brand-primary sm:text-5xl dark:text-white">
                                    Why Leading Decision Makers
                                    <br />
                                    <span className="bg-gradient-to-r from-[#C7A14A] to-zinc-500 bg-clip-text text-transparent">
                                        Choose This Platform.
                                    </span>
                                </h3>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {[
                                        {
                                            title: 'Unified Intelligence',
                                            desc: 'A single intelligent conversation replaces dozens of repetitive vendor meetings.',
                                            icon: (
                                                <MessageSquare className="h-5 w-5" />
                                            ),
                                        },
                                        {
                                            title: 'Expert Validation',
                                            desc: 'Pre-screen every decision with data-driven architectural and market insights.',
                                            icon: (
                                                <Target className="h-5 w-5" />
                                            ),
                                        },
                                        {
                                            title: 'Integrated Ecosystem',
                                            desc: 'Frictionless handovers between construction, interiors, and development teams.',
                                            icon: <Zap className="h-5 w-5" />,
                                        },
                                        {
                                            title: 'Accelerated Cycles',
                                            desc: 'Proprietary consultation logic that drives 5x faster decision-to-execution cycles.',
                                            icon: (
                                                <TrendingUp className="h-5 w-5" />
                                            ),
                                        },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-50px' }}
                                            transition={{ duration: 0.5, delay: i * 0.15 }}
                                            className="group rounded-[2rem] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:border-[#C7A14A]/50 dark:border-zinc-800 dark:bg-zinc-900"
                                        >
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-brand-primary transition-all duration-300 group-hover:bg-[#C7A14A] group-hover:text-white dark:bg-zinc-800 dark:text-[#C7A14A]">
                                                {item.icon}
                                            </div>
                                            <h4 className="mb-2 font-display text-lg font-bold text-brand-primary dark:text-white">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
                                                {item.desc}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats/Visual Side */}
                            <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                                <div className="space-y-4 pt-12">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[2.5rem] bg-brand-primary p-8 shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform duration-500 group-hover:scale-110">
                                            <CheckCircle2 className="h-24 w-24 text-white" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="mb-1 font-display text-5xl font-bold text-white">
                                                98%
                                            </div>
                                            <div className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                                                Consultation Accuracy
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="group flex aspect-square items-center justify-center rounded-[2.5rem] bg-zinc-100 p-8 transition-colors duration-500 hover:bg-[#C7A14A] dark:bg-zinc-800"
                                    >
                                        <Star className="h-16 w-16 text-zinc-300 transition-all duration-500 group-hover:text-white dark:text-zinc-700" />
                                    </motion.div>
                                </div>
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="flex aspect-video items-center justify-center rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <Sparkles className="h-10 w-10 animate-pulse text-[#C7A14A]" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[2.5rem] bg-[#C7A14A] p-8 shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform duration-500 group-hover:scale-110">
                                            <Zap className="h-24 w-24 text-white" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="mb-1 font-display text-5xl font-bold text-white">
                                                5x
                                            </div>
                                            <div className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                                                Decision Efficiency
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section
                    id="faq"
                    className="relative overflow-hidden border-t border-zinc-100 bg-white py-24 dark:border-zinc-800 dark:bg-brand-dark/30"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_rgba(199,161,74,0.04),_transparent_50%)]" />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-14 max-w-3xl">
                            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-4 py-2 backdrop-blur-sm">
                                <MessageSquare className="h-4 w-4 text-brand-primary dark:text-[#C7A14A]" />
                                <span className="text-xs font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                    FAQ
                                </span>
                            </div>
                            <h2 className="mb-4 font-display text-3xl leading-tight font-extrabold tracking-tight text-brand-primary sm:text-4xl lg:text-5xl dark:text-white">
                                Frequently asked
                                <br />
                                <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-zinc-500">
                                    questions
                                </span>
                            </h2>
                            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Quick answers about our platform, consultation, and services.
                            </p>
                        </div>

                        <div className="mx-auto max-w-3xl space-y-3">
                            {[
                                {
                                    q: 'What is Area 24 One?',
                                    a: 'Area 24 One is a single platform that connects you with five expert brands: Atha Construction, Nesthetix Design (interiors), Area24 Realty, Area24 Developers, and The Stage 365 (events). One conversation helps us understand your needs and route you to the right specialist.',
                                },
                                {
                                    q: 'How does the consultation work?',
                                    a: 'You start by chatting with our AI consultant — share your project, budget, and timeline. We clarify your requirements and then connect you with the right team (construction, interiors, real estate, development, or events) so you get tailored guidance without repeating yourself.',
                                },
                                {
                                    q: 'Is the consultation free?',
                                    a: 'Yes. The initial consultation and guidance through our platform are free. There’s no obligation — we help you get clarity before you commit to any paid service.',
                                },
                                {
                                    q: 'Which cities do you serve?',
                                    a: 'We operate across Karnataka, with a strong presence in Bangalore, Mysore, and Ballari. Costs and processes may vary slightly by city; our consultant will factor your location into the guidance.',
                                },
                                {
                                    q: 'Can I get a quote for construction or interiors?',
                                    a: 'Yes. Once we understand your project (type, area, budget band), we connect you with Atha Construction or Nesthetix Design. They provide detailed quotes and package options (e.g. construction per sqft, interior scope) based on your inputs.',
                                },
                                {
                                    q: 'How do I get started?',
                                    a: 'Click “Start Consultation” and open the chat. Tell us what you’re planning — building a home, designing interiors, buying property, developing land, or planning an event. Our AI will ask a few focused questions and then guide you to the right expert or next step.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-20px' }}
                                    transition={{ duration: 0.3, delay: i * 0.04 }}
                                    className="rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/80"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset dark:hover:bg-zinc-800/50 dark:focus-visible:ring-[#C7A14A]"
                                    >
                                        <span className="font-display text-base font-bold text-brand-primary dark:text-white">
                                            {item.q}
                                        </span>
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-brand-primary transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-[#C7A14A] ${openFaq === i ? 'rotate-180 border-[#C7A14A]/50 bg-[#C7A14A]/10 dark:bg-[#C7A14A]/20' : ''}`}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="border-t border-zinc-100 px-6 pb-5 pt-2 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700/50 dark:text-zinc-400">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                                Still have questions?
                            </p>
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-[#C7A14A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:text-[#C7A14A] dark:hover:text-white"
                            >
                                Start a conversation
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Value & outcomes CTA – meaning and profit driven */}
                <section className="mx-6 mb-12 lg:mb-16">
                    <div className="relative mx-auto max-w-7xl">
                        <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-brand-primary/10 blur-[100px] dark:bg-brand-primary/5" />
                        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#C7A14A]/10 blur-[100px]" />

                        <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white px-6 py-10 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/80 md:px-10 md:py-12">
                            <div className="relative z-10 mx-auto max-w-4xl">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                    <Target className="h-3 w-3" />
                                    <span>One platform. Five experts. Better outcomes.</span>
                                </div>

                                <h2 className="mb-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-primary sm:text-4xl dark:text-white">
                                    Clarity before commitment.
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-zinc-400">
                                        The right expert, the right decision.
                                    </span>
                                </h2>

                                <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                                    One conversation connects you to construction, interiors, real estate, development, or events. Compare options, get expert guidance, and move forward with confidence—without chasing multiple vendors or repeating your story.
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                                    {[
                                        { icon: <TrendingUp className="h-4 w-4" />, text: 'Informed decisions' },
                                        { icon: <Zap className="h-4 w-4" />, text: 'Time & cost saved' },
                                        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Trusted partners' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                            <span className="text-brand-primary dark:text-[#C7A14A]">{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    <Link
                                        href="/chat"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 font-display text-sm font-bold text-white shadow-md transition-all hover:bg-brand-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-[#C7A14A] dark:text-black dark:hover:bg-[#C7A14A]/90"
                                    >
                                        Get clarity now
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-brand-primary/30 bg-transparent px-6 text-sm font-semibold text-brand-primary transition-all hover:border-brand-primary hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:border-[#C7A14A]/40 dark:text-[#C7A14A] dark:hover:bg-[#C7A14A]/10"
                                    >
                                        Talk to an expert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-zinc-100 bg-white py-12 dark:border-zinc-900 dark:bg-brand-dark">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary p-1 transition-transform duration-500 hover:rotate-6 dark:bg-white">
                                    <img
                                        src="/image/area 24 one.png"
                                        alt="Logo"
                                        className="h-full w-full object-contain invert dark:invert-0"
                                    />
                                </div>
                                <span className="font-display text-sm font-extrabold tracking-tighter uppercase">
                                    Area 24{' '}
                                    <span className="text-zinc-500">one</span>
                                </span>
                            </div>
                            <p className="text-xs font-medium text-zinc-500">
                                © 2025 Area24One. All rights reserved. Designed
                                for Premium Consultation.
                            </p>
                            <div className="flex items-center gap-6">
                                <a
                                    href="#"
                                    className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-black dark:hover:text-white"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-black dark:hover:text-white"
                                >
                                    Terms
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialService={selectedService}
            />
        </>
    );
}
