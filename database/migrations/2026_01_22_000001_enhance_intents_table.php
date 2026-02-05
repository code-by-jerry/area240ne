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
        // Check if intents table exists, if not create it
        if (!Schema::hasTable('intents')) {
            Schema::create('intents', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->json('keywords')->nullable();
                $table->string('service_vertical')->default('General')->index();
                $table->string('intent_slug')->nullable()->unique();
                $table->longText('response_text')->nullable();
                $table->string('redirect_url')->nullable();
                $table->string('category')->nullable();
                $table->integer('priority')->default(50);
                $table->timestamps();
            });
        } else {
            // Table exists, add missing columns
            Schema::table('intents', function (Blueprint $table) {
                if (!Schema::hasColumn('intents', 'service_vertical')) {
                    $table->string('service_vertical')->default('General')->index();
                }
                if (!Schema::hasColumn('intents', 'intent_slug')) {
                    $table->string('intent_slug')->nullable()->unique();
                }
                if (!Schema::hasColumn('intents', 'response_text')) {
                    $table->longText('response_text')->nullable();
                }
                if (!Schema::hasColumn('intents', 'redirect_url')) {
                    $table->string('redirect_url')->nullable();
                }
                if (!Schema::hasColumn('intents', 'category')) {
                    $table->string('category')->nullable();
                }
                if (!Schema::hasColumn('intents', 'priority')) {
                    $table->integer('priority')->default(50);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intents');
    }
};
