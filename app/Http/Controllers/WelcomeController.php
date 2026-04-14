<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\HeroSlide;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    public function index()
    {
        // Cache hero slides for 5 minutes — they rarely change
        $heroSlides = Cache::remember('hero_slides_active', 300, fn() =>
            HeroSlide::where('is_active', true)
                ->orderBy('order')
                ->orderBy('created_at', 'desc')
                ->get()
        );

        // Cache company profile for 10 minutes
        $companyProfile = Cache::remember('company_profile', 600, fn() =>
            CompanyProfile::getSingleton()
        );

        $canonicalUrl = url('/');
        $primaryImage = $heroSlides->first()?->image_path ?: url('/favicon-512.png');

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'heroSlides' => $heroSlides,
            'companyProfile' => $companyProfile,
            'seo' => [
                'title' => 'Area24One | Construction, Interiors, Real Estate & Consultation Platform',
                'description' => 'Area24One connects you to trusted experts across construction, interiors, real estate, development, and events through one intelligent consultation platform.',
                'keywords' => 'construction services, interior design, real estate consulting, land development, event management, property consultation, Karnataka, Bangalore, Mysore, Ballari',
                'canonical' => $canonicalUrl,
                'image' => $primaryImage,
                'type' => 'website',
            ],
        ]);
    }
}
