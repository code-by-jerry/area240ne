<?php

namespace Database\Seeders;

use App\Models\ChatKnowledgeItem;
use App\Models\ChatQualificationFlow;
use App\Models\ChatResponseTemplate;
use App\Models\ChatServiceItem;
use App\Models\ChatSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ChatAssistantStarterSeeder extends Seeder
{
    public function run(): void
    {
        ChatSetting::query()->firstOrCreate(
            ['id' => 1],
            [
                'assistant_name' => 'Area24ONE',
                'welcome_title' => 'Welcome',
                'welcome_message' => "Area24ONE helps with homes, interiors, property, events, and land development across Karnataka.\n\nTell me what you need, and I'll guide you to the right service.\n\nWhat can I help you with today?",
                'fallback_message' => 'Tell me which service you need, or describe your requirement in one line.',
                'escalation_message' => "Thanks, I've noted your {{service_name}} requirement. Our team can take it forward with these details:\n{{summary_lines}}",
                'no_result_message' => 'Chat is currently unavailable. Please contact our team directly.',
                'chat_enabled' => true,
                'lead_capture_enabled' => true,
                'show_service_options' => true,
                'default_response_type' => 'hybrid',
            ],
        );

        $serviceDefaults = [
            'Construction' => [
                'icon' => 'construction',
                'short_summary' => 'End-to-end construction planning and execution.',
                'who_its_for' => ['Home owners', 'Villa projects', 'Commercial builds'],
                'offerings' => ['Turnkey construction', 'Project execution', 'Renovation support'],
                'pricing_note' => 'Pricing depends on built-up area, specification, and finish level.',
                'timeline_note' => 'Typical construction timelines vary by site readiness and project scope.',
                'cta_text' => 'Share your project type, location, budget, and preferred start timeline.',
                'locations' => ['Bangalore', 'Mysore', 'Ballari', 'Karnataka'],
                'meta' => [
                    'aliases' => ['build a house', 'build house', 'build home', 'home construction', 'house construction', 'villa construction', 'apartment construction', 'appartment construction'],
                ],
                'qualification_steps' => [
                    ['field_key' => 'project_type', 'label' => 'Project Type', 'question' => "What's your project?", 'answer_type' => 'option', 'quick_options' => ['Residential', 'Commercial', 'Mixed-use', 'Renovation', 'Other'], 'step_order' => 1, 'is_required' => true, 'validation_rules' => ['alias:Residential=house|home|villa|apartment|appartment|flat|residential', 'alias:Commercial=commercial|office|shop', 'alias:Mixed-use=mixed', 'alias:Renovation=renovation|renovate']],
                    ['field_key' => 'budget', 'label' => 'Budget', 'question' => "What's your budget range?", 'answer_type' => 'option', 'quick_options' => ['50L', '50L-1Cr', '1-5Cr', '5Cr+', 'Other'], 'step_order' => 2, 'is_required' => true, 'validation_rules' => ['parser:budget']],
                    ['field_key' => 'timeline', 'label' => 'Timeline', 'question' => 'Timeline for groundbreaking?', 'answer_type' => 'option', 'quick_options' => ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Other'], 'step_order' => 3, 'is_required' => false, 'validation_rules' => ['parser:timeline']],
                ],
            ],
            'Interiors' => [
                'icon' => 'interiors',
                'short_summary' => 'Premium interior design and turnkey execution.',
                'who_its_for' => ['Homes', 'Offices', 'Retail spaces'],
                'offerings' => ['Interior design', 'Turnkey interiors', 'Modular solutions'],
                'pricing_note' => 'Interior pricing varies by rooms, materials, and scope.',
                'timeline_note' => 'Interior timelines depend on design approvals, site readiness, and execution scope.',
                'cta_text' => 'Tell me the space type, area, style preference, and expected timeline.',
                'locations' => ['Bangalore', 'Mysore', 'Ballari', 'Karnataka'],
                'meta' => [
                    'aliases' => ['interior design', 'interiors', 'home interiors', 'kitchen design', 'wardrobe design'],
                ],
                'qualification_steps' => [
                    ['field_key' => 'space_type', 'label' => 'Space', 'question' => 'What space?', 'answer_type' => 'option', 'quick_options' => ['Residential home', 'Office', 'Retail', 'Hospitality', 'Other'], 'step_order' => 1, 'is_required' => true],
                    ['field_key' => 'area', 'label' => 'Area', 'question' => 'Approximate area?', 'answer_type' => 'option', 'quick_options' => ['<500 sqft', '500-1000 sqft', '1000-2000 sqft', '2000+ sqft', 'Other'], 'step_order' => 2, 'is_required' => true],
                    ['field_key' => 'style', 'label' => 'Style', 'question' => 'Design style preference?', 'answer_type' => 'option', 'quick_options' => ['Modern', 'Contemporary', 'Minimalist', 'Traditional', 'Other'], 'step_order' => 3, 'is_required' => false],
                ],
            ],
            'Real Estate' => [
                'icon' => 'real-estate',
                'short_summary' => 'Buy, sell, and property discovery support.',
                'who_its_for' => ['Buyers', 'Sellers', 'Investors'],
                'offerings' => ['Buy support', 'Sell support', 'Property discovery'],
                'pricing_note' => 'Budget and market value depend on location, asset type, and transaction goals.',
                'timeline_note' => 'Property search and closure timelines depend on inventory, documents, and approvals.',
                'cta_text' => 'Share whether you want to buy, sell, or invest along with your location and budget.',
                'locations' => ['Bangalore', 'Mysore', 'Ballari', 'Karnataka'],
                'meta' => [
                    'aliases' => ['buy property', 'sell property', 'buy house', 'buy plot', 'real estate'],
                ],
                'qualification_steps' => [
                    ['field_key' => 'goal', 'label' => 'Goal', 'question' => "What's your goal?", 'answer_type' => 'option', 'quick_options' => ['Buy', 'Sell', 'Rent', 'Invest', 'Other'], 'step_order' => 1, 'is_required' => true],
                    ['field_key' => 'budget', 'label' => 'Budget', 'question' => 'Budget or value range?', 'answer_type' => 'option', 'quick_options' => ['50L', '50L-1Cr', '1-5Cr', '5Cr+', 'Other'], 'step_order' => 2, 'is_required' => true, 'validation_rules' => ['parser:budget']],
                    ['field_key' => 'timeline', 'label' => 'Timeline', 'question' => 'Timeline?', 'answer_type' => 'option', 'quick_options' => ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Other'], 'step_order' => 3, 'is_required' => false, 'validation_rules' => ['parser:timeline']],
                ],
            ],
            'Event' => [
                'icon' => 'event',
                'short_summary' => 'Concept-to-execution event management.',
                'who_its_for' => ['Weddings', 'Corporate events', 'Private celebrations'],
                'offerings' => ['Planning', 'Production', 'Execution'],
                'pricing_note' => 'Event pricing depends on guest count, production scale, and venue scope.',
                'timeline_note' => 'Planning timelines vary based on event size, venue readiness, and vendor coordination.',
                'cta_text' => 'Tell me the event type, guest count, date, and budget range.',
                'locations' => ['Bangalore', 'Mysore', 'Ballari', 'Karnataka'],
                'meta' => [
                    'aliases' => ['event planning', 'event management', 'wedding planning', 'corporate event'],
                ],
                'qualification_steps' => [
                    ['field_key' => 'event_type', 'label' => 'Event Type', 'question' => 'Event type?', 'answer_type' => 'option', 'quick_options' => ['Wedding', 'Corporate', 'Private party', 'Festival', 'Other'], 'step_order' => 1, 'is_required' => true],
                    ['field_key' => 'guest_count', 'label' => 'Guests', 'question' => 'Expected guests?', 'answer_type' => 'option', 'quick_options' => ['<100', '100-300', '300-700', '700+', 'Other'], 'step_order' => 2, 'is_required' => true],
                    ['field_key' => 'budget_date', 'label' => 'Budget and Date', 'question' => 'Budget and date?', 'answer_type' => 'option', 'quick_options' => ['5L', '5-15L', '15-50L', '50L+', 'Other'], 'step_order' => 3, 'is_required' => false],
                ],
            ],
            'Land Development' => [
                'icon' => 'land-development',
                'short_summary' => 'Strategic land development and feasibility support.',
                'who_its_for' => ['Land owners', 'JV seekers', 'Development planners'],
                'offerings' => ['Feasibility review', 'Joint venture planning', 'Development strategy'],
                'pricing_note' => 'Development costs depend on land size, approvals, access, and project type.',
                'timeline_note' => 'Development timelines vary by documentation, approvals, and infrastructure planning.',
                'cta_text' => 'Share land size, ownership status, preferred use, and location details.',
                'locations' => ['Bangalore', 'Mysore', 'Ballari', 'Karnataka'],
                'meta' => [
                    'aliases' => ['develop land', 'land development', 'joint venture', 'jv', 'plot development'],
                ],
                'qualification_steps' => [
                    ['field_key' => 'land_status', 'label' => 'Land Status', 'question' => 'Land status?', 'answer_type' => 'option', 'quick_options' => ['Owned', 'Under consideration', 'Exploring options', 'Other'], 'step_order' => 1, 'is_required' => true],
                    ['field_key' => 'preferred_use', 'label' => 'Preferred Use', 'question' => 'Preferred use?', 'answer_type' => 'option', 'quick_options' => ['Residential', 'Commercial', 'Industrial', 'Mixed-use', 'Other'], 'step_order' => 2, 'is_required' => true],
                    ['field_key' => 'land_details', 'label' => 'Land Details', 'question' => 'Land details?', 'answer_type' => 'option', 'quick_options' => ['<1 acre', '1-5 acres', '5-20 acres', '20+ acres', 'Other'], 'step_order' => 3, 'is_required' => false],
                ],
            ],
        ];

        $serviceNames = array_keys($serviceDefaults);
        $commonQualificationTail = [
            [
                'field_key' => 'location',
                'label' => 'Location',
                'question' => 'Which location is this for?',
                'answer_type' => 'text',
                'quick_options' => ['Bangalore', 'Mysore', 'Ballari', 'Other'],
                'is_required' => true,
            ],
            [
                'field_key' => 'contact_name',
                'label' => 'Contact Name',
                'question' => 'What is your name?',
                'answer_type' => 'text',
                'quick_options' => null,
                'is_required' => true,
            ],
            [
                'field_key' => 'contact_phone',
                'label' => 'Contact Phone',
                'question' => 'What is the best phone number for our team to reach you on?',
                'answer_type' => 'phone',
                'quick_options' => null,
                'is_required' => true,
            ],
        ];

        foreach ($serviceDefaults as $name => $defaults) {
            $service = ChatServiceItem::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'icon' => $defaults['icon'],
                    'is_active' => true,
                    'short_summary' => $defaults['short_summary'],
                    'description' => $defaults['short_summary'] . ' ' . $defaults['pricing_note'] . ' ' . $defaults['timeline_note'],
                    'who_its_for' => $defaults['who_its_for'],
                    'offerings' => $defaults['offerings'],
                    'pricing_note' => $defaults['pricing_note'],
                    'timeline_note' => $defaults['timeline_note'],
                    'cta_text' => $defaults['cta_text'],
                    'locations' => $defaults['locations'],
                    'meta' => $defaults['meta'] ?? null,
                    'sort_order' => array_search($name, $serviceNames, true) ?: 0,
                    'published_at' => now(),
                ],
            );

            $qualificationSteps = array_values(array_map(
                static fn (array $step, int $index) => [
                    ...$step,
                    'step_order' => $index + 1,
                ],
                [
                    ...$defaults['qualification_steps'],
                    ...$commonQualificationTail,
                ],
                array_keys([
                    ...$defaults['qualification_steps'],
                    ...$commonQualificationTail,
                ]),
            ));

            foreach ($qualificationSteps as $step) {
                ChatQualificationFlow::query()->updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'field_key' => $step['field_key'],
                    ],
                    [
                        ...$step,
                        'service_id' => $service->id,
                        'published_at' => now(),
                    ],
                );
            }

            $knowledgeItems = [
                [
                    'title' => $name . ' pricing',
                    'slug' => Str::slug($name . '-pricing'),
                    'category' => 'pricing',
                    'question_patterns' => ['price', 'cost', 'budget', 'pricing', $name . ' pricing'],
                    'answer' => $defaults['pricing_note'] . ' ' . $defaults['cta_text'],
                    'short_answer' => $defaults['pricing_note'],
                    'tags' => ['pricing', 'cost', 'budget'],
                    'priority' => 80,
                    'is_active' => true,
                    'published_at' => now(),
                ],
                [
                    'title' => $name . ' timeline',
                    'slug' => Str::slug($name . '-timeline'),
                    'category' => 'timeline',
                    'question_patterns' => ['timeline', 'how long', 'duration', $name . ' timeline'],
                    'answer' => $defaults['timeline_note'] . ' ' . $defaults['cta_text'],
                    'short_answer' => $defaults['timeline_note'],
                    'tags' => ['timeline', 'duration', 'process'],
                    'priority' => 70,
                    'is_active' => true,
                    'published_at' => now(),
                ],
            ];

            foreach ($knowledgeItems as $item) {
                ChatKnowledgeItem::query()->updateOrCreate(
                    ['slug' => $item['slug']],
                    [
                        ...$item,
                        'service_id' => $service->id,
                    ],
                );
            }
        }

        $templates = [
            ['name' => 'Welcome Template', 'slug' => 'welcome-template', 'type' => 'welcome', 'title' => null, 'body' => "{{assistant_name}} helps with homes, interiors, property, events, and land development across Karnataka.\n\nTell me what you need, and I'll guide you to the right service.\n\nWhat can I help you with today?", 'quick_replies' => null, 'highlight' => false, 'requires_input' => false, 'ui_variant' => 'welcome-card', 'is_active' => true, 'published_at' => now()],
            ['name' => 'Greeting Template', 'slug' => 'greeting-template', 'type' => 'greeting', 'title' => null, 'body' => 'Hi there. Choose a service or describe what you are planning.', 'quick_replies' => null, 'highlight' => false, 'requires_input' => false, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
            ['name' => 'Fallback Template', 'slug' => 'fallback-template', 'type' => 'fallback', 'title' => null, 'body' => 'Tell me which service you need, or describe your requirement in one line.', 'quick_replies' => null, 'highlight' => false, 'requires_input' => false, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
            ['name' => 'Disabled Template', 'slug' => 'disabled-template', 'type' => 'disabled', 'title' => null, 'body' => 'Chat is currently unavailable. Please contact our team directly.', 'quick_replies' => null, 'highlight' => true, 'requires_input' => false, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
            ['name' => 'Service Answer Template', 'slug' => 'service-answer-template', 'type' => 'service_answer', 'title' => null, 'body' => '{{service_name}}\n\n{{summary_lines}}', 'quick_replies' => null, 'highlight' => false, 'requires_input' => false, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
            ['name' => 'Qualification Prompt Template', 'slug' => 'qualification-prompt-template', 'type' => 'qualification_prompt', 'title' => null, 'body' => '{{summary_lines}}', 'quick_replies' => null, 'highlight' => false, 'requires_input' => true, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
            ['name' => 'Qualification Complete Template', 'slug' => 'qualification-complete-template', 'type' => 'qualification_complete', 'title' => null, 'body' => "Thanks, I've noted your {{service_name}} requirement. Our team can take it forward with these details:\n{{summary_lines}}", 'quick_replies' => null, 'highlight' => false, 'requires_input' => false, 'ui_variant' => null, 'is_active' => true, 'published_at' => now()],
        ];

        foreach ($templates as $template) {
            ChatResponseTemplate::query()->updateOrCreate(['slug' => $template['slug']], $template);
        }

        $this->command?->info('Chat assistant starter data seeded.');
    }
}
