<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Services\ImageKitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class MediaAssetsController extends Controller
{
    public function __construct(private ImageKitService $imageKit)
    {
    }

    public function index()
    {
        $assets = MediaAsset::query()
            ->latest()
            ->get()
            ->map(fn (MediaAsset $asset) => [
                'id' => $asset->id,
                'title' => $asset->title,
                'image_path' => $asset->image_path,
                'image_url' => $this->resolveImageUrl($asset->image_path),
                'is_active' => $asset->is_active,
                'created_at' => optional($asset->created_at)?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/MediaAssets', [
            'assets' => $assets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'max:5120'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        try {
            $upload = $this->imageKit->upload(
                $request->file('image'),
                pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME),
                config('services.imagekit.folder', '/media-assets'),
            );
        } catch (RuntimeException $exception) {
            return back()->withErrors([
                'image' => $exception->getMessage(),
            ]);
        }

        MediaAsset::create([
            'title' => $validated['title'],
            'image_path' => $upload['url'],
            'imagekit_file_id' => $upload['file_id'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Media asset created successfully.');
    }

    public function update(Request $request, MediaAsset $mediaAsset)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($mediaAsset->imagekit_file_id) {
                $this->imageKit->delete($mediaAsset->imagekit_file_id);
            } elseif (! $this->isRemoteUrl($mediaAsset->image_path) && Storage::disk('public')->exists($mediaAsset->image_path)) {
                Storage::disk('public')->delete($mediaAsset->image_path);
            }

            try {
                $upload = $this->imageKit->upload(
                    $request->file('image'),
                    pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME),
                    config('services.imagekit.folder', '/media-assets'),
                );
            } catch (RuntimeException $exception) {
                return back()->withErrors([
                    'image' => $exception->getMessage(),
                ]);
            }

            $mediaAsset->image_path = $upload['url'];
            $mediaAsset->imagekit_file_id = $upload['file_id'];
        }

        $mediaAsset->fill([
            'title' => $validated['title'],
            'is_active' => $request->boolean('is_active'),
        ]);

        $mediaAsset->save();

        return redirect()->back()->with('success', 'Media asset updated successfully.');
    }

    public function destroy(MediaAsset $mediaAsset)
    {
        if ($mediaAsset->imagekit_file_id) {
            $this->imageKit->delete($mediaAsset->imagekit_file_id);
        } elseif (! $this->isRemoteUrl($mediaAsset->image_path) && Storage::disk('public')->exists($mediaAsset->image_path)) {
            Storage::disk('public')->delete($mediaAsset->image_path);
        }

        $mediaAsset->delete();

        return redirect()->back()->with('success', 'Media asset deleted successfully.');
    }

    private function resolveImageUrl(string $path): string
    {
        return $this->isRemoteUrl($path) ? $path : Storage::url($path);
    }

    private function isRemoteUrl(string $path): bool
    {
        return Str::startsWith($path, ['http://', 'https://']);
    }
}