<?php

namespace App\Services;

/**
 * SERVICE-SPECIFIC KEYWORDS MAPPING
 *
 * Comprehensive keyword sets for pricing, packages, features, comparison, and timeline
 * Each service has 30-40+ keywords for intelligent query routing and intent detection
 */
class ServiceKeywordsMap
{
    /**
     * CONSTRUCTION SERVICE - Keywords (Packages: ₹1849, 2025, 2399, 2799, 4400 per sqft)
     */
    public const CONSTRUCTION_KEYWORDS = [
        'pricing' => [
            'construction pricing', 'build cost', 'construction cost', 'building price', 'per sqft',
            'square foot rate', 'construction rate', 'pricing structure', 'price per sqft', 'cost estimate',
            '1849', '2025', '2399', '2799', '4400', 'rupees per sqft', 'rs per sqft',
            'basic construction', 'standard construction', 'premium construction', 'luxury construction',
            'affordable construction', 'budget construction', 'high-end construction',
            'how much per sqft', 'construction charges', 'construction fees', 'quotation', 'estimate',
            'cost breakdown', 'rate card', 'pricing model', 'payment plan', 'investment range'
        ],
        'packages' => [
            'construction package', '₹1849', '₹2025', '₹2399', '₹2799', '₹4400',
            'basic package', 'standard package', 'premium package', 'luxury package',
            'package details', 'package comparison', 'which package', 'package features',
            'what does package include', 'package inclusions', 'package scope', 'package offerings',
            'starter package', 'professional package', 'elite package', 'ultra premium package',
            '1849 package', '2025 package', '2399 package', '2799 package', '4400 package',
            'tell me about packages', 'available packages', 'package tiers'
        ],
        'features' => [
            'features', 'what included', 'specifications', 'materials', 'brands', 'steel quality',
            'cement grade', 'flooring options', 'wall tiles', 'bathroom fittings', 'electrical work',
            'plumbing work', 'doors windows', 'painting', 'materials quality', 'brand names',
            'JSW steel', 'ACC cement', 'Ultratech', 'TATA steel', 'Jaquar', 'Kohler', 'Cera',
            'kitchen specifications', 'bathroom specifications', 'false ceiling', 'lighting fixtures',
            'site engineer', 'architect support', 'project management', 'site supervision',
            'warranty period', 'guarantee', 'after-sales support', 'material brands included'
        ],
        'comparison' => [
            'compare packages', 'difference between packages', 'package comparison table',
            'which package best', 'package vs package', 'better package', 'upgrade options',
            'compare features', 'what\'s difference', 'similarities', 'key differences',
            'pros cons', 'advantages disadvantages', 'best for my budget'
        ],
        'timeline' => [
            'timeline', 'duration', 'completion time', 'project duration', 'how long',
            'construction timeline', 'project schedule', 'completion date', 'delivery time',
            'groundbreaking timeline', 'start to finish', 'expected delivery'
        ]
    ];

    /**
     * INTERIOR SERVICE - Keywords (Services from ₹5L+ project-based)
     */
    public const INTERIOR_KEYWORDS = [
        'pricing' => [
            'interior pricing', 'design cost', 'interior cost', 'decoration price', 'design fee',
            'project cost', 'budget', 'investment', '5 lakh', '5l', '10 lakh', '10l', '50 lakh',
            'luxury interior pricing', 'residential interior cost', 'commercial interior cost',
            'modular kitchen price', 'design only cost', 'execution cost', 'turnkey cost',
            'per project', 'custom pricing', 'quotation', 'estimate', 'cost range',
            'affordable interiors', 'premium interiors', 'luxury design cost', 'budget interiors',
            'how much for interior', 'interior charges', 'design fees', 'installation cost'
        ],
        'packages' => [
            'interior package', 'design package', 'luxury interior', 'residential interior',
            'commercial interior', 'modular kitchen', 'design only', 'execution only',
            'budget interior', 'premium interior', 'bespoke design', 'full turnkey',
            'package options', 'service types', 'interior solutions', 'design solutions',
            'what interior options', 'types of interiors', 'interior categories', 'interior services',
            'luxury residential', 'luxury commercial', 'budget-based interiors'
        ],
        'features' => [
            'features', 'what included', 'design services', 'space planning', '3d visualization',
            'material selection', 'color consultation', 'furniture design', 'soft furnishings',
            'lighting design', 'false ceiling', 'kitchen design', 'wardrobe design',
            'bathroom design', 'flooring options', 'wall finishes', 'paint', 'decor', 'accessories',
            'custom furniture', 'installation', 'supervision', 'warranty', 'guarantee',
            'design support', 'material brands', 'quality finishes', 'craftsmanship'
        ],
        'comparison' => [
            'compare interiors', 'interior package comparison', 'design type comparison',
            'which interior type', 'luxury vs residential', 'commercial vs residential',
            'design only vs full service', 'what\'s difference', 'similarities', 'key features',
            'best for my space', 'which package suits me', 'pros cons'
        ],
        'timeline' => [
            'timeline', 'duration', 'how long', 'project duration', 'completion time',
            'design completion', 'installation duration', 'project schedule', 'delivery timeline',
            'weeks to complete', 'turnaround time', 'execution period'
        ]
    ];

