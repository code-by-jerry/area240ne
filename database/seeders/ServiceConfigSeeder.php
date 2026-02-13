<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceConfig;

class ServiceConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            'Interiors' => [
                'q1' => "What space?",
                'q2' => "Approximate area?",
                'q3' => "Design style preference?",
                'options_q1' => ['Residential home', 'Office', 'Retail', 'Hospitality', 'Other'],
                'options_q2' => ['<500 sqft', '500-1000 sqft', '1000-2000 sqft', '2000+ sqft', 'Other'],
                'options_q3' => ['Modern', 'Contemporary', 'Minimalist', 'Traditional', 'Other'],
                'brand_name' => 'Nesthetix Designs',
                'brand_short' => 'Nesthetix',
                'website' => 'https://nesthetix.in/',
                'instagram' => 'https://www.instagram.com/nesthetixdesigns/',
                'facebook' => null,
                'linkedin' => null,
                'phone' => ['+91 9916047222', '+91 9606956044'],
                'projects_count' => '150+',
                'description' => 'Premium interior design & turnkey execution',
                'ceo_name' => 'AARUN',
                'ceo_website' => 'https://arunar.in/',
                'ceo_experience' => '16+ years',
            ],
            'Construction' => [
                'q1' => "What's your project?",
                'q2' => "What's your budget range?",
                'q3' => "Timeline for groundbreaking?",
                'options_q1' => ['Residential', 'Commercial', 'Mixed-use', 'Renovation', 'Other'],
                'options_q2' => ['₹50L', '₹50L-1Cr', '₹1-5Cr', '₹5Cr+', 'Other'],
                'options_q3' => ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Other'],
                'brand_name' => 'Atha Construction',
                'brand_short' => 'ATHA',
                'website' => 'https://athacons.com/',
                'instagram' => 'https://www.instagram.com/athacons/',
                'facebook' => null,
                'linkedin' => null,
                'phone' => ['+91 9916047222', '+91 9606956044'],
                'projects_count' => '200+',
                'description' => 'End-to-end construction — quality & schedule focused',
                'ceo_name' => 'AARUN',
                'ceo_website' => 'https://arunar.in/',
                'ceo_experience' => '16+ years',
            ],
            'Real Estate' => [
                'q1' => "What's your goal?",
                'q2' => "Budget/Value range?",
                'q3' => "Timeline?",
                'options_q1' => ['Buy', 'Sell', 'Rent', 'Invest', 'Other'],
                'options_q2' => ['₹50L', '₹50L-1Cr', '₹1-5Cr', '₹5Cr+', 'Other'],
                'options_q3' => ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Other'],
                'brand_name' => 'Area24 Realty',
                'brand_short' => 'AREA24 Realty',
                'website' => 'https://area24developers.com/',
                'instagram' => 'https://www.instagram.com/area24properties/',
                'facebook' => 'https://www.facebook.com/wearearea24/',
                'linkedin' => 'https://in.linkedin.com/company/area24',
                'phone' => ['+91 9916047222', '+91 9606956044'],
                'projects_count' => '100+',
                'description' => 'Buy/Sell/Rent — curated options & negotiation support',
                'ceo_name' => 'AARUN',
                'ceo_website' => 'https://arunar.in/',
                'ceo_experience' => '16+ years',
            ],
            'Event' => [
                'q1' => "Event type?",
                'q2' => "Expected guests?",
                'q3' => "Budget & date?",
                'options_q1' => ['Wedding', 'Corporate', 'Private party', 'Festival', 'Other'],
                'options_q2' => ['<100', '100-300', '300-700', '700+', 'Other'],
                'options_q3' => ['₹5L', '₹5-15L', '₹15-50L', '₹50L+', 'Other'],
                'brand_name' => 'Stage365 Events',
                'brand_short' => 'Stage365',
                'website' => 'https://stage365.in/',
                'instagram' => null,
                'facebook' => null,
                'linkedin' => null,
                'phone' => ['+91 9916047222', '+91 9606956044'],
                'projects_count' => '300+',
                'description' => 'Concept-to-execution event management',
                'ceo_name' => 'AARUN',
                'ceo_website' => 'https://arunar.in/',
                'ceo_experience' => '16+ years',
            ],
            'Land Development' => [
                'q1' => "Land status?",
                'q2' => "Preferred use?",
                'q3' => "Land details?",
                'options_q1' => ['Owned', 'Under consideration', 'Exploring options', 'Other'],
                'options_q2' => ['Residential', 'Commercial', 'Industrial', 'Mixed-use', 'Other'],
                'options_q3' => ['<1 acre', '1-5 acres', '5-20 acres', '20+ acres', 'Other'],
                'brand_name' => 'Area24 Developers (Land Division)',
                'brand_short' => 'AREA24 LAND',
                'website' => 'https://area24developers.com/',
                'instagram' => 'https://www.instagram.com/area24properties/',
                'facebook' => 'https://www.facebook.com/wearearea24/',
                'linkedin' => 'https://in.linkedin.com/company/area24',
                'phone' => ['+91 9916047222', '+91 9606956044'],
                'projects_count' => '100+',
                'description' => 'Strategic land development & sustainable infrastructure',
                'ceo_name' => 'AARUN',
                'ceo_website' => 'https://arunar.in/',
                'ceo_experience' => '16+ years',
            ],
        ];

        foreach ($configs as $service => $data) {
            ServiceConfig::updateOrCreate(
                ['service_vertical' => $service],
                $data
            );
        }
    }
}

