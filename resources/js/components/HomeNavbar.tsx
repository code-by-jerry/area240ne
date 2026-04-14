import { Link, router } from '@inertiajs/react';
import { BookOpen, HelpCircle, Layers, Menu, ShieldCheck, Star, X, Zap } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
    { label: 'Services', href: '#what-we-do', icon: Layers },
    { label: 'Expertise', href: '#expertise', icon: ShieldCheck },
    { label: 'Process', href: '#process', icon: Zap },
    { label: 'Why Us', href: '#why-us', icon: Star },
    { label: 'Blogs', href: '/blogs', icon: BookOpen },
    { label: 'FAQ', href: '#faq', icon: HelpCircle },
] as const;

interface HomeNavbarProps {
    auth: { user?: any };
    onConsultClick: () => void;
}

export const HomeNavbar = memo(function HomeNavbar({ auth, onConsultClick }: HomeNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastY = useRef(0);
    const rafId = useRef<number>(0);

    useEffect(() => {
        const onScroll = () => {
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                const y = window.scrollY;
                setScrolled(y > 20);
                setVisible(y < lastY.current || y < 50);
                lastY.current = y;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full border-b transition-transform duration-300 ${
                visible ? 'translate-y-0' : '-translate-y-full'
            } ${
                scrolled
                    ? 'border-slate-200 bg-white/90 py-1.5 backdrop-blur-md dark:border-slate-800 dark:bg-brand-dark/90'
                    : 'border-transparent bg-black/40 py-2 backdrop-blur-sm'
            }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
                            <img
                                src={scrolled ? '/image/main logo.png' : '/image/main logo (white).png'}
                                alt="Area24One"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                                    scrolled
                                        ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                                        : 'text-white/80 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className={`hidden rounded-full px-4 py-1.5 text-sm font-semibold transition-colors md:inline-flex ${
                                    scrolled
                                        ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={onConsultClick}
                                className={`hidden rounded-full px-4 py-1.5 text-sm font-semibold transition-colors md:inline-flex ${
                                    scrolled
                                        ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                Consult
                            </button>
                        )}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="rounded-md p-2 text-white md:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute top-0 right-0 h-full w-72 bg-white p-6 shadow-xl dark:bg-brand-dark">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="font-bold text-brand-primary dark:text-white">Menu</span>
                            <button onClick={() => setMobileOpen(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <item.icon className="h-4 w-4 text-[#C7A14A]" />
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-4 border-t pt-4 dark:border-slate-700">
                                {auth.user ? (
                                    <>
                                        <Link href="/dashboard" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200">
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => router.post('/logout')}
                                            className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200">
                                            Login
                                        </Link>
                                        <button
                                            onClick={() => { setMobileOpen(false); onConsultClick(); }}
                                            className="mt-2 w-full rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
                                        >
                                            Start Consultation
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
});
