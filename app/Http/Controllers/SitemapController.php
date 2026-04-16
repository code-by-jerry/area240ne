<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = [];

        // Static pages
        $urls[] = ['loc' => url('/'),               'priority' => '1.0', 'changefreq' => 'weekly'];
        $urls[] = ['loc' => url('/blogs'),          'priority' => '0.8', 'changefreq' => 'daily'];
        $urls[] = ['loc' => url('/about/ceo'),      'priority' => '0.8', 'changefreq' => 'monthly'];
        $urls[] = ['loc' => url('/cost-estimator'), 'priority' => '0.7', 'changefreq' => 'monthly'];
        $urls[] = ['loc' => url('/chat'),           'priority' => '0.6', 'changefreq' => 'monthly'];

        // Service landing pages
        foreach (\App\Http\Controllers\ServiceLandingController::allSlugs() as $slug) {
            $urls[] = [
                'loc'        => url("/services/{$slug}"),
                'priority'   => '0.9',
                'changefreq' => 'monthly',
            ];
        }

        // Blog posts
        $blogs = Blog::published()
            ->orderByDesc('published_at')
            ->get(['slug', 'updated_at', 'published_at']);

        foreach ($blogs as $blog) {
            $urls[] = [
                'loc'        => route('blogs.show', $blog->slug),
                'lastmod'    => ($blog->updated_at ?? $blog->published_at)?->toAtomString(),
                'priority'   => '0.7',
                'changefreq' => 'monthly',
            ];
        }

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
