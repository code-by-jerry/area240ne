<?php

namespace App\Services;

/**
 * Interior Package Service
 *
 * Provides detailed information about real interior design services and custom pricing
 * Data sourced from Area24ONE interior_details.md
 */
class InteriorPackageService
{
    /**
     * 7 Real Interior Service Categories with ₹5L+ Custom Pricing
     */
    protected const INTERIOR_SERVICES = [
        'luxury' => [
            'name' => 'Luxury Interiors',
            'description' => 'Premium, high-end interiors crafted with bespoke design, exquisite materials, and exceptional detailing',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Exclusive, fully customized luxury interiors with premium materials, high detailing, and white-glove execution',
            'service_scope' => [
                'Luxury Residential Interiors',
                'Bespoke Interior Design',
                'Custom Furniture & Joinery',
                'Premium Materials & Finishes',
                'False Ceiling & Designer Lighting',
                'Luxury Kitchens & Wardrobes',
                'Bathrooms & Spa-Style Spaces',
                'Technology & Smart Integration',
                'Complete Turnkey Execution',
                'High-Precision Project Management'
            ],
            'defines' => 'Bespoke, design-led approach | Premium & imported materials | Exceptional craftsmanship | High attention to detailing | Seamless design-to-execution delivery'
        ],
        'residential' => [
            'name' => 'Residential Interiors',
            'description' => 'Thoughtfully designed homes that reflect your lifestyle, culture, and everyday needs',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Customized residential interiors from apartments to villas with full turnkey execution',
            'service_scope' => [
                'Complete Home Interior Solutions',
                'Space Planning & Layout Design',
                'Living & Common Areas',
                'Bedroom Interior Design',
                'Kitchen & Utility Areas',
                'Wardrobes & Storage',
                'Bathroom & Toilet Interiors',
                'False Ceiling & Lighting',
                'Pooja & Spiritual Spaces',
                'Balcony & Outdoor Living',
                'Home Office & Study',
                'Material & Finish Selection',
                'Design Visualization & Documentation',
                'Turnkey Execution & Delivery'
            ],
            'defines' => 'Lifestyle-focused design | Indian home layouts | High-quality finishes | Turnkey delivery | Transparent timelines'
        ],
        'commercial' => [
            'name' => 'Commercial Interiors',
            'description' => 'Commercial environments designed for productivity, efficiency, and brand identity',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'High-performance business interiors with strong technical and brand alignment',
            'service_scope' => [
                'Corporate & Office Interiors',
                'Workspace Planning',
                'Front-of-House Areas',
                'Meeting & Collaboration Spaces',
                'Executive Areas',
                'Open Office & Team Zones',
                'Pantry & Cafeteria',
                'Retail & Business Interiors',
                'Specialized Commercial Spaces',
                'False Ceiling & Lighting',
                'MEP & Technical Services',
                'Technology & Infrastructure',
                'Turnkey Fit-Out',
                'Project Management'
            ],
            'defines' => 'Business-focused design | Strong MEP coordination | Brand-aligned interiors | Scalable solutions | Reliable execution'
        ],
        'modular_kitchens' => [
            'name' => 'Modular Kitchens',
            'description' => 'Modern, functional kitchens designed with precision and efficiency',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Indian-centric modular kitchens balancing durability, ergonomics, and aesthetics',
            'service_scope' => [
                'Complete Modular Kitchen Solutions',
                'Kitchen Layout Planning',
                'Cabinetry & Storage Systems',
                'Countertops & Backsplashes',
                'Shutters & Finishes',
                'Appliance Integration',
                'Lighting & Electrical Planning',
                'Ergonomics & Workflow',
                'Utility Area Design',
                'Installation & Execution',
                'Project Delivery'
            ],
            'defines' => 'Indian cooking optimized | Smart storage | Durable materials | Clean installation | End-to-end service'
        ],
        'design_only' => [
            'name' => 'Design-Only Services',
            'description' => 'Professional interior design planning without execution',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Execution-ready design documentation for smooth third-party implementation',
            'service_scope' => [
                'Design Consultation',
                'Space Planning',
                'Concept Development',
                '3D Visualization',
                'Material Specification',
                'Technical Drawings',
                'Kitchen & Wardrobe Design',
                'Lighting Planning',
                'Budget Guidance',
                'Design Coordination'
            ],
            'defines' => 'Execution-ready drawings | Indian usage aligned | Professional visualization | Flexible execution support'
        ],
        'execution_only' => [
            'name' => 'Execution-Only Services',
            'description' => 'Interior execution for client-provided or third-party designs',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Quality-driven execution with strict supervision and coordination',
            'service_scope' => [
                'Interior Project Execution',
                'Site Supervision',
                'Vendor Coordination',
                'Carpentry & Furniture',
                'Electrical & Lighting',
                'Plumbing & Sanitary',
                'False Ceiling & Partitions',
                'Surface Finishes',
                'Quality Control',
                'Timeline & Cost Management',
                'Final Handover'
            ],
            'defines' => 'Accurate implementation | Skilled workforce | Strong coordination | Quality-focused | Reliable timelines'
        ],
        'budget' => [
            'name' => 'Budget-Based Interiors',
            'description' => 'Maximum value interiors within a defined budget',
            'price' => '₹5L+ (Custom Project-Based)',
            'short_description' => 'Cost-controlled interiors using smart planning and durable materials',
            'service_scope' => [
                'Complete Budget Solutions',
                'Efficient Space Planning',
                'Standardized Designs',
                'Cost-Optimized Materials',
                'Modular Kitchens & Storage',
                'Wardrobes & Furniture',
                'Basic Ceiling & Lighting',
                'Electrical & Plumbing',
                'Phased Execution',
                'Project Delivery'
            ],
            'defines' => 'Cost-conscious planning | Practical design | Reliable workmanship | Transparent scope | Affordable interiors'
        ]
    ];

