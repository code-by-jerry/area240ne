import { Head, Link } from '@inertiajs/react';
import { PublicSiteLayout } from '@/components/public-site-layout';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    featured_image_url?: string | null;
    author_name?: string | null;
    published_at?: string | null;
}

interface SeoProps {
    title: string;
    description: string;
    canonical?: string | null;
    image?: string | null;
    type?: string | null;
    twitter_card?: string | null;
}

export default function BlogsIndex({
    featuredBlog,
    blogs,
    seo,
}: {
    featuredBlog?: Blog | null;
    blogs: Blog[];
    seo: SeoProps;
}) {
    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                {seo.canonical && <link rel="canonical" href={seo.canonical} />}
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:type" content={seo.type ?? 'website'} />
                {seo.canonical && <meta property="og:url" content={seo.canonical} />}
                {seo.image && <meta property="og:image" content={seo.image} />}
                <meta property="og:site_name" content="Area24One" />
                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                {seo.image && <meta name="twitter:image" content={seo.image} />}
            </Head>

            <PublicSiteLayout>
            <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_24%,#f8fafc_100%)] text-slate-900">
                <section className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
                    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#C7A14A] transition hover:text-[#b38d34]">
                            Back to Home
                        </Link>
                        <div className="mt-5 max-w-3xl">
                            <span className="inline-flex rounded-full border border-[#C7A14A]/30 bg-[#C7A14A]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#C7A14A]">
                                Area24One Journal
                            </span>
                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                                Ideas, guidance, and stories from the world of property.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Explore practical insights on construction, interiors, real estate, land development, and event spaces through a cleaner, easier reading experience.
                            </p>
                        </div>
                    </div>
                </section>

                <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
                    {featuredBlog && (
                        <Link
                            href={`/blogs/${featuredBlog.slug}`}
                            className="group mb-12 block overflow-hidden rounded-[2rem] border border-[#C7A14A]/20 bg-white shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_-45px_rgba(15,23,42,0.45)]"
                        >
                            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                                <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                                    <div>
                                        <span className="inline-flex rounded-full bg-[#C7A14A] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">
                                            Featured Article
                                        </span>
                                        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                            {featuredBlog.title}
                                        </h2>
                                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                                            {featuredBlog.excerpt}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500">
                                        <span>
                                            {featuredBlog.author_name || 'Area24One'}
                                            {featuredBlog.published_at ? ` · ${new Date(featuredBlog.published_at).toLocaleDateString()}` : ''}
                                        </span>
                                        <span className="font-medium text-slate-900 transition group-hover:text-[#C7A14A]">
                                            Read article
                                        </span>
                                    </div>
                                </div>

                                <div className="min-h-[280px] bg-slate-200 lg:min-h-full">
                                    {featuredBlog.featured_image_url ? (
                                        <img src={featuredBlog.featured_image_url} alt={featuredBlog.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8e7b7,transparent_45%),linear-gradient(135deg,#111827,#334155)] text-sm uppercase tracking-[0.3em] text-white/70">
                                            Area24One
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

                    {!featuredBlog && blogs.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-8 py-16 text-center shadow-sm">
                            <div className="mx-auto max-w-2xl">
                                <span className="inline-flex rounded-full border border-[#C7A14A]/30 bg-[#C7A14A]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A14A]">
                                    Coming Soon
                                </span>
                                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                                    No published articles are live yet.
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    Blog posts appear here once they are marked as both active and published in the admin panel.
                                </p>
                                <div className="mt-8">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/blogs/${blog.slug}`}
                                    className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)]"
                                >
                                    <div className="h-52 bg-slate-200">
                                        {blog.featured_image_url ? (
                                            <img src={blog.featured_image_url} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8e7b7,transparent_40%),linear-gradient(135deg,#0f172a,#334155)] text-xs uppercase tracking-[0.3em] text-white/70">
                                                Area24One
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                            {blog.author_name || 'Area24One'}
                                            {blog.published_at ? ` · ${new Date(blog.published_at).toLocaleDateString()}` : ''}
                                        </div>
                                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                                            {blog.title}
                                        </h3>
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                            {blog.excerpt}
                                        </p>
                                        <div className="mt-5 text-sm font-medium text-[#C7A14A] transition group-hover:text-[#b38d34]">
                                            Continue reading
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            </PublicSiteLayout>
        </>
    );
}
