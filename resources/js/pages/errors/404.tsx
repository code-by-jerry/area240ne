import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home, MessageSquare } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Head>
                <title>Page Not Found | Area24One</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-brand-dark">
                <div className="mb-6 text-8xl font-black tracking-tighter text-slate-100 dark:text-slate-800 select-none">
                    404
                </div>

                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                    Page not found
                </h1>
                <p className="mb-8 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary/90"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:border-brand-primary hover:text-brand-primary dark:border-slate-700 dark:text-slate-300"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Chat with us
                    </Link>
                </div>

                <Link
                    href="/blogs"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-primary"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Browse our blogs
                </Link>
            </div>
        </>
    );
}
