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
        Schema::table('intents', function (Blueprint $table) {
            $table->decimal('conversion_rate', 5, 2)->default(0)->after('redirect_url')->comment('Percentage');
            $table->integer('priority_score')->default(0)->after('conversion_rate');
            $table->boolean('is_high_value')->default(false)->after('priority_score');
            
            $table->index('conversion_rate');
            $table->index('priority_score');
            $table->index('is_high_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('intents', function (Blueprint $table) {
            $table->dropIndex(['conversion_rate']);
            $table->dropIndex(['priority_score']);
            $table->dropIndex(['is_high_value']);
            $table->dropColumn(['conversion_rate', 'priority_score', 'is_high_value']);
        });
    }
};
