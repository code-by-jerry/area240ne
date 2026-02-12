import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, CheckCircle2, Info, MapPin, Building2, User, Mail, Phone, Ruler, Layers, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';

declare function route(name: string, params?: any): string;

interface Estimation {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    plot_area: number;
    floors: number;
    package: string;
    estimated_cost: number;
    created_at: string;
}

const FAR_VALUES: Record<string, number> = {
    'Bangalore': 1.75,
    'Ballari': 1.75,
    'Mysore': 1.50,
    'Default': 1.75
};

const PACKAGES: Record<string, string> = {
    'basic': 'Basic',
    'standard': 'Standard',
    'premium': 'Premium',
    'luxury': 'Luxury'
};

export default function CostEstimationResult({ estimation }: { estimation: Estimation }) {
    const farValue = FAR_VALUES[estimation.city] || FAR_VALUES['Default'];
    const maxBuiltup = Math.floor(estimation.plot_area * farValue);
    const builtupPerFloor = Math.floor(estimation.plot_area * 0.75);
    const totalBuiltupArea = builtupPerFloor * estimation.floors;
    const maxFloors = builtupPerFloor > 0 ? Math.floor(maxBuiltup / builtupPerFloor) : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Construction Cost Estimation',
                text: `Check out my construction cost estimation: ${formatCurrency(estimation.estimated_cost)}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Estimation Result" />

            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <Link 
                            href={route('cost-estimator.create')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-brand-primary transition-colors mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Estimator
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                            Estimation Summary
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            Submitted on {new Date(estimation.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full flex items-center gap-2"
                            onClick={handleShare}
                        >
                            <Share2 className="h-4 w-4" />
                            Share Result
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Side: Summary Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-5 space-y-6"
                    >
                        <Card className="bg-brand-primary border-none shadow-2xl shadow-brand-primary/30 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Calculator className="h-32 w-32 text-white" />
                            </div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-white/80 text-sm font-medium">
                                    Total Estimated Cost
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 pb-8">
                                <div className="text-4xl font-display font-bold text-white tracking-tight">
                                    {formatCurrency(estimation.estimated_cost)}
                                </div>
                                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg w-fit backdrop-blur-sm">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                    <span className="text-white text-xs font-medium">
                                        Verified Estimation
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Project Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                        <MapPin className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{estimation.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                        <Ruler className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Plot Area</p>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{estimation.plot_area} sq.ft</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                        <Layers className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Structure</p>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">G + {estimation.floors - 1} Floors</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                        <Building2 className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Package</p>
                                        <p className="text-sm font-semibold text-brand-primary">{PACKAGES[estimation.package] || estimation.package}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Side: Technical Breakdown */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-7 space-y-6"
                    >
                        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                            <CardHeader className="pb-2 border-b border-zinc-50 dark:border-zinc-800">
                                <CardTitle className="text-xl">Technical Breakdown</CardTitle>
                                <CardDescription>Detailed analysis based on local regulations</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-xs text-zinc-400 font-medium mb-1">FAR Regulation</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-white">{farValue}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-xs text-zinc-400 font-medium mb-1">Max Floors</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-white">{maxFloors}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-zinc-50 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-zinc-300" />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Max Allowable Built-up</span>
                                        </div>
                                        <span className="font-bold text-zinc-900 dark:text-white">{maxBuiltup.toLocaleString()} sq.ft</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-zinc-50 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-zinc-300" />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Built-up Per Floor</span>
                                        </div>
                                        <span className="font-bold text-zinc-900 dark:text-white">{builtupPerFloor.toLocaleString()} sq.ft</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-brand-primary" />
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">Total Construction Area</span>
                                        </div>
                                        <span className="font-bold text-brand-primary text-lg">{totalBuiltupArea.toLocaleString()} sq.ft</span>
                                    </div>
                                </div>

                                <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-6 rounded-2xl border border-brand-primary/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Info className="h-4 w-4 text-brand-primary" />
                                            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Expert Recommendation</h4>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                            Based on {estimation.city}'s FAR of {farValue}, your plot supports a maximum of <span className="font-bold text-zinc-900 dark:text-white">{maxFloors} floors</span>. Your selection of <span className="font-bold text-zinc-900 dark:text-white">G + {estimation.floors - 1}</span> is within the regulatory limits.
                                        </p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Building2 className="h-24 w-24 text-brand-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Contact Info */}
                        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
                            <CardHeader className="bg-zinc-50 dark:bg-zinc-800/50 py-4 px-6">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <User className="h-4 w-4" /> Submitted By
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{estimation.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-zinc-400" />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{estimation.phone}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    </ErrorBoundary>
);
}
