<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Intent;
use App\Models\Response;
use Illuminate\Support\Facades\DB;

class ImportIntentsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'intents:import {file : The path to the CSV file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import intents and responses from a CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file);

        // Expected headers: Service, Intent Name, Keywords, Response, Redirect URL
        // Mapping indices
        $indices = array_flip($header);

        $count = 0;
        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== false) {
                $intentName = $row[$indices['Intent Name']] ?? $row[$indices['intent_slug']] ?? null;
                $keywords = $row[$indices['Keywords']] ?? $row[$indices['keywords']] ?? '';
                $responseText = $row[$indices['Response']] ?? $row[$indices['response_text']] ?? '';
                $redirectUrl = $row[$indices['Redirect URL']] ?? $row[$indices['redirect_url']] ?? null;

                if (!$intentName)
                    continue;

                $intent = Intent::updateOrCreate(
                    ['name' => $intentName],
                    ['keywords' => $keywords]
                );

                Response::updateOrCreate(
                    [
                        'intent_id' => $intent->id,
                        'response' => $responseText
                    ],
                    ['redirect_url' => $redirectUrl]
                );

                $count++;
            }

            DB::commit();
            $this->info("Successfully imported {$count} intents.");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error during import: " . $e->getMessage());
            return 1;
        }

        fclose($file);
        return 0;
    }
}
