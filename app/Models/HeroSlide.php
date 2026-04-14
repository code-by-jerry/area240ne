<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class HeroSlide extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'imagekit_file_id',
        'button_text',
        'button_link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saved(fn() => Cache::forget('hero_slides_active'));
        static::deleted(fn() => Cache::forget('hero_slides_active'));
    }
}
