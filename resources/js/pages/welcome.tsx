import { ConsultationModal } from '@/components/ConsultationModal';
import { ContactWidget } from '@/components/ContactWidget';
import { StoriesSection } from '@/components/StoriesSection';
import { HeroCarousel, HeroSlide } from '@/components/HeroCarousel';
import { Marquee } from '@/components/MagicMarquee';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calculator,
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
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
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



const staticHeroSlides = [
    {
        tag: 'The Future of Consultation',
        title: 'One Platform. Five Expert Brands.',
        highlight: 'One Smart Consultant.',
        description:
            'Plan, validate, and execute your property decisions — construction, interiors, real estate, development, and events — through one intelligent platform.',
        image: '/image/area 24 one.png',
        hero: '/image/hero/area 24 one.png',
        color: 'brand-primary',
        cta: (
            <Link
                href="/cost-estimator"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90"
            >
                <Calculator className="h-4 w-4" />
                Estimate Cost
            </Link>
        ),
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
            className="group flex h-28 w-32 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-gray-50 p-5 shadow-sm transition-all duration-300 hover:border-[#C7A14A]/50 hover:shadow-lg hover:shadow-[#C7A14A]/10 dark:border-slate-600 dark:bg-slate-100 dark:hover:border-[#C7A14A]/50"
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
                <span className="text-2xl font-bold text-slate-300 dark:text-slate-400">
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

interface ServiceCardProps {
    service: {
        id: string;
        icon: React.ReactNode;
        logo: string;
        images: string[];
        title: string;
        desc: string;
        accent: string;
        step: string;
        url: string;
    };
    index: number;
    onClick: () => void;
}

const ServiceCard = ({ service, index, onClick }: ServiceCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-24px' }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            onClick={onClick}
            className="group flex cursor-pointer flex-col overflow-hidden border border-slate-100 bg-[#FAFAF9] shadow-sm transition-all duration-300 hover:border-[#C7A14A]/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#C7A14A]/50">
            <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={service.images[currentImageIndex]}
                        alt={service.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </AnimatePresence>
                
                <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                        onClick={prevImage}
                        className="rounded-full bg-black/50 p-1 text-white hover:bg-[#C7A14A] backdrop-blur-sm transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="rounded-full bg-black/50 p-1 text-white hover:bg-[#C7A14A] backdrop-blur-sm transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                 <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    {service.images.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-[#C7A14A]' : 'bg-white/50'}`}
                        />
                    ))}
                 </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-display text-lg font-bold leading-tight text-brand-primary dark:text-white">
                    {service.title}
                </h3>
                
                <p className="flex-1 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                    {service.desc}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-wider transition-colors group-hover:text-[#C7A14A] dark:text-[#C7A14A] dark:group-hover:text-white">
                    <span>Explore Now</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </motion.div>
    );
};

