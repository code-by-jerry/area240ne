import { HeroCarousel, HeroSlide } from '@/components/HeroCarousel';
import { HomeNavbar } from '@/components/HomeNavbar';
import { Marquee } from '@/components/MagicMarquee';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Hammer,
    Home,
    MessageSquare,
    PaintBucket,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import {
    Suspense,
    lazy,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

type HomeSeo = {
    title: string;
    description: string;
    keywords?: string | null;
    canonical: string;
    image: string;
    type?: string | null;
};

type CompanyProfile = {
    name?: string | null;
    logo_url?: string | null;
    intro_text?: string | null;
    fallback_text?: string | null;
    phone?: string[] | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
};

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

const TRUST_ITEMS = [
    { type: 'badge', text: 'Decade-Backed Domain Expertise', icon: ShieldCheck },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/area%2024%20one.png?updatedAt=1770815540578'), logoAlt: 'Area 24 One' },
    { type: 'badge', text: 'Consultation Before Commitment', icon: MessageSquare },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Atha.png?updatedAt=1770815540515'), logoAlt: 'Atha' },
    { type: 'badge', text: 'Verified Specialists, Not Middlemen', icon: CheckCircle2 },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Nesthetix.png?updatedAt=1770815540561'), logoAlt: 'Nesthetix' },
    { type: 'badge', text: 'Right Expert, First Time', icon: Users },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/area%2024%20realty.png?updatedAt=1770815540228'), logoAlt: 'Area 24 Realty' },
    { type: 'badge', text: 'Reduced Decision & Planning Time', icon: Zap },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/Area%2024%20Developers.png?updatedAt=1770815541191'), logoAlt: 'Area 24 Developers' },
    { type: 'badge', text: 'Premium Execution Partners', icon: Star },
    { type: 'logo', logoSrc: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/stage%20365.png?updatedAt=1770815540783'), logoAlt: 'Stage 365' },
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
        icon: ik('https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/analysis.png', 'f-webp,q-80,w-96'),
    },
    {
        step: '02',
        title: 'Choose Your Path',
        desc: 'Select direct consultation for immediate guidance or use our AI Chat Assistant for instant answers.',
        icon: ik('https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/choose_path.png', 'f-webp,q-80,w-96'),
    },
    {
        step: '03',
        title: 'Get Matched',
        desc: 'Share your project details. We validate your requirements and connect you to the perfect specialist.',
        icon: ik('https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/match_up.png', 'f-webp,q-80,w-96'),
    },
] as const;

const FAQ_ITEMS = [
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

const IK_BASE = 'https://ik.imagekit.io/area24onestorage';

/** Add ImageKit WebP + quality transformation to any ImageKit URL */
function ik(url: string, opts = 'f-webp,q-80') {
    // Insert /tr:... before the filename
    return url.replace(/(https:\/\/ik\.imagekit\.io\/[^/]+\/)/, `$1tr:${opts}/`);
}

type MarqueeBrand = { name: string; logo: string };

function MarqueeBrandCard({ brand }: { brand: MarqueeBrand }) {
    return (
        <div className="flex items-center">
            <div
                className="flex h-16 w-24 shrink-0 items-center justify-center p-3"
                title={brand.name}
            >
                <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
        </div>
    );
}

const IK = 'https://ik.imagekit.io/area24onestorage/brand-materials';

/** Brand logos — served from ImageKit CDN with WebP transform */
const MARQUEE_BRANDS: MarqueeBrand[] = [
    { name: 'TATA TMT',    logo: ik(`${IK}/tata-tiscon-logo.png?updatedAt=1776316749749`,  'f-webp,q-80,w-160') },
    { name: 'JSW',         logo: ik(`${IK}/jsw-steel.jpeg?updatedAt=1776316750207`,        'f-webp,q-80,w-160') },
    { name: 'Ultratech',   logo: ik(`${IK}/ultratech-cement.png?updatedAt=1776316750206`,  'f-webp,q-80,w-160') },
    { name: 'ACC',         logo: ik(`${IK}/ACC.svg?updatedAt=1776316749154`,               'f-webp,q-80,w-160') },
    { name: 'Birla',       logo: ik(`${IK}/birla-logo.jpg?updatedAt=1776316750140`,        'f-webp,q-80,w-160') },
    { name: 'Dalmia',      logo: ik(`${IK}/dalmia-cement.svg?updatedAt=1776316749740`,     'f-webp,q-80,w-160') },
    { name: 'Zuari',       logo: ik(`${IK}/Zuari%20cement.jpg?updatedAt=1776316749689`,    'f-webp,q-80,w-160') },
    { name: 'Bharathi',    logo: ik(`${IK}/bharathi-logo.png?updatedAt=1776316749683`,     'f-webp,q-80,w-160') },
    { name: 'Kohler',      logo: ik(`${IK}/kohler.svg?updatedAt=1776316750305`,            'f-webp,q-80,w-160') },
    { name: 'Jaquar',      logo: ik(`${IK}/jaquar.svg?updatedAt=1776316749809`,            'f-webp,q-80,w-160') },
    { name: 'Parryware',   logo: ik(`${IK}/parryware-brand.png?updatedAt=1776316749806`,   'f-webp,q-80,w-160') },
    { name: 'Cera',        logo: ik(`${IK}/cera-logo.gif?updatedAt=1776316749739`,         'f-webp,q-80,w-160') },
    { name: 'Havells',     logo: ik(`${IK}/Havells_Logo.svg?updatedAt=1776316750243`,      'f-webp,q-80,w-160') },
    { name: 'Finolex',     logo: ik(`${IK}/Finolex%20logo.png?updatedAt=1776316750271`,    'f-webp,q-80,w-160') },
    { name: 'Legrand',     logo: ik(`${IK}/legrand.webp?updatedAt=1776316749809`,          'f-webp,q-80,w-160') },
    { name: 'Schneider',   logo: ik(`${IK}/schneider.svg?updatedAt=1776316749825`,         'f-webp,q-80,w-160') },
    { name: 'APL Apollo',  logo: ik(`${IK}/apl_apollo.png?updatedAt=1776316749034`,        'f-webp,q-80,w-160') },
    { name: 'Ashirwad',    logo: ik(`${IK}/ashirvad-logo.png?updatedAt=1776316749679`,     'f-webp,q-80,w-160') },
    { name: 'Jindal',      logo: ik(`${IK}/jindal-steel.svg?updatedAt=1776316749789`,      'f-webp,q-80,w-160') },
    { name: 'Sintex',      logo: ik(`${IK}/sintex.png?updatedAt=1776316749608`,            'f-webp,q-80,w-160') },
    { name: 'Sunvik TMT',  logo: ik(`${IK}/Sunvik%20TMT.png?updatedAt=1776316750209`,      'f-webp,q-80,w-160') },
    { name: 'Kamadhenu',   logo: ik(`${IK}/Kamadhenu.png?updatedAt=1776316750205`,         'f-webp,q-80,w-160') },
    { name: 'Orbit',       logo: ik(`${IK}/orbit-logo.webp?updatedAt=1776316749901`,       'f-webp,q-80,w-160') },
    { name: 'Indus',       logo: ik(`${IK}/Indus-logo.svg?updatedAt=1776316749775`,        'f-webp,q-80,w-160') },
    { name: 'Vguard',      logo: ik(`${IK}/vguard-logo.jpg?updatedAt=1776316749672`,       'f-webp,q-80,w-160') },
];

// Gallery images — served from ImageKit CDN
const GALLERY_IMAGES = [
    ik('https://ik.imagekit.io/area24onestorage/story-set/2.1.svg?updatedAt=1776316798602',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/3.1.svg?updatedAt=1776316799238',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/3.3.svg?updatedAt=1776316799318',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/3.5.svg?updatedAt=1776316799402',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/4.1.svg?updatedAt=1776316799261',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/4.3.svg?updatedAt=1776316799329',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/5.2.svg?updatedAt=1776316799331',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/6.0.svg?updatedAt=1776316799277',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/7.2.svg?updatedAt=1776316799303',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/7.4.svg?updatedAt=1776316799207',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/8.2.svg?updatedAt=1776316799262',  'f-webp,q-80,w-224'),
    ik('https://ik.imagekit.io/area24onestorage/story-set/9.2.svg?updatedAt=1776316799449',  'f-webp,q-80,w-224'),
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

const ServiceCard = memo(({ service, index, onClick }: ServiceCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    };

    const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    };

    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.3)] hover:border-[#C7A14A]/45 hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-950/90 dark:hover:border-[#C7A14A]/45"
        >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A14A]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative overflow-hidden border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(199,161,74,0.18),_transparent_45%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(241,245,249,0.92))] px-5 pb-5 pt-4 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(199,161,74,0.18),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.98))]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-slate-500 uppercase shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 dark:text-slate-300">
                            <span className="text-[#C7A14A]">{service.step}</span>
                            Expertise
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 dark:bg-[#C7A14A] dark:text-slate-950">
                            {service.icon}
                        </div>
                    </div>

                    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-[20px] border border-white/70 bg-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-slate-800 dark:bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-slate-900/4 to-white/5 dark:from-slate-950/35 dark:via-slate-950/8 dark:to-white/5" />
                        <img
                            src={service.images[currentImageIndex]}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            className="relative z-10 h-full w-full object-cover transition-opacity duration-200 group-hover:scale-[1.04] transition-transform"
                        />

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
            </div>
        );
});

