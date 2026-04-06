<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatKnowledgeItem;
use App\Models\ChatServiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChatKnowledgeItemsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ChatKnowledgeItems', [
            'items' => ChatKnowledgeItem::query()
                ->with('service:id,name')
                ->orderByDesc('priority')
                ->orderBy('title')
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

        ChatKnowledgeItem::create([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['title']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Knowledge item created.');
    }

    public function update(Request $request, ChatKnowledgeItem $chatKnowledgeItem)
    {
        $validated = $this->validatePayload($request, $chatKnowledgeItem->id);

        $chatKnowledgeItem->update([
            ...$validated,
            'slug' => $validated['slug'] ?: Str::slug($validated['title']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Knowledge item updated.');
    }

    public function toggleActive(ChatKnowledgeItem $chatKnowledgeItem)
    {
        $chatKnowledgeItem->update([
            'is_active' => ! $chatKnowledgeItem->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $chatKnowledgeItem->is_active]);
    }

    public function togglePublished(ChatKnowledgeItem $chatKnowledgeItem)
    {
        $chatKnowledgeItem->update([
            'published_at' => $chatKnowledgeItem->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $chatKnowledgeItem->published_at?->toISOString()]);
    }

    public function destroy(ChatKnowledgeItem $chatKnowledgeItem)
    {
        $chatKnowledgeItem->delete();

        return redirect()->back()->with('success', 'Knowledge item deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('chat_knowledge_items', 'slug')->ignore($ignoreId)],
            'category' => ['required', 'string', 'max:100'],
            'service_id' => ['nullable', 'exists:chat_services,id'],
            'question_patterns' => ['nullable'],
            'answer' => ['required', 'string'],
            'short_answer' => ['nullable', 'string'],
            'tags' => ['nullable'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        foreach (['question_patterns', 'tags'] as $field) {
            if (is_string($request->input($field))) {
                $validated[$field] = array_values(array_filter(array_map(
                    'trim',
                    preg_split('/\r\n|\r|\n|,/', $request->input($field)),
                )));
            }
        }

        return $validated;
    }
}
