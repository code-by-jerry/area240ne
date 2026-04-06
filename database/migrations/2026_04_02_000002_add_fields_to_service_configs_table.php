<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_configs', function (Blueprint $table) {
            if (!Schema::hasColumn('service_configs', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('service_vertical');
            }
            if (!Schema::hasColumn('service_configs', 'icon')) {
                $table->string('icon')->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('service_configs', 'detection_keywords')) {
                $table->json('detection_keywords')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('service_configs', function (Blueprint $table) {
            $table->dropColumn(array_filter([
                Schema::hasColumn('service_configs', 'is_active') ? 'is_active' : null,
                Schema::hasColumn('service_configs', 'icon') ? 'icon' : null,
            ]));
        });
    }
};
