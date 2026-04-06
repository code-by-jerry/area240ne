<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_messages', 'type')) {
                $table->string('type')->nullable()->after('message');
            }

            if (!Schema::hasColumn('chat_messages', 'meta')) {
                $table->json('meta')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            if (Schema::hasColumn('chat_messages', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('chat_messages', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
