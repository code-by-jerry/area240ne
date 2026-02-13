import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { store, update, destroy } from '@/routes/admin/intents';

interface Intent {
  id: number;
  name: string;
  intent_slug?: string | null;
  service_vertical: string;
  keywords?: string[] | null;
  response_text?: string | null;
  redirect_url?: string | null;
  category?: string | null;
  priority?: number | null;
  created_at: string;
}

interface Props {
  intents: Intent[];
}

const SERVICE_OPTIONS = ['General','Construction','Interiors','Real Estate','Event','Land Development'];

export default function Intents({ intents }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Intent | null>(null);
  const [q, setQ] = useState('');

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    intent_slug: '',
    service_vertical: 'General',
    keywords: '' as string | string[],
    response_text: '',
    redirect_url: '',
    category: '',
    priority: 50,
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return intents;
    return intents.filter(i =>
      (i.name?.toLowerCase().includes(term)) ||
      (i.intent_slug?.toLowerCase().includes(term)) ||
      (i.service_vertical?.toLowerCase().includes(term))
    );
  }, [q, intents]);

  const openCreateDialog = () => {
    setEditing(null);
    reset();
    clearErrors();
    setIsDialogOpen(true);
  };

  const openEditDialog = (intent: Intent) => {
    setEditing(intent);
    setData({
      name: intent.name || '',
      intent_slug: intent.intent_slug || '',
      service_vertical: intent.service_vertical || 'General',
      keywords: (intent.keywords || []).join(', '),
      response_text: intent.response_text || '',
      redirect_url: intent.redirect_url || '',
      category: intent.category || '',
      priority: intent.priority ?? 50,
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...data,
      keywords: typeof data.keywords === 'string'
        ? data.keywords.split(',').map(s => s.trim()).filter(Boolean)
        : data.keywords,
    };
    if (editing) {
      router.post(update.url(editing.id), payload, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      router.post(store.url(), payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this intent?')) return;
    router.delete(destroy.url(id));
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Intents', href: '/admin/intents' }]}>
      <Head title="Manage Chat Intents" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chat Intents</h1>
            <p className="text-muted-foreground">Add keywords and responses to drive the chat dynamically.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-64"
                placeholder="Search intents"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Redirect</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No intents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{i.intent_slug || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{i.service_vertical}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="flex flex-wrap gap-1">
                          {(i.keywords || []).slice(0, 6).map((k, idx) => (
                            <span key={idx} className="rounded bg-muted px-2 py-0.5 text-xs">{k}</span>
                          ))}
                          {(i.keywords || []).length > 6 && (
                            <span className="text-xs text-muted-foreground">+{(i.keywords || []).length - 6}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs break-all">{i.redirect_url || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(i)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(i.id)}>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Intent' : 'Create Intent'}</DialogTitle>
              <DialogDescription>Define keywords and responses. Chat will match user input against these.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Friendly name" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intent_slug">Intent Slug</Label>
                  <Input id="intent_slug" value={data.intent_slug as string} onChange={(e) => setData('intent_slug', e.target.value)} placeholder="unique_intent_slug" />
                  {errors.intent_slug && <p className="text-sm text-red-500">{errors.intent_slug}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="service_vertical">Service</Label>
                  <select
                    id="service_vertical"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.service_vertical}
                    onChange={(e) => setData('service_vertical', e.target.value)}
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.service_vertical && <p className="text-sm text-red-500">{errors.service_vertical}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input id="priority" type="number" value={Number(data.priority)} onChange={(e) => setData('priority', Number(e.target.value))} />
                  {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Textarea id="keywords" value={data.keywords as string} onChange={(e) => setData('keywords', e.target.value)} placeholder="e.g. price, budget, cost" rows={3} />
                {errors.keywords && <p className="text-sm text-red-500">{errors.keywords}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="response_text">Response</Label>
                <Textarea id="response_text" value={data.response_text} onChange={(e) => setData('response_text', e.target.value)} placeholder="Bot response text" rows={6} />
                {errors.response_text && <p className="text-sm text-red-500">{errors.response_text}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="redirect_url">Redirect URL (optional)</Label>
                  <Input id="redirect_url" value={data.redirect_url} onChange={(e) => setData('redirect_url', e.target.value)} placeholder="/cost-estimator" />
                  {errors.redirect_url && <p className="text-sm text-red-500">{errors.redirect_url}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input id="category" value={data.category as string} onChange={(e) => setData('category', e.target.value)} placeholder="e.g. cost_info, discovery" />
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {editing ? 'Save Changes' : 'Create Intent'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
