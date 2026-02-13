import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Mail, Calculator } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Stats = {
    users_total: number;
    users_today: number;
    leads_total: number;
    leads_today: number;
    estimations_total: number;
    estimations_today: number;
};

type LeadItem = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    service: string | null;
    location: string | null;
    lead_status: string | null;
    created_at: string;
};

type UserItem = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    created_at: string;
};

type EstimationItem = {
    id: number;
    name: string;
    city: string;
    package: string;
    estimated_cost: number;
    created_at: string;
};

type SeriesPoint = { date: string; count: number };
type StatusCounts = Record<string, number>;

export default function Dashboard({
    stats,
    recentLeads,
    recentUsers,
    recentEstimations,
    usersSeries,
    leadsSeries,
    estimationsSeries,
    leadStatusCounts,
}: {
    stats: Stats;
    recentLeads: LeadItem[];
    recentUsers: UserItem[];
    recentEstimations: EstimationItem[];
    usersSeries: SeriesPoint[];
    leadsSeries: SeriesPoint[];
    estimationsSeries: SeriesPoint[];
    leadStatusCounts: StatusCounts;
}) {
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(Number(amount));

    const statusData = Object.entries(leadStatusCounts).map(([name, value]) => ({ name, value }));
    const statusColors: Record<string, string> = {
        hot: '#ef4444',
        warm: '#f59e0b',
        cold: '#3b82f6',
        new: '#10b981',
        unknown: '#9ca3af',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users_total}</div>
                            <p className="text-xs text-muted-foreground">Today {stats.users_today}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">Leads</CardTitle>
                            <Mail className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.leads_total}</div>
                            <p className="text-xs text-muted-foreground">Today {stats.leads_today}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">Estimations</CardTitle>
                            <Calculator className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.estimations_total}</div>
                            <p className="text-xs text-muted-foreground">Today {stats.estimations_today}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Overview</CardTitle>
                            <CardDescription>Latest activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <div className="text-lg font-semibold">{stats.users_today}</div>
                                    <div className="text-xs text-muted-foreground">New Users</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">{stats.leads_today}</div>
                                    <div className="text-xs text-muted-foreground">New Leads</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold">{stats.estimations_today}</div>
                                    <div className="text-xs text-muted-foreground">Estimations</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users Trend (14 days)</CardTitle>
                            <CardDescription>Daily registrations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart data={usersSeries}>
                                    <defs>
                                        <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#eee" strokeDasharray="4 4" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <ChartTooltip />
                                    <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#usersGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads Trend (14 days)</CardTitle>
                            <CardDescription>Daily inbound leads</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart data={leadsSeries}>
                                    <defs>
                                        <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#eee" strokeDasharray="4 4" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <ChartTooltip />
                                    <Area type="monotone" dataKey="count" stroke="#7c3aed" fill="url(#leadsGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estimations Trend (14 days)</CardTitle>
                            <CardDescription>Daily estimation requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={estimationsSeries}>
                                    <CartesianGrid stroke="#eee" strokeDasharray="4 4" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <ChartTooltip />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#059669" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Status</CardTitle>
                            <CardDescription>Distribution by status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="relative h-[200px] w-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={70}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                labelLine={false}
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#6b7280'} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-xl font-bold">
                                                {statusData.reduce((s, d) => s + d.value, 0)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Total Leads</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                    {statusData.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <span
                                                className="inline-block h-2 w-2 rounded"
                                                style={{ background: statusColors[item.name] || '#6b7280' }}
                                            />
                                            <span className="capitalize">{item.name}</span>
                                            <span className="ml-auto font-medium">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Leads</CardTitle>
                            <CardDescription>Latest incoming leads</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentLeads.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No leads</TableCell>
                                        </TableRow>
                                    ) : (
                                        recentLeads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="font-medium">{lead.name}</TableCell>
                                                <TableCell>{lead.service || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={lead.lead_status === 'hot' ? 'default' : 'secondary'}>
                                                        {lead.lead_status || '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{formatDate(lead.created_at)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>Latest registrations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No users</TableCell>
                                        </TableRow>
                                    ) : (
                                        recentUsers.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="font-medium">{u.name}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{formatDate(u.created_at)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Estimations</CardTitle>
                        <CardDescription>Latest cost estimations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Package</TableHead>
                                    <TableHead className="text-right">Est. Cost</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentEstimations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No estimations</TableCell>
                                    </TableRow>
                                ) : (
                                    recentEstimations.map((e) => (
                                        <TableRow key={e.id}>
                                            <TableCell className="font-medium">{e.name}</TableCell>
                                            <TableCell>{e.city}</TableCell>
                                            <TableCell>{e.package}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(e.estimated_cost)}</TableCell>
                                            <TableCell className="text-right">{formatDate(e.created_at)}</TableCell>
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
