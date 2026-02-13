<?php

namespace App\Http\Controllers;

use App\Models\Intent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class IntentsController extends Controller
{
    public function index()
    {
        $intents = Intent::orderBy('service_vertical')
            ->orderBy('priority', 'desc')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'intent_slug',
                'service_vertical',
                'keywords',
                'response_text',
                'redirect_url',
                'category',
                'priority',
                'created_at',
                'updated_at',
            ]);

        return Inertia::render('Admin/Intents', [
            'intents' => $intents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'intent_slug' => ['nullable', 'string', 'max:255', Rule::unique('intents', 'intent_slug')],
            'service_vertical' => ['required', 'string', 'max:100'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:255'],
            'response_text' => ['nullable', 'string'],
            'redirect_url' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'priority' => ['nullable', 'integer', 'between:0,100'],
        ]);

        // Normalize keywords: allow comma-separated string from UI
        if (is_string($request->input('keywords'))) {
            $validated['keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('keywords')))));
        }

        Intent::create($validated);

        return redirect()->back()->with('success', 'Intent created.');
    }

    public function update(Request $request, Intent $intent)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'intent_slug' => ['nullable', 'string', 'max:255', Rule::unique('intents', 'intent_slug')->ignore($intent->id)],
            'service_vertical' => ['required', 'string', 'max:100'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:255'],
            'response_text' => ['nullable', 'string'],
            'redirect_url' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'priority' => ['nullable', 'integer', 'between:0,100'],
        ]);

        if (is_string($request->input('keywords'))) {
            $validated['keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('keywords')))));
        }

        $intent->update($validated);

        return redirect()->back()->with('success', 'Intent updated.');
    }

    public function destroy(Intent $intent)
    {
        $intent->delete();
        return redirect()->back()->with('success', 'Intent deleted.');
    }
}

