import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface ServiceOption {
    id: number;
    name: string;
}

interface ChatIntent {
    id: number;
    name: string;
    slug?: string | null;
    service_id?: number | null;
    service?: ServiceOption | null;
    keywords?: string[] | null;
    response_text?: string | null;
    redirect_url?: string | null;
    category?: string | null;
    priority?: number | null;
    conversion_rate?: number | null;
    priority_score?: number | null;
    is_high_value: boolean;
    is_active: boolean;
    published_at?: string | null;
}

interface Props {
    intents: ChatIntent[];
    services: ServiceOption[];
}

const EMPTY_FORM = {
    name: '',
    slug: '',
    service_id: '',
    keywords: '',
    response_text: '',
    redirect_url: '',
    category: '',
    priority: '50',
    conversion_rate: '0',
    priority_score: '0',
    is_high_value: false,
    is_active: true,
};

type FormState = typeof EMPTY_FORM;

export default function ChatIntents({ intents, services }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ChatIntent | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    const set = (key: keyof FormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return intents;

        return intents.filter((intent) =>
            intent.name.toLowerCase().includes(term) ||
            intent.slug?.toLowerCase().includes(term) ||
            intent.service?.name?.toLowerCase().includes(term) ||
            intent.category?.toLowerCase().includes(term) ||
            intent.keywords?.some((keyword) => keyword.toLowerCase().includes(term)),
        );
    }, [q, intents]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (intent: ChatIntent) => {
        setEditing(intent);
        setForm({
            name: intent.name ?? '',
            slug: intent.slug ?? '',
            service_id: intent.service_id ? String(intent.service_id) : '',
            keywords: (intent.keywords ?? []).join('\n'),
            response_text: intent.response_text ?? '',
            redirect_url: intent.redirect_url ?? '',
            category: intent.category ?? '',
            priority: String(intent.priority ?? 50),
            conversion_rate: String(intent.conversion_rate ?? 0),
            priority_score: String(intent.priority_score ?? 0),
            is_high_value: intent.is_high_value ?? false,
            is_active: intent.is_active ?? true,
        });
        setErrors({});
        setOpen(true);
    };

    const buildPayload = () => ({
        ...form,
        service_id: form.service_id || null,
        keywords: form.keywords,
        priority: Number(form.priority || 50),
        conversion_rate: Number(form.conversion_rate || 0),
        priority_score: Number(form.priority_score || 0),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing
            ? `/admin/chat-intents/${editing.id}`
            : '/admin/chat-intents';

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

    const handleToggle = (intent: ChatIntent) => {
        router.post(`/admin/chat-intents/${intent.id}/toggle`, {}, { preserveScroll: true });
    };

    const handlePublish = (intent: ChatIntent) => {
        router.post(`/admin/chat-intents/${intent.id}/publish`, {}, { preserveScroll: true });
    };

    const handleDelete = (intent: ChatIntent) => {
        if (!confirm(`Delete chat intent "${intent.name}"?`)) return;
        router.delete(`/admin/chat-intents/${intent.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Intents', href: '/admin/chat-intents' }]}>
            <Head title="Chat Intents" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chat Intents</h1>
                        <p className="text-muted-foreground">
                            Manage keyword-triggered replies and redirects in the same admin workflow as the rest of the assistant.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search intents" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Intent
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Keywords</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No chat intents found.
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((intent) => (
                                    <TableRow key={intent.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{intent.name}</p>
                                                <p className="text-xs text-muted-foreground">{intent.slug || '-'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {intent.service?.name || 'General'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{intent.category || 'general'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {(intent.keywords ?? []).length} keywords
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handlePublish(intent)} className="text-sm">
                                                <Badge variant={intent.published_at ? 'default' : 'outline'}>
                                                    {intent.published_at ? 'Published' : 'Draft'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleToggle(intent)} className="flex items-center gap-1 text-sm">
                                                {intent.is_active ? (
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
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(intent)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(intent)}>
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
                            <DialogTitle>{editing ? 'Edit Chat Intent' : 'Create Chat Intent'}</DialogTitle>
                            <DialogDescription>
                                Add keywords and the approved response the assistant should return for matching prompts.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Construction pricing intent" />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="construction-pricing" />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
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
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="pricing" />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Input id="priority" type="number" value={form.priority} onChange={(e) => set('priority', e.target.value)} />
                                    {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords</Label>
                                <Textarea id="keywords" rows={4} value={form.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="One phrase per line or comma separated." />
                                {errors.keywords && <p className="text-sm text-red-500">{errors.keywords}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="response_text">Response</Label>
                                <Textarea id="response_text" rows={6} value={form.response_text} onChange={(e) => set('response_text', e.target.value)} placeholder="Approved bot reply." />
                                {errors.response_text && <p className="text-sm text-red-500">{errors.response_text}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="redirect_url">Redirect URL</Label>
                                    <Input id="redirect_url" value={form.redirect_url} onChange={(e) => set('redirect_url', e.target.value)} placeholder="/cost-estimator" />
                                    {errors.redirect_url && <p className="text-sm text-red-500">{errors.redirect_url}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="conversion_rate">Conversion Rate</Label>
                                    <Input id="conversion_rate" type="number" step="0.01" value={form.conversion_rate} onChange={(e) => set('conversion_rate', e.target.value)} />
                                    {errors.conversion_rate && <p className="text-sm text-red-500">{errors.conversion_rate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority_score">Priority Score</Label>
                                    <Input id="priority_score" type="number" value={form.priority_score} onChange={(e) => set('priority_score', e.target.value)} />
                                    {errors.priority_score && <p className="text-sm text-red-500">{errors.priority_score}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_active">Active Intent</Label>
                                        <p className="text-sm text-muted-foreground">Inactive intents stay in admin but will not be used.</p>
                                    </div>
                                    <button id="is_active" type="button" onClick={() => set('is_active', !form.is_active)} className="flex items-center gap-2">
                                        {form.is_active ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Active</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Inactive</span></>}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_high_value">High Value Intent</Label>
                                        <p className="text-sm text-muted-foreground">Used for lead scoring and priority handling.</p>
                                    </div>
                                    <button id="is_high_value" type="button" onClick={() => set('is_high_value', !form.is_high_value)} className="flex items-center gap-2">
                                        {form.is_high_value ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Enabled</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Disabled</span></>}
                                    </button>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Intent'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
