import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Sparkles, Home, Building2, PaintBucket, Hammer, MessageSquare, Menu, X, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type SharedData } from '@/types';

export default function Welcome({ canLogin = true, canRegister = true }: { canLogin?: boolean, canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        {
            id: 'construction',
            icon: <Building2 className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />,
            title: 'Smart Construction',
            desc: 'Turnkey construction with real-time tracking and fixed pricing.',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'interiors',
            icon: <PaintBucket className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />,
            title: 'AI-Driven Interiors',
            desc: 'Personalized designs generated to match your style and budget.',
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'real-estate',
            icon: <Home className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />,
            title: 'Verified Real Estate',
            desc: 'Find verified plots and properties with zero brokerage options.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    return (
        <>
            <Head title="Future of Living" />
            <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-100 selection:text-blue-900 dark:bg-[#050505] dark:text-zinc-50 font-sans">

                {/* Navbar */}
                <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-black/80 dark:border-zinc-800' : 'bg-transparent'}`}>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-zinc-200">
                                    <img
                                        src="/image/Area 24 one logo black.png"
                                        alt="Area 24 One"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
                                    Area 24 <span className="font-medium text-zinc-500">one</span>
                                </span>
                            </div>

                            {/* Desktop Nav */}
                            <div className="hidden items-center gap-8 md:flex">
                                <a href="#services" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Services</a>
                                <a href="#works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Works</a>
                                <a href="#reviews" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Reviews</a>

                                {auth.user ? (
                                    <Link href="/dashboard" className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 border-l border-zinc-200 pl-8 dark:border-zinc-800">
                                        {canLogin && (
                                            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                Log in
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link href="/register" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                                                Get Started
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Toggle */}
                            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="absolute inset-x-0 top-16 border-b border-zinc-200 bg-white p-6 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="flex flex-col gap-4">
                                <a href="#services" className="text-base font-medium">Services</a>
                                <a href="#works" className="text-base font-medium">Works</a>
                                {auth.user ? (
                                    <Link href="/dashboard" className="font-semibold text-blue-600">Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="font-semibold">Log in</Link>
                                        <Link href="/register" className="font-semibold text-blue-600">Create Account</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                    <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-800 mb-8 dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300">
                            <Sparkles className="mr-2 h-4 w-4" /> AI-Powered Construction & Design
                        </div>
                        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl dark:text-white">
                            Build Your Dream Space <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 dark:from-white dark:via-zinc-200 dark:to-zinc-500">With Intelligence</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                            Area24One combines advanced AI with expert execution to simplify Real Estate, Construction, and Interior Design. Experience clarity like never before.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/chat" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-900 px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-zinc-800 hover:ring-4 hover:ring-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:hover:ring-zinc-800">
                                <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                                Start AI Chat
                                <ChevronRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a href="#works" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-400">
                                View Our Work <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Abstract Background Glow */}
                    <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px] dark:bg-blue-500/10" />
                </section>

                {/* Services Grid */}
                <section id="services" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Our Expertise</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">Everything you need to build.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {services.map((service) => (
                                <div key={service.id} className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-zinc-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-zinc-900 dark:shadow-none dark:ring-1 dark:ring-zinc-800">
                                    <div className="h-48 overflow-hidden">
                                        <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{service.title}</h3>
                                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modern Footer CTA */}
                <section className="relative isolate overflow-hidden bg-zinc-900 px-6 py-24 sm:py-32 lg:px-8 dark:bg-black">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start your journey?</h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
                            Our AI assistant is ready to help you plan your budget, find land, or design your interiors immediately.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/chat" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                Talk to Assistant
                            </Link>
                        </div>
                    </div>
                    <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
                        <circle cx="512" cy="512" r="512" fill="url(#blue-grad)" fillOpacity="0.7" />
                        <defs>
                            <radialGradient id="blue-grad">
                                <stop stopColor="#2563eb" />
                                <stop offset="1" stopColor="#2563eb" />
                            </radialGradient>
                        </defs>
                    </svg>
                </section>

                <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-0.5 shadow-sm ring-1 ring-zinc-200">
                                <img src="/image/Area 24 one logo black.png" alt="" className="h-full w-full object-contain" />
                            </div>
                            <span className="font-bold tracking-tighter uppercase text-sm">Area 24 <span className="font-medium text-zinc-500">one</span></span>
                        </div>
                        <p className="text-xs text-zinc-500">© 2025 Area24One. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
