<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_response_templates', function (Blueprint $table) {
            if (! Schema::hasColumn('chat_response_templates', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('is_active');
            }
        });

        Schema::table('chat_qualification_flows', function (Blueprint $table) {
            if (! Schema::hasColumn('chat_qualification_flows', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chat_response_templates', function (Blueprint $table) {
            if (Schema::hasColumn('chat_response_templates', 'published_at')) {
                $table->dropColumn('published_at');
            }
        });

        Schema::table('chat_qualification_flows', function (Blueprint $table) {
            if (Schema::hasColumn('chat_qualification_flows', 'published_at')) {
                $table->dropColumn('published_at');
            }
        });
    }
};
