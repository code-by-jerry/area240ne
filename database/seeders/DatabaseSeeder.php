<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

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
            StaticIntentSeeder::class,
            ServiceConfigSeeder::class,
        ]);
    }
}
