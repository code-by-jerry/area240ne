<?php

namespace App\Services;

/**
 * Land Development Package Service
 *
 * Provides land development options, pricing models, and project details
 */
class LandDevelopmentPackageService
{
    protected const LAND_MODELS = [
        'agricultural' => [
            'name' => 'Agricultural Development',
            'description' => 'Farmland conversion and sustainable agriculture projects',
            'features' => [
                'Land surveying & valuation',
                'Soil & feasibility analysis',
                'Irrigation planning',
                'Organic farming setup',
                'Cold storage facilities'
            ],
            'min_size' => '5+ acres',
            'pricing_model' => 'Custom (₹15-40L per acre)'
        ],
        'residential' => [
            'name' => 'Residential Community',
            'description' => 'Plotted residential developments with infrastructure',
            'features' => [
                'Site master planning',
                'Plot divisions & layouts',
                'Roads & utilities',
                'Water & sewage systems',
                'Amenities (parks, clubs)',
                'Gated security'
            ],
            'min_size' => '5-25+ acres',
            'pricing_model' => 'Custom (₹25-80L per acre)'
        ],
        'commercial' => [
            'name' => 'Commercial Complex',
            'description' => 'Retail, office, and mixed-use developments',
            'features' => [
                'Commercial space planning',
                'Retail/office layouts',
                'Parking solutions',
                'High-speed connectivity',
                'Premium security systems',
                'Landscaping & branding'
            ],
            'min_size' => '10-50+ acres',
            'pricing_model' => 'Custom (₹40-150L per acre)'
        ],
        'mixed' => [
            'name' => 'Mixed-Use Development',
            'description' => 'Residential + Commercial + Amenities',
            'features' => [
                'Integrated master planning',
                'Residential + Retail mix',
                'Corporate offices',
                'Food courts & entertainment',
                'School & healthcare spaces',
                'Premium infrastructure'
            ],
            'min_size' => '25+ acres',
            'pricing_model' => 'Custom (₹50-200L per acre)'
        ]
    ];

    /**
     * Get land development overview
     */
    public function getLandOverview(): string
    {
        $response = "🌱 **Land Development Solutions**\n\n";
        $response .= "We specialize in strategic land development projects:\n\n";

        foreach (self::LAND_MODELS as $key => $model) {
            $response .= "**{$model['name']}**\n";
            $response .= "• {$model['description']}\n";
            $response .= "• {$model['pricing_model']}\n\n";
        }

        $response .= "**What We Offer:**\n";
        $response .= "✓ Complete feasibility studies\n";
        $response .= "✓ Master planning & design\n";
        $response .= "✓ Legal & regulatory support\n";
        $response .= "✓ Infrastructure development\n";
        $response .= "✓ Project management\n";
        $response .= "✓ Marketing & sales support\n\n";

        $response .= "**Which development type interests you?**\n";

        return $response;
    }

    /**
     * Get detailed model information
     */
    public function getModelDetails(string $type): ?string
    {
        if (!isset(self::LAND_MODELS[$type])) {
            return null;
        }

        $model = self::LAND_MODELS[$type];
        $response = "📍 **{$model['name']}**\n\n";
        $response .= "{$model['description']}\n\n";

        $response .= "**Key Features:**\n";
        foreach ($model['features'] as $feature) {
            $response .= "✓ {$feature}\n";
        }

        $response .= "\n**Project Scope:**\n";
        $response .= "• Minimum size: {$model['min_size']}\n";
        $response .= "• Pricing: {$model['pricing_model']}\n";

        $response .= "\n**Timeline:** 6-24 months (varies by complexity)\n";

        return $response;
    }

    /**
     * Get comparison table for all models
     */
    public function getComparisonTable(): string
    {
        $response = "📊 **Land Development Comparison**\n\n";

        $response .= "| Model | Min Size | Pricing | Key Features |\n";
        $response .= "|-------|----------|---------|------------------|\n";

        foreach (self::LAND_MODELS as $key => $model) {
            $featureCount = count($model['features']);
            $response .= "| {$model['name']} | {$model['min_size']} | {$model['pricing_model']} | {$featureCount} features |\n";
        }

        $response .= "\n**Why Choose Area24 Developers?**\n";
        $response .= "✓ 100+ successful projects\n";
        $response .= "✓ Strategic locations across Karnataka\n";
        $response .= "✓ Sustainable development practices\n";
        $response .= "✓ Expert legal & regulatory handling\n";
        $response .= "✓ End-to-end project management\n";
        $response .= "✓ Transparent pricing & timelines\n\n";

        return $response;
    }

    /**
     * Check if input is asking about land/development
     */
    public function isLandQuery(string $input): bool
    {
        $lowInput = strtolower($input);
        $landKeywords = [
            'land', 'development', 'acre', 'acreage', 'plot', 'plots',
            'agricultural', 'residential community', 'commercial', 'mixed',
            'investment', 'pricing', 'cost', 'how much', 'project',
            'feasibility', 'master plan', 'infrastructure', 'features'
        ];

        foreach ($landKeywords as $keyword) {
            if (strpos($lowInput, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extract model type from input
     */
    public function extractModelType(string $input): ?string
    {
        $lowInput = strtolower($input);

        if (strpos($lowInput, 'agricultural') !== false || strpos($lowInput, 'farm') !== false) {
            return 'agricultural';
        }
        if (strpos($lowInput, 'residential') !== false || strpos($lowInput, 'community') !== false) {
            return 'residential';
        }
        if (strpos($lowInput, 'commercial') !== false || strpos($lowInput, 'retail') !== false) {
            return 'commercial';
        }
        if (strpos($lowInput, 'mixed') !== false) {
            return 'mixed';
        }

        return null;
    }

    /**
     * Get brief thank you message for Land Development
     */
    public function getThankYouMessage(): string
    {
        $response = "✨ **Area24 Developers (Land Division)**\n\n";
        $response .= "📊 Track Record\n";
        $response .= "✓ 100+ successful projects\n";
        $response .= "✓ Strategic land development & sustainable infrastructure\n\n";

        $response .= "📞 Contact Us\n";
        $response .= "📱 +91 9916047222\n";
        $response .= "📱 +91 9606956044\n\n";

        $response .= "🔗 Connect With Us\n";
        $response .= "🌐 Website: area24developers.com\n";
        $response .= "📸 Instagram: instagram.com\n";
        $response .= "👥 Facebook: facebook.com\n";
        $response .= "💼 LinkedIn: in.linkedin.com\n\n";

        $response .= "👨‍💼 Leadership\n";
        $response .= "Founder & CEO: AARUN\n";
        $response .= "Experience: 16+ years\n";
        $response .= "Portfolio: arunar.in\n\n";

        $response .= "Thank you for considering Area24 for your land development project! 🙏";

        return $response;
    }
}
