<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    public function index()
    {
        $heroSlides = HeroSlide::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'heroSlides' => $heroSlides,
        ]);
    }
}
