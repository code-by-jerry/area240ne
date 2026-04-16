<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ServiceLandingController extends Controller
{
    /**
     * Service landing page definitions.
     * Each entry maps a URL slug to full SEO + content data.
     */
    private const SERVICES = [
        'construction-bangalore' => [
            'title'       => 'Construction Services in Bangalore | Atha Construction — Area24One',
            'description' => 'Premium residential and commercial construction in Bangalore. Atha Construction delivers turnkey projects with transparent workflows. Get a free consultation.',
            'keywords'    => 'construction company Bangalore, home construction Bangalore, villa construction Bangalore, commercial construction Bangalore, Atha Construction',
            'h1'          => 'Construction Services in Bangalore',
            'service'     => 'Construction',
            'brand'       => 'Atha Construction',
            'location'    => 'Bangalore',
            'city_slug'   => 'bangalore',
        ],
        'interior-design-bangalore' => [
            'title'       => 'Interior Design in Bangalore | Nesthetix Designs — Area24One',
            'description' => 'Bespoke luxury interior design in Bangalore. Nesthetix Designs crafts stunning homes, offices, and commercial spaces. Book a free design consultation.',
            'keywords'    => 'interior design Bangalore, interior designer Bangalore, home interior Bangalore, office interior Bangalore, Nesthetix Designs',
            'h1'          => 'Interior Design Services in Bangalore',
            'service'     => 'Interiors',
            'brand'       => 'Nesthetix Designs',
            'location'    => 'Bangalore',
            'city_slug'   => 'bangalore',
        ],
        'real-estate-bangalore' => [
            'title'       => 'Real Estate Consultancy in Bangalore | Area24 Realty — Area24One',
            'description' => 'Expert real estate consulting in Bangalore. Buy, sell, or invest in property with Area24 Realty — data-driven insights and verified listings.',
            'keywords'    => 'real estate Bangalore, property consultant Bangalore, buy property Bangalore, sell property Bangalore, Area24 Realty',
            'h1'          => 'Real Estate Consultancy in Bangalore',
            'service'     => 'Real Estate',
            'brand'       => 'Area24 Realty',
            'location'    => 'Bangalore',
            'city_slug'   => 'bangalore',
        ],
        'construction-mysore' => [
            'title'       => 'Construction Services in Mysore | Atha Construction — Area24One',
            'description' => 'Trusted construction company in Mysore. Atha Construction builds residential villas, commercial spaces, and renovation projects across Mysuru.',
            'keywords'    => 'construction company Mysore, home construction Mysore, villa construction Mysore, Atha Construction Mysore',
            'h1'          => 'Construction Services in Mysore',
            'service'     => 'Construction',
            'brand'       => 'Atha Construction',
            'location'    => 'Mysore',
            'city_slug'   => 'mysore',
        ],
        'interior-design-mysore' => [
            'title'       => 'Interior Design in Mysore | Nesthetix Designs — Area24One',
            'description' => 'Premium interior design services in Mysore. Nesthetix Designs transforms homes and offices with bespoke, luxury interiors across Mysuru.',
            'keywords'    => 'interior design Mysore, interior designer Mysore, home interior Mysore, Nesthetix Designs Mysore',
            'h1'          => 'Interior Design Services in Mysore',
            'service'     => 'Interiors',
            'brand'       => 'Nesthetix Designs',
            'location'    => 'Mysore',
            'city_slug'   => 'mysore',
        ],
        'real-estate-mysore' => [
            'title'       => 'Real Estate Consultancy in Mysore | Area24 Realty — Area24One',
            'description' => 'Buy, sell, or invest in property in Mysore with Area24 Realty. Expert real estate consultants with deep knowledge of the Mysuru property market.',
            'keywords'    => 'real estate Mysore, property consultant Mysore, buy property Mysore, Area24 Realty Mysore',
            'h1'          => 'Real Estate Consultancy in Mysore',
            'service'     => 'Real Estate',
            'brand'       => 'Area24 Realty',
            'location'    => 'Mysore',
            'city_slug'   => 'mysore',
        ],
        'construction-ballari' => [
            'title'       => 'Construction Services in Ballari | Atha Construction — Area24One',
            'description' => 'Quality construction services in Ballari. Atha Construction delivers residential and commercial projects across Bellary with precision and transparency.',
            'keywords'    => 'construction company Ballari, home construction Ballari, Atha Construction Ballari, construction Bellary',
            'h1'          => 'Construction Services in Ballari',
            'service'     => 'Construction',
            'brand'       => 'Atha Construction',
            'location'    => 'Ballari',
            'city_slug'   => 'ballari',
        ],
        'land-development-karnataka' => [
            'title'       => 'Land Development in Karnataka | Area24 Developers — Area24One',
            'description' => 'Strategic land development across Karnataka. Area24 Developers handles residential communities, commercial complexes, and agricultural land projects.',
            'keywords'    => 'land development Karnataka, land investment Karnataka, residential plots Karnataka, Area24 Developers',
            'h1'          => 'Land Development Services in Karnataka',
            'service'     => 'Land Development',
            'brand'       => 'Area24 Developers',
            'location'    => 'Karnataka',
            'city_slug'   => 'karnataka',
        ],
        'event-management-bangalore' => [
            'title'       => 'Event Management in Bangalore | Stage365 — Area24One',
            'description' => 'Professional event management in Bangalore. Stage365 plans weddings, corporate events, product launches, and brand activations across Karnataka.',
            'keywords'    => 'event management Bangalore, wedding planner Bangalore, corporate events Bangalore, Stage365 Bangalore',
            'h1'          => 'Event Management Services in Bangalore',
            'service'     => 'Events',
            'brand'       => 'Stage365',
            'location'    => 'Bangalore',
            'city_slug'   => 'bangalore',
        ],
    ];

    public function show(string $slug)
    {
        $service = self::SERVICES[$slug] ?? null;

        if (!$service) {
            abort(404);
        }

        $canonicalUrl = url("/services/{$slug}");

        return Inertia::render('ServiceLanding', [
            'slug'    => $slug,
            'service' => $service,
            'seo'     => [
                'title'       => $service['title'],
                'description' => $service['description'],
                'keywords'    => $service['keywords'],
                'canonical'   => $canonicalUrl,
                'image'       => url('/favicon-512.png'),
                'type'        => 'website',
            ],
        ]);
    }

    /**
     * Return all slugs — used by SitemapController.
     */
    public static function allSlugs(): array
    {
        return array_keys(self::SERVICES);
    }
}
