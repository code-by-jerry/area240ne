<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatIntent extends Model
{
    protected $table = 'chat_intents';

    protected $fillable = [
        'name',
        'slug',
        'service_id',
        'keywords',
        'response_text',
        'redirect_url',
        'category',
        'priority',
        'conversion_rate',
        'priority_score',
        'is_high_value',
        'is_active',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'keywords' => 'array',
        'conversion_rate' => 'decimal:2',
        'is_high_value' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(ChatServiceItem::class, 'service_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function findBestMatch(string $userInput, ?int $serviceId = null): ?self
    {
        $lowInput = strtolower(trim($userInput));
        $query = static::query()
            ->where('is_active', true)
            ->whereNotNull('published_at');

        if ($serviceId) {
            $query->where(function ($builder) use ($serviceId) {
                $builder->where('service_id', $serviceId)
                    ->orWhereNull('service_id');
            });
        } else {
            $query->whereNull('service_id');
        }

        $bestMatch = null;
        $bestScore = 0.0;

        foreach ($query->with('service:id,name')->get() as $intent) {
            $score = static::calculateMatchScore($lowInput, $intent->keywords ?? []);
            if ($serviceId && $intent->service_id === $serviceId) {
                $score += 0.05;
            }
            $score += min(0.1, ((int) $intent->priority / 1000));

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $intent;
            }
        }

        return $bestScore >= 0.4 ? $bestMatch : null;
    }

    protected static function calculateMatchScore(string $input, array $keywords): float
    {
        $maxScore = 0.0;

        foreach ($keywords as $keyword) {
            $keyword = strtolower(trim((string) $keyword));
            if ($keyword === '') {
                continue;
            }

            if ($input === $keyword) {
                return 1.0;
            }

            if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $input)) {
                $maxScore = max($maxScore, 0.8);
            } elseif (str_contains($input, $keyword)) {
                $maxScore = max($maxScore, 0.6);
            }
        }

        return $maxScore;
    }

    public function getFormattedResponse(): string
    {
        $text = $this->response_text ?? '';
        if (str_starts_with($text, '"""') && str_ends_with($text, '"""')) {
            $text = substr($text, 3, -3);
        }

        return trim($text);
    }

    public function isClarificationIntent(): bool
    {
        return in_array($this->category, [
            'emotion_handling',
            'user_anxiety',
            'clarification_request',
        ], true);
    }

    public function shouldPauseFlow(): bool
    {
        return in_array($this->slug, [
            'user_not_ready',
            'user_overwhelmed',
            'user_anxiety_cost',
            'user_anxiety_cheating',
            'user_confusion_area',
        ], true);
    }
}
