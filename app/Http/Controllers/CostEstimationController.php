<?php

namespace App\Http\Controllers;

use App\Models\CostEstimation;
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

        CostEstimation::create($validated);

        return redirect()->back()->with('success', 'Cost estimation saved successfully!');
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
