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

export default function BlogShow({ blog, relatedBlogs, seo }: { blog: Blog; relatedBlogs: Blog[]; seo: { title: string; description: string; keywords?: string | null; canonical?: string | null } }) {
    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                {seo.keywords && <meta name="keywords" content={seo.keywords} />}
                {seo.canonical && <link rel="canonical" href={seo.canonical} />}
            </Head>

            <div className="min-h-screen bg-white text-slate-900">
                <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
                    <Link href="/blogs" className="text-sm font-medium text-[#C7A14A]">Back to Blogs</Link>

                    <header className="mt-6 border-b pb-10">
                        <div className="text-sm text-slate-500">
                            {blog.author_name || 'Area24One'}
                            {blog.published_at ? ` · ${new Date(blog.published_at).toLocaleDateString()}` : ''}
                        </div>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{blog.title}</h1>
                        {blog.excerpt && <p className="mt-4 text-lg leading-8 text-slate-600">{blog.excerpt}</p>}
                        {blog.featured_image_url && (
                            <div className="mt-8 overflow-hidden rounded-3xl border">
                                <img src={blog.featured_image_url} alt="" className="h-full max-h-[420px] w-full object-cover" />
                            </div>
                        )}
                    </header>

                    <div
                        className="prose prose-slate mt-10 max-w-none leading-8 prose-headings:tracking-tight prose-a:text-[#C7A14A] prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>

                {relatedBlogs.length > 0 && (
                    <section className="border-t bg-slate-50 py-14">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8">
                            <h2 className="text-2xl font-semibold tracking-tight">Related articles</h2>
                            <div className="mt-8 grid gap-6 md:grid-cols-3">
                                {relatedBlogs.map((item) => (
                                    <Link key={item.id} href={`/blogs/${item.slug}`} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                                        <div className="text-xs uppercase tracking-wide text-slate-500">
                                            {item.author_name || 'Area24One'}
                                        </div>
                                        <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
