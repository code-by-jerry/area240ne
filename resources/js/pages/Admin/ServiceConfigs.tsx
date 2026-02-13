import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

interface ServiceConfig {
  id: number;
  service_vertical: string;
  q1?: string | null;
  q2?: string | null;
  q3?: string | null;
  options_q1?: string[] | null;
  options_q2?: string[] | null;
  options_q3?: string[] | null;
  brand_name?: string | null;
  brand_short?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  phone?: string[] | null;
  projects_count?: string | null;
  description?: string | null;
  ceo_name?: string | null;
  ceo_website?: string | null;
  ceo_experience?: string | null;
  intro_text?: string | null;
  greeting_keywords?: string[] | null;
  location_keywords?: Record<string, string[]> | null;
  process_timeline?: string | null;
  detection_keywords?: string[] | null;
}

interface Props {
  configs: ServiceConfig[];
}

const SERVICE_OPTIONS = ['Construction','Interiors','Real Estate','Event','Land Development'];

export default function ServiceConfigs({ configs }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceConfig | null>(null);
  const [q, setQ] = useState('');

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    service_vertical: 'Construction',
    q1: '',
    q2: '',
    q3: '',
    options_q1: '' as string | string[],
    options_q2: '' as string | string[],
    options_q3: '' as string | string[],
    brand_name: '',
    brand_short: '',
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    phone: '' as string | string[],
    projects_count: '',
    description: '',
    ceo_name: '',
    ceo_website: '',
    ceo_experience: '',
    intro_text: '',
    greeting_keywords: '' as string | string[],
    location_keywords: '',
    process_timeline: '',
    detection_keywords: '' as string | string[],
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return configs;
    return configs.filter(c =>
      (c.service_vertical?.toLowerCase().includes(term)) ||
      (c.brand_name?.toLowerCase().includes(term)) ||
      (c.description?.toLowerCase().includes(term))
    );
  }, [q, configs]);

  const openCreateDialog = () => {
    setEditing(null);
    reset();
    clearErrors();
    setIsDialogOpen(true);
  };

  const openEditDialog = (cfg: ServiceConfig) => {
    setEditing(cfg);
    setData({
      service_vertical: cfg.service_vertical || 'Construction',
      q1: cfg.q1 || '',
      q2: cfg.q2 || '',
      q3: cfg.q3 || '',
      options_q1: (cfg.options_q1 || []).join(', '),
      options_q2: (cfg.options_q2 || []).join(', '),
      options_q3: (cfg.options_q3 || []).join(', '),
      brand_name: cfg.brand_name || '',
      brand_short: cfg.brand_short || '',
      website: cfg.website || '',
      instagram: cfg.instagram || '',
      facebook: cfg.facebook || '',
      linkedin: cfg.linkedin || '',
      phone: (cfg.phone || []).join(', '),
      projects_count: cfg.projects_count || '',
      description: cfg.description || '',
      ceo_name: cfg.ceo_name || '',
      ceo_website: cfg.ceo_website || '',
      ceo_experience: cfg.ceo_experience || '',
      intro_text: cfg.intro_text || '',
      greeting_keywords: (cfg.greeting_keywords || []).join(', '),
      location_keywords: cfg.location_keywords ? JSON.stringify(cfg.location_keywords, null, 2) : '',
      process_timeline: cfg.process_timeline || '',
      detection_keywords: (cfg.detection_keywords || []).join(', '),
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const payload = () => ({
    ...data,
    options_q1: typeof data.options_q1 === 'string' ? (data.options_q1 as string).split(',').map(s => s.trim()).filter(Boolean) : data.options_q1,
    options_q2: typeof data.options_q2 === 'string' ? (data.options_q2 as string).split(',').map(s => s.trim()).filter(Boolean) : data.options_q2,
    options_q3: typeof data.options_q3 === 'string' ? (data.options_q3 as string).split(',').map(s => s.trim()).filter(Boolean) : data.options_q3,
    phone: typeof data.phone === 'string' ? (data.phone as string).split(',').map(s => s.trim()).filter(Boolean) : data.phone,
    greeting_keywords: typeof data.greeting_keywords === 'string' ? (data.greeting_keywords as string).split(',').map(s => s.trim()).filter(Boolean) : data.greeting_keywords,
    detection_keywords: typeof data.detection_keywords === 'string' ? (data.detection_keywords as string).split(',').map(s => s.trim()).filter(Boolean) : data.detection_keywords,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      router.post(`/admin/service-configs/${editing.id}`, payload(), { onSuccess: () => setIsDialogOpen(false) });
    } else {
      router.post('/admin/service-configs', payload(), { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this service config?')) return;
    router.delete(`/admin/service-configs/${id}`);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Service Configs', href: '/admin/service-configs' }]}>
      <Head title="Manage Service Configs" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Service Configs</h1>
            <p className="text-muted-foreground">Manage service questions, options, and brand info for chat.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-64"
                placeholder="Search services"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Config
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Phones</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No configs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Badge variant="secondary">{c.service_vertical}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{c.brand_name || '-'}</TableCell>
                      <TableCell className="text-xs">
                        {(c.phone || []).join(', ') || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(c.id)}>
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
              <DialogTitle>{editing ? 'Edit Service Config' : 'Create Service Config'}</DialogTitle>
              <DialogDescription>Define service questions, options, and brand details.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input id="brand_name" value={data.brand_name} onChange={(e) => setData('brand_name', e.target.value)} />
                  {errors.brand_name && <p className="text-sm text-red-500">{errors.brand_name}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand_short">Brand Short</Label>
                  <Input id="brand_short" value={data.brand_short} onChange={(e) => setData('brand_short', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects_count">Projects Count</Label>
                  <Input id="projects_count" value={data.projects_count} onChange={(e) => setData('projects_count', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" value={data.facebook} onChange={(e) => setData('facebook', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" value={data.linkedin} onChange={(e) => setData('linkedin', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phones (comma separated)</Label>
                  <Input id="phone" value={data.phone as string} onChange={(e) => setData('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="process_timeline">Process & Timeline</Label>
                  <Textarea id="process_timeline" value={data.process_timeline} onChange={(e) => setData('process_timeline', e.target.value)} rows={3} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ceo_name">CEO Name</Label>
                  <Input id="ceo_name" value={data.ceo_name} onChange={(e) => setData('ceo_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceo_website">CEO Website</Label>
                  <Input id="ceo_website" value={data.ceo_website} onChange={(e) => setData('ceo_website', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceo_experience">CEO Experience</Label>
                <Input id="ceo_experience" value={data.ceo_experience} onChange={(e) => setData('ceo_experience', e.target.value)} />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Global Chat Settings (Service-Agnostic)</h3>
                <p className="text-sm text-muted-foreground mb-4">These fields only need to be filled in <strong>one</strong> of the service configs to take effect globally.</p>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="intro_text">Bot Intro Text</Label>
                  <Textarea id="intro_text" value={data.intro_text} onChange={(e) => setData('intro_text', e.target.value)} rows={4} placeholder="The main welcome message..." />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="greeting_keywords">Greeting Keywords (comma separated)</Label>
                    <Input id="greeting_keywords" value={data.greeting_keywords as string} onChange={(e) => setData('greeting_keywords', e.target.value)} placeholder="hi, hello, namaste..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="detection_keywords">Detection Keywords (comma separated)</Label>
                    <Input id="detection_keywords" value={data.detection_keywords as string} onChange={(e) => setData('detection_keywords', e.target.value)} placeholder="build, construct, house..." />
                    <p className="text-[10px] text-muted-foreground">Used to detect this specific service intent.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_keywords">Location Keywords (JSON)</Label>
                    <Textarea id="location_keywords" value={data.location_keywords} onChange={(e) => setData('location_keywords', e.target.value)} rows={4} placeholder='{"bangalore": ["blr", "bengaluru"]}' />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Q1 Prompt</Label>
                  <Input value={data.q1} onChange={(e) => setData('q1', e.target.value)} />
                  <Label>Q1 Options (comma)</Label>
                  <Input value={data.options_q1 as string} onChange={(e) => setData('options_q1', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Q2 Prompt</Label>
                  <Input value={data.q2} onChange={(e) => setData('q2', e.target.value)} />
                  <Label>Q2 Options (comma)</Label>
                  <Input value={data.options_q2 as string} onChange={(e) => setData('options_q2', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Q3 Prompt</Label>
                <Input value={data.q3} onChange={(e) => setData('q3', e.target.value)} />
                <Label>Q3 Options (comma)</Label>
                <Input value={data.options_q3 as string} onChange={(e) => setData('options_q3', e.target.value)} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {editing ? 'Save Changes' : 'Create Config'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
