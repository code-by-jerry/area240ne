<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeywordSearch extends Model
{
    use HasFactory;

    protected $fillable = [
        'keyword',
        'intent_slug',
        'user_id',
        'session_id',
        'converted',
        'service_vertical'
    ];

    protected $casts = [
        'converted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function intent()
    {
        return $this->belongsTo(Intent::class, 'intent_slug', 'intent_slug');
    }
}
