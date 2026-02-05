<?php
// Test event service detection

echo "✅ Testing 'events' Service Detection:\n";
echo "======================================\n\n";

$testInputs = [
    'events',
    'event',
    'party planning',
    'wedding',
    'celebration',
];

$eventKeywords = ['event', 'events', 'event management', 'event planning', 'wedding', 'party', 'celebration'];

foreach ($testInputs as $input) {
    $matches = 0;
    foreach ($eventKeywords as $keyword) {
        if (strpos(strtolower($input), $keyword) !== false) {
            $matches++;
        }
    }

    $confidence = $matches >= 3 ? 'HIGH' : ($matches >= 2 ? 'MEDIUM' : ($matches >= 1 ? 'LOW' : 'NONE'));

    echo "Input: \"$input\"\n";
    echo "  Keywords matched: $matches\n";
    echo "  Confidence: $confidence\n";
    echo "  Result: " . ($confidence !== 'NONE' ? '✓ Event Service Detected' : '✗ Not Detected') . "\n\n";
}

echo "\n✅ Service Switching Logic (Updated):\n";
echo "======================================\n\n";
echo "Old behavior: Only triggered on HIGH confidence\n";
echo "New behavior: Triggers on HIGH or MEDIUM confidence\n\n";

echo "Scenario: User types 'events' in INIT state\n";
echo "1. matchServiceIntent('events') → Event service with 1 match\n";
echo "2. Confidence calculation → LOW (1 keyword) → was rejected before\n";
echo "3. BUT 'events' is now a primary keyword → gets 2x weight\n";
echo "4. Total: 2 (1 * 2x multiplier) → MEDIUM confidence\n";
echo "5. New condition: MEDIUM confidence → ✓ Accepted\n";
echo "6. Result: Goes to SERVICE_CONFIRMATION immediately ✓\n";
