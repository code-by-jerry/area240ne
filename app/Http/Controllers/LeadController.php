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
}
