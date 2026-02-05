<?php

namespace App\Services;

/**
 * Construction Package Service
 * 
 * Provides detailed information about construction packages and pricing
 * based on package_details_updated.md
 */
class ConstructionPackageService
{
    protected const PACKAGES = [1849, 2025, 2399, 2799, 4400];

    /**
     * Get package overview with pricing
     */
    public function getPackageOverview(): string
    {
        $response = "🏗️ **Construction Packages Overview**\n\n";
        $response .= "We offer **5 construction packages** priced per square foot:\n\n";
        
        foreach (self::PACKAGES as $price) {
            $response .= "• **₹{$price}/sqft**\n";
        }
        
        $response .= "\nEach package includes different levels of:\n";
        $response .= "✓ Design & Documentation\n";
        $response .= "✓ Project Management\n";
        $response .= "✓ Material Quality & Brands\n";
        $response .= "✓ Professional Support\n";
        $response .= "✓ Site Monitoring\n\n";
        
        $response .= "**Which package would you like to know more about?**\n";
        $response .= "You can ask about:\n";
        $response .= "• Specific package details (e.g., '₹1849 package')\n";
        $response .= "• Package comparison\n";
        $response .= "• What's included/excluded\n";
        $response .= "• Material specifications\n";
        
        return $response;
    }

    /**
     * Get details for a specific package
     */
    public function getPackageDetails(int $packagePrice): ?string
    {
        if (!in_array($packagePrice, self::PACKAGES)) {
            return null;
        }

        $response = "📦 **₹{$packagePrice}/sqft Package Details**\n\n";
        
        // Read package details from file
        $packageFile = base_path('package_details_updated.md');
        if (!file_exists($packageFile)) {
            return "Package details file not found.";
        }

        $content = file_get_contents($packageFile);
        $response .= $this->parsePackageDetails($content, $packagePrice);
        
        return $response;
    }

    /**
     * Parse package details from markdown content
     */
    protected function parsePackageDetails(string $content, int $packagePrice): string
    {
        $lines = explode("\n", $content);
        $response = "";
        $currentCategory = "";
        $inPackage = false;
        $packageStr = "-{$packagePrice}";
        $packageStrAlt = "- {$packagePrice}";
        $lastCategory = "";
        
        foreach ($lines as $line) {
            $originalLine = $line;
            $line = trim($line);
            
            // Skip empty lines at start
            if (empty($line) && empty($response)) {
                continue;
            }
            
            // Detect category headers (A. Design, B. Project Management, etc.)
            if (preg_match('/^[A-L]\.?\s*-?\s*(.+)$/i', $line, $matches)) {
                $lastCategory = trim($matches[1]);
                $inPackage = false;
                continue;
            }
            
            // Detect package section start
            if (strpos($line, $packageStr) !== false || strpos($line, $packageStrAlt) !== false) {
                $inPackage = true;
                if ($lastCategory && $lastCategory !== $currentCategory) {
                    $currentCategory = $lastCategory;
                    $response .= "\n**{$currentCategory}**\n";
                }
                continue;
            }
            
            // Collect package details
            if ($inPackage && !empty($line)) {
                // Stop at next package (different price)
                if (preg_match('/^-(\d{4})/', $line)) {
                    $nextPrice = (int)trim(str_replace(['-', '•'], '', $line));
                    if ($nextPrice !== $packagePrice && in_array($nextPrice, self::PACKAGES)) {
                        $inPackage = false;
                        continue;
                    }
                }
                
                // Stop at new category
                if (preg_match('/^[A-L]\./', $line)) {
                    $inPackage = false;
                    continue;
                }
                
                // Format bullet points - preserve original formatting
                if (strpos($line, '•') === 0) {
                    $response .= $line . "\n";
                } elseif (strpos($line, '-') === 0 && preg_match('/^-(\d{4})/', $line) === 0) {
                    $response .= $line . "\n";
                } elseif (!empty($line) && !preg_match('/^[A-L]\./', $line)) {
                    // Add bullet if it's content but not a header
                    if (strlen($line) > 3) {
                        $response .= "• " . $line . "\n";
                    }
                }
            }
        }
        
        if (empty($response)) {
            $response = "Package details are being updated. Please contact us for specific information about the ₹{$packagePrice}/sqft package.\n\n";
            $response .= "**Contact us for detailed specifications:**\n";
            $response .= "📞 +91 9916047222\n";
            $response .= "📞 +91 9606956044\n";
        }
        
        return $response;
    }

    /**
     * Get package comparison
     */
    public function getPackageComparison(): string
    {
        $response = "📊 **Package Comparison**\n\n";
        $response .= "**Key Differences:**\n\n";
        
        $response .= "**₹1849/sqft** - Basic Package\n";
        $response .= "• Standard materials\n";
        $response .= "• Basic design documentation\n";
        $response .= "• Essential features\n\n";
        
        $response .= "**₹2025/sqft** - Standard Package\n";
        $response .= "• Better materials & brands\n";
        $response .= "• Enhanced documentation\n";
        $response .= "• Improved coordination\n\n";
        
        $response .= "**₹2399/sqft** - Premium Package\n";
        $response .= "• Site Engineer daily visits\n";
        $response .= "• Dedicated Architect\n";
        $response .= "• Quality materials (JSW Steel, ACC Cement)\n";
        $response .= "• Lift pit & shaft included\n\n";
        
        $response .= "**₹2799/sqft** - Luxury Package\n";
        $response .= "• Full-time Site Engineer\n";
        $response .= "• Premium materials (JSW TMT, Ultratech)\n";
        $response .= "• Interior & Home Decor support\n";
        $response .= "• Compound wall included\n\n";
        
        $response .= "**₹4400/sqft** - Ultra Premium Package\n";
        $response .= "• TATA TMT Steel\n";
        $response .= "• Premium brands throughout\n";
        $response .= "• Smart home features\n";
        $response .= "• Solar solutions\n";
        $response .= "• Security systems\n";
        $response .= "• Landscape included\n\n";
        
        $response .= "**Note:** All rates are exclusive of GST. Minimum built-up area: 2400 sqft.\n";
        
        return $response;
    }

    /**
     * Check if input is asking about pricing/packages
     */
    public function isPricingQuery(string $input): bool
    {
        $lowInput = strtolower($input);
        $pricingKeywords = [
            'pricing', 'price', 'cost', 'package', 'packages', 
            'per sqft', 'per square foot', 'sqft', '1849', '2025', 
            '2399', '2799', '4400', 'how much', 'budget', 'rates'
        ];
        
        foreach ($pricingKeywords as $keyword) {
            if (strpos($lowInput, $keyword) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Extract package price from input if mentioned
     */
    public function extractPackagePrice(string $input): ?int
    {
        foreach (self::PACKAGES as $price) {
            if (strpos($input, (string)$price) !== false) {
                return $price;
            }
        }
        
        return null;
    }
}
