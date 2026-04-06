<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_intents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('service_id')->nullable()->constrained('chat_services')->nullOnDelete();
            $table->json('keywords')->nullable();
            $table->text('response_text')->nullable();
            $table->string('redirect_url')->nullable();
            $table->string('category', 100)->nullable();
            $table->unsignedInteger('priority')->default(50);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->unsignedInteger('priority_score')->default(0);
            $table->boolean('is_high_value')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['service_id', 'is_active']);
            $table->index(['category', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_intents');
    }
};
