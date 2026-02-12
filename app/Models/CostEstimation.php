<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CostEstimation extends Model
{
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'state',
        'city',
        'plot_area',
        'floors',
        'package',
        'estimated_cost',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }
}
