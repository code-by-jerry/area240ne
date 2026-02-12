import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { Calculator, CheckCircle2, Info, ArrowRight, Lock, MapPin, Building2, User, Mail, Phone, Ruler, Layers } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// FAR Values based on documentation
const FAR_VALUES: Record<string, number> = {
    'Bangalore': 1.75,
    'Ballari': 1.75,
    'Mysore': 1.50,
    'Default': 1.75
};

const PACKAGES = [
    { 
        id: 'basic', 
        name: 'Basic', 
        price: 1800, 
        description: 'Standard finishes, essential amenities',
        features: ['RCC Structure', 'Standard Flooring', 'Basic Electrical']
    },
    { 
        id: 'standard', 
        name: 'Standard', 
        price: 2200, 
        description: 'Quality materials, better aesthetics',
        features: ['Premium Vitrified Tiles', 'Modular Switches', 'Plastic Emulsion Paint']
    },
    { 
        id: 'premium', 
        name: 'Premium', 
        price: 2800, 
        description: 'Superior finishes, modern design',
        features: ['Italian Marble', 'Branded Fittings', 'Smart Home Ready']
    },
    { 
        id: 'luxury', 
        name: 'Luxury', 
        price: 3500, 
        description: 'Ultra-premium specifications',
        features: ['Designer Interiors', 'Home Automation', 'Premium Landscaping']
    },
];

