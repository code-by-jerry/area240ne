<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Intent;
use App\Models\ServiceConfig;

/**
 * AREA24ONE CHAT SERVICE (v1.1 - PHASE 1 OPTIMIZED)
 *
 * Smart, direct flow - no unnecessary steps:
 * INIT → Detect Intent → SERVICE_SELECTED → LEAD_QUALIFICATION
 *
 * Key Improvements:
 * ✓ Strict greeting detection (no false positives)
 * ✓ Direct intent matching (skip unnecessary steps)
 * ✓ Clickable format links
 * ✓ Technical lead questions focused
 * ✓ Professional + casual flow
 * ✓ Quality lead capture
 */
class ChatService
{
    protected $session;

    /**
     * STRICT Greeting Keywords (only real greetings)
     */
    protected const GREETING_KEYWORDS = [
        'hi', 'hello', 'hey', 'namaste', 'namaskar',
        'how are you', 'whats up', 'sup', 'welcome'
    ];

    /**
     * Location Keywords
     */
    protected const LOCATION_KEYWORDS = [
        'bangalore' => ['bangalore', 'bengaluru', 'blr', 'bangalore city', 'bengaluru city', 'lavelle'],
        'mysore' => ['mysore', 'mysuru', 'mysore city', 'mysuru city'],
        'ballari' => ['ballari', 'bellary', 'ballari city'],
        'karnataka' => ['karnataka', 'karnataka state', 'across karnataka', 'throughout karnataka']
    ];

    /**
     * Service Intent Keywords (30-40 per service)
     */
    protected const SERVICES_INTENT_KEYWORDS = [
        'Construction' => [
            'build', 'construct', 'construction', 'building', 'architecture', 'architectural',
            'house', 'villa', 'bungalow', 'residence', 'residential', 'apartment', 'flat',
            'commercial', 'office', 'shop', 'warehouse', 'mall', 'plaza', 'complex',
            'renovation', 'remodeling', 'repair', 'restoration', 'refurbishment', 'upgrade',
            'project', 'development', 'development project', 'contractor', 'builder',
            'civil', 'structural', 'concrete', 'plot', 'land', 'site',
            'sustainable', 'eco-friendly', 'green building', 'dream home', 'dream house',
            'new construction', 'construct a building', 'build structure', 'engineering',
            'infrastructure', 'interior construction', 'finishing', 'fit-out'
        ],
        'Interiors' => [
            'interior', 'interior design', 'interior designer', 'interiors', 'design',
            'designing', 'decor', 'decoration', 'decorative', 'luxury interior',
            'luxury design', 'premium interior', 'high-end interior', 'home design',
            'home interior', 'home decor', 'apartment design', 'flat design',
            'villa design', 'villa interior', 'bungalow interior', 'office interior',
            'office design', 'office space', 'workspace design', 'commercial interior',
            'commercial design', 'retail design', 'hospitality design', 'hotel design',
            'restaurant design', 'interior styling', 'space design', 'space planning',
            'room design', 'furniture design', 'home makeover', 'room makeover',
            'complete interior', 'full interior', 'renovation design', 'modular',
            'aesthetic', 'minimalist', 'contemporary', 'traditional', 'modern'
        ],
        'Real Estate' => [
            'real estate', 'realty', 'property', 'real property', 'properties',
            'buy', 'sell', 'purchase', 'sale', 'acquisition', 'investment',
            'property investment', 'real estate investment', 'invest in property',
            'apartment', 'flat', 'residential', 'dwelling', 'home', 'villa',
            'bungalow', 'independent house', 'independent villa', 'commercial property',
            'commercial space', 'office space', 'retail space', 'shop', 'showroom',
            'land', 'plot', 'land parcel', 'land plot', 'land investment',
            'property consultancy', 'real estate consultancy', 'consultancy',
            'property management', 'asset management', 'portfolio management',
            'property valuation', 'property appraisal', 'market value', 'property listing',
            'buyer', 'seller', 'investor', 'property owner', 'property agent',
            'property consultant', 'real estate professional', 'prime location',
            'premium location', 'strategic location', 'affordable housing', 'luxury property'
        ],
        'Event' => [
            'event', 'event management', 'event planning', 'event organizer', 'organizing',
            'wedding', 'marriage', 'wedding celebration', 'wedding ceremony', 'party',
            'celebration', 'party planning', 'celebration planning', 'corporate event',
            'corporate function', 'corporate gathering', 'b2b event', 'conference',
            'seminar', 'workshop', 'training', 'business event', 'reception',
            'banquet', 'dinner', 'gala', 'ball', 'birthday party', 'anniversary',
            'milestone celebration', 'product launch', 'brand launch', 'brand event',
            'product event', 'promotional event', 'activation', 'brand activation',
            'exhibition', 'expo', 'trade show', 'trade event', 'cultural event',
            'social event', 'community event', 'private event', 'private function',
            'event coordination', 'event execution', 'event logistics', 'entertainment',
            'performer', 'music', 'live performance', 'decoration', 'event decor'
        ],
        'Land Development' => [
            'land', 'land development', 'land project', 'development project', 'land investment',
            'invest in land', 'land opportunity', 'agricultural land', 'farm land',
            'farming land', 'agricultural property', 'residential land', 'residential plot',
            'residential development', 'commercial land', 'commercial plot',
            'commercial development', 'industrial land', 'industrial plot', 'industrial zone',
            'plot', 'plots', 'plotted development', 'plot development', 'land parcel',
            'land area', 'land size', 'square feet', 'acreage', 'land acquisition',
            'land purchase', 'land buying', 'land dealer', 'land broker', 'land agent',
            'land cost', 'land price', 'land rate', 'per square feet', 'development',
            'project development', 'township development', 'infrastructure development',
            'land valuation', 'investment opportunity', 'future growth potential',
            'appreciation potential', 'investment returns', 'strategic location'
        ]
    ];

