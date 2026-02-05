<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intent;
use Illuminate\Support\Facades\File;

/**
 * IntentSeeder
 *
 * Imports dataset from CSV file into intents table
 * Handles duplicate prevention and keyword parsing
 */
class IntentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvPath = database_path('seeders/data/dataset area24one (1).csv');

        if (!File::exists($csvPath)) {
            $this->command->error("CSV file not found: {$csvPath}");
            return;
        }

        // Clear existing intents (optional - comment out if you want to preserve)
        // Intent::truncate();

        $file = fopen($csvPath, 'r');
        $header = fgetcsv($file); // Skip header row
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) < 5) {
                continue; // Skip incomplete rows
            }

            [$serviceVertical, $intentSlug, $keywordsStr, $responseText, $redirectUrl] = $row;

            // Skip if service_vertical is a header line
            if ($serviceVertical === 'service_vertical' || empty($intentSlug)) {
                continue;
            }

            // Parse keywords (comma-separated, quoted)
            $keywords = $this->parseKeywords($keywordsStr);

            // Check if intent already exists
            $existing = Intent::where('intent_slug', $intentSlug)->first();

            if ($existing) {
                // Update existing
                $existing->update([
                    'service_vertical' => trim($serviceVertical),
                    'keywords' => $keywords,
                    'response_text' => trim($responseText),
                    'redirect_url' => trim($redirectUrl) ?: null,
                    'category' => $this->categorizeIntent($intentSlug)
                ]);
            } else {
                // Create new
                Intent::create([
                    'name' => $this->slugToName($intentSlug),
                    'service_vertical' => trim($serviceVertical),
                    'intent_slug' => $intentSlug,
                    'keywords' => $keywords,
                    'response_text' => trim($responseText),
                    'redirect_url' => trim($redirectUrl) ?: null,
                    'category' => $this->categorizeIntent($intentSlug),
                    'priority' => 50
                ]);
            }

            $count++;
        }

        fclose($file);
        $this->command->info("✓ Imported {$count} intents from dataset");
    }

    /**
     * Parse keywords from comma-separated string
     * Handles quoted values
     */
    protected function parseKeywords(string $keywordsStr): array
    {
        // Remove surrounding quotes if present
        $keywordsStr = trim($keywordsStr, '"');

        // Split by comma and clean
        $keywords = array_map(function ($keyword) {
            return trim($keyword);
        }, explode(',', $keywordsStr));

        // Filter empty
        return array_filter($keywords);
    }

    /**
     * Categorize intent based on slug for better routing
     */
    protected function categorizeIntent(string $slug): string
    {
        if (str_contains($slug, 'greet')) {
            return 'greeting';
        }
        if (str_contains($slug, 'user_anxiety') || str_contains($slug, 'user_overwhelmed')) {
            return 'emotion_handling';
        }
        if (str_contains($slug, 'discovery')) {
            return 'discovery';
        }
        if (str_contains($slug, 'cost') || str_contains($slug, 'budget') || str_contains($slug, 'price')) {
            return 'cost_info';
        }
        if (str_contains($slug, 'timeline') || str_contains($slug, 'duration') || str_contains($slug, 'time')) {
            return 'timeline_info';
        }
        if (str_contains($slug, 'process') || str_contains($slug, 'workflow')) {
            return 'process_info';
        }
        if (str_contains($slug, 'service')) {
            return 'service_info';
        }
        if (str_contains($slug, 'contact')) {
            return 'contact_info';
        }
        if (str_contains($slug, 'convo_')) {
            return 'conversation_flow';
        }
        return 'general_info';
    }

    /**
     * Convert slug to human-readable name
     */
    protected function slugToName(string $slug): string
    {
        return ucwords(str_replace('_', ' ', $slug));
    }
}
