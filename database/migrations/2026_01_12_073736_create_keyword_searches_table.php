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
        Schema::create('keyword_searches', function (Blueprint $table) {
            $table->id();
            $table->string('keyword')->index();
            $table->string('intent_slug')->nullable()->index();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('session_id')->nullable()->index();
            $table->boolean('converted')->default(false)->index();
            $table->string('service_vertical')->nullable();
            $table->timestamps();
            
            // Index for analytics queries
            $table->index(['keyword', 'converted']);
            $table->index(['intent_slug', 'converted']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keyword_searches');
    }
};
