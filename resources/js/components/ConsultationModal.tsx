import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialService?: string;
}

const EMPTY_FORM = { name: '', email: '', phone: '', service: '', message: '' };

export function ConsultationModal({ isOpen, onClose, initialService }: ConsultationModalProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialService) setForm(f => ({ ...f, service: initialService }));
    }, [initialService]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSuccess(false);
                setError('');
                setForm(EMPTY_FORM);
            }, 300); // after close animation
        }
    }, [isOpen]);

    const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/leads', {
                name: form.name,
                phone: form.phone,
                email: form.email,
                service: form.service,
                message: form.message,
            });
            setSuccess(true);
            setTimeout(onClose, 2500);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-primary z-20" />

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left — image, hidden on mobile */}
                    <div className="relative hidden md:block h-full min-h-[480px]">
                        <img
                            src="https://ik.imagekit.io/area24onestorage/assets/CTA-image.png"
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-primary/10" />
                    </div>

                    {/* Right — form */}
                    <div className="flex flex-col">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-display font-bold">
                                    {success ? 'Request Received!' : 'Start Your Consultation'}
                                </DialogTitle>
                                <DialogDescription className="pt-1">
                                    {success
                                        ? 'Our team will reach out to you shortly.'
                                        : "Tell us about your needs and we'll connect you with the right expert."}
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        {success ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
                                <CheckCircle2 className="h-14 w-14 text-green-500" />
                                <p className="text-base font-medium text-brand-primary dark:text-white">
                                    Connecting you to the right expert...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-6">
                                <Input
                                    placeholder="Full Name"
                                    required
                                    value={form.name}
                                    onChange={e => set('name', e.target.value)}
                                    className="h-11 bg-zinc-50 dark:bg-zinc-900"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={form.email}
                                        onChange={e => set('email', e.target.value)}
                                        className="h-11 bg-zinc-50 dark:bg-zinc-900"
                                    />
                                    <Input
                                        type="tel"
                                        placeholder="Phone"
                                        required
                                        value={form.phone}
                                        onChange={e => set('phone', e.target.value)}
                                        className="h-11 bg-zinc-50 dark:bg-zinc-900"
                                    />
                                </div>

                                <Select value={form.service} onValueChange={val => set('service', val)}>
                                    <SelectTrigger className="h-11 bg-zinc-50 dark:bg-zinc-900">
                                        <SelectValue placeholder="Select Service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Services</SelectLabel>
                                            <SelectItem value="construction">Construction (Atha Construction)</SelectItem>
                                            <SelectItem value="interiors">Interiors (Nesthetix Design)</SelectItem>
                                            <SelectItem value="real-estate">Real Estate (Area24 Realty)</SelectItem>
                                            <SelectItem value="development">Development (Area24 Developers)</SelectItem>
                                            <SelectItem value="events">Events (The Stage 365)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Other</SelectLabel>
                                            <SelectItem value="general">General Inquiry</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <textarea
                                    placeholder="Briefly describe your project..."
                                    className={cn(
                                        'min-h-[90px] w-full rounded-md border border-input bg-zinc-50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:bg-zinc-900',
                                    )}
                                    value={form.message}
                                    onChange={e => set('message', e.target.value)}
                                />

                                {error && <p className="text-sm text-red-500">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-auto h-11 w-full inline-flex items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-bold text-white transition-colors hover:bg-brand-primary/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                                    ) : (
                                        <>Request Callback <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
