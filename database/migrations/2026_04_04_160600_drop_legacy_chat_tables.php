<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['responses', 'keyword_searches', 'intent_conversions', 'service_configs', 'intents'] as $table) {
            if (Schema::hasTable($table)) {
                Schema::drop($table);
            }
        }
    }

    public function down(): void
    {
        // Legacy chat tables were intentionally retired.
        // Restoring them should be handled from the original historical migrations,
        // not by recreating partial schemas here.
    }
};
