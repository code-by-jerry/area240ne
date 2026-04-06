import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ChatSettingsData {
    id: number;
    assistant_name: string;
    welcome_title?: string | null;
    welcome_message?: string | null;
    fallback_message?: string | null;
    escalation_message?: string | null;
    no_result_message?: string | null;
    default_response_type?: string | null;
    chat_enabled: boolean;
    lead_capture_enabled: boolean;
    show_service_options: boolean;
}

interface Props {
    settings: ChatSettingsData;
}

export default function ChatSettings({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        assistant_name: settings.assistant_name ?? '',
        welcome_title: settings.welcome_title ?? '',
        welcome_message: settings.welcome_message ?? '',
        fallback_message: settings.fallback_message ?? '',
        escalation_message: settings.escalation_message ?? '',
        no_result_message: settings.no_result_message ?? '',
        default_response_type: settings.default_response_type ?? 'text',
        chat_enabled: settings.chat_enabled ?? true,
        lead_capture_enabled: settings.lead_capture_enabled ?? true,
        show_service_options: settings.show_service_options ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/chat-settings');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Chat Settings', href: '/admin/chat-settings' }]}>
            <Head title="Chat Settings" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chat Settings</h1>
                    <p className="text-muted-foreground">
                        Manage the assistant identity, welcome copy, and default fallback behavior from one place.
                    </p>
                </div>

                <form onSubmit={submit} className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assistant Content</CardTitle>
                            <CardDescription>
                                These messages shape the main chat experience for first-time users and unclear requests.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="assistant_name">Assistant Name</Label>
                                    <Input
                                        id="assistant_name"
                                        value={data.assistant_name}
                                        onChange={(e) => setData('assistant_name', e.target.value)}
                                        placeholder="Area24ONE"
                                    />
                                    {errors.assistant_name && <p className="text-sm text-red-500">{errors.assistant_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="welcome_title">Welcome Title</Label>
                                    <Input
                                        id="welcome_title"
                                        value={data.welcome_title}
                                        onChange={(e) => setData('welcome_title', e.target.value)}
                                        placeholder="Welcome"
                                    />
                                    {errors.welcome_title && <p className="text-sm text-red-500">{errors.welcome_title}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="welcome_message">Welcome Message</Label>
                                <Textarea
                                    id="welcome_message"
                                    rows={7}
                                    value={data.welcome_message}
                                    onChange={(e) => setData('welcome_message', e.target.value)}
                                    placeholder="Write the first message shown in a new chat."
                                />
                                {errors.welcome_message && <p className="text-sm text-red-500">{errors.welcome_message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fallback_message">Fallback Message</Label>
                                <Textarea
                                    id="fallback_message"
                                    rows={4}
                                    value={data.fallback_message}
                                    onChange={(e) => setData('fallback_message', e.target.value)}
                                    placeholder="Reply when the assistant cannot confidently route the user."
                                />
                                {errors.fallback_message && <p className="text-sm text-red-500">{errors.fallback_message}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="escalation_message">Escalation Message</Label>
                                    <Textarea
                                        id="escalation_message"
                                        rows={4}
                                        value={data.escalation_message}
                                        onChange={(e) => setData('escalation_message', e.target.value)}
                                        placeholder="Reply when handoff to the team is needed."
                                    />
                                    {errors.escalation_message && <p className="text-sm text-red-500">{errors.escalation_message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_result_message">No Result Message</Label>
                                    <Textarea
                                        id="no_result_message"
                                        rows={4}
                                        value={data.no_result_message}
                                        onChange={(e) => setData('no_result_message', e.target.value)}
                                        placeholder="Reply when no matching content is found."
                                    />
                                    {errors.no_result_message && <p className="text-sm text-red-500">{errors.no_result_message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Behavior</CardTitle>
                                <CardDescription>
                                    Control which features are enabled by default.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="default_response_type">Default Response Type</Label>
                                    <Select
                                        value={data.default_response_type}
                                        onValueChange={(value) => setData('default_response_type', value)}
                                    >
                                        <SelectTrigger id="default_response_type">
                                            <SelectValue placeholder="Choose response type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="knowledge">Knowledge Answer</SelectItem>
                                            <SelectItem value="rule">Rule-Based</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.default_response_type && <p className="text-sm text-red-500">{errors.default_response_type}</p>}
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="chat_enabled">Chat Enabled</Label>
                                        <p className="text-sm text-muted-foreground">Enable or disable the assistant on the website.</p>
                                    </div>
                                    <Switch
                                        id="chat_enabled"
                                        checked={data.chat_enabled}
                                        onCheckedChange={(checked) => setData('chat_enabled', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="lead_capture_enabled">Lead Capture</Label>
                                        <p className="text-sm text-muted-foreground">Allow the assistant to collect project details for follow-up.</p>
                                    </div>
                                    <Switch
                                        id="lead_capture_enabled"
                                        checked={data.lead_capture_enabled}
                                        onCheckedChange={(checked) => setData('lead_capture_enabled', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="show_service_options">Show Service Options</Label>
                                        <p className="text-sm text-muted-foreground">Display quick service chips under the first welcome message.</p>
                                    </div>
                                    <Switch
                                        id="show_service_options"
                                        checked={data.show_service_options}
                                        onCheckedChange={(checked) => setData('show_service_options', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Save Changes</CardTitle>
                                <CardDescription>
                                    These settings become the new default behavior for the assistant.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Saving...' : 'Save Chat Settings'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
