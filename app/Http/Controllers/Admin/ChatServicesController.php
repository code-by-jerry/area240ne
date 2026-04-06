<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatServiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChatServicesController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ChatServices', [
            'services' => ChatServiceItem::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        ChatServiceItem::create([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Chat service created.');
    }

    public function update(Request $request, ChatServiceItem $chatService)
    {
        $validated = $this->validatePayload($request, $chatService->id);

        $chatService->update([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['name']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Chat service updated.');
    }

    public function toggleActive(ChatServiceItem $chatService)
    {
        $chatService->update([
            'is_active' => ! $chatService->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $chatService->is_active]);
    }

    public function togglePublished(ChatServiceItem $chatService)
    {
        $chatService->update([
            'published_at' => $chatService->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $chatService->published_at?->toISOString()]);
    }

    public function destroy(ChatServiceItem $chatService)
    {
        $chatService->delete();

        return redirect()->back()->with('success', 'Chat service deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('chat_services', 'slug')->ignore($ignoreId),
            ],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'short_summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'who_its_for' => ['nullable', 'array'],
            'who_its_for.*' => ['string', 'max:255'],
            'offerings' => ['nullable', 'array'],
            'offerings.*' => ['string', 'max:255'],
            'pricing_note' => ['nullable', 'string'],
            'timeline_note' => ['nullable', 'string'],
            'cta_text' => ['nullable', 'string', 'max:255'],
            'locations' => ['nullable', 'array'],
            'locations.*' => ['string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'meta' => ['nullable', 'array'],
            'meta.aliases' => ['nullable', 'array'],
            'meta.aliases.*' => ['string', 'max:255'],
        ]);

        foreach (['who_its_for', 'offerings', 'locations'] as $field) {
            if (is_string($request->input($field))) {
                $validated[$field] = array_values(array_filter(array_map(
                    'trim',
                    preg_split('/\r\n|\r|\n|,/', $request->input($field)),
                )));
            }
        }

        if (is_string($request->input('meta.aliases'))) {
            $validated['meta']['aliases'] = array_values(array_filter(array_map(
                'trim',
                preg_split('/\r\n|\r|\n|,/', $request->input('meta.aliases')),
            )));
        }

        return $validated;
    }
}
