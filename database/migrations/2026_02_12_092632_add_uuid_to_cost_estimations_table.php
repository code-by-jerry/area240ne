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
        if (!Schema::hasColumn('cost_estimations', 'uuid')) {
            Schema::table('cost_estimations', function (Blueprint $table) {
                $table->uuid('uuid')->after('id')->unique()->nullable();
            });
        }

        // Generate UUIDs for existing records
        \Illuminate\Support\Facades\DB::table('cost_estimations')->get()->each(function ($estimation) {
            if (empty($estimation->uuid)) {
                \Illuminate\Support\Facades\DB::table('cost_estimations')
                    ->where('id', $estimation->id)
                    ->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
            }
        });

        Schema::table('cost_estimations', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cost_estimations', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
