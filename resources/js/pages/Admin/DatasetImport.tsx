import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';

export default function DatasetImport() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        file: null as File | null,
    });
    
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | null; text: string }>({ type: null, text: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setMessage({ type: null, text: '' });
        
        if (!data.file) {
            setMessage({ type: 'error', text: 'Please select a file to upload' });
            return;
        }
        
        // Use useForm's post method which handles CSRF automatically
        post('/dataset/import', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Check for success/warning/error messages from backend
                const flash = (page as any).props?.flash;
                if (flash?.success) {
                    setMessage({ type: 'success', text: flash.success });
                    reset('file');
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                } else if (flash?.warning) {
                    setMessage({ type: 'warning', text: flash.warning });
                } else if (flash?.error) {
                    setMessage({ type: 'error', text: flash.error });
                }
            },
            onError: (errors) => {
                console.error('Import errors:', errors);
                if (errors.message) {
                    setMessage({ type: 'error', text: errors.message });
                } else {
                    setMessage({ type: 'error', text: 'An error occurred during import. Please check the file format and try again.' });
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dataset Import', href: '#' }]}>
            <Head title="Import Dataset" />
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg max-w-xl mx-auto mt-10">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Import Dataset
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload your Excel (.xlsx) or CSV file containing intents, keywords, and responses.
                    </p>
                </div>
                
                <form onSubmit={submit} className="mt-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select File
                        </label>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".xlsx,.xls,.csv"
                            onChange={e => {
                                const file = e.target.files ? e.target.files[0] : null;
                                setData('file', file);
                                setMessage({ type: null, text: '' });
                            }}
                            disabled={processing}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.file && <div className="text-red-500 mt-2 text-sm">{errors.file}</div>}
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Importing...' : 'Upload & Import'}
                        </button>
                    </div>

                    {message.type && (
                        <div className={`p-4 rounded-md ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : message.type === 'warning'
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                            <p>{message.text}</p>
                            {message.text.includes('Session expired') && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-sm underline"
                                >
                                    Refresh Page
                                </button>
                            )}
                        </div>
                    )}

                    {recentlySuccessful && !message.type && (
                        <div className="p-4 rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            Dataset imported successfully!
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && !message.type && (
                        <div className="p-4 rounded-md bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            <ul className="list-disc list-inside space-y-1">
                                {Object.entries(errors).map(([key, value]) => (
                                    <li key={key}>{Array.isArray(value) ? value.join(', ') : value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
