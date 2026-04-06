<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatSettingsController extends Controller
{
    public function edit()
    {
        $settings = ChatSetting::query()->firstOrCreate(
            ['id' => 1],
            [
                'assistant_name' => 'Area24ONE',
                'welcome_title' => 'Welcome',
                'welcome_message' => "Area24ONE helps with homes, interiors, property, events, and land development across Karnataka.\n\nTell me what you need, and I'll guide you to the right service.\n\nWhat can I help you with today?",
                'fallback_message' => 'Tell me your requirement in one line and I will guide you.',
                'chat_enabled' => true,
                'lead_capture_enabled' => true,
                'show_service_options' => true,
            ],
        );

        return Inertia::render('Admin/ChatSettings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'assistant_name' => ['required', 'string', 'max:255'],
            'welcome_title' => ['nullable', 'string', 'max:255'],
            'welcome_message' => ['nullable', 'string'],
            'fallback_message' => ['nullable', 'string'],
            'escalation_message' => ['nullable', 'string'],
            'no_result_message' => ['nullable', 'string'],
            'chat_enabled' => ['boolean'],
            'lead_capture_enabled' => ['boolean'],
            'show_service_options' => ['boolean'],
            'default_response_type' => ['nullable', 'string', 'max:100'],
        ]);

        $settings = ChatSetting::query()->firstOrCreate(['id' => 1]);
        $settings->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Chat settings updated.');
    }
}
