<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/CompanyProfile', [
            'profile' => CompanyProfile::getSingleton(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'logo_url'      => ['nullable', 'string', 'max:500'],
            'intro_text'    => ['nullable', 'string'],
            'fallback_text' => ['nullable', 'string'],
            'phone'         => ['nullable', 'array'],
            'phone.*'       => ['string', 'max:50'],
            'email'         => ['nullable', 'email', 'max:255'],
            'website'       => ['nullable', 'string', 'max:500'],
            'instagram'     => ['nullable', 'string', 'max:500'],
            'facebook'      => ['nullable', 'string', 'max:500'],
            'linkedin'      => ['nullable', 'string', 'max:500'],
        ]);

        // Handle phone as comma-separated string from frontend
        if (is_string($request->input('phone'))) {
            $validated['phone'] = array_values(
                array_filter(array_map('trim', explode(',', $request->input('phone'))))
            );
        }

        $profile = CompanyProfile::first();

        if ($profile) {
            $profile->update($validated);
        } else {
            CompanyProfile::create($validated);
        }

        return redirect()->back()->with('success', 'Company profile saved.');
    }
}
