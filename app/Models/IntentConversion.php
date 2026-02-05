<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntentConversion extends Model
{
    use HasFactory;

    protected $fillable = [
        'intent_slug',
        'total_searches',
        'total_conversions',
        'conversion_rate',
        'last_updated'
    ];

    protected $casts = [
        'conversion_rate' => 'decimal:2',
        'last_updated' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function intent()
    {
        return $this->belongsTo(Intent::class, 'intent_slug', 'intent_slug');
    }
}
