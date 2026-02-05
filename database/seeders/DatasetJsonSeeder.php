<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intent;
use App\Models\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatasetJsonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('../dataset.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error("JSON file not found at: {$jsonPath}");
            return;
        }

        $this->command->info("Reading JSON file...");
        $jsonContent = file_get_contents($jsonPath);
        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("Failed to parse JSON: " . json_last_error_msg());
            return;
        }

        if (!is_array($data)) {
            $this->command->error("JSON data is not an array");
            return;
        }

        $this->command->info("Found " . count($data) . " records in JSON file");
        
        $stats = [
            'created' => 0,
            'updated' => 0,
            'skipped' => 0,
            'errors' => 0
        ];

        DB::beginTransaction();

        try {
            foreach ($data as $index => $item) {
                try {
                    // Skip header rows
                    if ($this->isHeaderRow($item)) {
                        $stats['skipped']++;
                        continue;
                    }

                    // Extract and clean data
                    $intentSlug = trim($item['intent_slug'] ?? '');
                    $keywords = trim($item['keywords'] ?? '');
                    $serviceVertical = trim($item['service_vertical'] ?? 'General');
                    $responseText = $this->cleanResponseText($item['response_text'] ?? '');
                    $redirectUrl = !empty($item['redirect_url']) ? trim($item['redirect_url']) : null;

                    // Validate required fields
                    if (empty($intentSlug) || empty($keywords)) {
                        $stats['skipped']++;
                        $this->command->warn("Skipping row {$index}: missing intent_slug or keywords");
                        continue;
                    }

                    // Find or create intent
                    $intent = Intent::where('intent_slug', $intentSlug)->first();

                    if ($intent) {
                        // Update existing intent
                        $intent->update([
                            'name' => $intentSlug,
                            'keywords' => $keywords,
                            'service_vertical' => $serviceVertical,
                            'redirect_url' => $redirectUrl
                        ]);
                        $stats['updated']++;
                    } else {
                        // Create new intent
                        $intent = Intent::create([
                            'intent_slug' => $intentSlug,
                            'name' => $intentSlug,
                            'keywords' => $keywords,
                            'service_vertical' => $serviceVertical,
                            'redirect_url' => $redirectUrl
                        ]);
                        $stats['created']++;
                    }

                    // Create or update response if response_text is provided
                    if (!empty($responseText)) {
                        Response::updateOrCreate(
                            [
                                'intent_id' => $intent->id,
                                'response' => $responseText
                            ],
                            [
                                'redirect_url' => $redirectUrl
                            ]
                        );
                    }

                    // Show progress every 100 records
                    if (($index + 1) % 100 === 0) {
                        $this->command->info("Processed " . ($index + 1) . " records...");
                    }

                } catch (\Exception $e) {
                    $stats['errors']++;
                    Log::error("Error seeding row {$index}: " . $e->getMessage(), [
                        'intent_slug' => $item['intent_slug'] ?? 'N/A',
                        'trace' => $e->getTraceAsString()
                    ]);
                    $this->command->error("Error on row {$index}: " . $e->getMessage());
                }
            }

            DB::commit();

            $this->command->info("\n=== Seeding Completed ===");
            $this->command->info("Created: {$stats['created']}");
            $this->command->info("Updated: {$stats['updated']}");
            $this->command->info("Skipped: {$stats['skipped']}");
            $this->command->info("Errors: {$stats['errors']}");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Seeding failed: " . $e->getMessage());
            Log::error("Dataset seeding failed: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Check if a row is a header row
     */
    protected function isHeaderRow(array $item): bool
    {
        $serviceVertical = strtolower(trim($item['service_vertical'] ?? ''));
        $intentSlug = strtolower(trim($item['intent_slug'] ?? ''));
        
        return $serviceVertical === 'service_vertical' || 
               $intentSlug === 'intent_slug';
    }

    /**
     * Clean response text - remove escaped quotes and extra whitespace
     */
    protected function cleanResponseText(string $text): string
    {
        // Remove escaped quotes (""text"" becomes "text")
        $text = preg_replace('/^""(.*)""$/', '$1', $text);
        
        // Remove any remaining escaped quotes
        $text = str_replace('""', '"', $text);
        
        // Trim whitespace
        $text = trim($text);
        
        return $text;
    }
}
