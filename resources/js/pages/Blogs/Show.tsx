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
    keywords?: string | null;
    canonical?: string | null;
    image?: string | null;
    type?: string | null;
    twitter_card?: string | null;
    published_time?: string | null;
    modified_time?: string | null;
    breadcrumbs?: { name: string; url: string }[] | null;
}

export default function BlogShow({
    blog,
    relatedBlogs,
    seo,
}: {
    blog: Blog;
    relatedBlogs: Blog[];
    seo: SeoProps;
}) {
    const normalizedBlogContent = blog.content
        .replace(/<h1(\b[^>]*)>/gi, '<h2$1>')
        .replace(/<\/h1>/gi, '</h2>');

    const breadcrumbSchema = seo.breadcrumbs ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: seo.breadcrumbs.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    } : null;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: seo.description,
        image: seo.image ?? undefined,
        datePublished: seo.published_time ?? blog.published_at ?? undefined,
        dateModified: seo.modified_time ?? undefined,
        author: { '@type': 'Person', name: blog.author_name || 'Area24One' },
        publisher: {
            '@type': 'Organization',
            name: 'Area24One',
            url: 'https://area24one.com',
        },
        url: seo.canonical ?? undefined,
    };

    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                {seo.canonical && <link rel="canonical" href={seo.canonical} />}
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:type" content={seo.type ?? 'article'} />
                {seo.canonical && <meta property="og:url" content={seo.canonical} />}
                {seo.image && <meta property="og:image" content={seo.image} />}
                {seo.published_time && <meta property="article:published_time" content={seo.published_time} />}
                {seo.modified_time && <meta property="article:modified_time" content={seo.modified_time} />}
                <meta name="twitter:card" content={seo.twitter_card ?? 'summary_large_image'} />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                {seo.image && <meta name="twitter:image" content={seo.image} />}
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
                {breadcrumbSchema && (
                    <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
                )}
            </Head>

            <PublicSiteLayout>
                <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-slate-900">
                    <article className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-16">
                        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-[#C7A14A] transition hover:text-[#b38d34]">
                            Back to Blogs
                        </Link>

                        <header className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.3)] sm:p-10 lg:p-12">
                            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                {blog.author_name || 'Area24One'}
                                {blog.published_at ? ` � ${new Date(blog.published_at).toLocaleDateString()}` : ''}
                            </div>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                                {blog.title}
                            </h1>
                            {blog.excerpt && (
                                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                                    {blog.excerpt}
                                </p>
                            )}
                            {blog.featured_image_url && (
                                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
                                    <img src={blog.featured_image_url} alt={blog.title} loading="lazy" decoding="async" className="h-full max-h-[480px] w-full object-cover" />
                                </div>
                            )}
                        </header>

                        <div
                            className="blog-content mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.28)] sm:p-10 lg:p-12"
                            dangerouslySetInnerHTML={{ __html: normalizedBlogContent }}
                        />
                    </article>

                    {relatedBlogs.length > 0 && (
                        <section className="border-t border-slate-200 bg-white/70 py-14 backdrop-blur">
                            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A14A]">Keep Reading</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Related articles</h2>
                                    </div>
                                </div>
                                <div className="mt-8 grid gap-6 md:grid-cols-3">
                                    {relatedBlogs.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/blogs/${item.slug}`}
                                            className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)]"
                                        >
                                            <div className="h-44 bg-slate-200">
                                                {item.featured_image_url ? (
                                                    <img src={item.featured_image_url} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#f8e7b7,transparent_40%),linear-gradient(135deg,#0f172a,#334155)] text-xs uppercase tracking-[0.3em] text-white/70">
                                                        Area24One
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                                    {item.author_name || 'Area24One'}
                                                </div>
                                                <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.title}</h3>
                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Internal links to service pages — boosts internal linking + local SEO */}
                    <section className="border-t border-slate-100 bg-slate-50 py-12">
                        <div className="mx-auto max-w-5xl px-6 lg:px-8">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A14A]">Our Services</p>
                            <h2 className="mb-6 text-lg font-semibold text-slate-900">Explore Area24One Services in Bangalore & Karnataka</h2>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { label: 'Construction in Bangalore', href: '/services/construction-bangalore' },
                                    { label: 'Interior Design Bangalore', href: '/services/interior-design-bangalore' },
                                    { label: 'Real Estate Bangalore', href: '/services/real-estate-bangalore' },
                                    { label: 'Construction in Mysore', href: '/services/construction-mysore' },
                                    { label: 'Land Development Karnataka', href: '/services/land-development-karnataka' },
                                    { label: 'Event Management Bangalore', href: '/services/event-management-bangalore' },
                                ].map(link => (
                                    <Link key={link.href} href={link.href}
                                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#C7A14A]/50 hover:text-[#C7A14A]">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </PublicSiteLayout>
        </>
    );
}