export default function Welcome({
    canLogin = true,
    canRegister = true,
    heroSlides = [],
}: {
    canLogin?: boolean;
    canRegister?: boolean;
    heroSlides?: HeroSlide[];
}) {
    const { auth } = usePage<{ auth: any }>().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [discovery, setDiscovery] = useState<DiscoveryOptions>({
        service: '',
        timeline: '',
        budget: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string>('');
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
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setScrolled(currentScrollY > 20);

            // Mobile Smart Header Logic
            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // Scrolling Down
                setIsHeaderVisible(false);
            } else {
                // Scrolling Up
                setIsHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // CTA Auto-Popup Logic
    useEffect(() => {
        // Show on mount
        setIsModalOpen(true);

        // Show every 3 minutes
        const interval = setInterval(() => {
            setIsModalOpen(true);
        }, 180000); // 3 minutes

        return () => clearInterval(interval);
    }, []);

    const services = [
        {
            id: 'construction',
            icon: <Building2 className="h-6 w-6" />,
            logo: '/image/atha.png',
            images: ['/image/hero/construction.jpg', '/image/atha.png'],
            title: 'Atha Construction',
            desc: 'Specializing in high-end residential and commercial projects, we offer a seamless journey from architectural blueprints to turnkey construction solutions.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '01',
            url: 'https://athaconstruction.in/',
        },
        {
            id: 'interiors',
            icon: <PaintBucket className="h-6 w-6" />,
            logo: '/image/nesthetix.png',
            images: ['/image/hero/interior.jpg', '/image/nesthetix.png'],
            title: 'Nesthetix Design',
            desc: 'Our award-winning designers craft bespoke interiors that blend opulence with functionality. We tailor every detail to your lifestyle.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '02',
            url: 'https://nesthetixdesigns.com/',
        },
        {
            id: 'real-estate',
            icon: <Home className="h-6 w-6" />,
            logo: '/image/area 24 realty.png',
            images: ['/image/hero/realty.jpg', '/image/area 24 realty.png'],
            title: 'Area24 Realty',
            desc: 'Access exclusive listings and data-driven market insights. Our consultants provide strategic advice for discerning buyers, sellers, and investors.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '03',
            url: 'https://area24developers.com/',
        },
        {
            id: 'development',
            icon: <Hammer className="h-6 w-6" />,
            logo: '/image/hero/Area24 developers  logo mockup.png',
            images: ['/image/hero/developer.jpg', '/image/hero/Area24 developers  logo mockup.png'],
            title: 'Area24 Developers',
            desc: 'We conceptualize and execute landmark residential and commercial developments. Our focus is on creating sustainable communities.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '04',
            url: 'https://area24developers.com/',
        },
        {
            id: 'events',
            icon: <Sparkles className="h-6 w-6" />,
            logo: '/image/stage 365.png',
            images: ['/image/hero/event.jpg', '/image/STAGE 365.png'],
            title: 'The Stage 365',
            desc: 'From corporate galas to immersive brand activations, we produce extraordinary events. Our team handles everything from conceptual design to execution.',
            accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
            step: '05',
            url: 'https://thestage365.com/',
        },
    ];

    return (
        <>
            <Head title="Area 24 One | Intelligent Consultation" />
            <div className="font-inter scroll-smooth min-h-screen bg-brand-surface text-brand-text selection:bg-brand-primary selection:text-white dark:bg-brand-dark dark:text-slate-50">
                {/* Navbar */}
                <nav
                    className={`fixed top-0 w-full z-50 border-b border-slate-200 bg-black/80 py-3 shadow-sm backdrop-blur-md transition-transform duration-300 dark:border-slate-800 dark:bg-brand-dark/95
                        ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}
                        md:translate-y-0 md:fixed md:inset-x-0 md:border-transparent md:shadow-none md:backdrop-blur-none md:transition-all md:duration-500
                        ${
                            scrolled
                                ? 'md:border-slate-200 md:bg-white/90 md:py-4 md:shadow-sm md:backdrop-blur-md md:dark:border-slate-800 md:dark:bg-brand-dark/90'
                                : 'md:bg-black/20 md:py-6 md:backdrop-blur-md md:dark:bg-black/40'
                        }`}>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-3">
                            <Link
                                href="/"
                                className="group flex cursor-pointer items-center gap-3 md:gap-4"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary p-1 shadow-lg shadow-brand-primary/10 transition-transform duration-500 group-hover:scale-105 md:h-16 md:w-16 md:rounded-2xl dark:bg-white">
                                    <img
                                        src="/image/area 24 one.png"
                                        alt="Logo"
                                        className="h-full w-full object-contain invert dark:invert-0"
                                    />
                                </div>
                                <span className={`font-display text-xl font-extrabold tracking-tighter uppercase md:text-2xl dark:text-white ${scrolled ? 'text-brand-primary' : 'text-white'}`}>
                                    Area 24{' '}
                                    <span className={`font-medium ${scrolled ? 'text-brand-muted' : 'text-white'}`}>
                                        one
                                    </span>
                                </span>
                            </Link>

                            <div className="hidden items-center gap-8 md:flex">
                                <Link
                                    href="/cost-estimator"
                                    className={`flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand-primary dark:text-slate-400 dark:hover:text-white ${scrolled ? 'text-brand-text/80' : 'text-white'}`}
                                >
                                    <Calculator className="h-4 w-4" />
                                    Estimate Cost
                                </Link>
                                {['What We Do', 'Expertise', 'Process', 'Why Us', 'FAQ'].map(
                                    (item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={`text-sm font-medium transition-all duration-300 hover:scale-105 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:text-white ${scrolled ? 'text-brand-muted' : 'text-white'}`}
                                        >
                                            {item}
                                        </a>
                                    ),
                                )}
                                <div className={`h-4 w-px ${scrolled ? 'bg-slate-200 dark:bg-slate-800' : 'bg-white/50'}`} />
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className={`text-sm font-semibold transition-opacity hover:opacity-70 ${scrolled ? 'text-brand-text' : 'text-white'}`}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-6">
                                        <Link
                                            href="/login"
                                            className={`text-sm font-medium transition-colors hover:text-brand-primary dark:text-slate-400 dark:hover:text-white ${scrolled ? 'text-brand-muted' : 'text-white'}`}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-7 font-display text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C7A14A] hover:shadow-lg hover:shadow-[#C7A14A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-white dark:text-brand-primary dark:hover:bg-[#C7A14A] dark:hover:text-white dark:focus-visible:ring-white"
                                        >
                                            Start Consultation
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 md:hidden">
                                <Link
                                    href="/chat"
                                    className="inline-flex h-9 items-center justify-center rounded-full bg-brand-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-[#C7A14A] dark:bg-white dark:text-brand-primary dark:hover:bg-[#C7A14A] dark:hover:text-white"
                                >
                                    Start
                                </Link>
                                <button
                                    aria-label="Toggle menu"
                                    className="rounded-lg p-2 text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="absolute inset-x-0 top-0 rounded-b-2xl bg-brand-surface p-6 pt-20 shadow-lg dark:bg-brand-dark">
                            <div className="flex flex-col gap-4">
                                <a
                                    href="#what-we-do"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                >
                                    What We Do
                                </a>
                                <a
                                    href="#expertise"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                >
                                    Expertise
                                </a>
                                <a
                                    href="#process"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                >
                                    Process
                                </a>
                                <a
                                    href="#why-us"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                >
                                    Why Us
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-primary transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900"
                                >
                                    FAQ
                                </a>
                                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-full bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-brand-primary transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            href="/login"
                                            className="flex-1 rounded-full bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-brand-primary transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="flex-1 rounded-full bg-brand-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#C7A14A] dark:bg-white dark:text-brand-primary dark:hover:bg-[#C7A14A] dark:hover:text-white"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Start Consultation
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* New Hero Carousel */}
                <HeroCarousel slides={heroSlides} />



                {/* Trust/Authority Strip */}
                <section className="relative overflow-hidden bg-brand-primary py-10 dark:bg-brand-primary">
                    {/* Textured Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                                backgroundSize: '24px 24px',
                            }}
                        />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-primary to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-primary to-transparent" />

                    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
                        <Marquee
                            className="[--duration:40s] [--gap:4rem]"
                            pauseOnHover
                        >
                            {[
                                {
                                    icon: <ShieldCheck className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Decade-Backed Domain Expertise',
                                    },
                                    {
                                    icon: <MessageSquare className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Consultation Before Commitment',
                                    },
                                    {
                                    icon: <CheckCircle2 className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Verified Specialists, Not Middlemen',
                                    },
                                    {
                                    icon: <Users className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Right Expert, First Time',
                                    },
                                    {
                                    icon: <Zap className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Reduced Decision & Planning Time',
                                    },
                                    {
                                    icon: <Star className="h-6 w-6 stroke-[1.5]" />,
                                    text: 'Premium Execution Partners',
                                },

                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group mx-4 flex cursor-default items-center gap-3 text-white/90"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-brand-primary">
                                        {item.icon}
                                    </div>
                                    <span className="font-display text-sm font-bold tracking-wide uppercase text-white transition-colors duration-300">
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
                    className="relative overflow-hidden border-y border-slate-100 bg-white py-14 dark:border-slate-800 dark:bg-brand-dark/50 md:py-16">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(199,161,74,0.04),_transparent_50%)]" />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            {/* Left Column: Context + Grid */}
                            <div className="flex flex-col justify-center w-full lg:flex-1">
                                <div className="mb-8 flex flex-col gap-6">
                                    <div className="max-w-2xl">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5">
                                            <Heart className="h-3.5 w-3.5 text-brand-primary dark:text-[#C7A14A]" />
                                            <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                                What we're building for you
                                            </span>
                                        </div>
                                        <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-primary sm:text-3xl dark:text-white">
                                            One conversation.{' '}
                                            <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-slate-500">
                                                Five brands. Zero runaround.
                                            </span>
                                        </h2>
                                        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                            Tell us once — vision, budget, timeline — we connect you to the right specialist. <strong className="text-brand-primary dark:text-white">Clarity before commitment.</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Who Is This For – bento grid: left col 2 stacked, right 2x2 */}
                                <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {[
                                        { title: 'Building a home or villa', image: '/image/icons/build home or villa.png' },
                                        { title: 'Designing or renovating interiors', image: '/image/icons/design interiors.png' },
                                        { title: 'Buying or selling property', image: '/image/icons/property.png' },
                                        { title: 'Developing land or projects', image: '/image/icons/developing land.png' },
                                        { title: 'Planning an event', image: '/image/icons/planning event.png' },
                                        { title: 'Not sure where to start', image: '/image/icons/not sure what to do.png' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 12 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-20px' }}
                                            transition={{ duration: 0.35, delay: i * 0.05 }}
                                            className={`group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-[#C7A14A]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-[#C7A14A]/40`}
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" 
                                                />
                                            </div>
                                            <h3 className="font-display text-sm font-bold text-brand-primary dark:text-white">
                                                {item.title}
                                            </h3>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Link
                                        href="/chat"
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-brand-primary bg-transparent px-6 py-3 text-sm font-semibold text-brand-primary transition-all duration-300 hover:bg-brand-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:border-[#C7A14A] dark:text-[#C7A14A] dark:hover:bg-[#C7A14A] dark:hover:text-white"
                                    >
                                        Start conversation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Video */}
                            <div className="flex justify-center w-full lg:w-auto lg:justify-end">
                                <div className="relative h-auto w-72 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-900/10 transform rotate-0 transition-all hover:scale-105 duration-500">
                                    <video
                                        src="/video/section%20video.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="h-auto w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section
                    ref={expertiseRef}
                    id="expertise"
                    className="relative overflow-hidden py-12 md:py-16 bg-zinc-50 dark:bg-black/20"
                >
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
                                <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-slate-400">
                                    One platform.
                                </span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400">
                                Construction, interiors, real estate, development, and events — start a consultation from any card.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* First Row: 3 Cards */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {services.slice(0, 3).map((service, i) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        index={i}
                                        onClick={() => {
                                            setSelectedService(service.id);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Second Row: 2 Cards (Centered) */}
                            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
                                {services.slice(3, 5).map((service, i) => (
                                    <div key={service.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                        <ServiceCard
                                            service={service}
                                            index={i + 3}
                                            onClick={() => {
                                                setSelectedService(service.id);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900/50 md:flex-row md:gap-8 md:py-10">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    Free consultation
                                </span>
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <Zap className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    Expert matching
                                </span>
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
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
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#C7A14A] dark:bg-white dark:text-brand-primary dark:hover:bg-slate-200"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Start consultation
                                </button>
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-all hover:border-brand-primary/50 hover:bg-brand-primary/5 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-[#C7A14A]/50 dark:hover:bg-[#C7A14A]/10"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Open chat
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <StoriesSection />

                {/* Auto Sliding Images Section */}
                <section className="relative overflow-hidden bg-zinc-50 py-12 dark:bg-black/20">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 -z-10">
                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(#C7A14A 1px, transparent 1px),
                                    linear-gradient(90deg, #C7A14A 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px',
                            }}
                        />
                        {/* Gradient Orbs */}
                        <div className="pointer-events-none absolute top-1/4 left-0 h-96 w-96 rounded-full bg-brand-primary/5 blur-[150px]" />
                        <div className="pointer-events-none absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-[#C7A14A]/5 blur-[150px]" />
                    </div>

                    <div className="relative z-10 mx-auto mb-8 max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1 backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-brand-primary" />
                                <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">
                                    Visual Gallery
                                </span>
                            </div>
                            <h2 className="mb-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-brand-primary sm:text-4xl dark:text-white">
                                Our Services
                                <br />
                                <span className="bg-gradient-to-r from-brand-primary to-[#C7A14A] bg-clip-text text-transparent dark:from-white dark:to-[#C7A14A]">
                                    in Motion
                                </span>
                            </h2>
                            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Explore the comprehensive range of services we
                                offer through our platform.
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        {/* Enhanced Gradient Masks */}
                        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-30 w-32 bg-gradient-to-r from-zinc-50 via-zinc-50/50 to-transparent md:w-48 dark:from-black/20 dark:via-black/10" />
                        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-30 w-32 bg-gradient-to-l from-zinc-50 via-zinc-50/50 to-transparent md:w-48 dark:from-black/20 dark:via-black/10" />

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
                                        className="h-48 w-56 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-brand-primary/50 sm:h-52 sm:w-60 md:h-56 md:w-64 dark:border-slate-800 dark:bg-zinc-900"
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
                    className="relative overflow-hidden bg-white py-16 dark:bg-brand-dark"
                >
                    {/* Strategic Grid Background Pattern */}
                    <motion.div
                        style={{ y: processBgY }}
                        className="absolute inset-0 -z-10 bg-white dark:bg-brand-dark"
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
                                <span className="bg-gradient-to-r from-[#C7A14A] to-slate-500 bg-clip-text text-transparent">
                                    Strategic.
                                </span>
                            </h3>
                            <p className="mx-auto max-w-xl text-base leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                Most people waste weeks talking to vendors. We
                                start with clarity — then route you correctly.
                            </p>
                        </div>

                        <div className="relative mx-auto max-w-5xl">
                            {/* Central Path (Desktop Only) */}
                            <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C7A14A]/30 to-transparent lg:block" />

                            <div className="relative space-y-16">
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
                                            <div className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-[#C7A14A]/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
                                                <div className="absolute -top-5 left-8 z-20 flex h-10 items-center justify-center rounded-xl bg-[#C7A14A] px-4 font-display text-xs font-bold tracking-widest text-white uppercase shadow-lg">
                                                    Step {step.num}
                                                </div>

                                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[#C7A14A] transition-all duration-300 group-hover:bg-[#C7A14A] group-hover:text-white dark:border-white/10 dark:bg-slate-800/50">
                                                    {step.icon}
                                                </div>

                                                <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#C7A14A] uppercase opacity-60">
                                                    Phase: {step.badge}
                                                </div>

                                                <h4 className="mb-3 font-display text-lg leading-tight font-bold text-brand-primary dark:text-white">
                                                    {step.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Desktop-only Connection Element */}
                                        <div className="relative hidden w-[10%] justify-center lg:flex">
                                            <div className="z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#C7A14A]/10 bg-white shadow-lg transition-transform group-hover:scale-110 dark:bg-brand-dark">
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
                                <p className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                                    Experience integrated consultation
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Materials & brands we use — Marquee (after Process, enhanced) */}
                <section
                    id="materials-brands"
                    className="relative overflow-hidden border-y border-slate-200 bg-white py-20 dark:border-slate-700 dark:bg-white"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,161,74,0.06),_transparent_60%)]" />
                    <div className="absolute inset-0 -z-10 bg-[length:24px_24px] bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)]" />
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                                Quality materials from recognised brands — see package details for full specifications.
                            </p>
                            <p className="mt-2 text-xs font-medium text-slate-400">
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
                    className="relative overflow-hidden bg-slate-50 py-32 dark:bg-slate-950/50"
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
                                    <span className="bg-gradient-to-r from-[#C7A14A] to-slate-500 bg-clip-text text-transparent">
                                        Choose This Platform.
                                    </span>
                                </h3>

                                <div className="relative grid gap-6 sm:grid-cols-2">
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
                                            className="group rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-[#C7A14A]/50 dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-brand-primary transition-all duration-300 group-hover:bg-[#C7A14A] group-hover:text-white dark:bg-slate-800 dark:text-[#C7A14A]">
                                                {item.icon}
                                            </div>
                                            <h4 className="mb-2 font-display text-lg font-bold text-brand-primary dark:text-white">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
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
                                        className="group flex aspect-square items-center justify-center rounded-[2.5rem] bg-slate-100 p-8 transition-colors duration-500 hover:bg-[#C7A14A] dark:bg-slate-800"
                                    >
                                        <Star className="h-16 w-16 text-slate-300 transition-all duration-500 group-hover:text-white dark:text-slate-700" />
                                    </motion.div>
                                </div>
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="flex aspect-video items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900"
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
                    className="relative overflow-hidden border-t border-slate-100 bg-white py-24 dark:border-slate-800 dark:bg-brand-dark/30"
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
                                <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-slate-500">
                                    questions
                                </span>
                            </h2>
                            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
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
                                    className="rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset dark:hover:bg-slate-800/50 dark:focus-visible:ring-[#C7A14A]"
                                    >
                                        <span className="font-display text-base font-bold text-brand-primary dark:text-white">
                                            {item.q}
                                        </span>
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-primary transition-all duration-300 dark:border-slate-700 dark:bg-slate-800 dark:text-[#C7A14A] ${openFaq === i ? 'rotate-180 border-[#C7A14A]/50 bg-[#C7A14A]/10 dark:bg-[#C7A14A]/20' : ''}`}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="border-t border-slate-100 px-6 pb-5 pt-2 text-sm leading-relaxed text-slate-600 dark:border-slate-700/50 dark:text-slate-400">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
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

                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-10 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 md:px-10 md:py-12">
                            <div className="relative z-10 mx-auto max-w-4xl">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-brand-primary uppercase dark:text-[#C7A14A]">
                                    <Target className="h-3 w-3" />
                                    <span>One platform. Five experts. Better outcomes.</span>
                                </div>

                                <h2 className="mb-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-primary sm:text-4xl dark:text-white">
                                    Clarity before commitment.
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-muted bg-clip-text text-transparent dark:from-white dark:via-[#C7A14A] dark:to-slate-400">
                                        The right expert, the right decision.
                                    </span>
                                </h2>

                                <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
                                    One conversation connects you to construction, interiors, real estate, development, or events. Compare options, get expert guidance, and move forward with confidence—without chasing multiple vendors or repeating your story.
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                                    {[
                                        { icon: <TrendingUp className="h-4 w-4" />, text: 'Informed decisions' },
                                        { icon: <Zap className="h-4 w-4" />, text: 'Time & cost saved' },
                                        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Trusted partners' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            <span className="text-brand-primary dark:text-[#C7A14A]">{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    <Link
                                        href="/chat"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 font-display text-sm font-bold text-white shadow-md transition-all hover:bg-brand-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:bg-[#C7A14A] dark:text-brand-primary dark:hover:bg-[#C7A14A]/90"
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
                <footer className="border-t border-slate-100 bg-white py-12 dark:border-slate-900 dark:bg-brand-dark">
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
                                    <span className="text-slate-500">one</span>
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                                © 2025 Area24One. All rights reserved. Designed
                                for Premium Consultation.
                            </p>
                            <div className="flex items-center gap-6">
                                <a
                                    href="#"
                                    className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-black dark:hover:text-white"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-black dark:hover:text-white"
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

            {/* Contact Widget */}
            <ContactWidget />
        </>
    );
}
