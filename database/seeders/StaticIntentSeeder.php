<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intent;

class StaticIntentSeeder extends Seeder
{
    public function run(): void
    {
        $dataset = [
            [
                'service_vertical' => 'General',
                'intent_slug' => 'greeting_welcome',
                'name' => 'Greeting Welcome',
                'keywords' => ['hi','hello','hey','start','begin','help'],
                'response_text' => 'Welcome to Area24 ONE. We help with Construction, Interiors, Real Estate, Events, and Land Development. What do you need help with today?',
                'redirect_url' => null,
                'category' => 'greeting',
                'priority' => 80,
            ],
            [
                'service_vertical' => 'Construction',
                'intent_slug' => 'construction_pricing_basic',
                'name' => 'Construction Pricing',
                'keywords' => ['price','cost','budget','how much','rates','pricing','sqft'],
                'response_text' => 'Turnkey construction typically ranges by specification. Share your plot size and location for a precise estimate, or open Cost Estimator.',
                'redirect_url' => '/cost-estimator',
                'category' => 'cost_info',
                'priority' => 70,
            ],
            [
                'service_vertical' => 'Interiors',
                'intent_slug' => 'interiors_pricing_basic',
                'name' => 'Interiors Pricing',
                'keywords' => ['interior price','budget','cost','rates','modular','kitchen','wardrobe'],
                'response_text' => 'Interior packages start at entry, premium, and luxury tiers. Tell me rooms and scope to suggest a fit.',
                'redirect_url' => '/interiors',
                'category' => 'cost_info',
                'priority' => 70,
            ],
            [
                'service_vertical' => 'Real Estate',
                'intent_slug' => 'real_estate_enquiry',
                'name' => 'Real Estate Enquiry',
                'keywords' => ['buy','sell','property','apartment','villa','plot','real estate'],
                'response_text' => 'We offer clear-title properties. Are you looking for a Villa, Apartment, or Plot? Share location preference.',
                'redirect_url' => '/properties',
                'category' => 'discovery',
                'priority' => 60,
            ],
            [
                'service_vertical' => 'Event',
                'intent_slug' => 'event_intro',
                'name' => 'Event Intro',
                'keywords' => ['event','wedding','corporate','party','manage event','plan event'],
                'response_text' => 'Stage 365 manages weddings and corporate events end-to-end. What type of event and date are you targeting?',
                'redirect_url' => 'https://thestage365.com/',
                'category' => 'service_info',
                'priority' => 60,
            ],
            [
                'service_vertical' => 'Land Development',
                'intent_slug' => 'jv_where_to_start',
                'name' => 'JV Where To Start',
                'keywords' => ['joint venture','jv','develop land','partner','land development'],
                'response_text' => 'First we assess land size, location, and ownership clarity. Share basics to evaluate JV feasibility.',
                'redirect_url' => 'https://area24developers.com/',
                'category' => 'discovery',
                'priority' => 60,
            ],
            [
                'service_vertical' => 'General',
                'intent_slug' => 'contact_support',
                'name' => 'Contact Support',
                'keywords' => ['contact','phone','call','support','help','assist'],
                'response_text' => 'You can reach our team at +91-XXXXXXXXXX. Share your need and location to route you faster.',
                'redirect_url' => null,
                'category' => 'contact_info',
                'priority' => 50,
            ],
            [
                'service_vertical' => 'General',
                'intent_slug' => 'fallback_help',
                'name' => 'Fallback Help',
                'keywords' => ['fallback_intent_key'],
                'response_text' => 'I can help with Construction, Interiors, Real Estate, Events, and Land Development. Tell me which area you need.',
                'redirect_url' => null,
                'category' => 'general_info',
                'priority' => 40,
            ],
        ];

        foreach ($dataset as $row) {
            $existing = Intent::where('intent_slug', $row['intent_slug'])->first();

            $payload = [
                'name' => $row['name'],
                'keywords' => $row['keywords'],
                'service_vertical' => $row['service_vertical'],
                'response_text' => $row['response_text'],
                'redirect_url' => $row['redirect_url'],
                'category' => $row['category'],
                'priority' => $row['priority'],
            ];

            if ($existing) {
                $existing->update($payload);
            } else {
                $payload['intent_slug'] = $row['intent_slug'];
                Intent::create($payload);
            }
        }

        $this->command?->info('✓ Seeded static chat intents');
    }
}

