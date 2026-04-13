import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TinyMceEditor } from '@/components/tinymce-editor';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Search, Star, ToggleLeft, ToggleRight, Trash2, Upload } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    featured_image_url?: string | null;
    author_name?: string | null;
    is_active: boolean;
    is_featured: boolean;
    published_at?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
    canonical_url?: string | null;
    updated_at: string;
}

interface Props {
    blogs: Blog[];
}

type FormState = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: File | null;
    author_name: string;
    is_published: boolean;
    is_active: boolean;
    is_featured: boolean;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    canonical_url: string;
};

const EMPTY_FORM: FormState = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: null,
    author_name: '',
    is_published: false,
    is_active: true,
    is_featured: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    canonical_url: '',
};

export default function Blogs({ blogs }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return blogs;

        return blogs.filter((blog) =>
            blog.title.toLowerCase().includes(term) ||
            blog.slug.toLowerCase().includes(term) ||
            blog.author_name?.toLowerCase().includes(term) ||
            blog.excerpt?.toLowerCase().includes(term),
        );
    }, [blogs, q]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setImagePreview(null);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (blog: Blog) => {
        setEditing(blog);
        setForm({
            title: blog.title ?? '',
            slug: blog.slug ?? '',
            excerpt: blog.excerpt ?? '',
            content: blog.content ?? '',
            featured_image: null,
            author_name: blog.author_name ?? '',
            is_published: Boolean(blog.published_at),
            is_active: blog.is_active ?? true,
            is_featured: blog.is_featured ?? false,
            seo_title: blog.seo_title ?? '',
            seo_description: blog.seo_description ?? '',
            seo_keywords: blog.seo_keywords ?? '',
            canonical_url: blog.canonical_url ?? '',
        });
        setImagePreview(blog.featured_image_url ?? null);
        setErrors({});
        setOpen(true);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        set('featured_image', file);

        setImagePreview((currentPreview) => {
            if (currentPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(currentPreview);
            }

            if (file) {
                return URL.createObjectURL(file);
            }

            return editing?.featured_image_url ?? null;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing ? `/admin/blogs/${editing.id}` : '/admin/blogs';

        router.post(url, form, {
            forceFormData: true,
            onError: (incomingErrors) => {
                setErrors(incomingErrors as Record<string, string>);
            },
            onSuccess: () => {
                setOpen(false);
                setErrors({});
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleToggle = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/toggle`, {}, { preserveScroll: true });
    };

    const handlePublish = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/publish`, {}, { preserveScroll: true });
    };

    const handleFeature = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/feature`, {}, { preserveScroll: true });
    };

    const handleDelete = (blog: Blog) => {
        if (!confirm(`Delete blog "${blog.title}"?`)) return;
        router.delete(`/admin/blogs/${blog.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Blogs', href: '/admin/blogs' }]}>
            <Head title="Blogs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
                        <p className="text-muted-foreground">
                            Manage blog articles, publication status, and SEO metadata from one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search blogs" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Blog
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Blog</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>SEO</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No blogs found.</TableCell>
                                    </TableRow>
                                ) : filtered.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {blog.featured_image_url ? (
                                                    <img src={blog.featured_image_url} alt="" className="h-12 w-16 rounded-md object-cover" />
                                                ) : (
                                                    <div className="h-12 w-16 rounded-md bg-muted" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{blog.title}</p>
                                                    <p className="text-xs text-muted-foreground">/{blog.slug}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{blog.author_name || 'Area24One'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {blog.seo_title || blog.seo_description ? 'Configured' : 'Default'}
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handlePublish(blog)} className="text-sm">
                                                <Badge variant={blog.published_at ? 'default' : 'outline'}>
                                                    {blog.published_at ? 'Published' : 'Draft'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleToggle(blog)} className="flex items-center gap-1 text-sm">
                                                {blog.is_active ? (
                                                    <>
                                                        <ToggleRight className="h-5 w-5 text-green-500" />
                                                        <Badge variant="secondary" className="bg-green-50 text-green-700">Active</Badge>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="h-5 w-5 text-zinc-400" />
                                                        <Badge variant="secondary" className="text-zinc-500">Inactive</Badge>
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleFeature(blog)} className="flex items-center gap-1 text-sm">
                                                <Star className={`h-4 w-4 ${blog.is_featured ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                                                <span className="text-muted-foreground">{blog.is_featured ? 'Featured' : 'Standard'}</span>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(blog)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(blog)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90vh] w-[98vw] max-w-[98vw] overflow-y-auto sm:max-w-[98vw] xl:w-[92vw] xl:max-w-[92vw] 2xl:w-[88vw] 2xl:max-w-[88vw]">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Blog' : 'Create Blog'}</DialogTitle>
                            <DialogDescription>
                                Create and manage blog content together with SEO metadata.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Blog title" />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="blog-slug" />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="author_name">Author Name</Label>
                                    <Input id="author_name" value={form.author_name} onChange={(e) => set('author_name', e.target.value)} placeholder="Area24One Editorial" />
                                    {errors.author_name && <p className="text-sm text-red-500">{errors.author_name}</p>}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="featured_image">Featured Image Upload</Label>
                                    <Input id="featured_image" type="file" accept="image/*" onChange={handleImageChange} />
                                    <div className="overflow-hidden rounded-xl border bg-slate-50">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Featured preview" className="h-44 w-full object-cover" />
                                        ) : (
                                            <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                                                <Upload className="h-5 w-5" />
                                                <span>No featured image selected</span>
                                            </div>
                                        )}
                                    </div>
                                    {errors.featured_image && <p className="text-sm text-red-500">{errors.featured_image}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea id="excerpt" rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary for cards and search engines." />
                                {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <TinyMceEditor value={form.content} onChange={(content) => set('content', content)} />
                                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                            </div>

                            <div className="rounded-xl border p-4">
                                <h3 className="mb-4 font-semibold">SEO</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="seo_title">SEO Title</Label>
                                        <Input id="seo_title" value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder="Custom meta title" />
                                        {errors.seo_title && <p className="text-sm text-red-500">{errors.seo_title}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="seo_description">SEO Description</Label>
                                        <Textarea id="seo_description" rows={3} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} placeholder="Custom meta description" />
                                        {errors.seo_description && <p className="text-sm text-red-500">{errors.seo_description}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seo_keywords">SEO Keywords</Label>
                                        <Input id="seo_keywords" value={form.seo_keywords} onChange={(e) => set('seo_keywords', e.target.value)} placeholder="construction, interiors, ..." />
                                        {errors.seo_keywords && <p className="text-sm text-red-500">{errors.seo_keywords}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="canonical_url">Canonical URL</Label>
                                        <Input id="canonical_url" value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} placeholder="https://..." />
                                        {errors.canonical_url && <p className="text-sm text-red-500">{errors.canonical_url}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_published">Live Status</Label>
                                        <p className="text-sm text-muted-foreground">Published blogs appear on the public blog pages. Draft blogs stay hidden.</p>
                                    </div>
                                    <button id="is_published" type="button" onClick={() => set('is_published', !form.is_published)} className="flex items-center gap-2">
                                        {form.is_published ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Published</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Draft</span></>}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_active">Active</Label>
                                        <p className="text-sm text-muted-foreground">Inactive blogs stay in admin but are hidden publicly.</p>
                                    </div>
                                    <button id="is_active" type="button" onClick={() => set('is_active', !form.is_active)} className="flex items-center gap-2">
                                        {form.is_active ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Active</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Inactive</span></>}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_featured">Featured</Label>
                                        <p className="text-sm text-muted-foreground">Featured blog is highlighted on the public index page.</p>
                                    </div>
                                    <button id="is_featured" type="button" onClick={() => set('is_featured', !form.is_featured)} className="flex items-center gap-2">
                                        {form.is_featured ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Featured</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Standard</span></>}
                                    </button>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Blog'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
