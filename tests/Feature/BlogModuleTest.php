<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BlogModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_blog_index_only_returns_published_active_posts(): void
    {
        $published = Blog::create([
            'title' => 'Published Blog',
            'slug' => 'published-blog',
            'content' => 'Published content',
            'is_active' => true,
            'published_at' => now(),
        ]);

        Blog::create([
            'title' => 'Draft Blog',
            'slug' => 'draft-blog',
            'content' => 'Draft content',
            'is_active' => true,
            'published_at' => null,
        ]);

        Blog::create([
            'title' => 'Inactive Blog',
            'slug' => 'inactive-blog',
            'content' => 'Inactive content',
            'is_active' => false,
            'published_at' => now(),
        ]);

        $response = $this->get('/blogs');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Blogs/Index')
            ->where('blogs.0.slug', $published->slug)
        );
    }

    public function test_public_blog_show_rejects_unpublished_posts(): void
    {
        Blog::create([
            'title' => 'Draft Blog',
            'slug' => 'draft-blog',
            'content' => 'Draft content',
            'is_active' => true,
            'published_at' => null,
        ]);

        $this->get('/blogs/draft-blog')->assertNotFound();
    }

    public function test_admin_can_open_blog_manager(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get('/admin/blogs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Blogs'));
    }

    public function test_admin_can_create_blog_with_uploaded_featured_image(): void
    {
        Http::fake([
            'https://upload.imagekit.io/api/v1/files/upload' => Http::response([
                'fileId' => 'ik-blog-123',
                'url' => 'https://ik.imagekit.io/demo/blog-images/feature.jpg',
                'filePath' => '/blog-images/feature.jpg',
                'name' => 'feature.jpg',
            ], 200),
        ]);

        config()->set('services.imagekit.public_key', 'public_test_key');
        config()->set('services.imagekit.private_key', 'private_test_key');
        config()->set('services.imagekit.url_endpoint', 'https://ik.imagekit.io/demo');
        config()->set('services.imagekit.blog_images_folder', '/blog-images');

        $admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->withoutMiddleware();

        $this->actingAs($admin)
            ->post('/admin/blogs', [
                'title' => 'ImageKit Blog',
                'slug' => 'imagekit-blog',
                'excerpt' => 'Short excerpt',
                'content' => '<p>Blog content</p>',
                'featured_image' => UploadedFile::fake()->create('feature.jpg', 180, 'image/jpeg'),
                'author_name' => 'Area24One Editorial',
                'is_active' => true,
                'is_featured' => false,
            ])
            ->assertRedirect();

        $blog = Blog::first();

        $this->assertNotNull($blog);
        $this->assertSame('ImageKit Blog', $blog->title);
        $this->assertSame('https://ik.imagekit.io/demo/blog-images/feature.jpg', $blog->featured_image_url);
        $this->assertSame('ik-blog-123', $blog->imagekit_file_id);
    }
}
