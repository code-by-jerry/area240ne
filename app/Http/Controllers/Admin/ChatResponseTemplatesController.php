<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatResponseTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChatResponseTemplatesController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ChatResponseTemplates', [
            'templates' => ChatResponseTemplate::query()
                ->orderBy('type')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        ChatResponseTemplate::create([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Response template created.');
    }

    public function update(Request $request, ChatResponseTemplate $chatResponseTemplate)
    {
        $validated = $this->validatePayload($request, $chatResponseTemplate->id);

        $chatResponseTemplate->update([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Response template updated.');
    }

    public function toggleActive(ChatResponseTemplate $chatResponseTemplate)
    {
        $chatResponseTemplate->update([
            'is_active' => ! $chatResponseTemplate->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $chatResponseTemplate->is_active]);
    }

    public function togglePublished(ChatResponseTemplate $chatResponseTemplate)
    {
        $chatResponseTemplate->update([
            'published_at' => $chatResponseTemplate->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $chatResponseTemplate->published_at?->toISOString()]);
    }

    public function destroy(ChatResponseTemplate $chatResponseTemplate)
    {
        $chatResponseTemplate->delete();

        return redirect()->back()->with('success', 'Response template deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('chat_response_templates', 'slug')->ignore($ignoreId)],
            'type' => ['required', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'quick_replies' => ['nullable'],
            'highlight' => ['boolean'],
            'requires_input' => ['boolean'],
            'ui_variant' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        if (is_string($request->input('quick_replies'))) {
            $validated['quick_replies'] = array_values(array_filter(array_map(
                'trim',
                preg_split('/\r\n|\r|\n|,/', $request->input('quick_replies')),
            )));
        }

        return $validated;
    }
}
