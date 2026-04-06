<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@area24one.com'],
            [
                'name' => 'Admin User',
                'password' => 'Admin@2026',
                'phone' => '1234567890',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            ChatAssistantStarterSeeder::class,
            ChatIntentStarterSeeder::class,
        ]);
    }
}
