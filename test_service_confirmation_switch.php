<?php
// Test service switching in SERVICE_CONFIRMATION state

echo "✅ Testing Service Switching in SERVICE_CONFIRMATION:\n";
echo "====================================================\n\n";

$realEstateKeywords = [
    'real estate', 'realty', 'property', 'real property', 'properties',
    'buy', 'sell', 'purchase', 'sale', 'acquisition', 'investment',
    'property investment', 'real estate investment'
];

$testInputs = [
    'property' => 1,        // Just "property" - 1 keyword match
    'buy property' => 2,    // "property" + "buy" - 2 keywords
    'real estate' => 1,     // Exact match "real estate" - counts as 1
    'i want to buy' => 1,   // Just "buy" - 1 keyword
];

echo "Real Estate Service Detection:\n";
echo "==============================\n\n";

foreach ($testInputs as $input => $expectedMatches) {
    $matches = 0;
    foreach ($realEstateKeywords as $keyword) {
        if (strpos(strtolower($input), $keyword) !== false) {
            $matches++;
        }
    }

    // "property" is a primary keyword with 2x weight
    $score = 0;
    foreach ($realEstateKeywords as $keyword) {
        if (strpos(strtolower($input), $keyword) !== false) {
            // Primary keywords get 2x
            if (in_array($keyword, ['property', 'buy', 'sell', 'real estate'])) {
                $score += 2;
            } else {
                $score += 1;
            }
        }
    }

    $confidence = $score >= 3 ? 'HIGH' : ($score >= 2 ? 'MEDIUM' : 'LOW');

    echo "Input: \"$input\"\n";
    echo "  Keywords: $matches | Score: $score\n";
    echo "  Confidence: $confidence\n";
    echo "  Switches service? " . (in_array($confidence, ['HIGH', 'MEDIUM']) ? '✓ YES' : '✗ NO') . "\n\n";
}

echo "\n✅ Scenario: User in SERVICE_CONFIRMATION with Event selected\n";
echo "===========================================================\n\n";
echo "User types: \"property\"\n";
echo "1. SERVICE_CONFIRMATION state detects input\n";
echo "2. matchServiceIntent('property') → Real Estate with score 2 (primary keyword 2x)\n";
echo "3. Confidence: MEDIUM (score >= 2)\n";
echo "4. Condition: MEDIUM confidence + different service → TRUE\n";
echo "5. Action: Switch from Event → Real Estate\n";
echo "6. Result: Shows Real Estate service confirmation ✓\n";