    /**
     * LAND DEVELOPMENT - Keywords (Custom pricing, ₹15-200L per acre)
     */
    public const LAND_KEYWORDS = [
        'pricing' => [
            'land pricing', 'land cost', 'land rate', 'per acre', 'development cost',
            'project investment', 'development price', 'land value', 'land rate per acre',
            'agricultural land price', 'residential land cost', 'commercial land cost',
            'mixed development cost', 'budget range', 'investment range', 'quotation',
            'custom pricing', 'land feasibility cost', 'survey cost', 'estimate',
            'development charges', 'how much per acre', 'total project cost', 'investment needed',
            'land investment', 'project cost', 'development fee'
        ],
        'packages' => [
            'land development model', 'development type', 'agricultural land', 'residential land',
            'commercial land', 'mixed development', 'plotted development', 'township',
            'land project type', 'development options', 'project model', 'land opportunity',
            'development category', 'what development types', 'available options',
            'agricultural development', 'residential community', 'commercial complex',
            'mixed-use development', 'land development solutions'
        ],
        'features' => [
            'features', 'included services', 'master planning', 'surveying', 'feasibility study',
            'soil test', 'infrastructure', 'utilities', 'roads', 'water supply', 'sewage system',
            'landscaping', 'amenities', 'legal support', 'regulatory approval', 'documentation',
            'project management', 'execution', 'quality', 'sustainability', 'eco-friendly',
            'investment potential', 'appreciation', 'location benefits', 'accessibility',
            'future growth', 'strategic location', 'connectivity'
        ],
        'comparison' => [
            'compare land models', 'development comparison', 'agricultural vs residential',
            'commercial vs mixed', 'what\'s difference', 'similarities', 'key differences',
            'which model best', 'comparison table', 'benefits of each'
        ]
    ];

    /**
     * REAL ESTATE - Keywords (Custom pricing based on property)
     */
    public const REALESTATE_KEYWORDS = [
        'pricing' => [
            'property price', 'property cost', 'property value', 'investment amount',
            'budget range', 'price range', '50 lakh', '1 crore', '2 crore', '5 crore',
            'affordable property', 'luxury property', 'commercial property price',
            'residential property cost', 'investment range', 'quotation', 'valuation',
            'market value', 'property rates', 'rental yield', 'roi', 'return on investment',
            'property investment', 'how much', 'price per sqft', 'per square foot'
        ],
        'packages' => [
            'real estate service', 'property service', 'buy property', 'sell property',
            'property investment', 'rental property', 'commercial property', 'residential property',
            'apartment', 'villa', 'independent house', 'plot', 'land', 'commercial space',
            'office space', 'retail space', 'property type', 'available properties',
            'prime property', 'premium location', 'investment property'
        ],
        'features' => [
            'features', 'amenities', 'location', 'accessibility', 'connectivity',
            'nearby schools', 'hospitals', 'shopping', 'transportation', 'parking',
            'security', 'maintenance', 'property management', 'legal documentation',
            'title clarity', 'investment potential', 'appreciation', 'rental income',
            'market demand', 'infrastructure', 'development potential', 'lifestyle benefits',
            'gated community', 'neighbourhood quality', 'future growth'
        ]
    ];

