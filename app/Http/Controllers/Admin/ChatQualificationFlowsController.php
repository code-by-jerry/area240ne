<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatQualificationFlow;
use App\Models\ChatServiceItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ChatQualificationFlowsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ChatQualificationFlows', [
            'flows' => ChatQualificationFlow::query()
                ->with('service:id,name')
                ->orderBy('service_id')
                ->orderBy('step_order')
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

        ChatQualificationFlow::create([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Qualification step created.');
    }

    public function update(Request $request, ChatQualificationFlow $chatQualificationFlow)
    {
        $validated = $this->validatePayload($request, $chatQualificationFlow->id, (int) $chatQualificationFlow->service_id);

        $chatQualificationFlow->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Qualification step updated.');
    }

    public function toggleActive(ChatQualificationFlow $chatQualificationFlow)
    {
        $chatQualificationFlow->update([
            'is_active' => ! $chatQualificationFlow->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $chatQualificationFlow->is_active]);
    }

    public function togglePublished(ChatQualificationFlow $chatQualificationFlow)
    {
        $chatQualificationFlow->update([
            'published_at' => $chatQualificationFlow->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $chatQualificationFlow->published_at?->toISOString()]);
    }

    public function destroy(ChatQualificationFlow $chatQualificationFlow)
    {
        $chatQualificationFlow->delete();

        return redirect()->back()->with('success', 'Qualification step deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null, ?int $currentServiceId = null): array
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:chat_services,id'],
            'field_key' => [
                'required',
                'string',
                'max:100',
                Rule::unique('chat_qualification_flows', 'field_key')
                    ->where(fn ($query) => $query->where('service_id', $request->integer('service_id', $currentServiceId)))
                    ->ignore($ignoreId),
            ],
            'label' => ['nullable', 'string', 'max:255'],
            'question' => ['required', 'string'],
            'answer_type' => ['required', 'string', 'max:50'],
            'quick_options' => ['nullable'],
            'step_order' => ['required', 'integer', 'min:0'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
            'validation_rules' => ['nullable'],
        ]);

        foreach (['quick_options', 'validation_rules'] as $field) {
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
