import { Head, Link } from '@inertiajs/react';
import { PublicSiteLayout } from '@/components/public-site-layout';
import { ArrowRight, ExternalLink, Globe, Instagram, Linkedin } from 'lucide-react';

const TIMELINE = [
    {
        year: '2025',
        title: 'The Rise of Nesthetix Designs LLP',
        detail: 'Rebranded and expanded the interior design division into Nesthetix Designs LLP, focusing exclusively on bespoke luxury interiors and architectural enhancements. This transformation allowed Nesthetix Designs to establish itself as a premier provider of customized, high-end interior solutions. The company introduced cutting-edge design techniques, blending modern aesthetics with functionality to cater to elite clientele.',
    },
    {
        year: '2024',
        title: 'The Birth of Atha Construction Pvt. Ltd.',
        detail: 'Spun off the construction division into Atha Construction Pvt. Ltd., dedicated to high-quality and sustainable building solutions. Atha Construction incorporated state-of-the-art technologies and sustainable materials to meet modern-day infrastructure requirements, quickly positioning itself as an industry leader in residential and commercial developments.',
    },
    {
        year: '2023',
        title: 'Corporate Evolution & Growth',
        detail: 'Established Area24 Developers Pvt. Ltd. and Stagecstatic365 Media House LLP, transforming real estate and event media sectors. This milestone represented a shift towards corporate expansion and diversification, enabling the brands to gain investor confidence and secure larger contracts.',
    },
    {
        year: '2020',
        title: 'Structuring Real Estate into a Proprietorship',
        detail: 'Formalized Area24 Realty as a Proprietorship to enhance operational efficiency, market reach, and customer trust. Area24 Realty expanded its services, offering end-to-end real estate solutions from property consultation to asset management.',
    },
    {
        year: '2018',
        title: 'Venturing into Luxury Interior Design',
        detail: 'Expanded into high-end interior design to create personalized, sophisticated spaces, laying the foundation for Nesthetix Designs LLP. By integrating contemporary trends with timeless elegance, the company developed a signature design philosophy spanning luxury residences, commercial spaces, and hospitality projects.',
    },
    {
        year: '2016',
        title: 'Expansion into Property Development & Management',
        detail: 'Area24 Realty evolved into a full-fledged real estate solutions provider, diversifying into property management, sales, construction, and development. The integration of construction services allowed seamless project execution, ensuring quality and timely delivery.',
    },
    {
        year: '2010',
        title: 'The Foundation of a Vision',
        detail: 'Launched The Stage 365 and established Area24 Realty, marking the beginning of real estate consulting and premium property solutions. From the outset, innovation and integrity were the guiding principles, helping both brands achieve remarkable milestones.',
    },
];

const SUBSIDIARIES = [
    {
        name: 'Atha Construction Pvt. Ltd.',
        role: 'Construction & Engineering',
        founded: '2024',
        url: 'https://athaconstruction.in/',
        desc: 'High-quality residential and commercial construction with sustainable building practices.',
    },
    {
        name: 'Nesthetix Designs LLP',
        role: 'Luxury Interior Design',
        founded: '2025',
        url: 'https://nesthetixdesigns.com/',
        desc: 'Bespoke luxury interiors for residences, offices, and hospitality spaces.',
    },
    {
        name: 'Area24 Realty',
        role: 'Real Estate Consultancy',
        founded: '2016',
        url: 'https://area24developers.com/',
        desc: 'Premium real estate solutions — buying, selling, investment, and property management.',
    },
    {
        name: 'Area24 Developers Pvt. Ltd.',
        role: 'Land & Property Development',
        founded: '2023',
        url: 'https://area24developers.com/',
        desc: 'Large-scale residential and commercial development projects across Karnataka.',
    },
    {
        name: 'Stage365',
        role: 'Event Management',
        founded: '2010',
        url: 'https://thestage365.com/',
        desc: 'Corporate events, weddings, product launches, and brand activations.',
    },
];

