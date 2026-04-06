import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface Profile {
    id?: number;
    name: string;
    logo_url?: string | null;
    intro_text?: string | null;
    fallback_text?: string | null;
    phone?: string[] | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
}

interface Props {
    profile: Profile;
}

export default function CompanyProfilePage({ profile }: Props) {
    const [form, setForm] = useState({
        name: profile.name ?? '',
        logo_url: profile.logo_url ?? '',
        intro_text: profile.intro_text ?? '',
        fallback_text: profile.fallback_text ?? '',
        phone: (profile.phone ?? []).join(', '),
        email: profile.email ?? '',
        website: profile.website ?? '',
        instagram: profile.instagram ?? '',
        facebook: profile.facebook ?? '',
        linkedin: profile.linkedin ?? '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/admin/company-profile', {
            ...form,
            phone: form.phone.split(',').map(s => s.trim()).filter(Boolean),
        }, {
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Company Profile', href: '/admin/company-profile' }]}>
            <Head title="Company Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
                    <p className="text-muted-foreground">Global company details used in the chat greeting and responses.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name *</Label>
                                    <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo URL</Label>
                                    <Input id="logo_url" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Numbers (comma separated)</Label>
                                    <Input id="phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 99160..., +91 96069..." />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Chat Messages</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="intro_text">Welcome / Intro Message</Label>
                                <Textarea id="intro_text" rows={5} value={form.intro_text} onChange={e => set('intro_text', e.target.value)} placeholder="Hi! I'm Area24ONE..." />
                                <p className="text-xs text-muted-foreground">Shown when a visitor opens the chat for the first time.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fallback_text">Fallback Message</Label>
                                <Textarea id="fallback_text" rows={3} value={form.fallback_text} onChange={e => set('fallback_text', e.target.value)} placeholder="I'm not sure about that, but our team can help..." />
                                <p className="text-xs text-muted-foreground">Shown when no intent matches the user's message.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Social & Web Links</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://area24one.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input id="instagram" value={form.instagram} onChange={e => set('instagram', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input id="facebook" value={form.facebook} onChange={e => set('facebook', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input id="linkedin" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