export default function CostEstimator() {
    const [showResults, setShowResults] = useState(false);
    
    const { data, setData, post, processing, errors, reset, wasSuccessful, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        state: 'Karnataka',
        city: 'Bangalore',
        plot_area: '',
        floors: '1',
        package: 'standard',
        estimated_cost: 0,
    });

    const calculation = useMemo(() => {
        const plotArea = parseFloat(data.plot_area as string) || 0;
        const farValue = FAR_VALUES[data.city] || FAR_VALUES['Default'];
        const maxBuiltup = Math.floor(plotArea * farValue);
        const builtupPerFloor = Math.floor(plotArea * 0.75);
        
        let maxFloors = builtupPerFloor > 0 ? Math.floor(maxBuiltup / builtupPerFloor) : 0;
        if (maxFloors < 1) maxFloors = 1;

        const selectedFloors = parseInt(data.floors as string) || 1;
        const totalBuiltupArea = builtupPerFloor * selectedFloors;
        
        const selectedPackage = PACKAGES.find(p => p.id === data.package);
        const pricePerSqft = selectedPackage ? selectedPackage.price : 0;
        const calculatedCost = totalBuiltupArea * pricePerSqft;

        return {
            farValue,
            maxBuiltup,
            builtupPerFloor,
            maxFloors,
            totalBuiltupArea,
            calculatedCost
        };
    }, [data.city, data.plot_area, data.floors, data.package]);

    // Ensure we always send the latest calculated cost, even if the state update is pending
    useEffect(() => {
        transform((data) => ({
            ...data,
            estimated_cost: calculation.calculatedCost,
        }));
    }, [calculation.calculatedCost]);

    useEffect(() => {
        if (data.estimated_cost !== calculation.calculatedCost) {
            setData('estimated_cost', calculation.calculatedCost);
        }
    }, [calculation.calculatedCost]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cost-estimator', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowResults(true);
                // Scroll to results on mobile
                setTimeout(() => {
                    const element = document.getElementById('estimation-results');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });
    };

    // Auto-lock when project details change
    // This ensures results are only shown for the submitted data
    // (Consolidated into the effect below)

    // Ensure results show if the submission was successful
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (wasSuccessful) {
            setIsUnlocked(true);
            setShowResults(true);
        }
    }, [wasSuccessful]);

    // Reset unlock state only on manual recalculate, but lock details when user changes inputs
    const handleRecalculate = () => {
        reset();
        setIsUnlocked(false);
        setShowResults(false);
    };

    // Auto-lock details when project configuration changes
    // This ensures they must re-submit to see details for new values
    useEffect(() => {
        if (isUnlocked) {
            setIsUnlocked(false);
            setShowResults(false);
        }
    }, [data.plot_area, data.floors, data.package, data.city]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (wasSuccessful && showResults) {
        // We'll show the success state with the results instead of a separate page
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Construction Cost Estimator" />
            
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
                        <Calculator className="h-4 w-4" />
                        Smart Estimation Tool
                    </div>
                    <h1 className="text-4xl font-display font-bold text-zinc-900 dark:text-white sm:text-5xl tracking-tight">
                        Construction Cost Estimator
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Get an accurate, professional cost breakdown for your construction project in seconds.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Section */}
                    <motion.div 
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="lg:col-span-7"
                    >
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                                        <Building2 className="h-5 w-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Project Configuration</CardTitle>
                                        <CardDescription>Fill in your details to generate a professional estimate.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-8 pt-6">
                                    {/* Personal Info Group */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <User className="h-4 w-4" /> Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name" className="text-xs font-medium ml-1">Full Name</Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="name" 
                                                        placeholder="John Doe"
                                                        className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary"
                                                        value={data.name} 
                                                        onChange={e => setData('name', e.target.value)}
                                                        required 
                                                    />
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                </div>
                                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email" className="text-xs font-medium ml-1">Email Address</Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="email" 
                                                        type="email" 
                                                        placeholder="john@example.com"
                                                        className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary"
                                                        value={data.email} 
                                                        onChange={e => setData('email', e.target.value)}
                                                        required 
                                                    />
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                </div>
                                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="phone" className="text-xs font-medium ml-1">Phone Number</Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="phone" 
                                                        placeholder="+91 98765 43210"
                                                        className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary"
                                                        value={data.phone} 
                                                        onChange={e => setData('phone', e.target.value)}
                                                        required 
                                                    />
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                </div>
                                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="city" className="text-xs font-medium ml-1">City / Location</Label>
                                                <div className="relative">
                                                    <Select value={data.city} onValueChange={val => setData('city', val)}>
                                                        <SelectTrigger className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary">
                                                            <SelectValue placeholder="Select City" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                            <SelectItem value="Ballari">Ballari</SelectItem>
                                                            <SelectItem value="Mysore">Mysore</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dimensions Group */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <Ruler className="h-4 w-4" /> Plot & Structure
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="plot_area" className="text-xs font-medium ml-1">Plot Area (sq.ft)</Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="plot_area" 
                                                        type="number" 
                                                        placeholder="e.g. 1200"
                                                        className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary"
                                                        value={data.plot_area} 
                                                        onChange={e => setData('plot_area', e.target.value)}
                                                        required 
                                                    />
                                                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="floors" className="text-xs font-medium ml-1">Total Floors</Label>
                                                <div className="relative">
                                                    <Select 
                                                        value={data.floors.toString()} 
                                                        onValueChange={val => setData('floors', val)}
                                                    >
                                                        <SelectTrigger className="pl-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-brand-primary">
                                                            <SelectValue placeholder="Select Floors" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                                <SelectItem key={num} value={num.toString()}>
                                                                    G + {num - 1} ({num} {num === 1 ? 'Floor' : 'Floors'})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Selection */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            Construction Package
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {PACKAGES.map(pkg => (
                                                <motion.div 
                                                    key={pkg.id}
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                                        data.package === pkg.id 
                                                        ? 'border-brand-primary bg-brand-primary/[0.03] ring-4 ring-brand-primary/10' 
                                                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                                                    }`}
                                                    onClick={() => setData('package', pkg.id)}
                                                >
                                                    {data.package === pkg.id && (
                                                        <div className="absolute top-2 right-2">
                                                            <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`font-bold ${data.package === pkg.id ? 'text-brand-primary' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                            {pkg.name}
                                                        </span>
                                                        <span className="text-lg font-display font-bold text-zinc-900 dark:text-white">
                                                            ₹{pkg.price} <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">/sq.ft</span>
                                                        </span>
                                                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{pkg.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-6 pb-8 px-6">
                                    <Button 
                                        type="submit" 
                                        className="w-full py-6 text-lg font-bold bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Get Estimation
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>

                    {/* Summary Section */}
                    <div id="estimation-results" className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
                        <AnimatePresence mode="wait">
                            {/* Live Estimate Card - Always Visible */}
                            <motion.div
                                key="main-cost"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <Card className="bg-brand-primary border-none shadow-2xl shadow-brand-primary/30 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Calculator className="h-32 w-32 text-white" />
                                    </div>
                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-white/80 text-sm font-medium flex items-center gap-2">
                                            Estimated Project Cost
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="text-5xl font-display font-bold text-white tracking-tight">
                                            {calculation.calculatedCost > 0 ? formatCurrency(calculation.calculatedCost) : '₹0'}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg w-fit backdrop-blur-sm">
                                            <Info className="h-4 w-4 text-white/70" />
                                            <span className="text-white/70 text-xs">
                                                Live estimation based on inputs
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {!isUnlocked ? (
                                    <motion.div
                                        key="locked-details"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group"
                                    >
                                        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md z-10 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center transition-all group-hover:bg-white/50 dark:group-hover:bg-zinc-900/50">
                                            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                                <Lock className="h-8 w-8 text-zinc-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Details Locked</h3>
                                            <p className="text-sm text-zinc-500 max-w-[240px]">
                                                Submit the form to unlock the detailed breakdown and expert recommendations.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="unlocked-details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Success Message */}
                                        {wasSuccessful && (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500 rounded-full">
                                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                                </div>
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    Estimate sent successfully to your email!
                                                </p>
                                            </div>
                                        )}

                                        {/* Breakdown Card */}
                                        <Card className="border-none shadow-xl bg-white dark:bg-zinc-900">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                                                        <span className="text-sm text-zinc-500">FAR Regulation ({data.city})</span>
                                                        <span className="font-bold text-zinc-900 dark:text-white">{calculation.farValue}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                                                        <span className="text-sm text-zinc-500">Max Allowable Built-up</span>
                                                        <span className="font-bold text-zinc-900 dark:text-white">{calculation.maxBuiltup.toLocaleString()} sq.ft</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                                                        <span className="text-sm text-zinc-500">Built-up Per Floor</span>
                                                        <span className="font-bold text-zinc-900 dark:text-white">{calculation.builtupPerFloor.toLocaleString()} sq.ft</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                                                        <span className="text-sm text-zinc-500">Total Construction Area</span>
                                                        <span className="font-bold text-brand-primary">{calculation.totalBuiltupArea.toLocaleString()} sq.ft</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-4 rounded-2xl border border-brand-primary/10 mt-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                                                        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Expert Recommendation</h4>
                                                    </div>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                                        Based on {data.city}'s FAR of {calculation.farValue}, your plot supports a maximum of <span className="font-bold text-zinc-900 dark:text-white">{calculation.maxFloors} floors</span>. We suggest optimizing your layout to utilize this area efficiently.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Button 
                                            variant="outline" 
                                            onClick={handleRecalculate}
                                            className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900"
                                        >
                                            Recalculate Estimate
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
