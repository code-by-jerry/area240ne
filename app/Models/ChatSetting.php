<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSetting extends Model
{
    protected $fillable = [
        'assistant_name',
        'welcome_title',
        'welcome_message',
        'fallback_message',
        'escalation_message',
        'no_result_message',
        'chat_enabled',
        'lead_capture_enabled',
        'show_service_options',
        'default_response_type',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'chat_enabled' => 'boolean',
        'lead_capture_enabled' => 'boolean',
        'show_service_options' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
