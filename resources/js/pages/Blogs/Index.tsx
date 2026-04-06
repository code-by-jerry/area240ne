import { Head, Link } from '@inertiajs/react';

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

export default function BlogsIndex({ featuredBlog, blogs, seo }: { featuredBlog?: Blog | null; blogs: Blog[]; seo: { title: string; description: string } }) {
    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Head>

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
                    <div className="mb-12">
                        <Link href="/" className="text-sm font-medium text-[#C7A14A]">Back to Home</Link>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Area24One Blog</h1>
                        <p className="mt-3 max-w-2xl text-base text-slate-600">
                            Insights, planning guides, and practical knowledge across construction, interiors, real estate, land development, and events.
                        </p>
                    </div>

                    {featuredBlog && (
                        <Link href={`/blogs/${featuredBlog.slug}`} className="mb-12 block overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md">
                            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="p-8 lg:p-10">
                                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Featured</span>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight">{featuredBlog.title}</h2>
                                    <p className="mt-4 text-base leading-7 text-slate-600">{featuredBlog.excerpt}</p>
                                    <div className="mt-6 text-sm text-slate-500">
                                        {featuredBlog.author_name || 'Area24One'}
                                        {featuredBlog.published_at ? ` · ${new Date(featuredBlog.published_at).toLocaleDateString()}` : ''}
                                    </div>
                                </div>
                                <div className="min-h-[260px] bg-slate-200">
                                    {featuredBlog.featured_image_url && <img src={featuredBlog.featured_image_url} alt="" className="h-full w-full object-cover" />}
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {blogs.map((blog) => (
                            <Link key={blog.id} href={`/blogs/${blog.slug}`} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="h-48 bg-slate-200">
                                    {blog.featured_image_url && <img src={blog.featured_image_url} alt="" className="h-full w-full object-cover" />}
                                </div>
                                <div className="p-6">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">
                                        {blog.author_name || 'Area24One'}
                                        {blog.published_at ? ` · ${new Date(blog.published_at).toLocaleDateString()}` : ''}
                                    </div>
                                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{blog.title}</h3>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
