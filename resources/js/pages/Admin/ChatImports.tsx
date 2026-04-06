import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ModuleOption {
    value: string;
    label: string;
}

interface ImportLog {
    id: number;
    module: string;
    file_name: string;
    file_type?: string | null;
    status: string;
    total_rows: number;
    success_rows: number;
    failed_rows: number;
    error_summary?: string | null;
    created_at: string;
    created_by?: number | null;
    createdBy?: { name: string } | null;
}

interface Props {
    logs: ImportLog[];
    modules: ModuleOption[];
}

export default function ChatImports({ logs, modules }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        module: modules[0]?.value ?? 'chat_services',
        overwrite: false,
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        post('/admin/chat-imports', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setMessage('Import request completed. Check the log table below for the latest result.');
                reset('file');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Imports', href: '/admin/chat-imports' }]}>
            <Head title="Chat Imports" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chat Imports</h1>
                    <p className="text-muted-foreground">
                        Bulk import services, knowledge items, response templates, and qualification flows from CSV or JSON files.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Import</CardTitle>
                            <CardDescription>
                                Supported formats right now: CSV and JSON. Column names should match the admin field names.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="module">Target Module</Label>
                                    <select
                                        id="module"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.module}
                                        onChange={(e) => setData('module', e.target.value)}
                                    >
                                        {modules.map((module) => (
                                            <option key={module.value} value={module.value}>{module.label}</option>
                                        ))}
                                    </select>
                                    {errors.module && <p className="text-sm text-red-500">{errors.module}</p>}
                                </div>

                                <div className="flex flex-wrap gap-2 rounded-lg border p-4">
                                    <p className="w-full text-sm font-medium">Sample templates</p>
                                    <a href={`/admin/chat-imports/template/${data.module}/csv`} className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
                                        Download CSV Template
                                    </a>
                                    <a href={`/admin/chat-imports/template/${data.module}/json`} className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
                                        Download JSON Template
                                    </a>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="file">Import File</Label>
                                    <input
                                        ref={fileInputRef}
                                        id="file"
                                        type="file"
                                        accept=".csv,.txt,.json"
                                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                        className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                    {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                                </div>

                                <div className="flex items-center gap-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="overwrite"
                                        checked={data.overwrite}
                                        onCheckedChange={(checked) => setData('overwrite', checked === true)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="overwrite">Overwrite existing rows</Label>
                                        <p className="text-sm text-muted-foreground">
                                            When enabled, rows with matching keys will be updated instead of skipped.
                                        </p>
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Importing...' : 'Upload And Import'}
                                </Button>

                                {message && <p className="text-sm text-green-600">{message}</p>}
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Import Logs</CardTitle>
                            <CardDescription>
                                Review status, row counts, and import errors from the latest uploads.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Module</TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Rows</TableHead>
                                        <TableHead>By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No import logs yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.module}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p>{log.file_name}</p>
                                                    <p className="text-xs text-muted-foreground">{log.file_type || '-'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{log.status}</p>
                                                    {log.error_summary && (
                                                        <p className="max-w-xs whitespace-pre-wrap text-xs text-red-500">
                                                            {log.error_summary}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {log.success_rows}/{log.total_rows}
                                                {log.failed_rows > 0 && ` (${log.failed_rows} failed)`}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {log.createdBy?.name || 'System'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
