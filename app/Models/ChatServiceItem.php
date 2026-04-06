<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatServiceItem extends Model
{
    protected $table = 'chat_services';

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'is_active',
        'short_summary',
        'description',
        'who_its_for',
        'offerings',
        'pricing_note',
        'timeline_note',
        'cta_text',
        'locations',
        'sort_order',
        'meta',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'who_its_for' => 'array',
        'offerings' => 'array',
        'locations' => 'array',
        'meta' => 'array',
        'published_at' => 'datetime',
    ];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