    /**
     * Get interior overview with all 7 service categories
     */
    public function getInteriorOverview(): string
    {
        $response = "🎨 **Interior Design Services**\n\n";
        $response .= "We take projects from **₹5 lakhs**; all pricing is **custom** based on your scope and requirements.\n\n";
        $response .= "We offer **7 specialized interior design services**:\n\n";

        foreach (self::INTERIOR_SERVICES as $key => $service) {
            $response .= "**{$service['name']}** - {$service['price']}\n";
            $response .= "• {$service['short_description']}\n\n";
        }

        $response .= "💡 **All projects start from ₹5L+ depending on scope & customization**\n\n";
        $response .= "📞 Contact us for your personalized quote:\n";
        $response .= "• Call: +91 9916047222\n";
        $response .= "• Call: +91 9606956044\n\n";

        $response .= "Which service interests you?\n";

        return $response;
    }

    /**
     * Get detailed service information
     */
    public function getServiceDetails(string $serviceType): ?string
    {
        if (!isset(self::INTERIOR_SERVICES[$serviceType])) {
            return null;
        }

        $service = self::INTERIOR_SERVICES[$serviceType];
        $response = "🎨 **{$service['name']}**\n\n";
        $response .= "{$service['description']}\n\n";

        $response .= "💰 **Pricing:** {$service['price']}\n\n";

        $response .= "**Service Scope:**\n";
        foreach ($service['service_scope'] as $item) {
            $response .= "✓ {$item}\n";
        }

        $response .= "\n**Key Characteristics:**\n";
        $response .= "{$service['defines']}\n\n";

        $response .= "📞 **Contact us for a personalized consultation:**\n";
        $response .= "• Call: +91 9916047222\n";
        $response .= "• Call: +91 9606956044\n";

        return $response;
    }