    /**
     * Service to Brand Mapping with CLICKABLE LINKS & CEO INFO
     */
    protected const SERVICE_TO_BRAND = [
        'Construction' => [
            'brand_name' => 'Atha Construction Pvt. Ltd.',
            'brand_short' => 'ATHA CONSTRUCTION',
            'website' => 'https://athaconstruction.in/',
            'instagram' => 'https://www.instagram.com/atha_construction/',
            'facebook' => 'https://www.facebook.com/athaconstructionofficial/',
            'linkedin' => 'https://www.linkedin.com/company/athaconstruction.in',
            'phone' => ['+91 9916047222', '+91 9606956044'],
            'projects_count' => '150+',
            'description' => 'High-quality, sustainable building solutions',
            'ceo_name' => 'AARUN',
            'ceo_website' => 'https://arunar.in/',
            'ceo_experience' => '16+ years'
        ],
        'Interiors' => [
            'brand_name' => 'Nesthetix Designs LLP',
            'brand_short' => 'NESTHETIX DESIGNS',
            'website' => 'https://nesthetixdesigns.com/',
            'instagram' => 'https://www.instagram.com/nesthetixdesigns/',
            'facebook' => 'https://www.facebook.com/nesthetixdesigns/',
            'linkedin' => 'https://in.linkedin.com/company/nesthetix-designs',
            'phone' => ['+91 9916047222', '+91 9606956044'],
            'projects_count' => '200+',
            'description' => 'Bespoke luxury interiors with meticulous craftsmanship',
            'ceo_name' => 'AARUN',
            'ceo_website' => 'https://arunar.in/',
            'ceo_experience' => '16+ years'
        ],
        'Real Estate' => [
            'brand_name' => 'Area24 Developers / Area24 Realty',
            'brand_short' => 'AREA24',
            'website' => 'https://area24developers.com/',
            'instagram' => 'https://www.instagram.com/area24properties/',
            'facebook' => 'https://www.facebook.com/wearearea24/',
            'linkedin' => 'https://in.linkedin.com/company/area24',
            'phone' => ['+91 9916047222', '+91 9606956044'],
            'projects_count' => '300+',
            'description' => 'Premium real estate solutions with property development',
            'ceo_name' => 'AARUN',
            'ceo_website' => 'https://arunar.in/',
            'ceo_experience' => '16+ years'
        ],
        'Event' => [
            'brand_name' => 'Stage365',
            'brand_short' => 'STAGE365',
            'website' => 'https://thestage365.com/',
            'instagram' => 'https://www.instagram.com/wearethestage365/',
            'facebook' => null,
            'linkedin' => null,
            'phone' => ['+91 9916047222', '+91 9606956044'],
            'projects_count' => '500+',
            'description' => 'High-quality event planning & brand activations',
            'ceo_name' => 'AARUN',
            'ceo_website' => 'https://arunar.in/',
            'ceo_experience' => '16+ years'
        ],
        'Land Development' => [
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
            'ceo_experience' => '16+ years'
        ]
    ];

    /**
     * Lead Qualification Questions per Service (More realistic & professional)
     */
    protected const LEAD_QUESTIONS = [
        'Construction' => [
            'q1' => 'What\'s your project?',
            'q2' => 'What\'s your budget range?',
            'q3' => 'Timeline for groundbreaking?'
        ],
        'Interiors' => [
            'q1' => 'What space?',
            'q2' => 'Approximate area?',
            'q3' => 'Design style preference?'
        ],
        'Real Estate' => [
            'q1' => 'What\'s your goal?',
            'q2' => 'Budget/Value range?',
            'q3' => 'Timeline?'
        ],
        'Event' => [
            'q1' => 'Event type?',
            'q2' => 'Expected guests?',
            'q3' => 'Budget & date?'
        ],
        'Land Development' => [
            'q1' => 'Land status?',
            'q2' => 'Preferred use?',
            'q3' => 'Land details?'
        ]
    ];

    /**
     * Question Options per Service (Clickable buttons with Other option)
     */
    protected const LEAD_QUESTION_OPTIONS = [
        'Construction' => [
            'q1' => ['Residential', 'Commercial', 'Mixed-use', 'Renovation', 'Other'],
            'q2' => ['₹50L', '₹50L-1Cr', '₹1-5Cr', '₹5Cr+', 'Other'],
            'q3' => ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Other']
        ],
        'Interiors' => [
            'q1' => ['Residential home', 'Office', 'Retail', 'Hospitality', 'Other'],
            'q2' => ['500-1000 sqft', '1000-2000 sqft', '2000-5000 sqft', '5000+ sqft', 'Other'],
            'q3' => ['Modern', 'Traditional', 'Minimalist', 'Luxury', 'Contemporary', 'Other']
        ],
        'Real Estate' => [
            'q1' => ['Buy property', 'Sell property', 'Rental investment', 'Lease consultation', 'Other'],
            'q2' => ['₹50L', '₹50L-1Cr', '₹1-2Cr', '₹2-5Cr', '₹5Cr+', 'Other'],
            'q3' => ['Within 1 month', '1-3 months', '3-6 months', 'Open', 'Other']
        ],
        'Event' => [
            'q1' => ['Wedding', 'Corporate Event', 'Product Launch', 'Conference', 'Party', 'Other'],
            'q2' => ['50-100', '100-250', '250-500', '500-1000', '1000+', 'Other'],
            'q3' => ['₹5-10L', '₹10-25L', '₹25-50L', '₹50L+', 'Other']
        ],
        'Land Development' => [
            'q1' => ['Own land seeking development', 'Want to invest in land', 'Other'],
            'q2' => ['Residential community', 'Commercial complex', 'Mixed development', 'Agricultural', 'Other'],
            'q3' => ['5-10 acres', '10-25 acres', '25+ acres', 'Other']
        ]
    ];

    /**
     * Area24ONE Introduction (Company Story)
     */
    protected const AREA24ONE_INTRO_TEXT = "Hi! I'm Area24ONE - your trusted partner for real estate, construction, interiors, events, and land development across Bangalore, Mysore, Ballari, and throughout Karnataka.

We help you:
✓ Build dream homes and villas
✓ Design stunning interiors
✓ Find/sell perfect properties
✓ Plan memorable events
✓ Develop land projects

We've completed 500+ successful projects with 98% client satisfaction.

What brings you here today? 👋";

    public function __construct()
    {
        // Minimal constructor
    }

    public function handle(string $sessionId = null, string $userMessage = '')
    {
        // Get or create session
        if ($sessionId) {
            $this->session = ChatSession::find($sessionId);
            if ($this->session && $this->session->user_id && $this->session->user_id !== auth()->id()) {
                throw new \Exception("Unauthorized access to chat session.");
            }
        }

        if (!$this->session) {
            $this->session = ChatSession::create([
                'state' => 'INIT',
                'user_id' => auth()->id(),
                'title' => 'New Chat',
                'data' => []
            ]);
        }

        // Save user message if provided
        if ($userMessage) {
            $this->session->messages()->create([
                'sender' => 'user',
                'message' => $userMessage
            ]);
        }

        // Process and get response
        $response = $this->processState($userMessage);

        // Save bot response
        $this->session->messages()->create([
            'sender' => 'bot',
            'message' => $response['text']
        ]);

        return [
            'reply' => $response['text'],
            'options' => $response['options'] ?? null,
            'highlight' => $response['highlight'] ?? false,
            'requires_input' => $response['requires_input'] ?? false,
            'session_id' => $this->session->id
        ];
    }

