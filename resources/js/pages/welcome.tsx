import { HeroCarousel, HeroSlide } from '@/components/HeroCarousel';
import { Marquee } from '@/components/MagicMarquee';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    Calculator,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Hammer,
    HelpCircle,
    Home,
    Layers,
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
import {
    Suspense,
    lazy,
    memo,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

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

const LazyConsultationModal = lazy(() =>
    import('@/components/ConsultationModal').then((module) => ({
        default: module.ConsultationModal,
    })),
);
const LazyContactWidget = lazy(() =>
    import('@/components/ContactWidget').then((module) => ({
        default: module.ContactWidget,
    })),
);
const LazyStoriesSection = lazy(() =>
    import('@/components/StoriesSection').then((module) => ({
        default: module.StoriesSection,
    })),
);

const NAV_ITEMS = [
    { label: 'Services', href: '#what-we-do', icon: Layers },
    { label: 'Expertise', href: '#expertise', icon: ShieldCheck },
    { label: 'Process', href: '#process', icon: Zap },
    { label: 'Why Us', href: '#why-us', icon: Star },
    { label: 'FAQ', href: '#faq', icon: HelpCircle },
] as const;

const TRUST_ITEMS = [
    {
        type: 'badge',
        text: 'Decade-Backed Domain Expertise',
        icon: ShieldCheck,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/area%2024%20one.png?updatedAt=1770815540578',
        logoAlt: 'Area 24 One',
    },
    {
        type: 'badge',
        text: 'Consultation Before Commitment',
        icon: MessageSquare,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Atha.png?updatedAt=1770815540515',
        logoAlt: 'Atha',
    },
    {
        type: 'badge',
        text: 'Verified Specialists, Not Middlemen',
        icon: CheckCircle2,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Nesthetix.png?updatedAt=1770815540561',
        logoAlt: 'Nesthetix',
    },
    {
        type: 'badge',
        text: 'Right Expert, First Time',
        icon: Users,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/area%2024%20realty.png?updatedAt=1770815540228',
        logoAlt: 'Area 24 Realty',
    },
    {
        type: 'badge',
        text: 'Reduced Decision & Planning Time',
        icon: Zap,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Area%2024%20Developers.png?updatedAt=1770815541191',
        logoAlt: 'Area 24 Developers',
    },
    {
        type: 'badge',
        text: 'Premium Execution Partners',
        icon: Star,
    },
    {
        type: 'logo',
        logoSrc:
            'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/stage%20365.png?updatedAt=1770815540783',
        logoAlt: 'Stage 365',
    },
] as const;

const WHO_ITS_FOR_ITEMS = [
    {
        title: 'Building a home or villa',
        image: '/image/icons/build home or villa.png',
    },
    {
        title: 'Designing or renovating interiors',
        image: '/image/icons/design interiors.png',
    },
    { title: 'Buying or selling property', image: '/image/icons/property.png' },
    {
        title: 'Developing land or projects',
        image: '/image/icons/developing land.png',
    },
    { title: 'Planning an event', image: '/image/icons/planning event.png' },
    {
        title: 'Not sure where to start',
        image: '/image/icons/not sure what to do.png',
    },
] as const;

const JOURNEY_STEPS = [
    {
        step: '01',
        title: 'Explore & Analyse',
        desc: 'Visit the site, browse our services, and understand how Area24One connects you to the right experts.',
        icon: 'https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/analysis.png',
    },
    {
        step: '02',
        title: 'Choose Your Path',
        desc: 'Select direct consultation for immediate guidance or use our AI Chat Assistant for instant answers.',
        icon: 'https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/choose_path.png',
    },
    {
        step: '03',
        title: 'Get Matched',
        desc: 'Share your project details. We validate your requirements and connect you to the perfect specialist.',
        icon: 'https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/match_up.png',
    },
] as const;

const CLIENT_REVIEWS = [
    {
        name: 'Rajesh K.',
        location: 'Bangalore',
        rating: 5,
        comment:
            'The AI assistant gave me clarity on my construction budget within minutes. Saved weeks of research.',
    },
    {
        name: 'Priya M.',
        location: 'Mysore',
        rating: 5,
        comment:
            'Direct consultation with ArunAR helped me avoid a bad investment. Their validation process is thorough.',
    },
    {
        name: 'Vikram S.',
        location: 'Ballari',
        rating: 5,
        comment:
            'Connected me to the right interior designer instantly. No running around, just results.',
    },
    {
        name: 'Anita R.',
        location: 'Bangalore',
        rating: 5,
        comment:
            'The strategic framework helped me understand risks I had not considered. Worth every minute.',
    },
    {
        name: 'Karthik N.',
        location: 'Mysore',
        rating: 5,
        comment:
            'From land development to execution, they guided me through every phase professionally.',
    },
    {
        name: 'Sunita B.',
        location: 'Bangalore',
        rating: 5,
        comment:
            'Chat support is incredibly responsive. Got answers to all my property queries at midnight.',
    },
    {
        name: 'Mohammed A.',
        location: 'Ballari',
        rating: 5,
        comment:
            'They matched me with Atha Construction for my villa project. Quality exceeded expectations.',
    },
    {
        name: 'Lakshmi P.',
        location: 'Mysore',
        rating: 5,
        comment:
            'The consultation was free but the insights were invaluable. Highly recommend for first-time builders.',
    },
] as const;

/** Base path for brand logos (public/image/brands material/) */
const BRANDS_IMAGE_BASE = '/image/brands%20material';

type MarqueeBrand = { name: string; logo: string };

function MarqueeBrandCard({
    brand,
    isLast,
}: {
    brand: MarqueeBrand;
    isLast?: boolean;
}) {
    const [imgError, setImgError] = useState(false);
    const showLogo = brand.logo && !imgError;
    return (
        <div className="flex items-center">
            <div
                className="flex h-20 w-28 shrink-0 items-center justify-center p-4 drop-shadow-sm"
                title={brand.name}
            >
                {showLogo ? (
                    <img
                        src={brand.logo}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-xl font-bold text-slate-400">
                        {brand.name.charAt(0)}
                    </span>
                )}
            </div>
            {/* Vertical Divider */}
            {!isLast && (
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
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

// ServiceCard is defined below as a memoized component

// Memoized ServiceCard for better performance
const ServiceCard = memo(
    ({ service, index, onClick }: ServiceCardProps) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const prefersReducedMotion = useReducedMotion();

        const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setCurrentImageIndex(
                (prev) => (prev - 1 + service.images.length) % service.images.length,
            );
        };

        const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
        };

        const motionProps = prefersReducedMotion
            ? { initial: { opacity: 1, y: 0 }, whileInView: undefined }
            : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-24px' },
                  transition: { duration: 0.35, delay: index * 0.06 },
              };

        return (
            <motion.div
                {...motionProps}
                onClick={onClick}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_16px_42px_-28px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C7A14A]/45 hover:shadow-[0_22px_55px_-26px_rgba(15,23,42,0.38)] dark:border-slate-800 dark:bg-slate-950/90 dark:hover:border-[#C7A14A]/45"
            >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A14A]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative overflow-hidden border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(199,161,74,0.18),_transparent_45%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(241,245,249,0.92))] px-5 pb-5 pt-4 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(199,161,74,0.18),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.98))]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-slate-500 uppercase shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/75 dark:text-slate-300">
                            <span className="text-[#C7A14A]">{service.step}</span>
                            Expertise
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 dark:bg-[#C7A14A] dark:text-slate-950">
                            {service.icon}
                        </div>
                    </div>

                    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-[20px] border border-white/70 bg-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-slate-900/4 to-white/5 dark:from-slate-950/35 dark:via-slate-950/8 dark:to-white/5" />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                                key={`${service.id}-${currentImageIndex}`}
                                src={service.images[currentImageIndex]}
                                alt={service.title}
                                loading="lazy"
                                initial={{ opacity: 0.25, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0.25, scale: 1.015 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            />
                        </AnimatePresence>

                        {service.images.length > 1 && (
                            <>
                                <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={handlePrevImage}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/85 text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-[#C7A14A]/70 hover:bg-[#C7A14A] hover:text-slate-950 dark:border-slate-700/80 dark:bg-slate-950/75 dark:text-slate-200"
                                        aria-label={`Previous ${service.title} image`}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextImage}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/85 text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-[#C7A14A]/70 hover:bg-[#C7A14A] hover:text-slate-950 dark:border-slate-700/80 dark:bg-slate-950/75 dark:text-slate-200"
                                        aria-label={`Next ${service.title} image`}
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="absolute bottom-3 left-4 z-20 flex gap-1.5">
                                    {service.images.map((_, dotIndex) => (
                                        <span
                                            key={`${service.id}-dot-${dotIndex}`}
                                            className={`h-1.5 rounded-full transition-all ${
                                                dotIndex === currentImageIndex
                                                    ? 'w-4 bg-[#C7A14A]'
                                                    : 'w-1.5 bg-white/80 dark:bg-white/55'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="space-y-2.5">
                        <h3 className="font-display text-lg leading-tight font-bold text-slate-950 dark:text-white">
                            {service.title}
                        </h3>
                        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {service.desc}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3.5 dark:border-slate-800">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                                <img
                                    src={service.logo}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
                                    Brand
                                </p>
                                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                                    {service.title}
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] text-white uppercase transition-colors duration-300 group-hover:bg-[#C7A14A] group-hover:text-slate-950 dark:bg-white dark:text-slate-950 dark:group-hover:bg-[#C7A14A]">
                            Consult
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    },
);

ServiceCard.displayName = 'ServiceCard';

export default function Welcome({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canLogin = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canRegister = true,
    heroSlides = [],
}: {
    canLogin?: boolean;
    canRegister?: boolean;
    heroSlides?: HeroSlide[];
}) {
    const { auth } = usePage<{ auth: { user?: unknown } }>().props;
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
    const [shouldRenderModal, setShouldRenderModal] = useState(false);
    const [shouldLoadStories, setShouldLoadStories] = useState(false);
    const [shouldLoadContactWidget, setShouldLoadContactWidget] =
        useState(false);
    const [selectedService, setSelectedService] = useState<string>('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const storiesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isModalOpen) {
            setShouldRenderModal(true);
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (shouldLoadStories || !storiesRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoadStories(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px 0px' },
        );

        observer.observe(storiesRef.current);

        return () => observer.disconnect();
    }, [shouldLoadStories]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let idleId: number | null = null;

        const loadWidget = () => setShouldLoadContactWidget(true);

        if ('requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(loadWidget, { timeout: 2000 });
        } else {
            timeoutId = setTimeout(loadWidget, 1200);
        }

        return () => {
            if (idleId !== null && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const processRef = useRef(null);
    const whyUsRef = useRef(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDiscoveryChange = (
        _key: keyof DiscoveryOptions,
        _value: string,
    ) => {
        // Discovery functionality temporarily disabled for performance
        // const updated = { ...discovery, [key]: value };
        // setDiscovery(updated);
        // if (Object.values(updated).every(Boolean)) {
        //     router.visit(`/chat?service=${updated.service}&timeline=${updated.timeline}&budget=${updated.budget}`);
        // }
    };

    // Throttled scroll handler for better performance
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Only update if value changes
                    const isScrolled = currentScrollY > 20;
                    setScrolled((prev) =>
                        prev !== isScrolled ? isScrolled : prev,
                    );

                    // Mobile Smart Header Logic - only update if actually changed
                    if (
                        currentScrollY > lastScrollY.current &&
                        currentScrollY > 50
                    ) {
                        setIsHeaderVisible((prev) =>
                            prev === false ? prev : false,
                        );
                    } else {
                        setIsHeaderVisible((prev) =>
                            prev === true ? prev : true,
                        );
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // CTA Auto-Popup Logic - scheduled once instead of polling
    useEffect(() => {
        const POPUP_STORAGE_KEY = 'area24one_last_popup_time';
        const SESSION_KEY = 'area24one_popup_shown_in_session';
        const RECURRING_INTERVAL = 180000; // 3 minutes in milliseconds

        let initialTimeoutId: number | null = null;
        let recurringTimeoutId: number | null = null;

        const showPopup = () => {
            setShouldRenderModal(true);
            setIsModalOpen(true);
            sessionStorage.setItem(SESSION_KEY, 'true');
            localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
        };

        const scheduleRecurringPopup = (delay: number) => {
            recurringTimeoutId = window.setTimeout(() => {
                showPopup();
                scheduleRecurringPopup(RECURRING_INTERVAL);
            }, delay);
        };

        const sessionShown = sessionStorage.getItem(SESSION_KEY);
        const lastPopupTime = Number(
            localStorage.getItem(POPUP_STORAGE_KEY) ?? '0',
        );

        if (!sessionShown) {
            initialTimeoutId = window.setTimeout(() => {
                showPopup();
                scheduleRecurringPopup(RECURRING_INTERVAL);
            }, 5000);
        } else {
            const elapsed = lastPopupTime ? Date.now() - lastPopupTime : 0;
            const nextDelay = Math.max(RECURRING_INTERVAL - elapsed, 1000);
            scheduleRecurringPopup(nextDelay);
        }

        return () => {
            if (initialTimeoutId !== null) {
                window.clearTimeout(initialTimeoutId);
            }
            if (recurringTimeoutId !== null) {
                window.clearTimeout(recurringTimeoutId);
            }
        };
    }, []);

    // Memoized services array to prevent unnecessary re-renders
    const services = useMemo(
        () => [
            {
                id: 'construction',
                icon: <Building2 className="h-6 w-6" />,
                logo: '/image/atha.png',
                images: [
                    'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Atha.png?updatedAt=1770815540515',
                    'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg',
                    'https://images.pexels.com/photos/69483/pexels-photo-69483.jpeg',
                    'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg',
                    'https://images.pexels.com/photos/27195983/pexels-photo-27195983.jpeg',
                ],
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
                images: [
                    'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Nesthetix.png?updatedAt=1770815540561',
                    'https://images.pexels.com/photos/20285350/pexels-photo-20285350.jpeg',
                    'https://images.pexels.com/photos/20285351/pexels-photo-20285351.jpeg',
                    'https://images.pexels.com/photos/11701127/pexels-photo-11701127.jpeg',
                    'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg',
                ],
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
                images: [
                    'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/area%2024%20realty.png?updatedAt=1770815540228',
                    'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg',
                    'https://images.pexels.com/photos/7937748/pexels-photo-7937748.jpeg',
                    'https://images.pexels.com/photos/8482871/pexels-photo-8482871.jpeg',
                    'https://images.pexels.com/photos/29726512/pexels-photo-29726512.jpeg',
                ],
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
                images: [
                    'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Area%2024%20Developers.png?updatedAt=1770815541191',
                    'https://images.pexels.com/photos/392031/pexels-photo-392031.jpeg',
                    'https://images.pexels.com/photos/1579356/pexels-photo-1579356.jpeg',
                    'https://images.pexels.com/photos/2314021/pexels-photo-2314021.jpeg',
                    'https://images.pexels.com/photos/29141362/pexels-photo-29141362.jpeg',
                ],
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
                images: [
                    'https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/stage%20365.png?updatedAt=1770815540783',
                    'https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg',
                    'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
                    'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
                    'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
                ],
                title: 'The Stage 365',
                desc: 'From corporate galas to immersive brand activations, we produce extraordinary events. Our team handles everything from conceptual design to execution.',
                accent: 'bg-brand-primary/10 text-brand-primary dark:text-[#C7A14A]',
                step: '05',
                url: 'https://thestage365.com/',
            },
        ],
        [],
    );

    return (
        <>
            <Head title="Area 24 One | Intelligent Consultation" />
            <div className="font-inter min-h-screen scroll-smooth bg-brand-surface text-brand-text selection:bg-brand-primary selection:text-white dark:bg-brand-dark dark:text-slate-50">
                {/* Navbar */}
                <nav
                    className={`fixed top-0 z-50 w-full border-b border-slate-200 bg-black/80 py-2 shadow-sm backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-brand-dark/95 ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'} md:fixed md:inset-x-0 md:translate-y-0 md:border-transparent md:shadow-none md:backdrop-blur-none md:transition-all md:duration-500 ${
                        scrolled
                            ? 'md:border-slate-200 md:bg-white/80 md:py-2 md:shadow-sm md:backdrop-blur-xl md:dark:border-slate-800 md:dark:bg-brand-dark/80'
                            : 'md:bg-black/40 md:py-3 md:backdrop-blur-xl md:dark:bg-black/60'
                    }`}
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex items-center justify-between gap-3">
                            <Link
                                href="/"
                                className="group flex cursor-pointer items-center gap-2 md:gap-3"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-transparent p-1 shadow-lg shadow-brand-primary/10 transition-transform duration-500 group-hover:scale-105 md:h-20 md:w-20 md:rounded-xl dark:bg-transparent">
                                    {/* Mobile Logo: Always White */}
                                    <img
                                        src="/image/main logo (white).png"
                                        alt="Logo Mobile"
                                        className="h-full w-full object-contain md:hidden"
                                    />
                                    {/* Desktop Logo: Switches on Scroll */}
                                    <img
                                        src={
                                            scrolled
                                                ? '/image/main logo.png'
                                                : '/image/main logo (white).png'
                                        }
                                        alt="Logo Desktop"
                                        className="hidden h-full w-full object-contain md:block"
                                    />
                                </div>
                            </Link>

                            {/* Desktop Navigation - Clean Design */}
                            <div className="hidden items-center gap-0.5 md:flex">
                                {NAV_ITEMS.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 hover:bg-white/10 ${scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white' : 'text-white/90 hover:text-white'}`}
                                    >
                                        <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                                            <item.icon className="h-4 w-4" />
                                        </span>
                                        <span>{item.label}</span>
                                    </a>
                                ))}

                                <div
                                    className={`mx-2 h-4 w-px ${scrolled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white/30'}`}
                                />

                                {/* Cost Estimator */}
                                <Link
                                    href="/cost-estimator"
                                    className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 hover:bg-white/10 ${scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white' : 'text-white/90 hover:text-white'}`}
                                >
                                    <Calculator className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                    <span>Estimate</span>
                                </Link>

                                <div
                                    className={`mx-2 h-4 w-px ${scrolled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white/30'}`}
                                />

                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-all duration-200 ${scrolled ? 'bg-brand-primary text-white hover:bg-brand-primary/90' : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'}`}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <Link
                                            href="/login"
                                            className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#C7A14A] hover:shadow-lg hover:shadow-brand-primary/25 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span>Consult</span>
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
                                    className={`rounded-lg p-2 transition-colors hover:bg-slate-100/10 ${scrolled ? 'text-brand-primary md:text-white' : 'text-white'}`}
                                    onClick={() =>
                                        setMobileMenuOpen(!mobileMenuOpen)
                                    }
                                >
                                    {mobileMenuOpen ? (
                                        <X
                                            size={22}
                                            className="text-white md:text-inherit"
                                        />
                                    ) : (
                                        <Menu
                                            size={22}
                                            className="text-white md:text-inherit"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Mobile Menu - Clean Design */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="absolute inset-x-4 top-20 rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-900">
                            <div className="flex flex-col gap-1">
                                {NAV_ITEMS.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-brand-primary dark:text-[#C7A14A]">
                                            <item.icon className="h-5 w-5" />
                                        </span>
                                        <span>{item.label}</span>
                                    </a>
                                ))}

                                <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

                                <Link
                                    href="/cost-estimator"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <Calculator className="h-5 w-5 text-brand-primary dark:text-[#C7A14A]" />
                                    <span>Cost Estimator</span>
                                </Link>

                                <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-primary/90"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-center text-base font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <span>Sign In</span>
                                        </Link>
                                        <Link
                                            href="/chat"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#C7A14A]"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Start Consultation</span>
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
                <section className="relative overflow-hidden bg-black py-4">
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
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />

                    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
                        <Marquee
                            className="[--duration:60s] [--gap:0rem]"
                            pauseOnHover
                        >
                            {TRUST_ITEMS.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="flex items-center gap-8 px-14">
                                        <div
                                            className={`flex h-24 w-auto items-center justify-center opacity-90 transition-opacity hover:opacity-100 ${item.type === 'badge' ? 'text-white' : ''}`}
                                        >
                                            {item.type === 'badge' ? (
                                                <item.icon className="h-10 w-10 stroke-[1.5]" />
                                            ) : (
                                                <img
                                                    src={item.logoSrc}
                                                    className="h-20 w-auto brightness-0 invert"
                                                    alt={item.logoAlt}
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                        {item.type === 'badge' && (
                                            <span className="font-display text-sm font-bold tracking-wide whitespace-nowrap text-white uppercase">
                                                {item.text}
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-8 w-px bg-white/30" />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </section>

                {/* What We Do & Who It's For - Customer-driven, compact bento */}
                <section
                    id="what-we-do"
                    className="relative overflow-hidden border-y border-slate-100 bg-white py-14 md:py-16 dark:border-slate-800 dark:bg-brand-dark/50"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(199,161,74,0.04),_transparent_50%)]" />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                            {/* Left Column: Context + Grid */}
                            <div className="flex w-full flex-col justify-center lg:flex-1">
                                <div className="mb-8 flex flex-col gap-6">
                                    <div className="max-w-2xl">
                                        <div className="mb-3 inline-flex items-center gap-2">
                                            <div className="h-px w-6 bg-[#C7A14A]" />
                                            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                                What we're building for you
                                            </span>
                                            <div className="h-px w-6 bg-[#C7A14A]" />
                                        </div>
                                        <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                            One conversation.{' '}
                                            <span className="text-[#C7A14A]">
                                                Five brands. Zero runaround.
                                            </span>
                                        </h2>
                                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                            Tell us once — vision, budget,
                                            timeline — we connect you to the
                                            right specialist.
                                        </p>
                                    </div>
                                </div>

                                {/* Who Is This For – bento grid: left col 2 stacked, right 2x2 */}
                                <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {WHO_ITS_FOR_ITEMS.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 12 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{
                                                once: true,
                                                margin: '-20px',
                                            }}
                                            transition={{
                                                duration: 0.35,
                                                delay: i * 0.05,
                                            }}
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
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-brand-primary bg-transparent px-6 py-3 text-sm font-semibold text-brand-primary transition-all duration-300 hover:bg-brand-primary hover:text-white focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none dark:border-[#C7A14A] dark:text-[#C7A14A] dark:hover:bg-[#C7A14A] dark:hover:text-white"
                                    >
                                        Start conversation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Video */}
                            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
                                <div className="relative h-auto w-72 rotate-0 transform overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-900/10 transition-all duration-500 hover:scale-105">
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="none"
                                        className="h-auto w-full"
                                    >
                                        <source
                                            src="/video/section.mp4"
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section
                    id="expertise"
                    className="relative overflow-hidden bg-zinc-50 py-10 md:py-12 dark:bg-black/20"
                >
                    <div className="absolute top-0 right-0 -z-10 h-[320px] w-[320px] rounded-full bg-brand-primary/5 blur-[80px]" />
                    <div className="absolute bottom-1/4 left-0 -z-10 h-[240px] w-[240px] rounded-full bg-[#C7A14A]/5 blur-[60px]" />

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-8 text-center md:mb-10">
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    Our Expertise
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Five brands.{' '}
                                <span className="text-[#C7A14A]">
                                    One platform.
                                </span>
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                                Construction, interiors, real estate,
                                development, and events — start a consultation
                                from any card.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* First Row: 3 Cards */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                {services.slice(3, 5).map((service, i) => (
                                    <div
                                        key={service.id}
                                        className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
                                    >
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

                        {/* Minimal CTA Section */}
                        <div className="mt-10 flex flex-col items-center gap-5 text-center">
                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
                                {[
                                    {
                                        icon: CheckCircle2,
                                        text: 'Free consultation',
                                    },
                                    { icon: Zap, text: 'Expert matching' },
                                    { icon: Target, text: 'Quick response' },
                                ].map((item, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                                    >
                                        <item.icon className="h-4 w-4 text-[#C7A14A]" />
                                        {item.text}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedService('');
                                        setIsModalOpen(true);
                                    }}
                                    className="group inline-flex items-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C7A14A] hover:shadow-lg hover:shadow-brand-primary/25"
                                >
                                    <MessageSquare className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                                    Start consultation
                                </button>
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary dark:text-slate-400 dark:hover:text-white"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Open chat
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Your Journey - How It Works */}
                <section className="relative overflow-hidden bg-[#0A1628] py-16 lg:py-20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(199,161,74,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(199,161,74,0.5) 1px, transparent 1px)',
                                backgroundSize: '60px 60px',
                            }}
                        />
                    </div>

                    <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    Your Journey
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h2 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                                How to Approach{' '}
                                <span className="text-[#C7A14A]">
                                    Area24One
                                </span>
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
                                From discovery to decision — a clear path to
                                your project goals.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="grid gap-6 md:grid-cols-3">
                            {JOURNEY_STEPS.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.1,
                                    }}
                                    className="relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -top-3 left-6">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C7A14A] text-xs font-bold text-[#0A1628]">
                                            {item.step}
                                        </span>
                                    </div>

                                    <div className="pt-2">
                                        <div className="mb-3 h-12 w-12">
                                            <img
                                                src={item.icon}
                                                alt={item.title}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-base font-medium text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Connector Line (not on last item) */}
                                    {i < 2 && (
                                        <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-[#C7A14A]/30 md:block" />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-10 text-center"
                        >
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#C7A14A] px-6 py-3 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#B89440]"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Start with AI Assistant
                                </Link>
                                <button
                                    onClick={() => {
                                        setSelectedService('');
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-[#C7A14A]"
                                >
                                    Request Direct Consultation
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div ref={storiesRef} className="min-h-[12rem]">
                    {shouldLoadStories ? (
                        <Suspense
                            fallback={
                                <div className="h-48 bg-zinc-50 dark:bg-black/20" />
                            }
                        >
                            <LazyStoriesSection />
                        </Suspense>
                    ) : null}
                </div>

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
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    Visual Gallery
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Our Services{' '}
                                <span className="text-[#C7A14A]">
                                    in Motion
                                </span>
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
                                            loading="lazy"
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

                {/* The Area24One Strategic Framework - Fixed Background Image */}
                <section
                    ref={processRef}
                    id="process"
                    className="relative min-h-[600px] overflow-hidden"
                >
                    {/* Fixed Background Image - Optimized */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url(https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/pexels-ivan-s-8962803.jpg)',
                        }}
                    />

                    {/* Dark Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/85 to-[#0A1628]/90" />

                    {/* Content Stacked Over Image */}
                    <div className="relative z-10 flex min-h-[600px] items-center py-16 lg:py-20">
                        <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
                            {/* Compact Header */}
                            <div className="mb-10 text-center lg:mb-12">
                                <div className="mb-3 inline-flex items-center gap-3">
                                    <div className="h-px w-6 bg-[#C7A14A]" />
                                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C7A14A] uppercase">
                                        The Area24One Strategic Framework
                                    </span>
                                    <div className="h-px w-6 bg-[#C7A14A]" />
                                </div>

                                <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                                    From Concept to{' '}
                                    <span className="text-[#C7A14A]">
                                        Controlled Execution
                                    </span>
                                </h2>
                            </div>

                            {/* Compact Connected Timeline */}
                            <div className="relative">
                                {/* Vertical Connection Line */}
                                <div className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-[#C7A14A] via-[#C7A14A]/30 to-transparent lg:left-1/2 lg:-translate-x-1/2" />

                                <div className="space-y-5">
                                    {[
                                        {
                                            phase: 'PHASE I',
                                            title: 'Strategic Assessment',
                                            objective:
                                                'Establish clarity before commitment.',
                                            items: [
                                                'Risk exposure map',
                                                'Viability observations',
                                                'Direction summary',
                                            ],
                                            align: 'left',
                                        },
                                        {
                                            phase: 'PHASE II',
                                            title: 'Feasibility & Alignment',
                                            objective:
                                                'Validate before mobilizing.',
                                            items: [
                                                'Budget architecture',
                                                'Feasibility notes',
                                                'Market alignment',
                                            ],
                                            align: 'right',
                                        },
                                        {
                                            phase: 'PHASE III',
                                            title: 'Execution Structuring',
                                            objective:
                                                'Align stakeholders under one framework.',
                                            items: [
                                                'Execution roadmap',
                                                'Responsibility matrix',
                                                'Oversight framework',
                                            ],
                                            align: 'left',
                                        },
                                    ].map((phase, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: i * 0.1,
                                            }}
                                            className={`relative flex items-start gap-5 lg:grid lg:grid-cols-2 lg:gap-8 ${phase.align === 'right' ? 'lg:text-right' : ''}`}
                                        >
                                            {/* Node */}
                                            <div
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C7A14A] bg-[#0A1628]/80 backdrop-blur-sm lg:absolute lg:left-1/2 lg:-translate-x-1/2 ${phase.align === 'right' ? 'lg:order-2' : ''}`}
                                            >
                                                <span className="text-sm font-bold text-[#C7A14A]">
                                                    {i + 1}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div
                                                className={`flex-1 pb-1 lg:pb-0 ${phase.align === 'right' ? 'lg:order-1 lg:pr-16' : 'lg:order-2 lg:pl-16'}`}
                                            >
                                                <div className="group">
                                                    <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A]">
                                                        {phase.phase}
                                                    </span>
                                                    <h3 className="mt-0.5 text-base font-medium text-white transition-colors group-hover:text-[#C7A14A]">
                                                        {phase.title}
                                                    </h3>
                                                    <p className="mt-0.5 text-sm font-medium text-slate-200">
                                                        {phase.objective}
                                                    </p>

                                                    {/* Compact Deliverables */}
                                                    <div
                                                        className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${phase.align === 'right' ? 'lg:justify-end' : ''}`}
                                                    >
                                                        {phase.items.map(
                                                            (item, j) => (
                                                                <span
                                                                    key={j}
                                                                    className="inline-flex items-center gap-1.5 text-xs text-slate-300"
                                                                >
                                                                    <span className="h-1 w-1 rounded-full bg-[#C7A14A]" />
                                                                    {item}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Spacer for opposite side */}
                                            <div
                                                className={`hidden lg:block ${phase.align === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Compact CTA */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 lg:flex-row lg:justify-between"
                            >
                                <p className="text-xs text-slate-400">
                                    Framework by{' '}
                                    <span className="text-[#C7A14A]">
                                        ArunAR
                                    </span>
                                </p>

                                <button
                                    onClick={() => {
                                        setSelectedService('');
                                        setIsModalOpen(true);
                                    }}
                                    className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#C7A14A]"
                                >
                                    Request Strategic Review
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Materials & brands we use — Clean Marquee */}
                <section
                    id="materials-brands"
                    className="relative overflow-hidden bg-white py-16 dark:bg-white"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Compact Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="mb-10 text-center"
                        >
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    Materials & brands we use
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h3 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl">
                                Trusted partners across our construction
                                packages
                            </h3>
                        </motion.div>

                        {/* Clean Marquee - No wrapper, mild shadow, vertical dividers */}
                        <div className="relative overflow-hidden">
                            <Marquee
                                className="py-4 [--duration:40s] [--gap:0px]"
                                pauseOnHover
                                repeat={6}
                            >
                                {MARQUEE_BRANDS.map((brand, i) => (
                                    <MarqueeBrandCard
                                        key={i}
                                        brand={brand}
                                        isLast={false}
                                    />
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </section>

                {/* Founder-Led Elite Advisory - Clean Modern Design */}
                <section
                    ref={whyUsRef}
                    id="why-us"
                    className="relative overflow-hidden bg-[#0A1628]"
                >
                    {/* Fixed Background Image - Optimized */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url(https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/pexels-ivan-s-8962803.jpg)',
                        }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-[#0A1628]/92" />

                    <div className="relative z-10 py-20 lg:py-24">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">
                            {/* Compact Header */}
                            <div className="mb-12 text-center lg:mb-14">
                                <div className="mb-4 inline-flex items-center gap-3">
                                    <div className="h-px w-8 bg-[#C7A14A]" />
                                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C7A14A] uppercase">
                                        The ArunAR Decision Model
                                    </span>
                                    <div className="h-px w-8 bg-[#C7A14A]" />
                                </div>

                                <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    Before Capital Moves,{' '}
                                    <span className="text-[#C7A14A]">
                                        Strategy Is Validated.
                                    </span>
                                </h2>
                            </div>

                            {/* Strategic Layers - Clean Cards */}
                            <div className="grid gap-4 lg:grid-cols-2">
                                {[
                                    {
                                        num: '01',
                                        title: 'Strategic Feasibility Control',
                                        desc: 'Capital exposure, financial logic, and execution viability assessed before commitments.',
                                    },
                                    {
                                        num: '02',
                                        title: 'Architectural & Technical Authority',
                                        desc: 'Design decisions reviewed for constructability, cost impact, and asset value.',
                                    },
                                    {
                                        num: '03',
                                        title: 'Market Intelligence Alignment',
                                        desc: 'Positioning and pricing validated against real-world market behavior.',
                                    },
                                    {
                                        num: '04',
                                        title: 'Execution Governance',
                                        desc: 'All stakeholders operate within one unified decision chain.',
                                    },
                                ].map((layer, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.08,
                                        }}
                                        className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#C7A14A]/30 hover:bg-slate-900/50"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C7A14A]/30 text-xs font-bold text-[#C7A14A]">
                                                {layer.num}
                                            </span>
                                            <div>
                                                <h3 className="mb-1 text-base font-medium text-white transition-colors group-hover:text-[#C7A14A]">
                                                    {layer.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-slate-400">
                                                    {layer.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Authority Metrics - Inline Row */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-8 flex flex-wrap justify-center gap-8 border-y border-slate-800/50 py-6 lg:gap-12"
                            >
                                {[
                                    { value: '₹120Cr+', label: 'Reviewed' },
                                    {
                                        value: '30–45 Days',
                                        label: 'Validation',
                                    },
                                    {
                                        value: 'Zero-Compromise',
                                        label: 'Screening',
                                    },
                                ].map((metric, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xl font-semibold text-white lg:text-2xl">
                                            {metric.value}
                                        </div>
                                        <div className="mt-0.5 text-[10px] tracking-wider text-slate-500 uppercase">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Compact Quote & Attribution */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-10 text-center"
                            >
                                <p className="mx-auto max-w-2xl text-base leading-relaxed font-light text-slate-300">
                                    "A project is not approved because it looks
                                    promising. It is approved because it
                                    survives structured scrutiny."
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <div className="h-px w-8 bg-[#C7A14A]/50" />
                                    <span className="text-sm font-medium text-[#C7A14A]">
                                        ArunAR
                                    </span>
                                    <div className="h-px w-8 bg-[#C7A14A]/50" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Client Reviews - Auto Scroll Marquee */}
                <section className="relative overflow-hidden bg-[#0A1628] py-16 lg:py-20">
                    {/* Subtle Background */}
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, rgba(199,161,74,0.5) 1px, transparent 0)',
                                backgroundSize: '40px 40px',
                            }}
                        />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    Client Reviews
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h2 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                                Trusted by{' '}
                                <span className="text-[#C7A14A]">
                                    Decision-Makers
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* Reviews Marquee - Full Width Slow Scroll */}
                    <div className="relative w-full overflow-hidden">
                        <Marquee
                            className="py-4 [--duration:96s]"
                            pauseOnHover
                            repeat={2}
                        >
                            {CLIENT_REVIEWS.map((review, i) => (
                                <div
                                    key={i}
                                    className="mx-6 w-[320px] shrink-0 sm:mx-8 sm:w-[380px] lg:mx-10 lg:w-[420px]"
                                >
                                    <div className="border-l-2 border-[#C7A14A]/30 pl-5">
                                        {/* Rating Stars */}
                                        <div className="mb-3 flex gap-1">
                                            {Array(review.rating)
                                                .fill(null)
                                                .map((_, j) => (
                                                    <svg
                                                        key={j}
                                                        className="h-4 w-4 fill-[#C7A14A]"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="mb-4 text-sm leading-relaxed text-slate-300">
                                            "{review.comment}"
                                        </p>

                                        {/* Name & Location */}
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-medium text-white">
                                                {review.name}
                                            </span>
                                            <span className="text-slate-600">
                                                •
                                            </span>
                                            <span className="text-slate-500">
                                                {review.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </section>

                {/* FAQ Section - Compact Modern Design */}
                <section
                    id="faq"
                    className="relative overflow-hidden bg-slate-50 py-16 dark:bg-[#0A0F1C]"
                >
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        {/* Compact Header */}
                        <div className="mb-10 text-center">
                            <div className="mb-3 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    FAQ
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                Frequently asked questions
                            </h2>
                        </div>

                        {/* Compact Accordion */}
                        <div className="space-y-2">
                            {[
                                {
                                    q: 'What is Area 24 One?',
                                    a: 'A single platform connecting you with five expert brands: Atha Construction, Nesthetix Design, Area24 Realty, Area24 Developers, and The Stage 365.',
                                },
                                {
                                    q: 'How does consultation work?',
                                    a: 'Chat with our AI consultant about your project, budget, and timeline. We clarify requirements and connect you to the right specialist.',
                                },
                                {
                                    q: 'Is the consultation free?',
                                    a: 'Yes. Initial consultation and guidance are completely free with no obligation.',
                                },
                                {
                                    q: 'Which cities do you serve?',
                                    a: 'We operate across Karnataka with strong presence in Bangalore, Mysore, and Ballari.',
                                },
                                {
                                    q: 'Can I get a quote?',
                                    a: 'Yes. Once we understand your project, we connect you with the right team for detailed quotes and package options.',
                                },
                                {
                                    q: 'How do I get started?',
                                    a: 'Click "Start Consultation" and tell us what you are planning. Our AI will guide you to the right expert.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.3,
                                        delay: i * 0.05,
                                    }}
                                    className="rounded-lg border border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(openFaq === i ? null : i)
                                        }
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {item.q}
                                        </span>
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-200 dark:border-slate-700 dark:text-slate-400 ${openFaq === i ? 'rotate-180 border-[#C7A14A] bg-[#C7A14A] text-white dark:bg-[#C7A14A]' : ''}`}
                                        >
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-200 ease-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="border-t border-slate-100 px-5 pt-3 pb-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Compact CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 text-center"
                        >
                            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                                Still have questions?
                            </p>
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C7A14A] transition-colors hover:text-[#B89440]"
                            >
                                Start a conversation
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* One Platform CTA - Fixed Background Image */}
                <section className="relative overflow-hidden">
                    {/* Fixed Background Image - Optimized */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url(https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/pexels-ivan-s-8962803.jpg)',
                        }}
                    />

                    {/* Light Overlay */}
                    <div className="absolute inset-0 bg-white/95 dark:bg-[#0A1628]/95" />

                    {/* Content */}
                    <div className="relative z-10 py-16 lg:py-20">
                        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                            {/* Micro Label */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-4 inline-flex items-center gap-2"
                            >
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    One platform. Five experts. Better outcomes.
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </motion.div>

                            {/* Headline */}
                            <motion.h2
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-3 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                            >
                                Clarity before commitment.
                                <br />
                                <span className="text-[#C7A14A]">
                                    The right expert, the right decision.
                                </span>
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                                className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                            >
                                One conversation connects you to construction,
                                interiors, real estate, development, or events.
                                Compare options and move forward with
                                confidence.
                            </motion.p>

                            {/* Benefits - Compact Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mb-8 flex flex-wrap items-center justify-center gap-6"
                            >
                                {[
                                    {
                                        icon: TrendingUp,
                                        text: 'Informed decisions',
                                    },
                                    { icon: Zap, text: 'Time & cost saved' },
                                    {
                                        icon: ShieldCheck,
                                        text: 'Trusted partners',
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                                    >
                                        <item.icon className="h-3.5 w-3.5 text-[#C7A14A]" />
                                        {item.text}
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.25 }}
                                className="flex flex-col items-center justify-center gap-3 sm:flex-row"
                            >
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#0A1628] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0A1628]/90 hover:shadow-lg dark:bg-[#C7A14A] dark:text-[#0A1628]"
                                >
                                    Get clarity now
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#C7A14A] dark:text-slate-400"
                                >
                                    Talk to an expert
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-100 bg-white py-12 dark:border-slate-900 dark:bg-brand-dark">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent p-1 transition-transform duration-500 hover:rotate-6 dark:bg-transparent">
                                    <img
                                        src="/image/main logo (white).png"
                                        alt="Logo"
                                        className="h-full w-full object-contain"
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
            {shouldRenderModal ? (
                <Suspense fallback={null}>
                    <LazyConsultationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        initialService={selectedService}
                    />
                </Suspense>
            ) : null}

            {/* Contact Widget */}
            {shouldLoadContactWidget ? (
                <Suspense fallback={null}>
                    <LazyContactWidget />
                </Suspense>
            ) : null}
        </>
    );
}
