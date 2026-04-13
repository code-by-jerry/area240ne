<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Services\ImageKitService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use RuntimeException;

class BlogsController extends Controller
{
    public function __construct(
        protected ImageKitService $imageKitService
    ) {
    }

    public function index()
    {
        return Inertia::render('Admin/Blogs', [
            'blogs' => Blog::query()
                ->orderByDesc('published_at')
                ->orderByDesc('updated_at')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        if ($request->hasFile('featured_image')) {
            try {
                $upload = $this->imageKitService->upload(
                    $request->file('featured_image'),
                    $request->file('featured_image')->getClientOriginalName(),
                    config('services.imagekit.blog_images_folder', '/blog-images'),
                );

                $validated['featured_image_url'] = $upload['url'];
                $validated['imagekit_file_id'] = $upload['file_id'];
            } catch (RuntimeException $exception) {
                return back()
                    ->withErrors(['featured_image' => $exception->getMessage()])
                    ->withInput();
            }
        }

        Blog::create([
            ...$validated,
            'published_at' => $validated['is_published'] ? now() : null,
            'slug' => $validated['slug'] ?: Str::slug($validated['title']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Blog created.');
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $this->validatePayload($request, $blog->id);

        if ($request->hasFile('featured_image')) {
            try {
                $upload = $this->imageKitService->upload(
                    $request->file('featured_image'),
                    $request->file('featured_image')->getClientOriginalName(),
                    config('services.imagekit.blog_images_folder', '/blog-images'),
                );

                $this->imageKitService->delete($blog->imagekit_file_id);

                $validated['featured_image_url'] = $upload['url'];
                $validated['imagekit_file_id'] = $upload['file_id'];
            } catch (RuntimeException $exception) {
                return back()
                    ->withErrors(['featured_image' => $exception->getMessage()])
                    ->withInput();
            }
        }

        $blog->update([
            ...$validated,
            'published_at' => $validated['is_published']
                ? ($blog->published_at ?? now())
                : null,
            'slug' => $validated['slug'] ?: Str::slug($validated['title']),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Blog updated.');
    }

    public function toggleActive(Blog $blog)
    {
        $blog->update([
            'is_active' => ! $blog->is_active,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_active' => $blog->is_active]);
    }

    public function togglePublished(Blog $blog)
    {
        $blog->update([
            'published_at' => $blog->published_at ? null : now(),
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['published_at' => $blog->published_at?->toISOString()]);
    }

    public function toggleFeatured(Blog $blog)
    {
        $blog->update([
            'is_featured' => ! $blog->is_featured,
            'updated_by' => auth()->id(),
        ]);

        return response()->json(['is_featured' => $blog->is_featured]);
    }

    public function destroy(Blog $blog)
    {
        $this->imageKitService->delete($blog->imagekit_file_id);
        $blog->delete();

        return redirect()->back()->with('success', 'Blog deleted.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blogs', 'slug')->ignore($ignoreId)],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'seo_keywords' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'url', 'max:2048'],
        ]);
    }
}
