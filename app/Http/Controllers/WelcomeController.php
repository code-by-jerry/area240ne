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
                'title' => 'Area24One | Construction, Interiors & Real Estate',
                'description' => 'One platform connecting you to expert brands across construction, interiors, real estate, development, and events in Bangalore, Mysore & Karnataka.',
                'keywords' => 'construction Bangalore, interior design Bangalore, real estate Karnataka, land development, event management, property consultation, Mysore, Ballari',
                'canonical' => $canonicalUrl,
                'image' => $primaryImage,
                'type' => 'website',
            ],
        ]);
    }
}
