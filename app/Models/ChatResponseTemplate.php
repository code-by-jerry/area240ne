<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatResponseTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'title',
        'body',
        'quick_replies',
        'highlight',
        'requires_input',
        'ui_variant',
        'is_active',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'quick_replies' => 'array',
        'highlight' => 'boolean',
        'requires_input' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
