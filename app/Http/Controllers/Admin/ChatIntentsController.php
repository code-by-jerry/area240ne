<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatIntent;
use App\Models\ChatServiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChatIntentsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ChatIntents', [
            'intents' => ChatIntent::query()
                ->with('service:id,name')
                ->orderByDesc('priority')
                ->orderBy('name')
                ->get(),
            'services' => ChatServiceItem::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        ChatIntent::create([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Chat intent created.');
    }

    public function update(Request $request, ChatIntent $chatIntent)
    {
        $validated = $this->validatePayload($request, $chatIntent->id);

        $chatIntent->update([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Chat intent updated.');
    }

    public function toggleActive(ChatIntent $chatIntent)
    {
        $chatIntent->update([
            'is_active' => ! $chatIntent->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $chatIntent->is_active]);
    }

    public function togglePublished(ChatIntent $chatIntent)
    {
        $chatIntent->update([
            'published_at' => $chatIntent->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $chatIntent->published_at?->toISOString()]);
    }

    public function destroy(ChatIntent $chatIntent)
    {
        $chatIntent->delete();

        return redirect()->back()->with('success', 'Chat intent deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('chat_intents', 'slug')->ignore($ignoreId)],
            'service_id' => ['nullable', 'exists:chat_services,id'],
            'keywords' => ['nullable'],
            'response_text' => ['nullable', 'string'],
            'redirect_url' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'priority' => ['nullable', 'integer', 'between:0,100'],
            'conversion_rate' => ['nullable', 'numeric', 'between:0,100'],
            'priority_score' => ['nullable', 'integer', 'min:0'],
            'is_high_value' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        if (is_string($request->input('keywords'))) {
            $validated['keywords'] = array_values(array_filter(array_map(
                'trim',
                preg_split('/\r\n|\r|\n|,/', $request->input('keywords')),
            )));
        }

        return $validated;
    }
}
