?php

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

        return Inertia::render('Blogs/Index', [
            'featuredBlog' => $featured,
            'blogs' => $blogs,
            'seo' => [
                'title' => 'Blogs | Area24One',
                'description' => 'Insights, guides, and updates on construction, interiors, real estate, land development, and events.',
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

        return Inertia::render('Blogs/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'seo' => [
                'title' => $blog->seo_title ?: $blog->title,
                'description' => $blog->seo_description ?: ($blog->excerpt ?: str($blog->content)->stripTags()->limit(160)->toString()),
                'keywords' => $blog->seo_keywords,
                'canonical' => $blog->canonical_url ?: url('/blogs/' . $blog->slug),
            ],
        ]);
    }
}
