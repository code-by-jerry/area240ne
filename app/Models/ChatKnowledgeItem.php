<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatKnowledgeItem extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'service_id',
        'question_patterns',
        'answer',
        'short_answer',
        'tags',
        'priority',
        'is_active',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'question_patterns' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function service()
    {
        return $this->belongsTo(ChatServiceItem::class, 'service_id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
