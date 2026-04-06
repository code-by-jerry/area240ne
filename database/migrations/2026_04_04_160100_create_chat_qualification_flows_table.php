<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_qualification_flows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('chat_services')->cascadeOnDelete();
            $table->string('field_key');
            $table->string('label')->nullable();
            $table->text('question');
            $table->string('answer_type')->default('text');
            $table->json('quick_options')->nullable();
            $table->unsignedInteger('step_order')->default(0);
            $table->boolean('is_required')->default(true);
            $table->boolean('is_active')->default(true);
            $table->json('validation_rules')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['service_id', 'field_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_qualification_flows');
    }
};