    /**
     * PHASE 1 v1.1: STATE MACHINE (4 STATES - OPTIMIZED)
     */
    protected function processState(string $input)
    {
        $state = $this->session->state;
        $data = $this->session->data ?? [];
        $lowInput = strtolower(trim($input));

        // STATE 1: INIT - Welcome (detect intent before showing intro)
        if ($state === 'INIT') {
            // Check if user message contains service intent
            $detection = $this->matchServiceIntent($lowInput);

            if ($detection['confidence'] === 'HIGH' && $detection['service']) {
                // User has clear intent - go straight to confirmation
                $data['service'] = $detection['service'];
                $data['intent_keywords_matched'] = $detection['keywords_matched'];
                $data['intent_confidence'] = $detection['confidence'];
                $data['location'] = $this->matchLocation($lowInput);
                $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
                return $this->showServiceConfirmation($detection['service']);
            }

            // No clear intent - show intro and move to INTENT_DETECTION
            $this->session->update(['state' => 'INTENT_DETECTION']);
            return ['text' => 'Hello! 👋 ' . $this->getIntroText()];
        }

        // STATE 2: INTENT_DETECTION - Detect service intent directly
        if ($state === 'INTENT_DETECTION') {
            // Skip if it's just greeting
            if ($this->detectGreeting($lowInput)) {
                return [
                    'text' => '📋 What brings you here?',
                    'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
                ];
            }

            $detection = $this->matchServiceIntent($lowInput);
            $location = $this->matchLocation($lowInput);

            $data['service'] = $detection['service'];
            $data['intent_keywords_matched'] = $detection['keywords_matched'];
            $data['intent_confidence'] = $detection['confidence'];
            $data['location'] = $location;

            // HIGH confidence: Show service confirmation
            if ($detection['confidence'] === 'HIGH' && $detection['service']) {
                $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
                return $this->showServiceConfirmation($detection['service']);
            }

            // No clear intent: Show service menu
            $this->session->update(['state' => 'SERVICE_SELECTION', 'data' => $data]);
            return [
                'text' => '📋 Pick a service:',
                'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
            ];
        }

        // STATE 2.5: SERVICE_CONFIRMATION - Confirm detected service before proceeding
        if ($state === 'SERVICE_CONFIRMATION') {
            $suggestedService = $data['service'] ?? null;

            // Check if user explicitly rejects or corrects
            if ($this->isRejection($lowInput)) {
                $this->session->update(['state' => 'SERVICE_SELECTION', 'data' => $data]);
                return [
                    'text' => 'No problem! Let me show you all options:',
                    'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
                ];
            }

            // Check if user mentions a different service
            $newDetection = $this->matchServiceIntent($lowInput);
            if ($newDetection['confidence'] === 'HIGH' && $newDetection['service'] !== $suggestedService) {
                // User corrected to different service
                $data['service'] = $newDetection['service'];
                $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
                return $this->showServiceConfirmation($newDetection['service']);
            }

            // User confirmed or didn't object - proceed to lead questions
            $title = $suggestedService . (($data['location'] ?? '') ? ' – ' . $data['location'] : '');
            $this->session->update(['state' => 'LEAD_QUALIFICATION', 'data' => $data, 'title' => $title]);
            $response = $this->buildServiceResponse($suggestedService, $data['location'] ?? null);
            $question = $this->getLeadQuestion($suggestedService, 'q1') ?: 'Tell me more?';
            $options = $this->getLeadOptions($suggestedService, 'q1');
            
                $result = [
                    'text' => $response['text'] . "\n\n" . $question
                ];
            
            if ($options) {
                $result['options'] = $options;
            }
            
            return $result;
        }

        // STATE 3: SERVICE_SELECTION - User picks service from menu
        if ($state === 'SERVICE_SELECTION') {
            $service = $this->detectService($lowInput);

            if (!$service) {
                return [
                    'text' => '📋 Please pick one:',
                    'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
                ];
            }

            $data['service'] = $service;
            $data['location'] = $data['location'] ?? $this->matchLocation($lowInput);
            $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
            return $this->showServiceConfirmation($service);
        }

        // STATE 4: LEAD_QUALIFICATION - Collect Q1, Q2, Q3 (with service change support)
        if ($state === 'LEAD_QUALIFICATION') {
            $service = $data['service'] ?? null;
            if (!$service) {
                return ['text' => 'Please select a service to continue.'];
            }

            // Allow user to change service during qualification
            if ($this->isRejection($lowInput) || strpos($lowInput, 'actually') !== false || strpos($lowInput, 'change') !== false || strpos($lowInput, 'different') !== false) {
                $this->session->update(['state' => 'SERVICE_SELECTION', 'data' => $data]);
                return [
                    'text' => 'No problem! Let me show you all options:',
                    'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
                ];
            }

            // Check if user mentions a different service explicitly
            $newDetection = $this->matchServiceIntent($lowInput);
            if ($newDetection['confidence'] === 'HIGH' && $newDetection['service'] !== $service) {
                $data['service'] = $newDetection['service'];
                $data['current_question'] = 'q1'; // Reset questions for new service
                $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
                return $this->showServiceConfirmation($newDetection['service']);
            }

            $currentQ = $data['current_question'] ?? 'q1';
            $waitingForCustomInput = $data['waiting_for_custom_input'] ?? false;

            // When waiting for custom input, if user asks about packages/pricing instead of answering, answer and re-prompt
            if ($waitingForCustomInput && $this->isPackageOrPricingQuestionInFlow($lowInput)) {
                $customQ = $data['custom_input_question'] ?? null;
                $label = $this->getCustomInputLabel($customQ, $service);
                if ($service === 'Interiors' && $label) {
                    $interiorService = new \App\Services\InteriorPackageService();
                    $overview = $interiorService->getInteriorOverview();
                    $brand = $this->getBrandArray('Interiors');
                    if ($brand && !empty($brand['phone'])) {
                        $overview .= "\n\n📞 **Want to discuss?** ";
                        $overview .= implode(' | ', array_map(fn($p) => "Call: {$p}", $brand['phone']));
                    }
                    return [
                        'text' => $overview . "\n\n—\n\nWhen you're ready, please specify your **" . $label . "**:",
                        'requires_input' => true
                    ];
                }
                if ($service === 'Construction' && $label) {
                    $pkgService = new \App\Services\ConstructionPackageService();
                    $overview = $pkgService->getPackageOverview();
                    $brand = $this->getBrandArray('Construction');
                    if ($brand && !empty($brand['phone'])) {
                        $overview .= "\n\n📞 **Want to discuss?** ";
                        $overview .= implode(' | ', array_map(fn($p) => "Call: {$p}", $brand['phone']));
                    }
                    return [
                        'text' => $overview . "\n\n—\n\nWhen you're ready, please specify your **" . $label . "**:",
                        'requires_input' => true
                    ];
                }
            }

            // Handle "Other" option - ask for custom input
            if ($input === 'Other' && !$waitingForCustomInput) {
                $data['waiting_for_custom_input'] = true;
                $data['custom_input_question'] = $currentQ;
                $this->session->update(['data' => $data]);
                return [
                    'text' => "Please specify your custom option:",
                    'requires_input' => true
                ];
            }

            // Store answer (either from button or custom input)
            if ($waitingForCustomInput) {
                $customQ = $data['custom_input_question'];
                $data[$customQ . '_answer'] = $input;
                $data['waiting_for_custom_input'] = false;
                unset($data['custom_input_question']);
                // Update currentQ to the question we just answered
                $currentQ = $customQ;
            } else {
                $data[$currentQ . '_answer'] = $input;
            }

            // Move to next question or collect name/phone
            if ($currentQ === 'q1') {
                $data['current_question'] = 'q2';
                $nextQ = $this->getLeadQuestion($service, 'q2') ?: 'Next question?';
                $options = $this->getLeadOptions($service, 'q2');
                $this->session->update(['data' => $data]);
                
                $result = ['text' => $nextQ];
                if ($options) {
                    $result['options'] = $options;
                }
                return $result;
            } elseif ($currentQ === 'q2') {
                $data['current_question'] = 'q3';
                $nextQ = $this->getLeadQuestion($service, 'q3') ?: 'Final question?';
                $options = $this->getLeadOptions($service, 'q3');
                $this->session->update(['data' => $data]);
                
                $result = ['text' => $nextQ];
                if ($options) {
                    $result['options'] = $options;
                }
                return $result;
            } elseif ($currentQ === 'q3') {
                // All 3 answers collected - now ask for location
                $data['current_question'] = 'location';
                $this->session->update(['data' => $data]);
                return [
                    'text' => 'What location?',
                    'options' => ['Bangalore', 'Mysore', 'Ballari', 'Other']
                ];
            } elseif ($currentQ === 'location') {
                // Handle location "Other" option
                if ($input === 'Other' && !$waitingForCustomInput) {
                    $data['waiting_for_custom_input'] = true;
                    $data['custom_input_question'] = 'location';
                    $this->session->update(['data' => $data]);
                    return [
                        'text' => "Please specify your location:",
                        'requires_input' => true
                    ];
                }
                
                // Store location (either from button or custom input)
                if ($waitingForCustomInput && ($data['custom_input_question'] ?? null) === 'location') {
                    $data['location'] = $input;
                    $data['waiting_for_custom_input'] = false;
                    unset($data['custom_input_question']);
                } else {
                    $data['location'] = $input;
                }
                
                // Location collected - now ask for name
                $data['current_question'] = 'name';
                $this->session->update(['data' => $data]);
                return [
                    'text' => "🔴 **REQUIRED** 🔴\n\n📝 Please provide your **FULL NAME**:\n\n(This is mandatory to proceed)",
                    'highlight' => true,
                    'requires_input' => true
                ];
            } elseif ($currentQ === 'name') {
                // Name collected - now ask for phone
                $data['name'] = $input;
                $data['current_question'] = 'phone';
                $this->session->update(['data' => $data]);
                return [
                    'text' => "🔴 **REQUIRED** 🔴\n\n📱 Please provide your **PHONE NUMBER**:\n\n(This is mandatory to proceed)",
                    'highlight' => true,
                    'requires_input' => true
                ];
            } elseif ($currentQ === 'phone') {
                // Phone collected - all data complete, save to leads
                $data['phone'] = $input;
                $this->session->update(['data' => $data]);
                
                // Create lead
                $lead = \App\Models\Lead::create([
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'email' => $data['email'] ?? null,
                    'service' => $service,
                    'location' => $data['location'] ?? null,
                    'q1_answer' => $data['q1_answer'] ?? null,
                    'q2_answer' => $data['q2_answer'] ?? null,
                    'q3_answer' => $data['q3_answer'] ?? null,
                    'message' => $this->formatLeadMessage($data, $service)
                ]);

                // Link session to lead
                $this->session->update(['lead_id' => $lead->id, 'state' => 'COMPLETE']);

                return [
                    'text' => "✅ Perfect! 👍\n\nWe have all your information. Our team will reach out to you soon with personalized solutions.\n\n**Your Details:**\n✓ Service: {$service}\n✓ Location: " . ($data['location'] ?? 'Not specified') . "\n✓ Name: {$data['name']}\n✓ Phone: {$data['phone']}\n\nThank you for choosing Area24ONE! 🎉"
                ];
            }
        }

        // STATE 5: COMPLETE - Continue conversation after lead qualification
        if ($state === 'COMPLETE') {
            $service = $data['service'] ?? null;
            $location = $data['location'] ?? null;

            // Intent-first: detect which service user is ASKING about (not session service) for pricing
            $pricingKeywords = ['pricing', 'price', 'cost', 'rates', 'how much', 'package', 'packages', 'budget', 'quote', 'quotation', 'estimate'];
            $isPricingQuery = false;
            foreach ($pricingKeywords as $kw) {
                if (strpos($lowInput, $kw) !== false) {
                    $isPricingQuery = true;
                    break;
                }
            }
            $askedService = $this->getAskedServiceForPricing($lowInput);

            // User asked about Interiors pricing (even if session is Construction)
            if ($isPricingQuery && $askedService === 'Interiors') {
                $interiorService = new \App\Services\InteriorPackageService();
                $serviceType = $interiorService->extractServiceType($input);
                if ($serviceType) {
                    $details = $interiorService->getPackageDetails($serviceType);
                    if ($details) {
                        $brand = $this->getBrandArray('Interiors');
                        $text = $details;
                        if ($brand && ! empty($brand['phone'])) {
                            $text .= "\n\n📞 **Need more details?**\n";
                            foreach ($brand['phone'] as $phone) {
                                $text .= "Call: {$phone}\n";
                            }
                        }
                        return ['text' => $text];
                    }
                }
                $overview = $interiorService->getInteriorOverview();
                $brand = $this->getBrandArray('Interiors');
                if ($brand && ! empty($brand['phone'])) {
                    $overview .= "\n\n📞 **Want to discuss your project?**\n";
                    foreach ($brand['phone'] as $phone) {
                        $overview .= "Call: {$phone}\n";
                    }
                }
                return ['text' => $overview];
            }

            // User asked about Construction pricing (only when they clearly mean construction)
            if ($isPricingQuery && $askedService === 'Construction') {
                $packageService = new \App\Services\ConstructionPackageService();
                if ($packageService->isPricingQuery($input)) {
                    $packagePrice = $packageService->extractPackagePrice($input);
                    if ($packagePrice) {
                        $details = $packageService->getPackageDetails($packagePrice);
                        if ($details) {
                            $brand = $this->getBrandArray('Construction');
                            $text = $details;
                            if ($brand && ! empty($brand['phone'])) {
                                $text .= "\n\n📞 **Need more details?**\n";
                                foreach ($brand['phone'] as $phone) {
                                    $text .= "Call: {$phone}\n";
                                }
                            }
                            return ['text' => $text];
                        }
                    }
                    $overview = $packageService->getPackageOverview();
                    $brand = $this->getBrandArray('Construction');
                    if ($brand && ! empty($brand['phone'])) {
                        $overview .= "\n\n📞 **Want to discuss your project?**\n";
                        foreach ($brand['phone'] as $phone) {
                            $overview .= "Call: {$phone}\n";
                        }
                    }
                    return ['text' => $overview];
                }
                if (strpos($lowInput, 'comparison') !== false || strpos($lowInput, 'compare') !== false) {
                    $comparison = $packageService->getPackageComparison();
                    $brand = $this->getBrandArray('Construction');
                    if ($brand && ! empty($brand['phone'])) {
                        $comparison .= "\n\n📞 **Need help choosing?**\n";
                        foreach ($brand['phone'] as $phone) {
                            $comparison .= "Call: {$phone}\n";
                        }
                    }
                    return ['text' => $comparison];
                }
            }

            // User asked about Real Estate / Event / Land Development pricing → custom-only response
            if ($isPricingQuery && in_array($askedService, ['Real Estate', 'Event', 'Land Development'], true)) {
                return ['text' => $this->getCustomPricingResponse($askedService)];
            }

            // Handle Construction pricing queries with package details (session service)
            if ($service === 'Construction') {
                $packageService = new \App\Services\ConstructionPackageService();
                
                if ($packageService->isPricingQuery($input)) {
                    $packagePrice = $packageService->extractPackagePrice($input);
                    
                    if ($packagePrice) {
                        // User asked about specific package
                        $packageDetails = $packageService->getPackageDetails($packagePrice);
                        if ($packageDetails) {
                            $brand = $this->getBrandArray($service) ?? null;
                            $responseText = $packageDetails;
                            if ($brand && !empty($brand['phone'])) {
                                $responseText .= "\n\n📞 **Need more details?**\n";
                                foreach ($brand['phone'] as $phone) {
                                    $responseText .= "Call: {$phone}\n";
                                }
                            }
                            return ['text' => $responseText];
                        }
                    } else {
                        // General pricing query - show overview
                        $overview = $packageService->getPackageOverview();
                        $brand = $this->getBrandArray($service) ?? null;
                        if ($brand && !empty($brand['phone'])) {
                            $overview .= "\n\n📞 **Want to discuss your project?**\n";
                            foreach ($brand['phone'] as $phone) {
                                $overview .= "Call: {$phone}\n";
                            }
                        }
                        return ['text' => $overview];
                    }
                }
                
                // Check for package comparison queries
                if (strpos($lowInput, 'comparison') !== false || 
                    strpos($lowInput, 'difference') !== false || 
                    strpos($lowInput, 'compare') !== false) {
                    $comparison = $packageService->getPackageComparison();
                    $brand = $this->getBrandArray($service) ?? null;
                    if ($brand && !empty($brand['phone'])) {
                        $comparison .= "\n\n📞 **Need help choosing?**\n";
                        foreach ($brand['phone'] as $phone) {
                            $comparison .= "Call: {$phone}\n";
                        }
                    }
                    return ['text' => $comparison];
                }
            }

            // Handle Interiors pricing / service queries
            if ($service === 'Interiors') {
                $interiorService = new \App\Services\InteriorPackageService();

                if ($interiorService->isPricingQuery($input)) {
                    $serviceType = $interiorService->extractServiceType($input);

                    if ($serviceType) {
                        $details = $interiorService->getPackageDetails($serviceType);
                        if ($details) {
                            $brand = $this->getBrandArray($service) ?? null;
                            $responseText = $details;
                            if ($brand && ! empty($brand['phone'])) {
                                $responseText .= "\n\n📞 **Need more details?**\n";
                                foreach ($brand['phone'] as $phone) {
                                    $responseText .= "Call: {$phone}\n";
                                }
                            }
                            return ['text' => $responseText];
                        }
                    }
                    $overview = $interiorService->getInteriorOverview();
                    $brand = $this->getBrandArray($service) ?? null;
                    if ($brand && ! empty($brand['phone'])) {
                        $overview .= "\n\n📞 **Want to discuss your project?**\n";
                        foreach ($brand['phone'] as $phone) {
                            $overview .= "Call: {$phone}\n";
                        }
                    }
                    return ['text' => $overview];
                }

                if (strpos($lowInput, 'comparison') !== false || strpos($lowInput, 'compare') !== false) {
                    $comparison = $interiorService->getComparisonTable();
                    $brand = $this->getBrandArray($service) ?? null;
                    if ($brand && ! empty($brand['phone'])) {
                        $comparison .= "\n\n📞 **Need help choosing?**\n";
                        foreach ($brand['phone'] as $phone) {
                            $comparison .= "Call: {$phone}\n";
                        }
                    }
                    return ['text' => $comparison];
                }
            }

            // Use IntentMatcher to provide contextual responses
            $intentMatcher = new \App\Services\IntentMatcher();
            $intentMatch = $intentMatcher->match($input, $service);

            if ($intentMatch && $intentMatch['found']) {
                // Found a relevant intent - return the response
                $responseText = $intentMatch['response'];

                // Add service context if available
                if ($service) {
                    $brand = $this->getBrandArray($service) ?? null;
                    if ($brand) {
                        // Append contact info for easy reference
                        $responseText .= "\n\n📞 **Need immediate help?**\n";
                        if (!empty($brand['phone']) && is_array($brand['phone'])) {
                            foreach ($brand['phone'] as $phone) {
                                $responseText .= "Call: {$phone}\n";
                            }
                        }
                    }
                }

                return ['text' => $responseText];
            }

            // Process / timeline query — give a real answer instead of repeating the generic message
            if ($service && $this->isProcessOrTimelineQuery($lowInput)) {
                $processText = $this->getProcessTimelineResponse($service);
                if ($processText) {
                    return ['text' => $processText];
                }
            }

            // "About [brand]" / "tell me about Nesthetix" etc. — return brand/company info
            if ($service && $this->isAboutBrandQuery($lowInput, $service)) {
                $brandResponse = $this->buildServiceResponse($service, $location);
                return ['text' => $brandResponse['text']];
            }

            // Check if user wants to start a new service
            $newDetection = $this->matchServiceIntent($lowInput);
            if ($newDetection['confidence'] === 'HIGH' && $newDetection['service'] !== $service) {
                // User wants to explore a different service
                $data['service'] = $newDetection['service'];
                $data['location'] = $this->matchLocation($lowInput) ?? $location;
                $this->session->update(['state' => 'SERVICE_CONFIRMATION', 'data' => $data]);
                return $this->showServiceConfirmation($newDetection['service']);
            }
            
            // Check if it's a greeting
            if ($this->detectGreeting($lowInput)) {
                $serviceContext = $service ? " I see you're interested in **{$service}**." : "";
                return [
                    'text' => "Hello again! 👋{$serviceContext} How can I help you today?",
                    'options' => $service ? null : ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
                ];
            }
            
            // Generic helpful response with service context
            if ($service) {
                $brand = $this->getBrandArray($service) ?? null;
                $serviceName = $brand['brand_name'] ?? $service;
                
                return [
                    'text' => "I'm here to help with your **{$service}** inquiry! 💬\n\nYou can ask me about:\n• Pricing and costs\n• Process and timeline\n• Materials and quality\n• Approvals and legal\n• Any other questions\n\nOr feel free to ask anything specific about {$serviceName}.",
                ];
            }
            
            // No service context - offer to help
            return [
                'text' => "I'm here to help! 😊\n\nWhat would you like to know? You can ask about:\n• Our services\n• Pricing information\n• Process details\n• Or anything else!",
                'options' => ['🏗️ Build a House/Villa', '🎨 Interior Design', '🏢 Buy/Sell Property', '🎉 Event Management', '🌱 Land Development']
            ];
        }

        // FALLBACK
        return ['text' => 'How can I help you?'];
    }

