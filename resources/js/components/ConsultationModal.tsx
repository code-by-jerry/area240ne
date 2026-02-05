import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialService?: string;
}

export function ConsultationModal({ isOpen, onClose, initialService }: ConsultationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: initialService || '',
        message: ''
    });
    const [success, setSuccess] = useState(false);

    // Update service if initialService changes when opening
    React.useEffect(() => {
        if (initialService) {
            setFormData(prev => ({ ...prev, service: initialService }));
        }
    }, [initialService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Form Submitted:", formData);
        setSuccess(true);
        setIsLoading(false);

        // Reset and close after a delay
        setTimeout(() => {
            setSuccess(false);
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
            onClose();
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-[#C7A14A] to-brand-primary" />

                <div className="p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display font-bold text-center">
                            {success ? "Request Received!" : "Start Your Consultation"}
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            {success
                                ? "Our expert consultants will review your details and reach out to you shortly."
                                : "Tell us about your needs and we'll connect you with the right expert."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {success ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <div className="h-8 w-8 bg-green-500 rounded-full animate-bounce"></div>
                        </div>
                        <p className="text-lg font-medium text-brand-primary dark:text-white">Connecting you...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary"
                            />
                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Select
                                value={formData.service}
                                onValueChange={(val) => setFormData({ ...formData, service: val })}
                            >
                                <SelectTrigger className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-brand-primary">
                                    <SelectValue placeholder="Select Service Interest" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="construction">Atha Construction</SelectItem>
                                    <SelectItem value="interiors">Nesthetix Interiors</SelectItem>
                                    <SelectItem value="real-estate">Area24 Realty</SelectItem>
                                    <SelectItem value="development">Area24 Developers</SelectItem>
                                    <SelectItem value="events">The Stage 365</SelectItem>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <textarea
                                placeholder="Briefly describe your project or requirement..."
                                className={cn(
                                    "flex min-h-[100px] w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                )}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 inline-flex items-center justify-center rounded-md bg-brand-primary dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-black transition-colors hover:bg-brand-primary/90 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Request Callback
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
