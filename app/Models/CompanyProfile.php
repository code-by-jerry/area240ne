<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $table = 'company_profile';

    protected $fillable = [
        'name',
        'logo_url',
        'intro_text',
        'fallback_text',
        'phone',
        'email',
        'website',
        'instagram',
        'facebook',
        'linkedin',
    ];

    protected $casts = [
        'phone' => 'array',
    ];

    /**
     * Get the singleton company profile, or a new empty instance.
     */
    public static function getSingleton(): self
    {
        return self::first() ?? new self();
    }
}
