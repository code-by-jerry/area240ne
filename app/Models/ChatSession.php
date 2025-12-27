<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasUuids;

    protected $fillable = ['state', 'data', 'lead_id', 'user_id', 'title'];

    protected $casts = [
        'data' => 'array',
    ];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
