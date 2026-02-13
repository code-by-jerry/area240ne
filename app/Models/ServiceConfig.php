<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceConfig extends Model
{
    protected $fillable = [
        'service_vertical',
        'q1',
        'q2',
        'q3',
        'options_q1',
        'options_q2',
        'options_q3',
        'brand_name',
        'brand_short',
        'website',
        'instagram',
        'facebook',
        'linkedin',
        'phone',
        'projects_count',
        'description',
        'ceo_name',
        'ceo_website',
        'ceo_experience',
        'intro_text',
        'greeting_keywords',
        'location_keywords',
        'process_timeline',
        'detection_keywords',
    ];

    protected $casts = [
        'options_q1' => 'array',
        'options_q2' => 'array',
        'options_q3' => 'array',
        'phone' => 'array',
        'greeting_keywords' => 'array',
        'location_keywords' => 'array',
        'detection_keywords' => 'array',
    ];
}
