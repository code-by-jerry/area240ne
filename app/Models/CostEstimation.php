<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CostEstimation extends Model
{
    protected $fillable = [
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
}
