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
        Schema::table('leads', function (Blueprint $table) {
            $table->string('intent_slug')->nullable()->after('service');
            $table->integer('conversion_score')->default(0)->after('intent_slug');
            $table->string('source_keyword')->nullable()->after('conversion_score');
            $table->string('engagement_level')->default('low')->after('source_keyword')->comment('low, medium, high');
            $table->string('lead_status')->default('cold')->after('engagement_level')->comment('hot, warm, cold');
            
            $table->index('intent_slug');
            $table->index('conversion_score');
            $table->index('lead_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex(['intent_slug']);
            $table->dropIndex(['conversion_score']);
            $table->dropIndex(['lead_status']);
            $table->dropColumn(['intent_slug', 'conversion_score', 'source_keyword', 'engagement_level', 'lead_status']);
        });
    }
};
