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

interface FlowStep {
    id: number;
    service_id: number;
    service?: ServiceOption | null;
    field_key: string;
    label?: string | null;
    question: string;
    answer_type: string;
    quick_options?: string[] | null;
    step_order: number;
    is_required: boolean;
    is_active: boolean;
    validation_rules?: string[] | null;
    published_at?: string | null;
}

interface Props {
    flows: FlowStep[];
    services: ServiceOption[];
}

const EMPTY_FORM = {
    service_id: '',
    field_key: '',
    label: '',
    question: '',
    answer_type: 'text',
    quick_options: '',
    step_order: '0',
    is_required: true,
    is_active: true,
    validation_rules: '',
};

type FormState = typeof EMPTY_FORM;

export default function ChatQualificationFlows({ flows, services }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<FlowStep | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [q, setQ] = useState('');

    const set = (key: keyof FormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return flows;

        return flows.filter((flow) =>
            flow.field_key.toLowerCase().includes(term) ||
            flow.service?.name?.toLowerCase().includes(term) ||
            flow.question.toLowerCase().includes(term),
        );
    }, [q, flows]);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setOpen(true);
    };

    const openEdit = (flow: FlowStep) => {
        setEditing(flow);
        setForm({
            service_id: String(flow.service_id),
            field_key: flow.field_key ?? '',
            label: flow.label ?? '',
            question: flow.question ?? '',
            answer_type: flow.answer_type ?? 'text',
            quick_options: (flow.quick_options ?? []).join('\n'),
            step_order: String(flow.step_order ?? 0),
            is_required: flow.is_required ?? true,
            is_active: flow.is_active ?? true,
            validation_rules: (flow.validation_rules ?? []).join('\n'),
        });
        setErrors({});
        setOpen(true);
    };

    const buildPayload = () => ({
        ...form,
        service_id: Number(form.service_id),
        quick_options: form.quick_options,
        validation_rules: form.validation_rules,
        step_order: Number(form.step_order || 0),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing
            ? `/admin/chat-qualification-flows/${editing.id}`
            : '/admin/chat-qualification-flows';

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

    const handleToggle = (flow: FlowStep) => {
        router.post(`/admin/chat-qualification-flows/${flow.id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = (flow: FlowStep) => {
        if (!confirm(`Delete qualification step "${flow.field_key}"?`)) return;
        router.delete(`/admin/chat-qualification-flows/${flow.id}`);
    };

    const handlePublish = (flow: FlowStep) => {
        router.post(`/admin/chat-qualification-flows/${flow.id}/publish`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Qualification Flows', href: '/admin/chat-qualification-flows' }]}>
            <Head title="Qualification Flows" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Qualification Flows</h1>
                        <p className="text-muted-foreground">
                            Define service-specific lead capture steps and the order in which the assistant asks them.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search flow steps" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Step
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Live</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No qualification steps found.</TableCell>
                                    </TableRow>
                                ) : filtered.map((flow) => (
                                    <TableRow key={flow.id}>
                                        <TableCell className="font-medium">{flow.service?.name || '-'}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{flow.field_key}</p>
                                                <p className="text-xs text-muted-foreground">{flow.label || 'No label'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-sm text-sm text-muted-foreground">{flow.question}</TableCell>
                                        <TableCell><Badge variant="secondary">{flow.answer_type}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{flow.step_order}</TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handlePublish(flow)} className="text-sm">
                                                <Badge variant={flow.published_at ? 'default' : 'outline'}>
                                                    {flow.published_at ? 'Published' : 'Draft'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button type="button" onClick={() => handleToggle(flow)} className="flex items-center gap-1 text-sm">
                                                {flow.is_active ? (
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
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(flow)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(flow)}>
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
                            <DialogTitle>{editing ? 'Edit Qualification Step' : 'Create Qualification Step'}</DialogTitle>
                            <DialogDescription>
                                These steps drive the rule-based lead capture flow after a service is selected.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="service_id">Service</Label>
                                    <select id="service_id" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.service_id} onChange={(e) => set('service_id', e.target.value)}>
                                        <option value="">Select service</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>{service.name}</option>
                                        ))}
                                    </select>
                                    {errors.service_id && <p className="text-sm text-red-500">{errors.service_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field_key">Field Key</Label>
                                    <Input id="field_key" value={form.field_key} onChange={(e) => set('field_key', e.target.value)} placeholder="budget" />
                                    {errors.field_key && <p className="text-sm text-red-500">{errors.field_key}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="label">Label</Label>
                                    <Input id="label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="Budget" />
                                    {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Textarea id="question" rows={4} value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="What is your approximate budget range?" />
                                {errors.question && <p className="text-sm text-red-500">{errors.question}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="answer_type">Answer Type</Label>
                                    <select id="answer_type" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.answer_type} onChange={(e) => set('answer_type', e.target.value)}>
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="option">Option</option>
                                        <option value="phone">Phone</option>
                                        <option value="date">Date</option>
                                    </select>
                                    {errors.answer_type && <p className="text-sm text-red-500">{errors.answer_type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="step_order">Step Order</Label>
                                    <Input id="step_order" type="number" value={form.step_order} onChange={(e) => set('step_order', e.target.value)} />
                                    {errors.step_order && <p className="text-sm text-red-500">{errors.step_order}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="validation_rules">Validation Rules</Label>
                                    <Textarea id="validation_rules" rows={3} value={form.validation_rules} onChange={(e) => set('validation_rules', e.target.value)} placeholder="required\nmin:100000" />
                                    <p className="text-xs text-muted-foreground">
                                        Dynamic parsing rules also go here, for example: `parser:budget`, `parser:timeline`, or `alias:Residential=house|home|villa`.
                                    </p>
                                    {errors.validation_rules && <p className="text-sm text-red-500">{errors.validation_rules}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quick_options">Quick Options</Label>
                                <Textarea id="quick_options" rows={4} value={form.quick_options} onChange={(e) => set('quick_options', e.target.value)} placeholder="Under 50 Lakhs\n50 Lakhs to 1 Crore\nAbove 1 Crore" />
                                {errors.quick_options && <p className="text-sm text-red-500">{errors.quick_options}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_required">Required Step</Label>
                                        <p className="text-sm text-muted-foreground">The assistant should not skip this field during qualification.</p>
                                    </div>
                                    <button id="is_required" type="button" onClick={() => set('is_required', !form.is_required)} className="flex items-center gap-2">
                                        {form.is_required ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Required</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Optional</span></>}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_active">Active Step</Label>
                                        <p className="text-sm text-muted-foreground">Inactive steps stay in admin but will not appear in the live flow.</p>
                                    </div>
                                    <button id="is_active" type="button" onClick={() => set('is_active', !form.is_active)} className="flex items-center gap-2">
                                        {form.is_active ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-sm font-medium">Active</span></> : <><ToggleLeft className="h-6 w-6 text-zinc-400" /><span className="text-sm font-medium">Inactive</span></>}
                                    </button>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Step'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
