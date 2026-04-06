<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'session_id',
        'sender',
        'message',
        'type',
        'meta',
        'options',
    ];

    protected $casts = [
        'options' => 'array',
        'meta' => 'array',
    ];
}
