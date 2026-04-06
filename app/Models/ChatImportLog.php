<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatImportLog extends Model
{
    protected $fillable = [
        'module',
        'file_name',
        'file_type',
        'status',
        'total_rows',
        'success_rows',
        'failed_rows',
        'error_summary',
        'payload_snapshot',
        'created_by',
    ];

    protected $casts = [
        'payload_snapshot' => 'array',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
