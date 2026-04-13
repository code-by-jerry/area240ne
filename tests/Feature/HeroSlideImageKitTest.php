<?php

namespace Tests\Feature;

use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HeroSlideImageKitTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_hero_slide_with_uploaded_image(): void
    {
        Http::fake([
            'https://upload.imagekit.io/api/v1/files/upload' => Http::response([
                'fileId' => 'ik-hero-123',
                'url' => 'https://ik.imagekit.io/demo/hero-slides/hero-banner.jpg',
                'filePath' => '/hero-slides/hero-banner.jpg',
                'name' => 'hero-banner.jpg',
            ], 200),
        ]);

        config()->set('services.imagekit.public_key', 'public_test_key');
        config()->set('services.imagekit.private_key', 'private_test_key');
        config()->set('services.imagekit.url_endpoint', 'https://ik.imagekit.io/demo');
        config()->set('services.imagekit.hero_slides_folder', '/hero-slides');

        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post('/admin/hero-slides', [
                'title' => 'Luxury Living',
                'description' => 'Premium hero slide',
                'image' => UploadedFile::fake()->create('hero-banner.jpg', 240, 'image/jpeg'),
                'button_text' => 'Explore',
                'button_link' => '/services',
                'is_active' => true,
                'order' => 1,
            ])
            ->assertRedirect();

        $slide = HeroSlide::first();

        $this->assertNotNull($slide);
        $this->assertSame('Luxury Living', $slide->title);
        $this->assertSame('https://ik.imagekit.io/demo/hero-slides/hero-banner.jpg', $slide->image_path);
        $this->assertSame('ik-hero-123', $slide->imagekit_file_id);
    }
}
