<?php

namespace Tests\Feature;

use App\Models\MediaAsset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MediaAssetModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_media_assets_manager(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get('/admin/media-assets')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/MediaAssets'));
    }

    public function test_admin_can_create_media_asset_with_uploaded_image(): void
    {
        Http::fake([
            'https://upload.imagekit.io/api/v1/files/upload' => Http::response([
                'fileId' => 'ik-file-123',
                'url' => 'https://ik.imagekit.io/demo/media-assets/hero-banner.jpg',
                'filePath' => '/media-assets/hero-banner.jpg',
                'name' => 'hero-banner.jpg',
            ], 200),
        ]);

        config()->set('services.imagekit.public_key', 'public_test_key');
        config()->set('services.imagekit.private_key', 'private_test_key');
        config()->set('services.imagekit.url_endpoint', 'https://ik.imagekit.io/demo');
        config()->set('services.imagekit.folder', '/media-assets');

        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post('/admin/media-assets', [
                'title' => 'Hero Banner',
                'image' => UploadedFile::fake()->create('hero-banner.jpg', 120, 'image/jpeg'),
                'is_active' => true,
            ])
            ->assertRedirect();

        $asset = MediaAsset::first();

        $this->assertNotNull($asset);
        $this->assertSame('Hero Banner', $asset->title);
        $this->assertTrue($asset->is_active);
        $this->assertSame('https://ik.imagekit.io/demo/media-assets/hero-banner.jpg', $asset->image_path);
        $this->assertSame('ik-file-123', $asset->imagekit_file_id);
    }
}