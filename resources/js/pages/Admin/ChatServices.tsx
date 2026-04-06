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

interface ChatService {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    is_active: boolean;
    short_summary?: string | null;
    description?: string | null;
    who_its_for?: string[] | null;
    offerings?: string[] | null;
    pricing_note?: string | null;
    timeline_note?: string | null;
    cta_text?: string | null;
    locations?: string[] | null;
    meta?: {
        aliases?: string[] | null;
    } | null;
    sort_order?: number | null;
    published_at?: string | null;
}

interface Props {
    services: ChatService[];
}

const EMPTY_FORM = {
    name: '',
    slug: '',
    icon: '',
    is_active: true,
    short_summary: '',
    description: '',
    who_its_for: '',
    offerings: '',
    pricing_note: '',
    timeline_note: '',
    cta_text: '',
    locations: '',
    aliases: '',
    sort_order: '0',
};

type FormState = typeof EMPTY_FORM;

export default function ChatServices({ services }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ChatService | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    const set = (key: keyof FormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return services;

        return services.filter((service) =>
            service.name.toLowerCase().includes(term) ||
            service.slug.toLowerCase().includes(term) ||
            service.short_summary?.toLowerCase().includes(term) ||
            service.locations?.some((location) => location.toLowerCase().includes(term)),
        );
    }, [q, services]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (service: ChatService) => {
        setEditing(service);
        setForm({
            name: service.name ?? '',
            slug: service.slug ?? '',
            icon: service.icon ?? '',
            is_active: service.is_active ?? true,
            short_summary: service.short_summary ?? '',
            description: service.description ?? '',
            who_its_for: (service.who_its_for ?? []).join('\n'),
            offerings: (service.offerings ?? []).join('\n'),
            pricing_note: service.pricing_note ?? '',
            timeline_note: service.timeline_note ?? '',
            cta_text: service.cta_text ?? '',
            locations: (service.locations ?? []).join('\n'),
            aliases: (service.meta?.aliases ?? []).join('\n'),
            sort_order: String(service.sort_order ?? 0),
        });
        setErrors({});
        setOpen(true);
    };

    const buildPayload = () => ({
        ...form,
        is_active: form.is_active,
        who_its_for: form.who_its_for,
        offerings: form.offerings,
        locations: form.locations,
        meta: {
            aliases: form.aliases,
        },
        sort_order: Number(form.sort_order || 0),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing
            ? `/admin/chat-services/${editing.id}`
            : '/admin/chat-services';

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

    const handleToggle = (service: ChatService) => {
        router.post(`/admin/chat-services/${service.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = (service: ChatService) => {
        if (!confirm(`Delete "${service.name}" from chat services?`)) return;
        router.delete(`/admin/chat-services/${service.id}`);
    };

    const handlePublish = (service: ChatService) => {
        router.post(`/admin/chat-services/${service.id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Services', href: '/admin/chat-services' }]}>
            <Head title="Chat Services" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chat Services</h1>
                        <p className="text-muted-foreground">
                            Manage service cards, summaries, and rule-friendly service metadata for the assistant.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="w-64 pl-8"
                                placeholder="Search services"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>

                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Service
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Summary</TableHead>
                                    <TableHead>Locations</TableHead>
                                    <TableHead>Sort</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No chat services found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {service.icon && <span className="text-lg">{service.icon}</span>}
                                                    <div>
                                                        <p className="font-medium">{service.name}</p>
                                                        <p className="text-xs text-muted-foreground">{service.slug}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-sm text-sm text-muted-foreground">
                                                {service.short_summary || service.description || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {(service.locations ?? []).slice(0, 3).map((location) => (
                                                        <Badge key={location} variant="secondary">{location}</Badge>
                                                    ))}
                                                    {(service.locations ?? []).length > 3 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            +{(service.locations ?? []).length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {service.sort_order ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                <button type="button" onClick={() => handlePublish(service)} className="text-sm">
                                                    <Badge variant={service.published_at ? 'default' : 'outline'}>
                                                        {service.published_at ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(service)}
                                                    className="flex items-center gap-1 text-sm"
                                                >
                                                    {service.is_active ? (
                                                        <>
                                                            <ToggleRight className="h-5 w-5 text-green-500" />
                                                            <Badge variant="secondary" className="bg-green-50 text-green-700">
                                                                Active
                                                            </Badge>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="h-5 w-5 text-zinc-400" />
                                                            <Badge variant="secondary" className="text-zinc-500">
                                                                Inactive
                                                            </Badge>
                                                        </>
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() => handleDelete(service)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Chat Service' : 'Create Chat Service'}</DialogTitle>
                            <DialogDescription>
                                Define the service information the assistant can show, route to, and qualify against.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Service Name</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => set('name', e.target.value)}
                                        placeholder="Construction"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={form.slug}
                                        onChange={(e) => set('slug', e.target.value)}
                                        placeholder="construction"
                                    />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Input
                                        id="icon"
                                        value={form.icon}
                                        onChange={(e) => set('icon', e.target.value)}
                                        placeholder="???"
                                    />
                                    {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="short_summary">Short Summary</Label>
                                    <Textarea
                                        id="short_summary"
                                        rows={3}
                                        value={form.short_summary}
                                        onChange={(e) => set('short_summary', e.target.value)}
                                        placeholder="One short summary used in service cards and quick responses."
                                    />
                                    {errors.short_summary && <p className="text-sm text-red-500">{errors.short_summary}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => set('sort_order', e.target.value)}
                                    />
                                    {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    placeholder="Longer explanation for the service."
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="who_its_for">Who It&apos;s For</Label>
                                    <Textarea
                                        id="who_its_for"
                                        rows={4}
                                        value={form.who_its_for}
                                        onChange={(e) => set('who_its_for', e.target.value)}
                                        placeholder="One item per line or comma separated."
                                    />
                                    {errors.who_its_for && <p className="text-sm text-red-500">{errors.who_its_for}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="offerings">Offerings</Label>
                                    <Textarea
                                        id="offerings"
                                        rows={4}
                                        value={form.offerings}
                                        onChange={(e) => set('offerings', e.target.value)}
                                        placeholder="One item per line or comma separated."
                                    />
                                    {errors.offerings && <p className="text-sm text-red-500">{errors.offerings}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="pricing_note">Pricing Note</Label>
                                    <Textarea
                                        id="pricing_note"
                                        rows={3}
                                        value={form.pricing_note}
                                        onChange={(e) => set('pricing_note', e.target.value)}
                                        placeholder="How pricing is usually framed."
                                    />
                                    {errors.pricing_note && <p className="text-sm text-red-500">{errors.pricing_note}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeline_note">Timeline Note</Label>
                                    <Textarea
                                        id="timeline_note"
                                        rows={3}
                                        value={form.timeline_note}
                                        onChange={(e) => set('timeline_note', e.target.value)}
                                        placeholder="Typical delivery or execution timeline."
                                    />
                                    {errors.timeline_note && <p className="text-sm text-red-500">{errors.timeline_note}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cta_text">CTA Text</Label>
                                    <Input
                                        id="cta_text"
                                        value={form.cta_text}
                                        onChange={(e) => set('cta_text', e.target.value)}
                                        placeholder="Share your requirement to get started"
                                    />
                                    {errors.cta_text && <p className="text-sm text-red-500">{errors.cta_text}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locations">Locations</Label>
                                    <Textarea
                                        id="locations"
                                        rows={3}
                                        value={form.locations}
                                        onChange={(e) => set('locations', e.target.value)}
                                        placeholder="Bangalore&#10;Mysore&#10;Ballari"
                                    />
                                    {errors.locations && <p className="text-sm text-red-500">{errors.locations}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="aliases">Service Match Phrases</Label>
                                <Textarea
                                    id="aliases"
                                    rows={4}
                                    value={form.aliases}
                                    onChange={(e) => set('aliases', e.target.value)}
                                    placeholder="build a house&#10;home construction&#10;villa construction"
                                />
                                <p className="text-sm text-muted-foreground">
                                    One phrase per line. These phrases help the assistant map natural user requests to this service.
                                </p>
                                {errors['meta.aliases'] && <p className="text-sm text-red-500">{errors['meta.aliases']}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active">Active Service</Label>
                                    <p className="text-sm text-muted-foreground">Inactive services stay in admin but won&apos;t be shown in the assistant.</p>
                                </div>
                                <button
                                    id="is_active"
                                    type="button"
                                    onClick={() => set('is_active', !form.is_active)}
                                    className="flex items-center gap-2"
                                >
                                    {form.is_active ? (
                                        <>
                                            <ToggleRight className="h-6 w-6 text-green-500" />
                                            <span className="text-sm font-medium">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <ToggleLeft className="h-6 w-6 text-zinc-400" />
                                            <span className="text-sm font-medium">Inactive</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
