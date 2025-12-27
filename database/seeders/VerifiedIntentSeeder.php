<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intent;
use App\Models\Response;

class VerifiedIntentSeeder extends Seeder
{
    public function run(): void
    {
        $intents = [
            'real_estate_enquiry' => [
                'keywords' => 'buy,villa,flat,apartment,property,real estate',
                'responses' => [
                    [
                        'response' => 'We offer clear title properties in prime locations. Are you looking for a Villa, Apartment, or Plot?',
                        'redirect_url' => '/properties'
                    ]
                ]
            ],
            'construction_service' => [
                'keywords' => 'construct,build,contractor,house construction,building',
                'responses' => [
                    [
                        'response' => 'We provide turnkey construction services at ₹1600/sqft. Do you have a plot ready?',
                        'redirect_url' => '/construction'
                    ]
                ]
            ],
            'interior_design' => [
                'keywords' => 'interior,design,decor,furnishing,kitchen,wardrobe',
                'responses' => [
                    [
                        'response' => 'Our interior packages start from 3 Lakhs. Would you like to see our portfolio?',
                        'redirect_url' => '/interiors'
                    ]
                ]
            ],
            'greeting' => [
                'keywords' => 'hi,hello,hey,start',
                'responses' => [
                    [
                        'response' => 'Welcome to Area24One! How can we help you today? (Real Estate, Construction, Interiors)',
                        'redirect_url' => null
                    ]
                ]
            ],
            'fallback' => [
                'keywords' => 'fallback_intent_key',
                'responses' => [
                    [
                        'response' => 'I can help with Real Estate, Construction, and Interiors. Please tell me what you are looking for.',
                        'redirect_url' => null
                    ]
                ]
            ]
        ];

        foreach ($intents as $name => $data) {
            $intent = Intent::create([
                'name' => $name,
                'keywords' => $data['keywords']
            ]);

            foreach ($data['responses'] as $resp) {
                Response::create([
                    'intent_id' => $intent->id,
                    'response' => $resp['response'],
                    'redirect_url' => $resp['redirect_url']
                ]);
            }
        }
    }
}
