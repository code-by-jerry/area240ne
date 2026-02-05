<?php

namespace App\Services;

use App\Models\ChatSession;
use Illuminate\Support\Facades\Auth;

class AuthenticationFlowService
{
    /**
     * Check if user needs to provide contact information
     */
    public function requiresContactInfo(?string $sessionId = null): bool
    {
        // If user is logged in, no need for contact info
        if (Auth::check()) {
            return false;
        }

        // If session has contact info, no need
        if ($sessionId) {
            $session = ChatSession::find($sessionId);
            if ($session && $this->hasContactInfo($session->data ?? [])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if session data contains contact information
     */
    protected function hasContactInfo(array $sessionData): bool
    {
        return !empty($sessionData['name']) && !empty($sessionData['phone']);
    }

    /**
     * Extract contact info from user input
     */
    public function extractContactInfo(string $input, array $sessionData = []): array
    {
        $extracted = [];
        
        // Extract phone number
        if (preg_match('/[6-9]\d{9}/', $input, $matches)) {
            $extracted['phone'] = $matches[0];
        }
        
        // Extract email
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $input, $matches)) {
            $extracted['email'] = $matches[0];
        }
        
        // Extract name (if phone/email found, text before it might be name)
        if (isset($extracted['phone'])) {
            $potentialName = trim(preg_replace('/[6-9]\d{9}/', '', $input));
            $potentialName = preg_replace('/^(my name is|i am|and)\s+/i', '', $potentialName);
            $potentialName = trim(preg_replace('/\s+(and|is)$/i', '', $potentialName));
            
            if (strlen($potentialName) > 2 && strlen($potentialName) < 50) {
                $extracted['name'] = $potentialName;
            }
        }
        
        return array_merge($sessionData, $extracted);
    }

    /**
     * Generate contact info request message
     */
    public function generateContactRequestMessage(array $sessionData = []): array
    {
        $missing = [];
        
        if (empty($sessionData['name'])) {
            $missing[] = 'name';
        }
        
        if (empty($sessionData['phone'])) {
            $missing[] = 'phone';
        }
        
        if (empty($missing)) {
            return [
                'text' => 'Thank you! I have your contact information.',
                'options' => null
            ];
        }
        
        if (count($missing) === 2) {
            return [
                'text' => 'To provide you with the best assistance and connect you with our experts, could you please share your Name and Phone Number?',
                'options' => null,
                'requires_contact' => true
            ];
        }
        
        if (in_array('name', $missing)) {
            return [
                'text' => 'Could you please share your name?',
                'options' => null,
                'requires_contact' => true
            ];
        }
        
        if (in_array('phone', $missing)) {
            return [
                'text' => 'Could you please share your 10-digit phone number?',
                'options' => null,
                'requires_contact' => true
            ];
        }
        
        return [
            'text' => 'Thank you!',
            'options' => null
        ];
    }

    /**
     * Check if contact info is complete
     */
    public function isContactInfoComplete(array $sessionData): bool
    {
        return !empty($sessionData['name']) && !empty($sessionData['phone']);
    }

    /**
     * Determine optimal point to request contact info
     */
    public function shouldRequestContactInfo(string $intentSlug, array $sessionData): bool
    {
        // Don't ask too early
        $questionsAnswered = $sessionData['questions_answered'] ?? 0;
        if ($questionsAnswered < 2) {
            return false;
        }

        // Ask before high-value intents
        $highValueIntents = [
            'construction_quote',
            'interior_quote',
            'property_inquiry',
            'lead_capture'
        ];

        if (in_array($intentSlug, $highValueIntents)) {
            return true;
        }

        // Ask if user is asking for cost/quote
        $costKeywords = ['cost', 'price', 'quote', 'estimate', 'budget'];
        foreach ($costKeywords as $keyword) {
            if (str_contains(strtolower($intentSlug), $keyword)) {
                return true;
            }
        }

        return false;
    }
}
