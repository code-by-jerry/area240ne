<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatQualificationFlow extends Model
{
    protected $fillable = [
        'service_id',
        'field_key',
        'label',
        'question',
        'answer_type',
        'quick_options',
        'step_order',
        'is_required',
        'is_active',
        'published_at',
        'validation_rules',
        'updated_by',
    ];

    protected $casts = [
        'quick_options' => 'array',
        'validation_rules' => 'array',
        'is_required' => 'boolean',
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