    /**
     * EVENT MANAGEMENT - Keywords (Custom pricing, ₹5-50L+)
     */
    public const EVENT_KEYWORDS = [
        'pricing' => [
            'event pricing', 'event cost', 'event budget', 'package cost', 'service charges',
            '5 lakh', '10 lakh', '25 lakh', '50 lakh', 'budget range', 'investment range',
            'wedding cost', 'corporate event cost', 'product launch cost', 'conference cost',
            'event management fee', 'execution cost', 'quotation', 'estimate',
            'how much for event', 'event charges', 'per guest cost', 'total event cost',
            'event investment', 'event pricing model', 'package pricing'
        ],
        'packages' => [
            'event package', 'event type', 'wedding package', 'corporate package',
            'product launch', 'conference', 'party', 'celebration', 'brand activation',
            'event category', 'service package', 'event options', 'available packages',
            'event solution', 'event planning package', 'wedding planning', 'corporate event',
            'private event', 'public event', 'business event'
        ],
        'features' => [
            'features', 'included services', 'planning', 'coordination', 'execution',
            'venue management', 'decoration', 'catering', 'entertainment', 'music',
            'lighting', 'sound', 'stage setup', 'photography', 'videography',
            'logistics', 'guest management', 'event day coordination', 'contingency planning',
            'professional team', 'experience', 'portfolio', 'client testimonials',
            'full service', 'end-to-end management', 'quality execution'
        ]
    ];

    /**
     * Get keywords for a specific service and intent type
     */
    public static function getServiceKeywords(string $service, string $intentType = null): array
    {
        $map = [
            'Construction' => self::CONSTRUCTION_KEYWORDS,
            'Interiors' => self::INTERIOR_KEYWORDS,
            'Land Development' => self::LAND_KEYWORDS,
            'Real Estate' => self::REALESTATE_KEYWORDS,
            'Event' => self::EVENT_KEYWORDS,
        ];

        if (!isset($map[$service])) {
            return [];
        }

        $keywords = $map[$service];

        if ($intentType && isset($keywords[$intentType])) {
            return $keywords[$intentType];
        }

        // Merge all intent types if no specific type requested
        $merged = [];
        foreach ($keywords as $type => $typeKeywords) {
            $merged = array_merge($merged, $typeKeywords);
        }

        return $merged;
    }

    /**
     * Detect query intent (pricing, packages, features, comparison, timeline)
     */
    public static function detectIntentType(string $input): ?string
    {
        $lowInput = strtolower($input);

        // Pricing intent
        $pricingTerms = ['price', 'cost', 'budget', 'how much', 'charges', 'rates', 'range', 'lakh', 'crore', 'sqft', '₹', 'rs', 'rupees'];
        foreach ($pricingTerms as $term) {
            if (strpos($lowInput, $term) !== false) {
                return 'pricing';
            }
        }

        // Packages intent
        $packageTerms = ['package', 'option', 'type', 'model', 'available', 'which', 'tier', 'level', 'category'];
        foreach ($packageTerms as $term) {
            if (strpos($lowInput, $term) !== false) {
                return 'packages';
            }
        }

        // Features/Details intent
        $featureTerms = ['features', 'included', 'specification', 'material', 'brand', 'quality', 'details', 'tell me', 'what about', 'info'];
        foreach ($featureTerms as $term) {
            if (strpos($lowInput, $term) !== false) {
                return 'features';
            }
        }

        // Comparison intent
        $compareTerms = ['compare', 'difference', 'versus', 'vs', 'better', 'similar', 'pros cons', 'advantage'];
        foreach ($compareTerms as $term) {
            if (strpos($lowInput, $term) !== false) {
                return 'comparison';
            }
        }

        // Timeline intent
        $timeTerms = ['timeline', 'duration', 'how long', 'complete', 'delivery', 'schedule', 'when', 'weeks', 'months'];
        foreach ($timeTerms as $term) {
            if (strpos($lowInput, $term) !== false) {
                return 'timeline';
            }
        }

        return null;
    }

    /**
     * Check if input contains service-specific keywords
     */
    public static function isServiceSpecificQuery(string $service, string $input): bool
    {
        $keywords = self::getServiceKeywords($service);
        $lowInput = strtolower($input);

        foreach ($keywords as $keyword) {
            if (strpos($lowInput, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get intent keywords for a service
     */
    public static function getIntentKeywords(string $service, string $intent): array
    {
        return self::getServiceKeywords($service, $intent);
    }
}
