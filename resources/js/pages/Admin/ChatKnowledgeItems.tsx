import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface ServiceOption {
    id: number;
    name: string;
}

interface KnowledgeItem {
    id: number;
    title: string;
    slug?: string | null;
    category: string;
    service_id?: number | null;
    service?: ServiceOption | null;
    question_patterns?: string[] | null;
    answer: string;
    short_answer?: string | null;
    tags?: string[] | null;
    priority?: number | null;
    is_active: boolean;
    published_at?: string | null;
}

interface Props {
    items: KnowledgeItem[];
    services: ServiceOption[];
}

const EMPTY_FORM = {
    title: '',
    slug: '',
    category: 'faq',
    service_id: '',
    question_patterns: '',
    answer: '',
    short_answer: '',
    tags: '',
    priority: '0',
    is_active: true,
};

type FormState = typeof EMPTY_FORM;

export default function ChatKnowledgeItems({ items, services }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<KnowledgeItem | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    const set = (key: keyof FormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return items;

        return items.filter((item) =>
            item.title.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            item.service?.name?.toLowerCase().includes(term) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(term)),
        );
    }, [q, items]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (item: KnowledgeItem) => {
        setEditing(item);
        setForm({
            title: item.title ?? '',
            slug: item.slug ?? '',
            category: item.category ?? 'faq',
            service_id: item.service_id ? String(item.service_id) : '',
            question_patterns: (item.question_patterns ?? []).join('\n'),
            answer: item.answer ?? '',
            short_answer: item.short_answer ?? '',
            tags: (item.tags ?? []).join('\n'),
            priority: String(item.priority ?? 0),
            is_active: item.is_active ?? true,
        });
        setErrors({});
        setOpen(true);
    };

    const buildPayload = () => ({
        ...form,
        service_id: form.service_id || null,
        question_patterns: form.question_patterns,
        tags: form.tags,
        priority: Number(form.priority || 0),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing
            ? `/admin/chat-knowledge-items/${editing.id}`
            : '/admin/chat-knowledge-items';

        router.post(url, buildPayload(), {
            onError: (incomingErrors) => {
                setErrors(incomingErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setOpen(false);
                setProcessing(false);
            },
        });
    };

    const handleToggle = (item: KnowledgeItem) => {
        router.post(`/admin/chat-knowledge-items/${item.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = (item: KnowledgeItem) => {
        if (!confirm(`Delete knowledge item "${item.title}"?`)) return;
        router.delete(`/admin/chat-knowledge-items/${item.id}`);
    };

    const handlePublish = (item: KnowledgeItem) => {
        router.post(`/admin/chat-knowledge-items/${item.id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Knowledge', href: '/admin/chat-knowledge-items' }]}>
            <Head title="Chat Knowledge" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chat Knowledge</h1>
                        <p className="text-muted-foreground">
                            Manage reusable answers, FAQs, and service-specific knowledge for the assistant.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search knowledge" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Patterns</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No knowledge items found.</TableCell>
                                    </TableRow>
                                ) : filtered.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.slug || '-'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.service?.name || 'General'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{(item.question_patterns ?? []).length} patterns</TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handlePublish(item)} className="text-sm">
                                                <Badge variant={item.published_at ? 'default' : 'outline'}>
                                                    {item.published_at ? 'Published' : 'Draft'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleToggle(item)} className="flex items-center gap-1 text-sm">
                                                {item.is_active ? (
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
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item)}>
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
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Knowledge Item' : 'Create Knowledge Item'}</DialogTitle>
                            <DialogDescription>
                                Add searchable patterns and the approved answer the assistant should return.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Construction pricing FAQ" />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="construction-pricing" />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="pricing" />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service_id">Service</Label>
                                    <select id="service_id" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.service_id} onChange={(e) => set('service_id', e.target.value)}>
                                        <option value="">General</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>{service.name}</option>
                                        ))}
                                    </select>
                                    {errors.service_id && <p className="text-sm text-red-500">{errors.service_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Input id="priority" type="number" value={form.priority} onChange={(e) => set('priority', e.target.value)} />
                                    {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question_patterns">Question Patterns</Label>
                                <Textarea id="question_patterns" rows={4} value={form.question_patterns} onChange={(e) => set('question_patterns', e.target.value)} placeholder="One phrase per line or comma separated." />
                                {errors.question_patterns && <p className="text-sm text-red-500">{errors.question_patterns}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="answer">Answer</Label>
                                <Textarea id="answer" rows={7} value={form.answer} onChange={(e) => set('answer', e.target.value)} placeholder="The full approved reply for this knowledge item." />
                                {errors.answer && <p className="text-sm text-red-500">{errors.answer}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="short_answer">Short Answer</Label>
                                    <Textarea id="short_answer" rows={3} value={form.short_answer} onChange={(e) => set('short_answer', e.target.value)} placeholder="Optional shorter version for compact responses." />
                                    {errors.short_answer && <p className="text-sm text-red-500">{errors.short_answer}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Textarea id="tags" rows={3} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="pricing\nbudget\ncost" />
                                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active">Active Item</Label>
                                    <p className="text-sm text-muted-foreground">Inactive items stay in admin but will not be used by the assistant.</p>
                                </div>
                                <button id="is_active" type="button" onClick={() => set('is_active', !form.is_active)} className="flex items-center gap-2">
                                    {form.is_active ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Active</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Inactive</span></>}
                                </button>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Item'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
