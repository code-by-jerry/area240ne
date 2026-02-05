<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Intent Model
 *
 * Stores knowledge base dataset with intent-to-response mappings
 * Enables contextual, conversational chat without loops
 */
class Intent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'keywords',
        'service_vertical',
        'intent_slug',
        'response_text',
        'redirect_url',
        'category',
        'priority'
    ];

    protected $casts = [
        'keywords' => 'array', // Store as JSON array for keyword matching
    ];

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    /**
     * Find best matching intent for user input
     * Returns the intent with highest keyword match confidence
     */
    public static function findBestMatch(string $userInput, ?string $serviceVertical = null): ?Intent
    {
        $lowInput = strtolower(trim($userInput));
        $bestMatch = null;
        $bestScore = 0;

        // Build query with optional service filter
        $query = static::query();

        if ($serviceVertical) {
            // If in a service context, prioritize service-specific intents
            $query->where(function ($q) use ($serviceVertical) {
                $q->where('service_vertical', $serviceVertical)
                  ->orWhere('service_vertical', 'General');
            });
        } else {
            // No service context, only look at General intents
            $query->where('service_vertical', 'General');
        }

        $intents = $query->get();

        foreach ($intents as $intent) {
            $score = static::calculateMatchScore($lowInput, $intent->keywords ?? []);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $intent;
            }
        }

        // Return match only if confidence > 40%
        return $bestScore >= 0.4 ? $bestMatch : null;
    }

    /**
     * Calculate match score between input and keywords
     * Returns confidence score between 0 and 1
     */
    protected static function calculateMatchScore(string $input, array $keywords): float
    {
        $maxScore = 0;

        foreach ($keywords as $keyword) {
            $keyword = strtolower(trim($keyword));

            // Exact match (highest confidence)
            if ($input === $keyword) {
                return 1.0;
            }

            // Contains match with word boundaries
            if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/i', $input)) {
                $maxScore = max($maxScore, 0.8);
            }

            // Partial match
            elseif (str_contains($input, $keyword)) {
                $maxScore = max($maxScore, 0.6);
            }
        }

        return $maxScore;
    }

    /**
     * Get response text with formatting
     */
    public function getFormattedResponse(): string
    {
        // Remove surrounding quotes if present
        $text = $this->response_text ?? '';
        if (str_starts_with($text, '"""') && str_ends_with($text, '"""')) {
            $text = substr($text, 3, -3);
        }
        return trim($text);
    }

    /**
     * Check if this is a clarification/emotion intent
     */
    public function isClarificationIntent(): bool
    {
        return in_array($this->category, [
            'emotion_handling',
            'user_anxiety',
            'clarification_request'
        ]);
    }

    /**
     * Check if this intent should pause normal flow
     */
    public function shouldPauseFlow(): bool
    {
        return in_array($this->intent_slug, [
            'user_not_ready',
            'user_overwhelmed',
            'user_anxiety_cost',
            'user_anxiety_cheating',
            'user_confusion_area'
        ]);
    }
}
