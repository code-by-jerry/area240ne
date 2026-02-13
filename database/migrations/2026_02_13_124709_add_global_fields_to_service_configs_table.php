<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('service_configs', function (Blueprint $table) {
            $table->text('intro_text')->nullable();
            $table->json('greeting_keywords')->nullable();
            $table->json('location_keywords')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_configs', function (Blueprint $table) {
            $table->dropColumn(['intro_text', 'greeting_keywords', 'location_keywords']);
        });
    }
};
