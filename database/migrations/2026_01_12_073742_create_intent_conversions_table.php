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
        Schema::create('intent_conversions', function (Blueprint $table) {
            $table->id();
            $table->string('intent_slug')->unique()->index();
            $table->integer('total_searches')->default(0);
            $table->integer('total_conversions')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0)->comment('Percentage');
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
            
            // Index for sorting by conversion rate
            $table->index('conversion_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intent_conversions');
    }
};
