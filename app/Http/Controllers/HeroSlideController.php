<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HeroSlideController extends Controller
{
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
            'image_url' => 'required|url',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        HeroSlide::create([
            'image_path' => $request->input('image_url'),
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
            'image_url' => 'nullable|url',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->filled('image_url')) {
            $heroSlide->image_path = $request->input('image_url');
        }

        $heroSlide->update([
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
        if (str_starts_with($heroSlide->image_path, '/storage/')) {
            $path = str_replace('/storage/', '', $heroSlide->image_path);
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
        
        $heroSlide->delete();
        return redirect()->back()->with('success', 'Slide deleted successfully.');
    }
}
