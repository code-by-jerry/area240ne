<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    protected $fillable = [
        'title',
        'image_path',
        'imagekit_file_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}