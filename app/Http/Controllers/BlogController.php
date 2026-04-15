<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $featured = Blog::published()
            ->where('is_featured', true)
            ->orderByDesc('published_at')
            ->first();

        $blogs = Blog::published()
            ->when($featured, fn ($query) => $query->where('id', '!=', $featured->id))
            ->orderByDesc('published_at')
            ->get();

        $canonicalUrl = url('/blogs');
        $image = $featured?->featured_image_url ?: url('/favicon-512.png');

        return Inertia::render('Blogs/Index', [
            'featuredBlog' => $featured,
            'blogs' => $blogs,
            'seo' => [
                'title' => 'Blogs | Area24One — Construction, Interiors & Real Estate Insights',
                'description' => 'Insights, guides, and updates on construction, interiors, real estate, land development, and events in Karnataka.',
                'canonical' => $canonicalUrl,
                'image' => $image,
                'type' => 'website',
                'twitter_card' => 'summary_large_image',
            ],
        ]);
    }

    public function show(string $slug)
    {
        $blog = Blog::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedBlogs = Blog::published()
            ->where('id', '!=', $blog->id)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get();

        $description = $blog->seo_description ?: ($blog->excerpt ?: str($blog->content)->stripTags()->limit(160)->toString());
        $canonicalUrl = $blog->canonical_url ?: route('blogs.show', $blog->slug);
        $image = $blog->featured_image_url ?: url('/favicon-512.png');

        return Inertia::render('Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => [
                'title' => $blog->seo_title ?: "{$blog->title} | Area24One",
                'description' => $description,
                'keywords' => $blog->seo_keywords,
                'canonical' => $canonicalUrl,
                'image' => $image,
                'type' => 'article',
                'twitter_card' => 'summary_large_image',
                'published_time' => $blog->published_at?->toIso8601String(),
                'modified_time' => $blog->updated_at?->toIso8601String(),
                'breadcrumbs' => [
                    ['name' => 'Home',  'url' => url('/')],
                    ['name' => 'Blogs', 'url' => route('blogs.index')],
                    ['name' => $blog->title, 'url' => $canonicalUrl],
                ],
            ],
        ]);
    }
}
