<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Response extends Model
{
    use HasFactory;

    protected $fillable = ['intent_id', 'response', 'redirect_url'];

    public function intent()
    {
        return $this->belongsTo(Intent::class);
    }
}
