import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CostEstimation {
    id: number;
    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    plot_area: string;
    floors: number;
    package: string;
    estimated_cost: string;
    created_at: string;
}

export default function CostEstimations({ estimations }: { estimations: CostEstimation[] }) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Cost Estimations', href: '/admin/cost-estimations' }]}>
            <Head title="Cost Estimations" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Cost Estimations</h1>
                        <p className="text-muted-foreground">
                            View and manage cost estimation requests from users.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Requests</CardTitle>
                        <CardDescription>
                            A list of all cost estimation queries submitted via the website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client Details</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Project Specs</TableHead>
                                    <TableHead>Package</TableHead>
                                    <TableHead>Est. Cost</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estimations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No cost estimations found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    estimations.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.email}</div>
                                                <div className="text-xs text-muted-foreground">{item.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{item.city}, {item.state}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{item.plot_area} sq.ft</div>
                                                <div className="text-xs text-muted-foreground">{item.floors} Floors</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.package}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(item.estimated_cost)}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDate(item.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
