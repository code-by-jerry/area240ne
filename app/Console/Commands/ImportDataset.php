<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Intent;
use Illuminate\Support\Facades\File;

class ImportDataset extends Command
{
    protected $signature = 'dataset:import';
    protected $description = 'Import dataset from CSV into intents table';

    public function handle()
    {
        $this->info('Clearing existing intents...');

        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Intent::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $csvPath = database_path('seeders/data/dataset area24one (2).csv');

        if (!File::exists($csvPath)) {
            $this->error("CSV not found: {$csvPath}");
            return 1;
        }

        $file = fopen($csvPath, 'r');
        $header = fgetcsv($file);
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) < 5) continue;

            [$serviceVertical, $intentSlug, $keywordsStr, $responseText, $redirectUrl] = $row;

            if ($serviceVertical === 'service_vertical' || empty($intentSlug)) continue;

            $keywords = $this->parseKeywords($keywordsStr);

            // Check if already exists by intent_slug
            if (Intent::where('intent_slug', $intentSlug)->exists()) {
                continue; // Skip duplicates
            }

            try {
                Intent::create([
                    'name' => ucwords(str_replace('_', ' ', $intentSlug)),
                    'service_vertical' => trim($serviceVertical),
                    'intent_slug' => $intentSlug,
                    'keywords' => $keywords,
                    'response_text' => trim($responseText),
                    'redirect_url' => trim($redirectUrl) ?: null,
                    'category' => $this->categorizeIntent($intentSlug),
                    'priority' => 50
                ]);

                $count++;
                if ($count % 100 === 0) {
                    $this->line("  Imported {$count} intents...");
                }
            } catch (\Exception $e) {
                // Skip on unique constraint or other errors
                $this->line("  Skipped: {$intentSlug} (duplicate or error)");
            }
        }

        fclose($file);
        $this->info("✓ Successfully imported {$count} intents!");
        return 0;
    }

    protected function parseKeywords(string $keywordsStr): array
    {
        $keywordsStr = trim($keywordsStr, '"');
        $keywords = array_map(fn($k) => trim($k), explode(',', $keywordsStr));
        return array_filter($keywords);
    }

    protected function categorizeIntent(string $slug): string
    {
        if (str_contains($slug, 'greet')) return 'greeting';
        if (str_contains($slug, 'user_anxiety') || str_contains($slug, 'user_overwhelmed')) return 'emotion_handling';
        if (str_contains($slug, 'discovery')) return 'discovery';
        if (str_contains($slug, 'cost') || str_contains($slug, 'budget')) return 'cost_info';
        if (str_contains($slug, 'timeline') || str_contains($slug, 'duration')) return 'timeline_info';
        if (str_contains($slug, 'process') || str_contains($slug, 'workflow')) return 'process_info';
        if (str_contains($slug, 'service')) return 'service_info';
        if (str_contains($slug, 'contact')) return 'contact_info';
        if (str_contains($slug, 'convo_')) return 'conversation_flow';
        return 'general_info';
    }
}
