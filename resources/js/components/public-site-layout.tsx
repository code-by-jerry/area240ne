import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calculator, HelpCircle, Layers, Menu, MessageSquare, ShieldCheck, Star, X, Zap } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

const NAV_ITEMS = [
    { label: 'Services', href: '/#what-we-do', icon: Layers },
    { label: 'Expertise', href: '/#expertise', icon: ShieldCheck },
    { label: 'Process', href: '/#process', icon: Zap },
    { label: 'Why Us', href: '/#why-us', icon: Star },
    { label: 'Blogs', href: '/blogs', icon: BookOpen },
    { label: 'FAQ', href: '/#faq', icon: HelpCircle },
] as const;

type AuthShape = {
    user?: unknown;
};

export function PublicSiteLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: AuthShape }>().props;

    return (
        <div className="font-inter min-h-screen bg-brand-surface text-brand-text selection:bg-brand-primary selection:text-white dark:bg-brand-dark dark:text-slate-50">
            <nav className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/78 py-1.5 backdrop-blur-xl dark:border-slate-800 dark:bg-brand-dark/78">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-3">
                        <Link href="/" className="group flex cursor-pointer items-center gap-2 md:gap-3">
                            <div className="flex h-12 w-12 items-center justify-center p-0 transition-transform duration-300 group-hover:scale-[1.02] md:h-14 md:w-14">
                                <img
                                    src="/image/main logo.png"
                                    alt="Area24One"
                                    className="hidden h-full w-full object-contain md:block"
                                />
                                <img
                                    src="/image/main logo (white).png"
                                    alt="Area24One"
                                    className="h-full w-full object-contain md:hidden"
                                />
                            </div>
                        </Link>

                        <div className="hidden items-center gap-px md:flex">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                    <span>{item.label}</span>
                                </a>
                            ))}

                            <div className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-700" />

                            <Link
                                href="/cost-estimator"
                                className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <Calculator className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                <span>Estimate</span>
                            </Link>

                            <div className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-700" />

                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-brand-primary px-3 py-1 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-primary/90"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        href="/login"
                                        className="rounded-lg px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/chat"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#C7A14A] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        <span>Consult</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:hidden">
                            <Link href="/chat" className="inline-flex h-8 items-center justify-center rounded-full bg-brand-primary px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#C7A14A] dark:bg-white dark:text-brand-primary dark:hover:bg-[#C7A14A] dark:hover:text-white">
                                Start
                            </Link>
                            <button
                                aria-label="Toggle menu"
                                className="rounded-lg p-2 text-brand-primary transition-colors hover:bg-slate-100/70 dark:text-white dark:hover:bg-slate-100/10"
                                onClick={() => setMobileMenuOpen((open) => !open)}
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

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

                            {auth?.user ? (
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
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>Sign In</span>
                                    </Link>
                                    <Link
                                        href="/chat"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#C7A14A]"
                                        onClick={() => setMobileMenuOpen(false)}
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

            <main className="pt-16 md:pt-18">{children}</main>

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
                                Area 24 <span className="text-slate-500">one</span>
                            </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                            © 2025 Area24One. All rights reserved. Designed for Premium Consultation.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="#"
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-black dark:hover:text-white"
                            >
                                Privacy
                            </a>
                            <a
                                href="#"
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-black dark:hover:text-white"
                            >
                                Terms
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