    /**
     * Show service confirmation with yes/no buttons
     */
    protected function showServiceConfirmation(string $service): array
    {
        $serviceEmojis = [
            'Construction' => '🏗️',
            'Interiors' => '🎨',
            'Real Estate' => '🏢',
            'Event' => '🎉',
            'Land Development' => '🌱'
        ];

        $emoji = $serviceEmojis[$service] ?? '✨';
        return [
            'text' => "{$emoji} Great! So you're interested in **{$service}**. Is that correct?",
            'options' => ['Yes, exactly!', 'No, let me change']
        ];
    }

    /**
     * Helper: Check if input is a rejection (no, nope, wrong, etc.)
     */
    protected function isRejection(string $input): bool
    {
        $rejections = ['no', 'nope', 'nah', 'wrong', 'not', 'don\'t want', 'not interested', 'different', 'change'];
        foreach ($rejections as $word) {
            if (strpos($input, $word) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Helper: Detect if input is a greeting
     */
    protected function detectGreeting(string $input): bool
    {
        // Try DB first
        $cfg = ServiceConfig::whereNotNull('greeting_keywords')->first();
        $greetingKeywords = $cfg ? $cfg->greeting_keywords : self::GREETING_KEYWORDS;

        foreach ($greetingKeywords as $greeting) {
            if (strpos($input, $greeting) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Helper: Match service intent from keywords (30-40 per service)
     */
    protected function matchServiceIntent(string $input): array
    {
        $matches = [];
        $keywordsMatched = [];

        $services = ['Construction', 'Interiors', 'Real Estate', 'Event', 'Land Development'];

        foreach ($services as $service) {
            // 1. Try DB ServiceConfig detection_keywords
            $cfg = ServiceConfig::where('service_vertical', $service)->first();
            $keywords = $cfg ? ($cfg->detection_keywords ?? []) : [];

            // 2. If empty, try DB Intent keywords
            if (empty($keywords)) {
                $keywords = $this->getServiceDetectionKeywords($service);
            }

            // 3. If still empty, use static fallback
            if (empty($keywords)) {
                $keywords = self::SERVICES_INTENT_KEYWORDS[$service] ?? [];
            }

            $serviceKeywordCount = 0;
            $matchedKeywords = [];

            foreach ($keywords as $keyword) {
                if (strpos($input, $keyword) !== false) {
                    $serviceKeywordCount += 1;
                    $matchedKeywords[] = $keyword;
                }
            }

            if ($serviceKeywordCount > 0) {
                $matches[$service] = $serviceKeywordCount;
                $keywordsMatched[$service] = $matchedKeywords;
            }
        }

        if (empty($matches)) {
            return [
                'service' => null,
                'keywords_matched' => [],
                'confidence' => 'NONE'
            ];
        }

        // Get service with highest matches
        $topService = array_key_first(array_map(fn() => null, array_filter(
            $matches,
            fn($v) => $v === max($matches)
        )));

        $matchCount = $matches[$topService];
        $confidence = $matchCount >= 3 ? 'HIGH' : ($matchCount >= 2 ? 'MEDIUM' : 'LOW');

        return [
            'service' => $topService,
            'keywords_matched' => $keywordsMatched[$topService] ?? [],
            'confidence' => $confidence
        ];
    }

    /**
     * Load detection keywords for a service from DB intents.
     */
    protected function getServiceDetectionKeywords(string $service): array
    {
        $sets = Intent::where('service_vertical', $service)->pluck('keywords')->all();
        $all = [];
        foreach ($sets as $arr) {
            if (is_array($arr)) {
                foreach ($arr as $kw) {
                    if (is_string($kw)) {
                        $kw = trim(mb_strtolower($kw));
                        if ($kw !== '' && strlen($kw) >= 3) {
                            $all[] = $kw;
                        }
                    }
                }
            }
        }
        if (empty($all)) {
            return [];
        }
        return array_values(array_unique($all));
    }

    /**
     * Helper: Match location from input
     */
    protected function matchLocation(string $input): ?string
    {
        // Try DB first (from first available config that has global settings)
        $cfg = ServiceConfig::whereNotNull('location_keywords')->first();
        $locationKeywords = $cfg ? $cfg->location_keywords : self::LOCATION_KEYWORDS;

        foreach ($locationKeywords as $location => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos($input, $keyword) !== false) {
                    return $location;
                }
            }
        }
        return null;
    }

    /**
     * Detect which service the user is asking about (for pricing/intent routing).
     * Used in COMPLETE so "interior pricing" gets Interiors response even when session is Construction.
     */
    protected function getAskedServiceForPricing(string $input): ?string
    {
        $low = $input;
        if (strpos($low, 'interior') !== false || strpos($low, 'interiors') !== false || strpos($low, 'interior design') !== false || strpos($low, 'nesthetix') !== false) {
            return 'Interiors';
        }
        if (strpos($low, 'construction') !== false || strpos($low, 'build') !== false || strpos($low, 'construct') !== false || strpos($low, 'atha') !== false) {
            return 'Construction';
        }
        if (strpos($low, 'real estate') !== false || strpos($low, 'property') !== false || strpos($low, 'buy property') !== false || strpos($low, 'sell property') !== false || strpos($low, 'area24 realty') !== false) {
            return 'Real Estate';
        }
        if (strpos($low, 'event') !== false || strpos($low, 'wedding') !== false || strpos($low, 'party') !== false || strpos($low, 'stage 365') !== false || strpos($low, 'stage365') !== false) {
            return 'Event';
        }
        if (strpos($low, 'land') !== false || strpos($low, 'land development') !== false || strpos($low, 'plot') !== false) {
            return 'Land Development';
        }
        return null;
    }

    /**
     * Response when user asks about pricing for services that are fully custom (Real Estate, Event, Land Development).
     */
    protected function getCustomPricingResponse(string $service): string
    {
        $brand = $this->getBrandArray($service) ?? null;
        $name = $brand['brand_name'] ?? $service;
        $phones = $brand['phone'] ?? ['+91 9916047222', '+91 9606956044'];

        $text = "**{$service}** — {$name}\n\n";
        $text .= "Pricing is **fully custom** based on your requirements.\n\n";
        $text .= "✓ Share your details here and we’ll get back with a tailored response\n";
        $text .= "✓ Or contact us directly:\n";
        foreach ($phones as $phone) {
            $text .= "• Call / WhatsApp: {$phone}\n";
        }
        $text .= "• Email or visit in person — we’re happy to discuss your project.\n\n";
        $text .= "Tell us a bit about what you need and we’ll take it from there.";

        return $text;
    }

    /**
     * Detect if input looks like a package/pricing question (used when waiting for custom input in lead qual)
     */
    protected function isPackageOrPricingQuestionInFlow(string $input): bool
    {
        $keywords = ['package', 'packages', 'pricing', 'price', 'cost', 'how much', 'details', 'what is your', 'tell me about', 'pavkage', 'pacakge'];
        foreach ($keywords as $kw) {
            if (strpos($input, $kw) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Human-readable label for custom input question (for re-prompt after answering package question). Service-aware.
     */
    protected function getCustomInputLabel(?string $customQ, string $service): ?string
    {
        if (!$customQ) {
            return null;
        }
        if ($customQ === 'location') {
            return 'location';
        }
        $labels = [
            'Construction' => ['q1' => 'project type', 'q2' => 'budget range', 'q3' => 'timeline for groundbreaking'],
            'Interiors' => ['q1' => 'space type', 'q2' => 'approximate area', 'q3' => 'design style'],
            'Real Estate' => ['q1' => 'goal', 'q2' => 'budget/value range', 'q3' => 'timeline'],
            'Event' => ['q1' => 'event type', 'q2' => 'expected guests', 'q3' => 'budget & date'],
            'Land Development' => ['q1' => 'land status', 'q2' => 'preferred use', 'q3' => 'land details'],
        ];
        return $labels[$service][$customQ] ?? $customQ;
    }

    /**
     * Detect if user is asking about process, timeline, steps, or duration
     */
    protected function isProcessOrTimelineQuery(string $input): bool
    {
        $keywords = ['process', 'timeline', 'how long', 'steps', 'duration', 'phases', 'stages', 'workflow', 'procedure', 'when can', 'how many days', 'how many weeks', 'schedule'];
        foreach ($keywords as $kw) {
            if (strpos($input, $kw) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Service-specific process & timeline response (COMPLETE state)
     */
    protected function getProcessTimelineResponse(string $service): ?string
    {
        $cfg = ServiceConfig::where('service_vertical', $service)->first();
        if ($cfg && !empty($cfg->process_timeline)) {
            $brand = $this->getBrandArray($service) ?? null;
            $phones = $brand['phone'] ?? [];
            $text = $cfg->process_timeline;

            if (!empty($phones)) {
                $text .= "\n\n📞 **Want a tailored timeline?**\n";
                foreach ($phones as $phone) {
                    $text .= "Call: {$phone}\n";
                }
            }
            return $text;
        }

        $brand = $this->getBrandArray($service) ?? null;
        $phones = $brand['phone'] ?? [];

        $responses = [
            'Interiors' => "🎨 **Nesthetix Designs — Process & Timeline**\n\n" .
                "**Typical flow:**\n" .
                "1. **Consultation** — We understand your space, style, and budget (1–2 meetings).\n" .
                "2. **Design & concept** — Mood boards, layouts, and 3D visuals (2–4 weeks).\n" .
                "3. **Finalisation** — Material selection, BOQ, and project plan (1–2 weeks).\n" .
                "4. **Execution** — Site work, coordination, and quality checks (timeline depends on scope).\n" .
                "5. **Handover** — Final walkthrough and documentation.\n\n" .
                "Overall timeline is **custom** per project; we'll give you a clear schedule after the first briefing.",
            'Construction' => "🏗️ **Atha Construction — Process & Timeline**\n\n" .
                "**Typical flow:**\n" .
                "1. **Site visit & brief** — Understanding your requirements and site (1–2 meetings).\n" .
                "2. **Design & approvals** — Drawings, structural details, and statutory approvals (4–12 weeks).\n" .
                "3. **Construction** — Foundation to finishing as per agreed schedule (project-specific).\n" .
                "4. **Handover** — Snagging, documentation, and key handover.\n\n" .
                "Timeline depends on scale and approvals; we'll share a detailed schedule after the initial assessment.",
            'Real Estate' => "🏢 **Area24 Realty — Process & Timeline**\n\n" .
                "**Typical flow:**\n" .
                "1. **Requirement & budget** — We understand what you're looking for (buy/sell/rent).\n" .
                "2. **Shortlisting** — Curated options matching your criteria.\n" .
                "3. **Site visits & negotiation** — Viewings and deal structuring.\n" .
                "4. **Documentation & closure** — Legal checks and registration support.\n\n" .
                "Timeline varies by deal; we'll give you a realistic schedule once we know your goal.",
            'Event' => "🎉 **Stage365 — Process & Timeline**\n\n" .
                "**Typical flow:**\n" .
                "1. **Brief & concept** — Event type, scale, and creative direction (1–2 meetings).\n" .
                "2. **Proposal** — Theme, venue, F&B, and budget outline (1–2 weeks).\n" .
                "3. **Planning & production** — Vendor finalisation, run sheet, and rehearsals.\n" .
                "4. **Execution & wrap** — Event day and post-event support.\n\n" .
                "Timeline depends on event size; we'll share a clear plan after the initial brief.",
            'Land Development' => "🌱 **Area24 Land Development — Process & Timeline**\n\n" .
                "**Typical flow:**\n" .
                "1. **Site & intent** — Understanding land status and your development goal.\n" .
                "2. **Feasibility** — Land use, regulations, and high-level economics (2–4 weeks).\n" .
                "3. **Plan & approvals** — Layout, NOC, and statutory clearances (project-specific).\n" .
                "4. **Execution** — Development as per approved plan.\n\n" .
                "Timeline is project-specific; we'll outline it after the first assessment.",
        ];

        $text = $responses[$service] ?? null;
        if (!$text) {
            return null;
        }
        if (!empty($phones)) {
            $text .= "\n\n📞 **Want a tailored timeline?**\n";
            foreach ($phones as $phone) {
                $text .= "Call: {$phone}\n";
            }
        }
        return $text;
    }

    /**
     * Detect if user is asking about the current service/brand (e.g. tell me about Nesthetix)
     */
    protected function isAboutBrandQuery(string $input, string $service): bool
    {
        $brand = $this->getBrandArray($service) ?? null;
        if (!$brand) {
            return false;
        }
        $aboutKeywords = ['about', 'tell me about', 'who is', 'what is', 'who are', 'what are', 'info', 'information', 'know about'];
        $brandTerms = array_filter([
            strtolower($brand['brand_name'] ?? ''),
            strtolower($brand['brand_short'] ?? ''),
        ]);
        $triggers = [
            'Interiors' => array_merge(['nesthetix', 'nesthetix design', 'interior design company'], $brandTerms),
            'Construction' => array_merge(['atha', 'atha construction', 'construction company'], $brandTerms),
            'Real Estate' => array_merge(['area24 realty', 'area24 real estate', 'realty'], $brandTerms),
            'Event' => array_merge(['stage365', 'stage 365', 'event company'], $brandTerms),
            'Land Development' => array_merge(['area24 land', 'land development', 'area24 developers'], $brandTerms),
        ];
        $serviceTriggers = $triggers[$service] ?? [];
        foreach ($aboutKeywords as $kw) {
            if (strpos($input, $kw) === false) {
                continue;
            }
            foreach ($serviceTriggers as $t) {
                if (strpos($input, $t) !== false) {
                    return true;
                }
            }
            $short = strtolower($brand['brand_short'] ?? '');
            $name = strtolower($brand['brand_name'] ?? '');
            if (($short && strpos($input, $short) !== false) || ($name && strpos($input, $name) !== false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Helper: Detect service from button click or direct text
     */
    protected function detectService(string $lowInput): ?string
    {
        $serviceMap = [
            'build' => 'Construction',
            'house' => 'Construction',
            'villa' => 'Construction',
            'construction' => 'Construction',
            'interior' => 'Interiors',
            'design' => 'Interiors',
            'decor' => 'Interiors',
            'property' => 'Real Estate',
            'real estate' => 'Real Estate',
            'buy' => 'Real Estate',
            'sell' => 'Real Estate',
            'event' => 'Event',
            'wedding' => 'Event',
            'party' => 'Event',
            'land' => 'Land Development',
            'develop' => 'Land Development'
        ];

        foreach ($serviceMap as $keyword => $service) {
            if (strpos($lowInput, $keyword) !== false) {
                return $service;
            }
        }

        // Check button clicks
        if (strpos($lowInput, 'build') !== false || strpos($lowInput, 'house') !== false) {
            return 'Construction';
        }
        if (strpos($lowInput, 'interior') !== false || strpos($lowInput, 'design') !== false) {
            return 'Interiors';
        }
        if (strpos($lowInput, 'property') !== false || strpos($lowInput, 'real estate') !== false) {
            return 'Real Estate';
        }
        if (strpos($lowInput, 'event') !== false || strpos($lowInput, 'wedding') !== false) {
            return 'Event';
        }
        if (strpos($lowInput, 'land') !== false) {
            return 'Land Development';
        }

        return null;
    }

    /**
     * Helper: Build service-specific response with brand info & clickable links
     */
    protected function buildServiceResponse(string $service, ?string $location): array
    {
        $cfg = \App\Models\ServiceConfig::where('service_vertical', $service)->first();
        $brand = $cfg ? [
            'brand_name' => $cfg->brand_name,
            'brand_short' => $cfg->brand_short,
            'website' => $cfg->website,
            'instagram' => $cfg->instagram,
            'facebook' => $cfg->facebook,
            'linkedin' => $cfg->linkedin,
            'phone' => $cfg->phone ?? [],
            'projects_count' => $cfg->projects_count,
            'description' => $cfg->description,
            'ceo_name' => $cfg->ceo_name,
            'ceo_website' => $cfg->ceo_website,
            'ceo_experience' => $cfg->ceo_experience,
        ] : (self::SERVICE_TO_BRAND[$service] ?? null);
        if (!$brand) {
            return ['text' => 'Service not found.'];
        }
        $response = "✨ **{$service}** - {$brand['brand_name']}\n\n";
        $response .= "📊 **Track Record**\n";
        $response .= "✓ {$brand['projects_count']} successful projects\n";
        $response .= "✓ {$brand['description']}\n\n";
        $response .= "📞 **Contact Us**\n";
        if (!empty($brand['phone']) && is_array($brand['phone'])) {
            foreach ($brand['phone'] as $phone) {
                $response .= "Phone: {$phone}\n";
            }
        }
        $response .= "\n🔗 **Connect With Us**\n";
        $response .= "Website: " . $brand['website'] . "\n";
        if ($brand['instagram']) {
            $response .= "Instagram: " . $brand['instagram'] . "\n";
        }
        if ($brand['facebook']) {
            $response .= "Facebook: " . $brand['facebook'] . "\n";
        }
        if ($brand['linkedin']) {
            $response .= "LinkedIn: " . $brand['linkedin'] . "\n";
        }
        $response .= "\n👨‍💼 **Leadership**\n";
        $response .= "Founder & CEO: {$brand['ceo_name']}\n";
        $response .= "Experience: {$brand['ceo_experience']}\n";
        $response .= "Portfolio: " . $brand['ceo_website'] . "\n";
        return [
            'text' => $response,
            'brand' => $brand,
            'service' => $service,
            'type' => 'service_info'
        ];
    }

    /**
     * Get Introduction Text
     */
    protected function getIntroText(): string
    {
        $cfg = ServiceConfig::whereNotNull('intro_text')->first();
        return $cfg ? $cfg->intro_text : self::AREA24ONE_INTRO_TEXT;
    }

    /**
     * Helper: Format lead message from qualification data
     */
    protected function formatLeadMessage(array $data, string $service): string
    {
        $message = "Service: {$service}\n";
        
        if (!empty($data['location'])) {
            $message .= "Location: {$data['location']}\n";
        }
        
        if (!empty($data['q1_answer'])) {
            $q1Label = $this->getLeadQuestion($service, 'q1') ?: 'Question 1';
            $message .= "{$q1Label}: {$data['q1_answer']}\n";
        }
        
        if (!empty($data['q2_answer'])) {
            $q2Label = $this->getLeadQuestion($service, 'q2') ?: 'Question 2';
            $message .= "{$q2Label}: {$data['q2_answer']}\n";
        }
        
        if (!empty($data['q3_answer'])) {
            $q3Label = $this->getLeadQuestion($service, 'q3') ?: 'Question 3';
            $message .= "{$q3Label}: {$data['q3_answer']}\n";
        }
        
        return trim($message);
    }

    protected function getLeadQuestion(string $service, string $key): string
    {
        $cfg = \App\Models\ServiceConfig::where('service_vertical', $service)->first();
        if ($cfg) {
            if ($key === 'q1' && $cfg->q1) return $cfg->q1;
            if ($key === 'q2' && $cfg->q2) return $cfg->q2;
            if ($key === 'q3' && $cfg->q3) return $cfg->q3;
        }
        return self::LEAD_QUESTIONS[$service][$key] ?? '';
    }

    protected function getLeadOptions(string $service, string $key): ?array
    {
        $cfg = \App\Models\ServiceConfig::where('service_vertical', $service)->first();
        if ($cfg) {
            if ($key === 'q1' && is_array($cfg->options_q1) && count($cfg->options_q1)) return $cfg->options_q1;
            if ($key === 'q2' && is_array($cfg->options_q2) && count($cfg->options_q2)) return $cfg->options_q2;
            if ($key === 'q3' && is_array($cfg->options_q3) && count($cfg->options_q3)) return $cfg->options_q3;
        }
        return self::LEAD_QUESTION_OPTIONS[$service][$key] ?? null;
    }

    protected function getBrandArray(string $service): ?array
    {
        $cfg = \App\Models\ServiceConfig::where('service_vertical', $service)->first();
        if ($cfg) {
            return [
                'brand_name' => $cfg->brand_name,
                'brand_short' => $cfg->brand_short,
                'website' => $cfg->website,
                'instagram' => $cfg->instagram,
                'facebook' => $cfg->facebook,
                'linkedin' => $cfg->linkedin,
                'phone' => $cfg->phone ?? [],
                'projects_count' => $cfg->projects_count,
                'description' => $cfg->description,
                'ceo_name' => $cfg->ceo_name,
                'ceo_website' => $cfg->ceo_website,
                'ceo_experience' => $cfg->ceo_experience,
            ];
        }
        return self::SERVICE_TO_BRAND[$service] ?? null;
    }
}
