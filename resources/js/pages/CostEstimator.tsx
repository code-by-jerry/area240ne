import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { Calculator, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// FAR Values based on documentation
const FAR_VALUES: Record<string, number> = {
    'Bangalore': 1.75,
    'Ballari': 1.75,
    'Mysore': 1.50,
    'Default': 1.75
};

const PACKAGES = [
    { id: 'basic', name: 'Basic', price: 1800 },
    { id: 'standard', name: 'Standard', price: 2200 },
    { id: 'premium', name: 'Premium', price: 2800 },
    { id: 'luxury', name: 'Luxury', price: 3500 },
];

export default function CostEstimator() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
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

    const [calculation, setCalculation] = useState({
        farValue: 1.75,
        maxBuiltup: 0,
        builtupPerFloor: 0,
        maxFloors: 0,
        totalBuiltupArea: 0,
        calculatedCost: 0
    });

    useEffect(() => {
        calculateEstimates();
    }, [data.city, data.plot_area, data.floors, data.package]);

    const calculateEstimates = () => {
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

        setCalculation({
            farValue,
            maxBuiltup,
            builtupPerFloor,
            maxFloors,
            totalBuiltupArea,
            calculatedCost
        });
        
        // Only update estimated_cost in data if it has changed to avoid loop
        if (data.estimated_cost !== calculatedCost) {
             setData('estimated_cost', calculatedCost);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cost-estimator', {
            onSuccess: () => {
                // Optional: Scroll to top or show toast
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (wasSuccessful) {
        return (
            <div className="min-h-screen bg-brand-surface dark:bg-brand-dark flex items-center justify-center p-4">
                <Head title="Cost Estimate Sent" />
                <Card className="w-full max-w-md text-center p-8">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">Estimate Sent!</CardTitle>
                    <CardDescription className="text-lg mb-6">
                        Thank you for your interest. We have sent the detailed cost estimation to your email.
                    </CardDescription>
                    <Button onClick={() => window.location.href = '/'} className="w-full">
                        Return to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-surface dark:bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Construction Cost Estimator" />
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-display font-bold text-brand-primary dark:text-white sm:text-4xl">
                        Construction Cost Estimator
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                        Get an instant estimate for your dream project based on location and specifications.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>Enter your plot details to calculate the estimate.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input 
                                                id="name" 
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)}
                                                required 
                                            />
                                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)}
                                                required 
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input 
                                                id="phone" 
                                                value={data.phone} 
                                                onChange={e => setData('phone', e.target.value)}
                                                required 
                                            />
                                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Select 
                                                value={data.city} 
                                                onValueChange={val => setData('city', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                    <SelectItem value="Ballari">Ballari</SelectItem>
                                                    <SelectItem value="Mysore">Mysore</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="plot_area">Plot Area (sq.ft)</Label>
                                            <Input 
                                                id="plot_area" 
                                                type="number" 
                                                min="1"
                                                value={data.plot_area} 
                                                onChange={e => setData('plot_area', e.target.value)}
                                                required 
                                            />
                                            {errors.plot_area && <p className="text-sm text-red-500">{errors.plot_area}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="floors">Number of Floors</Label>
                                            <Select 
                                                value={data.floors.toString()} 
                                                onValueChange={val => setData('floors', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Floors" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                                        <SelectItem key={num} value={num.toString()}>
                                                            G + {num - 1} ({num} Floors)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Construction Package</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {PACKAGES.map(pkg => (
                                                <div 
                                                    key={pkg.id}
                                                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-brand-primary ${data.package === pkg.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-zinc-200 dark:border-zinc-700'}`}
                                                    onClick={() => setData('package', pkg.id)}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold">{pkg.name}</span>
                                                        <span className="text-sm font-medium text-brand-primary">₹{pkg.price}/sq.ft</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? 'Submitting...' : 'Save Estimate'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <Card className="bg-brand-primary text-white border-none">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calculator className="h-5 w-5" />
                                        Estimated Cost
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold">
                                        {formatCurrency(calculation.calculatedCost)}
                                    </div>
                                    <p className="text-brand-primary-foreground/80 text-sm mt-2">
                                        *Approximate cost based on market rates
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Calculation Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <span className="text-zinc-500">FAR Value</span>
                                        <span className="font-medium">{calculation.farValue}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <span className="text-zinc-500">Max Allowable Built-up</span>
                                        <span className="font-medium">{calculation.maxBuiltup.toLocaleString()} sq.ft</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <span className="text-zinc-500">Built-up Per Floor</span>
                                        <span className="font-medium">{calculation.builtupPerFloor.toLocaleString()} sq.ft</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                                        <span className="text-zinc-500">Total Built-up Area</span>
                                        <span className="font-medium">{calculation.totalBuiltupArea.toLocaleString()} sq.ft</span>
                                    </div>
                                    
                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg mt-4">
                                        <h4 className="text-sm font-semibold mb-2">Recommendation</h4>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Based on your plot size and city regulations (FAR {calculation.farValue}), we recommend building up to <span className="font-bold text-brand-primary">{calculation.maxFloors} floors</span>.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
