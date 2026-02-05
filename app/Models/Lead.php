<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'phone', 
        'email', 
        'service', 
        'message',
        'location',
        'q1_answer',
        'q2_answer',
        'q3_answer',
        'intent_slug',
        'conversion_score',
        'source_keyword',
        'engagement_level',
        'lead_status'
    ];
}
