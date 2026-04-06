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

interface ChatResponseTemplate {
    id: number;
    name: string;
    slug: string;
    type: string;
    title?: string | null;
    body: string;
    quick_replies?: string[] | null;
    highlight: boolean;
    requires_input: boolean;
    ui_variant?: string | null;
    is_active: boolean;
    published_at?: string | null;
}

interface Props {
    templates: ChatResponseTemplate[];
}

const EMPTY_FORM = {
    name: '',
    slug: '',
    type: 'fallback',
    title: '',
    body: '',
    quick_replies: '',
    highlight: false,
    requires_input: false,
    ui_variant: '',
    is_active: true,
};

type FormState = typeof EMPTY_FORM;

export default function ChatResponseTemplates({ templates }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ChatResponseTemplate | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    const set = (key: keyof FormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return templates;

        return templates.filter((template) =>
            template.name.toLowerCase().includes(term) ||
            template.slug.toLowerCase().includes(term) ||
            template.type.toLowerCase().includes(term),
        );
    }, [q, templates]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (template: ChatResponseTemplate) => {
        setEditing(template);
        setForm({
            name: template.name ?? '',
            slug: template.slug ?? '',
            type: template.type ?? 'fallback',
            title: template.title ?? '',
            body: template.body ?? '',
            quick_replies: (template.quick_replies ?? []).join('\n'),
            highlight: template.highlight ?? false,
            requires_input: template.requires_input ?? false,
            ui_variant: template.ui_variant ?? '',
            is_active: template.is_active ?? true,
        });
        setErrors({});
        setOpen(true);
    };

    const buildPayload = () => ({
        ...form,
        quick_replies: form.quick_replies,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing
            ? `/admin/chat-response-templates/${editing.id}`
            : '/admin/chat-response-templates';

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

    const handleToggle = (template: ChatResponseTemplate) => {
        router.post(`/admin/chat-response-templates/${template.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = (template: ChatResponseTemplate) => {
        if (!confirm(`Delete response template "${template.name}"?`)) return;
        router.delete(`/admin/chat-response-templates/${template.id}`);
    };

    const handlePublish = (template: ChatResponseTemplate) => {
        router.post(`/admin/chat-response-templates/${template.id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Response Templates', href: '/admin/chat-response-templates' }]}>
            <Head title="Response Templates" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Response Templates</h1>
                        <p className="text-muted-foreground">
                            Manage reusable assistant messages for welcome, fallback, escalation, and other chat states.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search templates" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Template
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>Quick Replies</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No response templates found.</TableCell>
                                    </TableRow>
                                ) : filtered.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{template.name}</p>
                                                <p className="text-xs text-muted-foreground">{template.slug}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary">{template.type}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{template.ui_variant || '-'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{(template.quick_replies ?? []).length}</TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handlePublish(template)} className="text-sm">
                                                <Badge variant={template.published_at ? 'default' : 'outline'}>
                                                    {template.published_at ? 'Published' : 'Draft'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleToggle(template)} className="flex items-center gap-1 text-sm">
                                                {template.is_active ? (
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
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(template)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(template)}>
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
                            <DialogTitle>{editing ? 'Edit Response Template' : 'Create Response Template'}</DialogTitle>
                            <DialogDescription>
                                Use placeholders like {'{{assistant_name}}'}, {'{{service_name}}'}, and {'{{summary_lines}}'} inside the template body.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Fallback Reply" />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="fallback-default" />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select id="type" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => set('type', e.target.value)}>
                                        <option value="welcome">Welcome</option>
                                        <option value="greeting">Greeting</option>
                                        <option value="fallback">Fallback</option>
                                        <option value="disabled">Disabled</option>
                                        <option value="service_answer">Service Answer</option>
                                        <option value="qualification_prompt">Qualification Prompt</option>
                                        <option value="qualification_complete">Qualification Complete</option>
                                        <option value="escalation">Escalation</option>
                                    </select>
                                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Optional heading" />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ui_variant">UI Variant</Label>
                                    <Input id="ui_variant" value={form.ui_variant} onChange={(e) => set('ui_variant', e.target.value)} placeholder="welcome-card" />
                                    {errors.ui_variant && <p className="text-sm text-red-500">{errors.ui_variant}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body">Body</Label>
                                <Textarea id="body" rows={8} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Template body with optional placeholders." />
                                {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quick_replies">Quick Replies</Label>
                                <Textarea id="quick_replies" rows={4} value={form.quick_replies} onChange={(e) => set('quick_replies', e.target.value)} placeholder="One option per line or comma separated." />
                                {errors.quick_replies && <p className="text-sm text-red-500">{errors.quick_replies}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="highlight">Highlight</Label>
                                        <p className="text-sm text-muted-foreground">Apply emphasized rendering in the chat UI.</p>
                                    </div>
                                    <button id="highlight" type="button" onClick={() => set('highlight', !form.highlight)} className="flex items-center gap-2">
                                        {form.highlight ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">On</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Off</span></>}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="requires_input">Requires Input</Label>
                                        <p className="text-sm text-muted-foreground">Useful for prompts that expect an immediate answer.</p>
                                    </div>
                                    <button id="requires_input" type="button" onClick={() => set('requires_input', !form.requires_input)} className="flex items-center gap-2">
                                        {form.requires_input ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">On</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Off</span></>}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_active">Active</Label>
                                        <p className="text-sm text-muted-foreground">Inactive templates are ignored by the runtime.</p>
                                    </div>
                                    <button id="is_active" type="button" onClick={() => set('is_active', !form.is_active)} className="flex items-center gap-2">
                                        {form.is_active ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Active</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Inactive</span></>}
                                    </button>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Template'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
