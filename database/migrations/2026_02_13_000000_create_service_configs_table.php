<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('service_configs', function (Blueprint $table) {
            $table->id();
            $table->string('service_vertical')->unique();
            $table->string('q1')->nullable();
            $table->string('q2')->nullable();
            $table->string('q3')->nullable();
            $table->json('options_q1')->nullable();
            $table->json('options_q2')->nullable();
            $table->json('options_q3')->nullable();
            $table->string('brand_name')->nullable();
            $table->string('brand_short')->nullable();
            $table->string('website')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('linkedin')->nullable();
            $table->json('phone')->nullable();
            $table->string('projects_count')->nullable();
            $table->text('description')->nullable();
            $table->string('ceo_name')->nullable();
            $table->string('ceo_website')->nullable();
            $table->string('ceo_experience')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_configs');
    }
};