export default function CeoProfile() {
    const canonicalUrl = 'https://area24one.com/about/ceo';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'AARUN',
        givenName: 'AARUN',
        jobTitle: 'Founder & CEO',
        image: 'https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/avatar.webp',
        description: 'Indian entrepreneur and Founder & CEO of Area24One — a multi-industry group spanning construction, interior design, real estate, land development, and event management across Karnataka, India. Entrepreneur since 2010.',
        url: canonicalUrl,
        sameAs: [
            'https://arunar.in/',
            'https://www.linkedin.com/in/arunar',
            'https://www.instagram.com/arunar.in/',
            'https://area24one.com/about/ceo',
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'Area24One',
            url: 'https://area24one.com',
        },
        owns: SUBSIDIARIES.map(s => ({
            '@type': 'Organization',
            name: s.name,
            url: s.url,
        })),
        knowsAbout: [
            'Real Estate', 'Construction', 'Interior Design',
            'Event Management', 'Land Development', 'Entrepreneurship',
            'Property Development', 'Corporate Strategy',
        ],
        hasOccupation: {
            '@type': 'Occupation',
            name: 'Entrepreneur',
            occupationLocation: { '@type': 'City', name: 'Bangalore' },
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        nationality: { '@type': 'Country', name: 'India' },
    };

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Area24One',
        alternateName: 'Area 24 One',
        url: 'https://area24one.com',
        logo: 'https://area24one.com/image/main%20logo.png',
        founder: { '@type': 'Person', name: 'AARUN', url: canonicalUrl },
        foundingDate: '2010',
        foundingLocation: { '@type': 'City', name: 'Bangalore' },
        description: 'Area24One is a multi-industry group founded by AARUN, with subsidiaries in construction, interior design, real estate, land development, and event management across Karnataka, India.',
        areaServed: [
            { '@type': 'City', name: 'Bangalore' },
            { '@type': 'City', name: 'Mysore' },
            { '@type': 'City', name: 'Ballari' },
            { '@type': 'State', name: 'Karnataka' },
        ],
        numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 50 },
        subOrganization: SUBSIDIARIES.map(s => ({
            '@type': 'Organization',
            name: s.name,
            url: s.url,
            foundingDate: s.founded,
            founder: { '@type': 'Person', name: 'AARUN' },
        })),
        sameAs: [
            'https://www.instagram.com/area24properties/',
            'https://www.facebook.com/wearearea24/',
            'https://in.linkedin.com/company/area24',
        ],
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://area24one.com/' },
            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://area24one.com/about' },
            { '@type': 'ListItem', position: 3, name: 'CEO — AARUN', item: canonicalUrl },
        ],
    };

    return (
        <>
            <Head>
                <title>AARUN — Founder & CEO of Area24One | Entrepreneur Karnataka</title>
                <meta name="description" content="AARUN is the Founder & CEO of Area24One and its subsidiaries — Atha Construction, Nesthetix Designs, Area24 Realty, Area24 Developers, and Stage365. Entrepreneur based in Bangalore, Karnataka since 2010." />
                <meta name="keywords" content="AARUN, AARUN CEO, AARUN entrepreneur, AARUN Area24One, AARUN Bangalore, Area24One CEO, founder Area24One, Atha Construction CEO, Nesthetix Designs founder, Area24 Realty founder, Stage365 founder, entrepreneur Karnataka, real estate entrepreneur Bangalore" />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content="AARUN — Founder & CEO of Area24One" />
                <meta property="og:description" content="AARUN is the Founder & CEO of Area24One — a multi-industry group with subsidiaries in construction, interiors, real estate, development, and events across Karnataka." />
                <meta property="og:type" content="profile" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content="https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/avatar.webp" />
                <meta property="og:image:alt" content="AARUN — Founder & CEO of Area24One" />
                <meta property="og:site_name" content="Area24One" />
                <meta property="profile:first_name" content="AARUN" />
                <meta property="article:modified_time" content="2025-04-01T00:00:00+05:30" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AARUN — Founder & CEO of Area24One" />
                <meta name="twitter:description" content="Entrepreneur and founder of Area24One Group — construction, interiors, real estate, development, and events across Karnataka since 2010." />
                <meta name="twitter:image" content="https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/avatar.webp" />
                <meta name="twitter:image:alt" content="AARUN — Founder & CEO of Area24One" />
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Head>

            <PublicSiteLayout>
                <div className="min-h-screen bg-white dark:bg-brand-dark">

                    {/* ── HERO ─────────────────────────────────────────── */}
                    <section className="bg-[#0A1628] pb-0 pt-16 lg:pt-24">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">

                            {/* Breadcrumb */}
                            <nav aria-label="Breadcrumb" className="mb-12 text-xs text-white/40">
                                <ol className="flex items-center gap-2">
                                    <li><Link href="/" className="hover:text-white/70 transition-colors">Home</Link></li>
                                    <li className="text-white/20">/</li>
                                    <li><Link href="/about" className="hover:text-white/70 transition-colors">About</Link></li>
                                    <li className="text-white/20">/</li>
                                    <li className="text-white/60">AARUN</li>
                                </ol>
                            </nav>

                            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">

                                {/* Left — Avatar + quick facts */}
                                <div className="shrink-0 lg:w-64">
                                    {/* Avatar */}
                                    <div className="mb-6 h-48 w-48 overflow-hidden rounded-3xl border border-white/10 lg:h-56 lg:w-56">
                                        <img
                                            src="https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/avatar.webp"
                                            alt="AARUN — Founder & CEO of Area24One"
                                            loading="eager"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Social links */}
                                    <div className="flex gap-3">
                                        {[
                                            { href: 'https://arunar.in/', icon: Globe, label: 'Website' },
                                            { href: 'https://www.linkedin.com/in/arunar', icon: Linkedin, label: 'LinkedIn' },
                                            { href: 'https://www.instagram.com/arunar.in/', icon: Instagram, label: 'Instagram' },
                                        ].map(({ href, icon: Icon, label }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-[#C7A14A]/50 hover:text-[#C7A14A]"
                                            >
                                                <Icon className="h-4 w-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Right — Name + bio */}
                                <div className="flex-1 pb-16 lg:pb-24">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A14A]">
                                        Founder & CEO · Area24One
                                    </p>
                                    <h1 className="mb-4 text-5xl font-black tracking-tight text-white lg:text-6xl">
                                        AARUN
                                    </h1>
                                    <p className="mb-8 text-lg text-white/50">
                                        Entrepreneur · Bangalore, Karnataka · Since 2010
                                    </p>

                                    {/* Stats row */}
                                    <div className="mb-10 flex flex-wrap gap-8">
                                        {[
                                            { value: '15+', label: 'Years of experience' },
                                            { value: '5', label: 'Companies founded' },
                                            { value: '500+', label: 'Projects delivered' },
                                            { value: '3', label: 'Cities served' },
                                        ].map((s) => (
                                            <div key={s.label}>
                                                <p className="text-2xl font-black text-white">{s.value}</p>
                                                <p className="text-xs text-white/40">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="max-w-2xl text-base leading-8 text-white/70">
                                        <strong className="text-white">AARUN</strong> is an Indian entrepreneur and the Founder & CEO of <strong className="text-white">Area24One</strong> — a multi-industry group headquartered in Bangalore, Karnataka. Driven by a relentless passion for innovation, growth, and excellence, his journey began in 2010 with the establishment of The Stage 365, setting the foundation for a multi-industry legacy spanning real estate, construction, interior design, and event management.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── ABOUT ────────────────────────────────────────── */}
                    <section className="border-b border-slate-100 bg-white py-20 dark:border-slate-800 dark:bg-brand-dark">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A14A]">About</p>
                                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Building legacies that shape the future
                                    </h2>
                                    <p className="mb-5 text-base leading-8 text-slate-600 dark:text-slate-400">
                                        With over 16 years of entrepreneurial experience, AARUN has systematically expanded from event management into real estate consulting, property development, construction, and interior design — building a vertically integrated group that serves clients across the full property lifecycle.
                                    </p>
                                    <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
                                        From founding Area24 as a premium real estate solutions provider to evolving it into a fully integrated development and consulting firm, his ventures have consistently focused on quality, sustainability, and customer-centric solutions. AARUN is known for his strategic approach to corporate structuring — spinning off each business vertical into a dedicated entity to ensure focused execution and operational excellence.
                                    </p>
                                </div>

                                {/* Quick facts */}
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
                                    <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A14A]">Quick Facts</p>
                                    <div className="space-y-5">
                                        {[
                                            { label: 'Nationality', value: 'Indian' },
                                            { label: 'Based in', value: 'Bangalore, Karnataka' },
                                            { label: 'Occupation', value: 'Entrepreneur, CEO' },
                                            { label: 'Active since', value: '2010 – present' },
                                            { label: 'Known for', value: 'Area24One Group' },
                                            { label: 'Industries', value: 'Real Estate, Construction, Interiors, Events' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-start gap-4">
                                                <span className="w-28 shrink-0 text-sm font-medium text-slate-400 dark:text-slate-500">{item.label}</span>
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Online</p>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { href: 'https://arunar.in/', icon: Globe, label: 'arunar.in' },
                                                { href: 'https://www.linkedin.com/in/arunar', icon: Linkedin, label: 'LinkedIn Profile' },
                                                { href: 'https://www.instagram.com/arunar.in/', icon: Instagram, label: '@arunar.in' },
                                            ].map(({ href, icon: Icon, label }) => (
                                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline dark:text-[#C7A14A]">
                                                    <Icon className="h-4 w-4" /> {label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── SUBSIDIARIES ─────────────────────────────────── */}
                    <section className="bg-slate-50 py-20 dark:bg-slate-900/30">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A14A]">Portfolio</p>
                            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Companies & Subsidiaries
                            </h2>
                            <p className="mb-12 max-w-xl text-base text-slate-500 dark:text-slate-400">
                                Area24One Group operates through five specialised subsidiaries, each a leader in its domain across Karnataka.
                            </p>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {SUBSIDIARIES.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-[#C7A14A]/40 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#C7A14A]/40"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A14A]">{s.role}</p>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                                            </div>
                                            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-[#C7A14A] dark:text-slate-600" />
                                        </div>
                                        <p className="flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
                                        <p className="text-xs font-medium text-slate-400">Est. {s.founded}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── TIMELINE ─────────────────────────────────────── */}
                    <section className="border-b border-slate-100 bg-white py-20 dark:border-slate-800 dark:bg-brand-dark">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A14A]">Journey</p>
                            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Entrepreneurial Timeline
                            </h2>
                            <p className="mb-16 max-w-xl text-base text-slate-500 dark:text-slate-400">
                                A 15-year journey of building, expanding, and transforming industries across Karnataka.
                            </p>

                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />

                                <div className="space-y-12">
                                    {TIMELINE.map((item) => (
                                        <div key={item.year} className="relative flex gap-10">
                                            {/* Dot */}
                                            <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C7A14A] bg-white dark:bg-brand-dark">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#C7A14A]" />
                                            </div>

                                            <div className="flex-1 pb-2">
                                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                                    <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
                                                        {item.year}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                                </div>
                                                <p className="text-sm leading-8 text-slate-500 dark:text-slate-400">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── CTA ──────────────────────────────────────────── */}
                    <section className="bg-[#0A1628] py-20">
                        <div className="mx-auto max-w-3xl px-6 text-center">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A14A]">Get in touch</p>
                            <h2 className="mb-4 text-3xl font-bold text-white">
                                Work with Area24One
                            </h2>
                            <p className="mb-10 text-base text-white/50">
                                Connect with our team for construction, interiors, real estate, development, or events across Karnataka.
                            </p>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#C7A14A] px-8 py-3.5 text-sm font-semibold text-[#0A1628] hover:bg-[#B89440]"
                                >
                                    Start a Consultation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="https://arunar.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:border-white/40"
                                >
                                    <Globe className="h-4 w-4" />
                                    Visit arunar.in
                                </a>
                            </div>
                        </div>
                    </section>

                </div>
            </PublicSiteLayout>
        </>
    );
}

