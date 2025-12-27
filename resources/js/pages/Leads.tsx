import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Lead {
    id: number;
    phone: string;
    message: string;
    created_at: string;
    service?: string;
}

interface LeadsProps {
    leads: Lead[];
}

export default function Leads({ leads }: LeadsProps) {
    const breadcrumbs = [
        {
            title: 'Leads',
            href: '/leads',
        },
    ];

    const parseMessage = (msg: string) => {
        try {
            const data = JSON.parse(msg);
            // If it's just a simple string, return it as is
            if (typeof data !== 'object') return msg;

            // Exclude redundant fields
            const { phone, service, message, ...rest } = data;

            if (Object.keys(rest).length === 0) return msg;

            return (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(rest).map(([key, value]) => (
                        <span key={key} className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700">
                            <span className="opacity-70 mr-1 uppercase text-[10px]">{key.replace('_', ' ')}:</span> {String(value)}
                        </span>
                    ))}
                </div>
            );
        } catch (e) {
            return msg;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-6">
                    <h2 className="text-2xl font-bold mb-4">Lead Management</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                                {leads.length > 0 ? (
                                    leads.map((lead) => (
                                        <tr key={lead.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{lead.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">{lead.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.service || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-lg">
                                                {parseMessage(lead.message)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No leads found yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
