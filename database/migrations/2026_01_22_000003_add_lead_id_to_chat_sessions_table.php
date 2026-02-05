<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chat_sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_sessions', 'lead_id')) {
                $table->unsignedBigInteger('lead_id')->nullable()->after('data');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->dropColumn('lead_id');
        });
    }
};
