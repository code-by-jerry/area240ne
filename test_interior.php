<?php
require_once 'app/Services/InteriorPackageService.php';
$s = new App\Services\InteriorPackageService();

echo "✅ Test 1: extractPackageType('luxury interiors')\n";
$type = $s->extractPackageType('I want luxury interiors');
echo "Result: " . ($type ?: 'null') . "\n\n";

echo "✅ Test 2: getPackageDetails('luxury')\n";
echo $s->getPackageDetails('luxury') . "\n\n";

echo "✅ Test 3: getInteriorOverview() - First 5 lines\n";
$lines = explode("\n", $s->getInteriorOverview());
foreach (array_slice($lines, 0, 10) as $line) {
    echo $line . "\n";
}
