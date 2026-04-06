<?php

namespace App\Services;

use App\Models\ChatIntent;

class ChatIntentMatcher
{
    public function match(string $userInput, ?int $serviceId = null): ?array
    {
        $intent = ChatIntent::findBestMatch($userInput, $serviceId);

        if (! $intent) {
            return null;
        }

        return [
            'found' => true,
            'intent_slug' => $intent->slug,
            'intent_name' => $intent->name,
            'service_id' => $intent->service_id,
            'service_name' => $intent->service?->name,
            'response' => $intent->getFormattedResponse(),
            'redirect_url' => $intent->redirect_url,
            'is_clarification' => $intent->isClarificationIntent(),
            'should_pause_flow' => $intent->shouldPauseFlow(),
        ];
    }
}
