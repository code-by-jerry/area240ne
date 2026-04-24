import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, MessageSquare, Phone } from 'lucide-react';

interface ServiceData {
    title: string;
    description: string;
    keywords: string;
    h1: string;
    service: string;
    brand: string;
    location: string;
    city_slug: string;
}

interface Seo {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    image: string;
    type: string;
}

interface Props {
    slug: string;
    service: ServiceData;
    seo: Seo;
}

const SERVICE_CONTENT: Record<string, {
    intro: string;
    points: string[];
    cta: string;
    phone: string;
}> = {
    Construction: {
        intro: 'Atha Construction delivers high-quality residential and commercial construction projects with precision engineering, transparent timelines, and turnkey execution.',
        points: [
            'Residential villas, apartments, and independent houses',
            'Commercial offices, retail spaces, and warehouses',
            'Renovation, restoration, and fit-out projects',
            'Sustainable and eco-friendly construction methods',
            'Transparent cost breakdowns and milestone-based billing',
        ],
        cta: 'Get a free construction consultation',
        phone: '+91 9916047222',
    },
    Interiors: {
        intro: 'Nesthetix Designs creates bespoke luxury interiors that blend functionality with aesthetics — from concept to handover, every detail is crafted to your lifestyle.',
        points: [
            'Residential home and villa interiors',
            'Office and commercial space design',
            'Modular kitchens and wardrobes',
            'Hospitality and retail interior design',
            'Full project management from design to execution',
        ],
        cta: 'Book a free design consultation',
        phone: '+91 9916047222',
    },
    'Real Estate': {
        intro: 'Area24 Realty provides expert property consultancy — helping buyers, sellers, and investors make informed decisions with data-driven market insights.',
        points: [
            'Residential and commercial property buying',
            'Property selling and valuation services',
            'Rental and lease consultation',
            'Investment portfolio advisory',
            'Legal documentation and registration support',
        ],
        cta: 'Talk to a property consultant',
        phone: '+91 9916047222',
    },
    'Land Development': {
        intro: 'Area24 Developers specialises in strategic land development — from feasibility assessment to execution, we build sustainable communities and commercial complexes.',
        points: [
            'Residential plotted developments',
            'Commercial and mixed-use complexes',
            'Agricultural and industrial land projects',
            'Land acquisition and feasibility studies',
            'Township planning and infrastructure development',
        ],
        cta: 'Discuss your land project',
        phone: '+91 9916047222',
    },
    Events: {
        intro: 'Stage365 produces extraordinary events — from intimate weddings to large-scale corporate conferences and brand activations across Karnataka.',
        points: [
            'Wedding planning and execution',
            'Corporate events and conferences',
            'Product launches and brand activations',
            'Cultural and social events',
            'End-to-end logistics and vendor management',
        ],
        cta: 'Plan your event with us',
        phone: '+91 9916047222',
    },
};

export default function ServiceLanding({ slug, service, seo }: Props) {
    const content = SERVICE_CONTENT[service.service] ?? SERVICE_CONTENT['Construction'];
    const areaServedType = service.location === 'Karnataka' ? 'AdministrativeArea' : 'City';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.h1,
        description: seo.description,
        provider: {
            '@type': 'Organization',
            name: service.brand,
            url: 'https://area24one.com',
            telephone: content.phone,
        },
        areaServed: {
            '@type': areaServedType,
            name: service.location,
        },
        url: seo.canonical,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://area24one.com/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://area24one.com/#expertise' },
            { '@type': 'ListItem', position: 3, name: service.h1, item: seo.canonical },
        ],
    };

    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords} />
                <link rel="canonical" href={seo.canonical} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:url" content={seo.canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={seo.image} />
                <meta property="og:site_name" content="Area24One" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.image} />
                <meta name="robots" content="index, follow" />
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Head>

            <div className="min-h-screen bg-white dark:bg-brand-dark">
                {/* Simple nav */}
                <nav className="border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-brand-dark">
                    <div className="mx-auto flex max-w-5xl items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/image/main logo.png" alt="Area24One" className="h-10 w-10 object-contain" />
                            <span className="text-sm font-bold text-brand-primary dark:text-white">Area24One</span>
                        </Link>
                        <Link href="/chat" className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90">
                            <MessageSquare className="h-4 w-4" />
                            Start Consultation
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <section className="bg-brand-primary px-6 py-16 text-white">
                    <div className="mx-auto max-w-5xl">
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/" className="hover:text-white">Home</Link></li>
                                <li>/</li>
                                <li><Link href="/#expertise" className="hover:text-white">Services</Link></li>
                                <li>/</li>
                                <li className="text-white">{service.h1}</li>
                            </ol>
                        </nav>

                        <p className="mb-2 text-sm font-semibold tracking-widest text-[#C7A14A] uppercase">
                            {service.brand} · {service.location}
                        </p>
                        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            {service.h1}
                        </h1>
                        <p className="max-w-2xl text-lg text-white/80">
                            {content.intro}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-2 rounded-full bg-[#C7A14A] px-6 py-3 text-sm font-semibold text-[#0A1628] hover:bg-[#B89440]"
                            >
                                {content.cta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href={`tel:${content.phone.replace(/\s/g, '')}`}
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                            >
                                <Phone className="h-4 w-4" />
                                {content.phone}
                            </a>
                        </div>
                    </div>
                </section>

                {/* What we offer */}
                <section className="px-6 py-16">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            What We Offer in {service.location}
                        </h2>
                        <ul className="grid gap-4 sm:grid-cols-2">
                            {content.points.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C7A14A]" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Why Area24One */}
                <section className="bg-slate-50 px-6 py-16 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                            Why Choose Area24One for {service.service} in {service.location}?
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {[
                                { title: 'Free Consultation', desc: 'No commitment required. Talk to an expert before you decide.' },
                                { title: 'Verified Specialists', desc: `${service.brand} — trusted by 500+ clients across Karnataka.` },
                                { title: 'One Platform', desc: 'Construction, interiors, real estate, events — all under one roof.' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                                    <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-16 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                            Ready to get started in {service.location}?
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            Chat with our AI consultant or call us directly. Free consultation, no obligation.
                        </p>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-primary/90"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Start Free Consultation
                            </Link>
                            <a
                                href={`tel:${content.phone.replace(/\s/g, '')}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-primary dark:text-slate-400"
                            >
                                <Phone className="h-4 w-4" />
                                {content.phone}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
                    <Link href="/" className="hover:text-brand-primary">← Back to Area24One</Link>
                    <span className="mx-3">·</span>
                    <span>© 2025 Area24One. All rights reserved.</span>
                </footer>
            </div>
        </>
    );
}
