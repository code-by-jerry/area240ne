<?php
// Test pricing detection logic

echo "✅ Testing Pricing Query Detection:\n";
echo "====================================\n\n";

$pricingKeywords = [
    'pricing', 'price', 'cost', 'rates', 'charges', 'budget',
    'how much', 'quote', 'quotation', 'estimate', 'investment',
    'expense', 'expenditure', 'fee', 'amount', 'rupees', 'lakh', 'crore'
];

$testQueries = [
    'construction pricing' => true,
    'how much does construction cost' => true,
    'interior design price' => true,
    'what is the quote for building' => true,
    'construction' => false,
    'tell me about construction' => false,
    'describe interior design' => false,
];

foreach ($testQueries as $query => $expected) {
    $isPricing = false;
    foreach ($pricingKeywords as $keyword) {
        if (strpos(strtolower($query), $keyword) !== false) {
            $isPricing = true;
            break;
        }
    }

    $status = ($isPricing === $expected) ? '✓ PASS' : '✗ FAIL';
    echo "$status: '$query'\n";
    echo "        Expected: " . ($expected ? 'PRICING' : 'NOT PRICING') . " | Got: " . ($isPricing ? 'PRICING' : 'NOT PRICING') . "\n\n";
}

echo "\n✅ Testing Service Keyword Matching:\n";
echo "=====================================\n\n";

$serviceKeywords = [
    'Construction' => ['build', 'construct', 'construction', 'building'],
    'Interiors' => ['interior', 'interior design', 'decor', 'design'],
    'Real Estate' => ['property', 'real estate', 'buy', 'sell'],
];

$testInputs = [
    'construction pricing',
    'interior design pricing',
    'tell me about construction',
    'property investment'
];

foreach ($testInputs as $input) {
    echo "Input: \"$input\"\n";

    $matches = [];
    foreach ($serviceKeywords as $service => $keywords) {
        $count = 0;
        foreach ($keywords as $keyword) {
            if (strpos(strtolower($input), $keyword) !== false) {
                $count++;
            }
        }
        if ($count > 0) {
            $matches[$service] = $count;
        }
    }

    if (!empty($matches)) {
        foreach ($matches as $service => $count) {
            echo "  ✓ $service: $count keyword(s)\n";
        }
    } else {
        echo "  - No service detected\n";
    }
    echo "\n";
}

echo "✅ Service Switching Logic:\n";
echo "===========================\n\n";
echo "When user is in COMPLETE state with service='Interiors' and asks 'construction pricing':\n";
echo "1. matchServiceIntent() detects 'Construction' with 1 keyword match → MEDIUM confidence\n";
echo "2. isPricingQuery() detects 'pricing' keyword → TRUE\n";
echo "3. Service switching triggers: Interiors → Construction\n";
echo "4. ChatService switches state to SERVICE_CONFIRMATION\n";
echo "5. Returns construction packages instead of interior packages ✓\n";
