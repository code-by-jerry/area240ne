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
            $table->string('location')->nullable()->after('service');
            $table->text('q1_answer')->nullable()->after('location');
            $table->text('q2_answer')->nullable()->after('q1_answer');
            $table->text('q3_answer')->nullable()->after('q2_answer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['location', 'q1_answer', 'q2_answer', 'q3_answer']);
        });
    }
};
