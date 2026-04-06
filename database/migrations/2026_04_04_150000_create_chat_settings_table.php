<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_settings', function (Blueprint $table) {
            $table->id();
            $table->string('assistant_name')->default('Area24ONE');
            $table->string('welcome_title')->nullable();
            $table->text('welcome_message')->nullable();
            $table->text('fallback_message')->nullable();
            $table->text('escalation_message')->nullable();
            $table->text('no_result_message')->nullable();
            $table->boolean('chat_enabled')->default(true);
            $table->boolean('lead_capture_enabled')->default(true);
            $table->boolean('show_service_options')->default(true);
            $table->string('default_response_type')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_settings');
    }
};
