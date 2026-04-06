<?php

namespace Database\Seeders;

use App\Models\ChatIntent;
use App\Models\ChatServiceItem;
use Illuminate\Database\Seeder;

class ChatIntentStarterSeeder extends Seeder
{
    public function run(): void
    {
        $serviceMap = ChatServiceItem::query()->pluck('id', 'name');

        $dataset = [
            [
                'service_name' => null,
                'slug' => 'greeting-welcome',
                'name' => 'Greeting Welcome',
                'keywords' => ['hi', 'hello', 'hey', 'start', 'begin', 'help'],
                'response_text' => 'Welcome to Area24ONE. We help with Construction, Interiors, Real Estate, Events, and Land Development. What do you need help with today?',
                'redirect_url' => null,
                'category' => 'greeting',
                'priority' => 80,
            ],
            [
                'service_name' => 'Construction',
                'slug' => 'construction-pricing-basic',
                'name' => 'Construction Pricing',
                'keywords' => ['price', 'cost', 'budget', 'how much', 'rates', 'pricing', 'sqft'],
                'response_text' => 'Turnkey construction typically ranges by specification. Share your plot size and location for a precise estimate, or open Cost Estimator.',
                'redirect_url' => '/cost-estimator',
                'category' => 'cost_info',
                'priority' => 70,
                'is_high_value' => true,
            ],
            [
                'service_name' => 'Interiors',
                'slug' => 'interiors-pricing-basic',
                'name' => 'Interiors Pricing',
                'keywords' => ['interior price', 'budget', 'cost', 'rates', 'modular', 'kitchen', 'wardrobe'],
                'response_text' => 'Interior packages start at entry, premium, and luxury tiers. Tell me rooms and scope to suggest a fit.',
                'redirect_url' => '/interiors',
                'category' => 'cost_info',
                'priority' => 70,
                'is_high_value' => true,
            ],
            [
                'service_name' => 'Real Estate',
                'slug' => 'real-estate-enquiry',
                'name' => 'Real Estate Enquiry',
                'keywords' => ['buy', 'sell', 'property', 'apartment', 'villa', 'plot', 'real estate'],
                'response_text' => 'We offer clear-title properties. Are you looking for a villa, apartment, or plot? Share your location preference.',
                'redirect_url' => '/properties',
                'category' => 'discovery',
                'priority' => 60,
            ],
            [
                'service_name' => 'Event',
                'slug' => 'event-intro',
                'name' => 'Event Intro',
                'keywords' => ['event', 'wedding', 'corporate', 'party', 'manage event', 'plan event'],
                'response_text' => 'Stage 365 manages weddings and corporate events end to end. What type of event and date are you targeting?',
                'redirect_url' => 'https://thestage365.com/',
                'category' => 'service_info',
                'priority' => 60,
            ],
            [
                'service_name' => 'Land Development',
                'slug' => 'jv-where-to-start',
                'name' => 'JV Where To Start',
                'keywords' => ['joint venture', 'jv', 'develop land', 'partner', 'land development'],
                'response_text' => 'First we assess land size, location, and ownership clarity. Share the basics to evaluate joint venture feasibility.',
                'redirect_url' => 'https://area24developers.com/',
                'category' => 'discovery',
                'priority' => 60,
            ],
            [
                'service_name' => null,
                'slug' => 'contact-support',
                'name' => 'Contact Support',
                'keywords' => ['contact', 'phone', 'call', 'support', 'help', 'assist'],
                'response_text' => 'You can reach our team directly, or share your need and location here so we can route you faster.',
                'redirect_url' => null,
                'category' => 'contact_info',
                'priority' => 50,
            ],
            [
                'service_name' => null,
                'slug' => 'fallback-help',
                'name' => 'Fallback Help',
                'keywords' => ['fallback_intent_key'],
                'response_text' => 'I can help with Construction, Interiors, Real Estate, Events, and Land Development. Tell me which area you need.',
                'redirect_url' => null,
                'category' => 'general_info',
                'priority' => 40,
            ],
        ];

        foreach ($dataset as $row) {
            ChatIntent::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'service_id' => $row['service_name'] ? ($serviceMap[$row['service_name']] ?? null) : null,
                    'keywords' => $row['keywords'],
                    'response_text' => $row['response_text'],
                    'redirect_url' => $row['redirect_url'],
                    'category' => $row['category'],
                    'priority' => $row['priority'],
                    'is_high_value' => $row['is_high_value'] ?? false,
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }

        $this->command?->info('Chat intent starter data seeded.');
    }
}