    /**
     * Get comparison of all 7 services
     */
    public function getComparisonTable(): string
    {
        $response = "📊 **Interior Design Services Comparison**\n\n";
        $response .= "All our services feature **₹5L+ custom project-based pricing**\n\n";

        $response .= "1️⃣ **Luxury Interiors** - Bespoke, premium materials, exceptional craftsmanship\n";
        $response .= "2️⃣ **Residential Interiors** - Complete homes, lifestyle-focused design\n";
        $response .= "3️⃣ **Commercial Interiors** - Office spaces, brand-aligned, MEP coordination\n";
        $response .= "4️⃣ **Modular Kitchens** - Functional, ergonomic, Indian-optimized\n";
        $response .= "5️⃣ **Design-Only Services** - Professional plans without execution\n";
        $response .= "6️⃣ **Execution-Only Services** - Quality-driven implementation\n";
        $response .= "7️⃣ **Budget-Based Interiors** - Cost-optimized, practical design\n\n";

        $response .= "**Why Choose Our Interior Services?**\n";
        $response .= "✓ 7 specialized service categories\n";
        $response .= "✓ Custom project-based pricing (₹5L+)\n";
        $response .= "✓ Design-led, quality-focused approach\n";
        $response .= "✓ Complete turnkey execution available\n";
        $response .= "✓ Professional visualization & documentation\n";
        $response .= "✓ Post-project support\n\n";

        return $response;
    }

    /**
     * Check if input is asking about pricing/services
     */
    public function isPricingQuery(string $input): bool
    {
        $lowInput = strtolower($input);
        $pricingKeywords = [
            'pricing', 'price', 'cost', 'rates', 'charges', 'budget',
            'how much', 'package', 'packages', 'plan', 'plans',
            'service', 'services', 'luxury', 'residential', 'commercial', 'modular',
            'comparison', 'compare', 'cost breakdown',
            'estimate', 'quotation', 'quote', 'lakh', '5l'
        ];

        foreach ($pricingKeywords as $keyword) {
            if (strpos($lowInput, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extract service type from input
     */
    public function extractServiceType(string $input): ?string
    {
        $lowInput = strtolower($input);

        // Luxury Interiors
        if (strpos($lowInput, 'luxury') !== false || strpos($lowInput, 'bespoke') !== false || strpos($lowInput, 'premium') !== false) {
            return 'luxury';
        }
        
        // Residential Interiors
        if (strpos($lowInput, 'residential') !== false || strpos($lowInput, 'home') !== false || strpos($lowInput, 'apartment') !== false || strpos($lowInput, 'villa') !== false) {
            return 'residential';
        }
        
        // Commercial Interiors
        if (strpos($lowInput, 'commercial') !== false || strpos($lowInput, 'office') !== false || strpos($lowInput, 'corporate') !== false || strpos($lowInput, 'retail') !== false) {
            return 'commercial';
        }
        
        // Modular Kitchens
        if (strpos($lowInput, 'kitchen') !== false || strpos($lowInput, 'modular') !== false) {
            return 'modular_kitchens';
        }
        
        // Design-Only
        if (strpos($lowInput, 'design only') !== false || strpos($lowInput, 'design-only') !== false || (strpos($lowInput, 'design') !== false && strpos($lowInput, 'no execution') !== false)) {
            return 'design_only';
        }
        
        // Execution-Only
        if (strpos($lowInput, 'execution only') !== false || strpos($lowInput, 'execution-only') !== false || (strpos($lowInput, 'execution') !== false && strpos($lowInput, 'no design') !== false)) {
            return 'execution_only';
        }
        
        // Budget-Based
        if (strpos($lowInput, 'budget') !== false || strpos($lowInput, 'affordable') !== false || strpos($lowInput, 'cost') !== false) {
            return 'budget';
        }

        return null;
    }

    /**
     * Extract package type from input (backward compatibility wrapper for extractServiceType)
     */
    public function extractPackageType(string $input): ?string
    {
        return $this->extractServiceType($input);
    }

    /**
     * Get package details (backward compatibility wrapper for getServiceDetails)
     */
    public function getPackageDetails(string $packageType): ?string
    {
        return $this->getServiceDetails($packageType);
    }
}
