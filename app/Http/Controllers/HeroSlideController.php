<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use App\Services\ImageKitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use RuntimeException;

class HeroSlideController extends Controller
{
    public function __construct(
        protected ImageKitService $imageKitService
    ) {
    }

    public function index()
    {
        $slides = HeroSlide::orderBy('order')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/HeroSlides', [
            'slides' => $slides
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        try {
            $upload = $this->imageKitService->upload(
                $request->file('image'),
                $request->file('image')->getClientOriginalName(),
                config('services.imagekit.hero_slides_folder', '/hero-slides'),
            );
        } catch (RuntimeException $exception) {
            return back()
                ->withErrors(['image' => $exception->getMessage()])
                ->withInput();
        }

        HeroSlide::create([
            'image_path' => $upload['url'],
            'imagekit_file_id' => $upload['file_id'],
            'title' => $request->title,
            'description' => $request->description,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
            'is_active' => $request->boolean('is_active', true),
            'order' => $request->input('order', 0),
        ]);

        return redirect()->back()->with('success', 'Slide created successfully.');
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $request->validate([
            'image' => 'nullable|image|max:5120',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            try {
                $upload = $this->imageKitService->upload(
                    $request->file('image'),
                    $request->file('image')->getClientOriginalName(),
                    config('services.imagekit.hero_slides_folder', '/hero-slides'),
                );
            } catch (RuntimeException $exception) {
                return back()
                    ->withErrors(['image' => $exception->getMessage()])
                    ->withInput();
            }

            $this->imageKitService->delete($heroSlide->imagekit_file_id);

            $heroSlide->image_path = $upload['url'];
            $heroSlide->imagekit_file_id = $upload['file_id'];
        }

        $heroSlide->update([
            'image_path' => $heroSlide->image_path,
            'imagekit_file_id' => $heroSlide->imagekit_file_id,
            'title' => $request->title,
            'description' => $request->description,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
            'is_active' => $request->boolean('is_active'),
            'order' => (int) $request->input('order', 0),
        ]);

        return redirect()->back()->with('success', 'Slide updated successfully.');
    }

    public function destroy(HeroSlide $heroSlide)
    {
        $this->imageKitService->delete($heroSlide->imagekit_file_id);

        $heroSlide->delete();
        return redirect()->back()->with('success', 'Slide deleted successfully.');
    }
}