ServiceCard.displayName = 'ServiceCard';

// Skeleton that matches StoriesSection height/layout — prevents layout shift on lazy load
function StoriesSkeleton() {
    return (
        <section className="bg-zinc-50 py-16 dark:bg-black/20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10">
                    <div className="mb-3 h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-6 w-72 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[9/16] min-w-[180px] shrink-0 rounded-2xl bg-zinc-200 md:min-w-[220px] dark:bg-zinc-800"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Welcome({
    heroSlides = [],
    companyProfile,
    seo,
}: {
    heroSlides?: HeroSlide[];
    companyProfile?: CompanyProfile;
    seo: HomeSeo;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRenderModal, setShouldRenderModal] = useState(false);
    const [shouldLoadStories, setShouldLoadStories] = useState(false);
    const [shouldLoadContactWidget, setShouldLoadContactWidget] = useState(false);
    const [selectedService, setSelectedService] = useState<string>('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const storiesRef = useRef<HTMLDivElement>(null);

    const { auth } = usePage<{ auth: { user?: unknown } }>().props;

    const companyName = companyProfile?.name || 'Area24One';
    const companyUrl = companyProfile?.website || seo.canonical;
    const companyLogo = companyProfile?.logo_url || seo.image;
    const sameAs = [
        companyProfile?.instagram,
        companyProfile?.facebook,
        companyProfile?.linkedin,
    ].filter(Boolean);
    const schemaGraph = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: companyName,
            url: companyUrl,
            logo: companyLogo,
            image: seo.image,
            description: seo.description,
            email: companyProfile?.email || undefined,
            telephone: companyProfile?.phone?.[0] || undefined,
            sameAs: sameAs.length > 0 ? sameAs : undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: companyName,
            url: seo.canonical,
            description: seo.description,
            inLanguage: 'en-IN',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: seo.title,
            url: seo.canonical,
            description: seo.description,
            primaryImageOfPage: seo.image,
            about: [
                'Construction',
                'Interior Design',
                'Real Estate',
                'Land Development',
                'Event Management',
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.a,
                },
            })),
        },
    ];

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
            { rootMargin: '1200px 0px' }, // load well before user reaches it
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

    const openModal = useCallback((service = '') => {
        setSelectedService(service);
        setShouldRenderModal(true);
        setIsModalOpen(true);
    }, []);

    // Memoized services array to prevent unnecessary re-renders
    const services = useMemo(
        () => [
            {
                id: 'construction',
                icon: <Building2 className="h-6 w-6" />,
                logo: '/image/atha.png',
                images: [
                    'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/69483/pexels-photo-69483.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/27195983/pexels-photo-27195983.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
                    'https://images.pexels.com/photos/20285350/pexels-photo-20285350.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/20285351/pexels-photo-20285351.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/11701127/pexels-photo-11701127.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
                    'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/7937748/pexels-photo-7937748.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/8482871/pexels-photo-8482871.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/29726512/pexels-photo-29726512.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
                    'https://images.pexels.com/photos/392031/pexels-photo-392031.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/1579356/pexels-photo-1579356.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/2314021/pexels-photo-2314021.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/29141362/pexels-photo-29141362.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
                logo: ik('https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/stage%20365.png?updatedAt=1770815540783', 'f-webp,q-80,w-200'),
                images: [
                    'https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
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
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <link rel="canonical" href={seo.canonical} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:type" content={seo.type ?? 'website'} />
                <meta property="og:url" content={seo.canonical} />
                <meta property="og:image" content={seo.image} />
                <meta property="og:site_name" content={companyName} />
                <meta property="og:locale" content="en_IN" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.image} />
                <script type="application/ld+json">{JSON.stringify(schemaGraph)}</script>
            </Head>
            <div className="min-h-screen bg-brand-surface text-brand-text selection:bg-brand-primary selection:text-white dark:bg-brand-dark dark:text-slate-50">
                <HomeNavbar auth={auth as any} onConsultClick={() => openModal()} />

                {/* Hero Carousel */}
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
                            repeat={2}
                        >
                            {TRUST_ITEMS.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="flex items-center gap-4 px-6 md:gap-8 md:px-14">
                                        <div
                                            className={`flex h-14 w-auto items-center justify-center opacity-90 md:h-24 ${item.type === 'badge' ? 'text-white' : ''}`}
                                        >
                                            {item.type === 'badge' ? (
                                                <item.icon className="h-10 w-10 stroke-[1.5]" />
                                            ) : (
                                                <img
                                                    src={item.logoSrc}
                                                    className="h-16 w-auto opacity-80"
                                                    alt={item.logoAlt}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{ filter: 'brightness(0) invert(1)' }}
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

                {/* What We Do & Who It's For */}
                <section
                    id="what-we-do"
                    className="relative overflow-hidden border-y border-slate-100 bg-white py-14 md:py-16 dark:border-slate-800 dark:bg-brand-dark/50"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                            <div className="flex w-full flex-col justify-center lg:flex-1">
                                <div className="mb-8">
                                    <div className="mb-3 inline-flex items-center gap-2">
                                        <div className="h-px w-6 bg-[#C7A14A]" />
                                        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                            What we're building for you
                                        </span>
                                        <div className="h-px w-6 bg-[#C7A14A]" />
                                    </div>
                                    <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                        One conversation.{' '}
                                        <span className="text-[#C7A14A]">Five brands. Zero runaround.</span>
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                        Tell us once — vision, budget, timeline — we connect you to the right specialist.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {WHO_ITS_FOR_ITEMS.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <h3 className="text-sm font-bold text-brand-primary dark:text-white">
                                                {item.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Link
                                        href="/chat"
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-primary hover:text-white dark:border-[#C7A14A] dark:text-[#C7A14A] dark:hover:bg-[#C7A14A] dark:hover:text-white"
                                    >
                                        Start conversation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Video — poster prevents autoplay decode on scroll */}
                            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
                                <div className="relative h-auto w-72 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-900/10">
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className="h-auto w-full"
                                    >
                                        <source src="/video/section.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section
                    id="expertise"
                    className="relative overflow-hidden bg-zinc-50 py-10 md:py-12 section-offscreen dark:bg-black/20"
                >
                    {/* Decorative orbs — pointer-events-none, no blur on mobile */}
                    <div className="absolute top-0 right-0 -z-10 hidden h-[320px] w-[320px] rounded-full bg-brand-primary/5 blur-[80px] lg:block" />
                    <div className="absolute bottom-1/4 left-0 -z-10 hidden h-[240px] w-[240px] rounded-full bg-[#C7A14A]/5 blur-[60px] lg:block" />

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
                                        onClick={() => openModal(service.id)}
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
                                            onClick={() => openModal(service.id)}
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
                                    onClick={() => openModal()}
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
                <section className="relative overflow-hidden bg-[#0A1628] py-16 section-offscreen lg:py-20">
                    {/* Background Pattern — static, no animation */}
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

                        {/* Steps — no motion.div, no backdrop-blur */}
                        <div className="grid gap-6 md:grid-cols-3">
                            {JOURNEY_STEPS.map((item, i) => (
                                <div
                                    key={i}
                                    className="relative rounded-xl border border-slate-800 bg-slate-900 p-6"
                                >
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
                                                loading="lazy"
                                                decoding="async"
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

                                    {i < 2 && (
                                        <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-[#C7A14A]/30 md:block" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-10 text-center">
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#C7A14A] px-6 py-3 text-sm font-semibold text-[#0A1628] transition-all hover:bg-[#B89440]"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Start with AI Assistant
                                </Link>
                                <button
                                    onClick={() => openModal()}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-[#C7A14A]"
                                >
                                    Request Direct Consultation
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div ref={storiesRef} className="min-h-[520px]">
                    {shouldLoadStories ? (
                        <Suspense
                            fallback={
                                <StoriesSkeleton />
                            }
                        >
                            <LazyStoriesSection />
                        </Suspense>
                    ) : null}
                </div>

                {/* Auto Sliding Images Section */}
                <section className="relative overflow-hidden bg-zinc-50 py-12 section-offscreen dark:bg-black/20">
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
                                <span className="text-[#C7A14A]">in Motion</span>
                            </h2>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        {/* Fade masks */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-zinc-50 to-transparent dark:from-black/20" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-zinc-50 to-transparent dark:from-black/20" />

                        {/* Use the existing CSS marquee animation — no inline style tag */}
                        <Marquee
                            className="[--duration:80s] [--gap:1rem]"
                            pauseOnHover
                            repeat={2}
                        >
                            {GALLERY_IMAGES.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="h-48 w-56 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-zinc-900"
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        aria-hidden="true"
                                        width={224}
                                        height={192}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-contain p-2"
                                    />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </section>

                {/* The Area24One Strategic Framework - Fixed Background Image */}
                <section
                    id="process"
                    className="relative min-h-[600px] overflow-hidden section-offscreen"
                >
                    <img
                        src={ik('https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/pexels-ivan-s-8962803.jpg', 'f-webp,q-70,w-1400')}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
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
                                        <div
                                            key={i}
                                            className={`relative flex items-start gap-5 lg:grid lg:grid-cols-2 lg:gap-8 ${phase.align === 'right' ? 'lg:text-right' : ''}`}
                                        >
                                            {/* Node */}
                                            <div
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C7A14A] bg-[#0A1628] lg:absolute lg:left-1/2 lg:-translate-x-1/2 ${phase.align === 'right' ? 'lg:order-2' : ''}`}
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
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Compact CTA */}
                            <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 lg:flex-row lg:justify-between">
                                <p className="text-xs text-slate-400">
                                    Framework by{' '}
                                    <span className="text-[#C7A14A]">
                                        ArunAR
                                    </span>
                                </p>

                                <button
                                    onClick={() => openModal()}
                                    className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#C7A14A]"
                                >
                                    Request Strategic Review
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Materials & brands we use — Clean Marquee */}
                <section
                    id="materials-brands"
                    className="relative overflow-hidden bg-white py-16 section-offscreen dark:bg-white"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-10 text-center">
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
                        </div>

                        {/* Clean Marquee */}
                        <div className="relative overflow-hidden">
                            <Marquee
                                className="py-4 [--duration:50s] [--gap:0px]"
                                pauseOnHover
                                repeat={3}
                            >
                                {MARQUEE_BRANDS.map((brand, i) => (
                                    <MarqueeBrandCard
                                        key={i}
                                        brand={brand}
                                    />
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </section>

                {/* Founder-Led Elite Advisory - Clean Modern Design */}
                <section
                    id="why-us"
                    className="relative overflow-hidden bg-[#0A1628]"
                >
                    <img
                        src={ik('https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/pexels-ivan-s-8962803.jpg', 'f-webp,q-70,w-1400')}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover opacity-20"
                    />

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
                                    <div
                                        key={i}
                                        className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-6 transition-all duration-300 hover:border-[#C7A14A]/30 hover:bg-slate-900/50"
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
                                    </div>
                                ))}
                            </div>

                            {/* Authority Metrics */}
                            <div className="mt-8 flex flex-wrap justify-center gap-8 border-y border-slate-800/50 py-6 lg:gap-12">
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
                            </div>

                            {/* Compact Quote */}
                            <div className="mt-10 text-center">
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
                            </div>
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
                    className="relative overflow-hidden bg-slate-50 py-16 section-offscreen dark:bg-[#0A0F1C]"
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
                            {FAQ_ITEMS.map((item, i) => (
                                <div
                                    key={i}
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
                                </div>
                            ))}
                        </div>

                        {/* Compact CTA */}
                        <div className="mt-8 text-center">
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
                        </div>
                    </div>
                </section>

                {/* One Platform CTA */}
                <section className="relative overflow-hidden bg-white py-16 section-offscreen dark:bg-[#0A1628] lg:py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
                            <div className="mb-4 inline-flex items-center gap-2">
                                <div className="h-px w-6 bg-[#C7A14A]" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                    One platform. Five experts. Better outcomes.
                                </span>
                                <div className="h-px w-6 bg-[#C7A14A]" />
                            </div>

                            <h2 className="mb-3 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Clarity before commitment.
                                <br />
                                <span className="text-[#C7A14A]">
                                    The right expert, the right decision.
                                </span>
                            </h2>

                            <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                One conversation connects you to construction,
                                interiors, real estate, development, or events.
                                Compare options and move forward with
                                confidence.
                            </p>

                            <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
                                {[
                                    { icon: TrendingUp, text: 'Informed decisions' },
                                    { icon: Zap, text: 'Time & cost saved' },
                                    { icon: ShieldCheck, text: 'Trusted partners' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <item.icon className="h-3.5 w-3.5 text-[#C7A14A]" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#0A1628] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0A1628]/90 hover:shadow-lg dark:bg-[#C7A14A] dark:text-[#0A1628]"
                                >
                                    Get clarity now
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <button
                                    onClick={() => openModal()}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#C7A14A] dark:text-slate-400"
                                >
                                    Talk to an expert
                                </button>
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
