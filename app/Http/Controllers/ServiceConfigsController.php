<?php

namespace App\Http\Controllers;

use App\Models\ServiceConfig;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServiceConfigsController extends Controller
{
    public function index()
    {
        $configs = ServiceConfig::orderBy('service_vertical')->get();
        return Inertia::render('Admin/ServiceConfigs', [
            'configs' => $configs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_vertical' => ['required', 'string', 'max:100', Rule::unique('service_configs', 'service_vertical')],
            'q1' => ['nullable', 'string', 'max:255'],
            'q2' => ['nullable', 'string', 'max:255'],
            'q3' => ['nullable', 'string', 'max:255'],
            'options_q1' => ['nullable', 'array'],
            'options_q1.*' => ['string', 'max:255'],
            'options_q2' => ['nullable', 'array'],
            'options_q2.*' => ['string', 'max:255'],
            'options_q3' => ['nullable', 'array'],
            'options_q3.*' => ['string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'brand_short' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'array'],
            'phone.*' => ['string', 'max:50'],
            'projects_count' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'ceo_name' => ['nullable', 'string', 'max:255'],
            'ceo_website' => ['nullable', 'string', 'max:255'],
            'ceo_experience' => ['nullable', 'string', 'max:255'],
            'intro_text' => ['nullable', 'string'],
            'greeting_keywords' => ['nullable', 'array'],
            'greeting_keywords.*' => ['string', 'max:255'],
            'location_keywords' => ['nullable', 'array'],
            'process_timeline' => ['nullable', 'string'],
            'detection_keywords' => ['nullable', 'array'],
            'detection_keywords.*' => ['string', 'max:255'],
        ]);

        if (is_string($request->input('phone'))) {
            $validated['phone'] = array_values(array_filter(array_map('trim', explode(',', $request->input('phone')))));
        }
        if (is_string($request->input('greeting_keywords'))) {
            $validated['greeting_keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('greeting_keywords')))));
        }
        if (is_string($request->input('detection_keywords'))) {
            $validated['detection_keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('detection_keywords')))));
        }
        if (is_string($request->input('location_keywords'))) {
            try {
                $validated['location_keywords'] = json_decode($request->input('location_keywords'), true);
            } catch (\Exception $e) {
                $validated['location_keywords'] = null;
            }
        }
        foreach (['options_q1', 'options_q2', 'options_q3'] as $k) {
            if (is_string($request->input($k))) {
                $validated[$k] = array_values(array_filter(array_map('trim', explode(',', $request->input($k)))));
            }
        }

        ServiceConfig::create($validated);
        return redirect()->back()->with('success', 'Service config created.');
    }

    public function update(Request $request, ServiceConfig $serviceConfig)
    {
        $validated = $request->validate([
            'service_vertical' => ['required', 'string', 'max:100', Rule::unique('service_configs', 'service_vertical')->ignore($serviceConfig->id)],
            'q1' => ['nullable', 'string', 'max:255'],
            'q2' => ['nullable', 'string', 'max:255'],
            'q3' => ['nullable', 'string', 'max:255'],
            'options_q1' => ['nullable', 'array'],
            'options_q1.*' => ['string', 'max:255'],
            'options_q2' => ['nullable', 'array'],
            'options_q2.*' => ['string', 'max:255'],
            'options_q3' => ['nullable', 'array'],
            'options_q3.*' => ['string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'brand_short' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'array'],
            'phone.*' => ['string', 'max:50'],
            'projects_count' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'ceo_name' => ['nullable', 'string', 'max:255'],
            'ceo_website' => ['nullable', 'string', 'max:255'],
            'ceo_experience' => ['nullable', 'string', 'max:255'],
            'intro_text' => ['nullable', 'string'],
            'greeting_keywords' => ['nullable', 'array'],
            'greeting_keywords.*' => ['string', 'max:255'],
            'location_keywords' => ['nullable', 'array'],
            'process_timeline' => ['nullable', 'string'],
            'detection_keywords' => ['nullable', 'array'],
            'detection_keywords.*' => ['string', 'max:255'],
        ]);

        if (is_string($request->input('phone'))) {
            $validated['phone'] = array_values(array_filter(array_map('trim', explode(',', $request->input('phone')))));
        }
        if (is_string($request->input('greeting_keywords'))) {
            $validated['greeting_keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('greeting_keywords')))));
        }
        if (is_string($request->input('detection_keywords'))) {
            $validated['detection_keywords'] = array_values(array_filter(array_map('trim', explode(',', $request->input('detection_keywords')))));
        }
        if (is_string($request->input('location_keywords'))) {
            try {
                $validated['location_keywords'] = json_decode($request->input('location_keywords'), true);
            } catch (\Exception $e) {
                $validated['location_keywords'] = null;
            }
        }
        foreach (['options_q1', 'options_q2', 'options_q3'] as $k) {
            if (is_string($request->input($k))) {
                $validated[$k] = array_values(array_filter(array_map('trim', explode(',', $request->input($k)))));
            }
        }

        $serviceConfig->update($validated);
        return redirect()->back()->with('success', 'Service config updated.');
    }

    public function destroy(ServiceConfig $serviceConfig)
    {
        $serviceConfig->delete();
        return redirect()->back()->with('success', 'Service config deleted.');
    }
}
