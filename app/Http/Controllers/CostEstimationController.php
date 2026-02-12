<?php

namespace App\Http\Controllers;

use App\Models\CostEstimation;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostEstimationController extends Controller
{
    /**
     * Display the cost estimator page.
     */
    public function create()
    {
        return Inertia::render('CostEstimator');
    }

    /**
     * Store a new cost estimation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'state' => 'required|string',
            'city' => 'required|string',
            'plot_area' => 'required|numeric|min:1',
            'floors' => 'required|integer|min:1',
            'package' => 'required|string',
            'estimated_cost' => 'required|numeric',
        ]);

        $estimation = CostEstimation::create($validated);

        // Also create a Lead record so it shows up in the general Leads panel
        Lead::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'service' => 'Cost Estimation',
            'location' => $validated['city'] . ', ' . $validated['state'],
            'message' => json_encode([
                'plot_area' => $validated['plot_area'] . ' sq.ft',
                'floors' => $validated['floors'],
                'package' => $validated['package'],
                'estimated_cost' => '₹' . number_format($validated['estimated_cost']),
            ]),
            'lead_status' => 'new'
        ]);

        return redirect()->route('cost-estimation.show', $estimation->uuid)->with('success', 'Cost estimation saved successfully!');
    }

    /**
     * Display the specified cost estimation.
     */
    public function show($uuid)
    {
        $estimation = CostEstimation::where('uuid', $uuid)->firstOrFail();

        return Inertia::render('CostEstimationResult', [
            'estimation' => $estimation
        ]);
    }

    /**
     * Display a listing of cost estimations for admin.
     */
    public function index()
    {
        $estimations = CostEstimation::latest()->get();

        return Inertia::render('Admin/CostEstimations', [
            'estimations' => $estimations,
        ]);
    }
}
