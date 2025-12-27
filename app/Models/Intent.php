<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Intent extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'keywords'];

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
