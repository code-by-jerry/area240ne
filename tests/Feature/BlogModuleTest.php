<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
