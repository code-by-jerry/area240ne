import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, Copy, Image as ImageIcon } from 'lucide-react';

interface MediaAsset {
    id: number;
    title: string;
    image_path: string;
    image_url: string;
    is_active: boolean;
    created_at?: string | null;
}

interface Props {
    assets: MediaAsset[];
}

export default function MediaAssets({ assets }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MediaAsset | null>(null);
    const [q, setQ] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        title: string;
        image: File | null;
        is_active: boolean;
    }>({
        title: '',
        image: null,
        is_active: true,
    });

    useEffect(() => {
        if (!data.image) {
            setPreviewUrl(editing?.image_url ?? null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image, editing?.image_url]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return assets;

        return assets.filter((asset) => asset.title.toLowerCase().includes(term));
    }, [assets, q]);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setPreviewUrl(null);
        setOpen(true);
    };

    const openEdit = (asset: MediaAsset) => {
        setEditing(asset);
        setData({
            title: asset.title,
            image: null,
            is_active: asset.is_active,
        });
        clearErrors();
        setPreviewUrl(asset.image_url);
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = editing ? `/admin/media-assets/${editing.id}` : '/admin/media-assets';

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                setPreviewUrl(null);
            },
        });
    };

    const handleDelete = (asset: MediaAsset) => {
        if (!confirm(`Delete media asset "${asset.title}"?`)) return;
        router.delete(`/admin/media-assets/${asset.id}`);
    };

    const copyImageUrl = async (url: string) => {
        await navigator.clipboard.writeText(url);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Media Assets', href: '/admin/media-assets' }]}> 
            <Head title="Media Assets" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Media Assets</h1>
                        <p className="text-muted-foreground">
                            Manage reusable uploaded images for admin and site content.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="w-64 pl-8" placeholder="Search assets" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Asset
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Image URL</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No media assets found.
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.title}</TableCell>
                                        <TableCell>
                                            <div className="h-14 w-20 overflow-hidden rounded-md border bg-muted">
                                                <img src={asset.image_url} alt={asset.title} className="h-full w-full object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="max-w-xs truncate rounded bg-muted px-2 py-1 text-xs">{asset.image_url}</code>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => copyImageUrl(asset.image_url)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={asset.is_active ? 'default' : 'secondary'}>
                                                {asset.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(asset)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(asset)}>
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
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Media Asset' : 'Create Media Asset'}</DialogTitle>
                            <DialogDescription>
                                Upload a reusable image asset and manage its visibility.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Asset title" />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image Upload {editing ? '(Optional to replace)' : ''}</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                />
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                            <ImageIcon className="h-6 w-6" />
                                            No image selected
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Inactive assets remain stored but can be hidden from selection workflows.
                                    </p>
                                </div>
                                <Button type="button" variant={data.is_active ? 'default' : 'outline'} onClick={() => setData('is_active', !data.is_active)}>
                                    {data.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : editing ? 'Save Changes' : 'Create Asset'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
