<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::latest()->get();

        return Inertia::render('Leads', [
            'leads' => $leads
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['required', 'string', 'max:50'],
            'email'   => ['nullable', 'email', 'max:255'],
            'service' => ['nullable', 'string', 'max:100'],
            'message' => ['nullable', 'string'],
        ]);

        $lead = Lead::create($validated);

        // Fire Brevo notification — non-blocking, won't fail the request
        try {
            (new \App\Services\BrevoService())->sendLeadNotification($lead->toArray());
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Brevo notification failed', ['error' => $e->getMessage()]);
        }

        return response()->json(['success' => true]);
    }
}
