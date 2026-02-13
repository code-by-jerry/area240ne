import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { store, update, destroy } from '@/routes/admin/hero-slides';
import { Plus, Pencil, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define type based on Model
interface HeroSlide {
    id: number;
    title?: string;
    description?: string;
    image_path: string;
    button_text?: string;
    button_link?: string;
    order: number;
    is_active: boolean;
}

export default function HeroSlides({ slides }: { slides: HeroSlide[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        button_text: '',
        button_link: '',
        order: 0,
        is_active: true,
        image_url: '',
    });

    const openCreateDialog = () => {
        setEditingSlide(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setData({
            title: slide.title || '',
            description: slide.description || '',
            button_text: slide.button_text || '',
            button_link: slide.button_link || '',
            order: slide.order,
            is_active: Boolean(slide.is_active),
            image_url: slide.image_path || '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingSlide) {
            // Use post with _method: put if needed, or just post for FormData in Laravel
            // Laravel Inertia file uploads with PUT/PATCH are tricky, usually easier to use POST with _method spoofing
            // or just a dedicated route. Here I used POST in web.php for update as well.
            post(update.url(editingSlide.id), {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post(store.url(), {
                onSuccess: () => setIsDialogOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Hero Slides', href: '/admin/hero-slides' }]}>
            <Head title="Manage Hero Slides" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Hero Carousel</h1>
                        <p className="text-muted-foreground">
                            Manage the slides displayed on the homepage hero section.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Slide
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Title & Description</TableHead>
                                    <TableHead>Button</TableHead>
                                    <TableHead className="w-[100px]">Order</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slides.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No slides found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    slides.map((slide) => (
                                        <TableRow key={slide.id}>
                                            <TableCell>
                                                <div className="relative h-12 w-20 overflow-hidden rounded-md bg-slate-100">
                                                    <img 
                                                        src={slide.image_path} 
                                                        alt={slide.title} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{slide.title || 'No Title'}</div>
                                                <div className="truncate max-w-xs text-xs text-muted-foreground">
                                                    {slide.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {slide.button_text ? (
                                                    <Badge variant="outline">{slide.button_text}</Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{slide.order}</TableCell>
                                            <TableCell>
                                                <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                                                    {slide.is_active ? 'Active' : 'Hidden'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => openEditDialog(slide)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() => handleDelete(slide.id)}
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

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{editingSlide ? 'Edit Slide' : 'Create New Slide'}</DialogTitle>
                            <DialogDescription>
                                Add a new slide to the homepage carousel.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="image_url">Background Image URL {editingSlide ? '(Optional)' : '(Required)'}</Label>
                                <div className="flex items-center gap-4">
                                    {editingSlide && (
                                        <div className="relative h-20 w-32 overflow-hidden rounded-md border">
                                            <img src={editingSlide.image_path} alt="Current" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <Input 
                                        id="image_url" 
                                        type="url" 
                                        value={data.image_url}
                                        onChange={(e) => setData('image_url', e.target.value)}
                                        placeholder="https://example.com/your-image.jpg"
                                    />
                                </div>
                                {errors.image_url && <p className="text-sm text-red-500">{errors.image_url}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input 
                                        id="title" 
                                        value={data.title} 
                                        onChange={(e) => setData('title', e.target.value)} 
                                        placeholder="e.g. Modern Living"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input 
                                        id="order" 
                                        type="number"
                                        value={data.order} 
                                        onChange={(e) => setData('order', parseInt(e.target.value))} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={data.description} 
                                    onChange={(e) => setData('description', e.target.value)} 
                                    placeholder="Short description for the slide..."
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="button_text">Button Text</Label>
                                    <Input 
                                        id="button_text" 
                                        value={data.button_text} 
                                        onChange={(e) => setData('button_text', e.target.value)} 
                                        placeholder="e.g. View Projects"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="button_link">Button Link</Label>
                                    <Input 
                                        id="button_link" 
                                        value={data.button_link} 
                                        onChange={(e) => setData('button_link', e.target.value)} 
                                        placeholder="e.g. /projects"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch 
                                    id="is_active" 
                                    checked={data.is_active} 
                                    onCheckedChange={(checked) => setData('is_active', checked)} 
                                />
                                <Label htmlFor="is_active">Active (Visible on homepage)</Label>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingSlide ? 'Save Changes' : 'Create Slide'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
