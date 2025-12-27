<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Lead;
use Illuminate\Support\Str;

class ChatService
{
    protected $session;

    public function handle(string $sessionId = null, string $userMessage = '')
    {
        // 1. Get or Create Session
        if ($sessionId) {
            $this->session = ChatSession::find($sessionId);

            // Ownership check: if session has a user, it must match current auth
            if ($this->session && $this->session->user_id && $this->session->user_id !== auth()->id()) {
                throw new \Exception("Unauthorized access to chat session.");
            }
        }

        if (!$this->session) {
            $this->session = ChatSession::create([
                'state' => 'INIT',
                'user_id' => auth()->id(),
                'title' => 'New Chat'
            ]);
        }

        // 2. Save User Message
        if ($userMessage) {
            $this->session->messages()->create([
                'sender' => 'user',
                'message' => $userMessage
            ]);
        }

        // 3. Process State Machine
        $response = $this->processState($userMessage);

        // 4. Save Bot Response
        $this->session->messages()->create([
            'sender' => 'bot',
            'message' => $response['text'],
            'options' => $response['options'] ?? null
        ]);

        return [
            'reply' => $response['text'],
            'options' => $response['options'] ?? null,
            'session_id' => $this->session->id,
            'redirect' => $response['redirect'] ?? null
        ];
    }

    protected function processState($input)
    {
        $state = $this->session->state;
        $data = $this->session->data ?? [];
        $lowInput = strtolower($input);

        // --- GLOBAL HELPERS ---

        // Restart Logic
        if (Str::contains($lowInput, ['start new chat', 'restart', 'menu'])) {
            $this->session->update(['state' => 'ROUTE_SELECTION', 'data' => [], 'title' => 'New Chat']);
            return [
                'text' => "Hello again! I can help you with multiple services. What do you need?",
                'options' => [
                    "Build a House / Villa",
                    "Interior Design",
                    "Buy / Sell Property",
                    "Event Management"
                ]
            ];
        }

        // Capture phone numbers at any point
        if (preg_match('/[6-9]\d{9}/', $lowInput, $matches)) {
            $data['phone'] = $matches[0];

            // Try to extract name (everything before the phone number)
            $potentialName = trim(Str::before($input, $matches[0]));
            // Clean common connectors like "and", "my name is", etc.
            $potentialName = preg_replace('/^(my name is|i am|and)\s+/i', '', $potentialName);
            $potentialName = trim(preg_replace('/\s+(and|is)$/i', '', $potentialName));

            if ($potentialName && strlen($potentialName) > 2) {
                $data['name'] = $potentialName;
                // Update title with Name and Service
                $service = $data['service'] ?? 'Enquiry';
                $this->session->update(['title' => "$potentialName | $service - " . date('d M')]);
            }

            $this->session->update(['data' => $data]);
            // If we were asking for phone, move on
            if ($state === 'ASK_PHONE') {
                $this->session->update(['state' => 'FINAL']);
                return $this->finalizeLead();
            }
        }

        // --- STATE MACHINE ---

        if ($state === 'INIT') {
            $this->session->update(['state' => 'ROUTE_SELECTION']);
            return [
                'text' => "Hello! Welcome to Area24One. I can help you with multiple services. What specific assistance do you need today?",
                'options' => [
                    "Build a House / Villa",
                    "Interior Design",
                    "Buy / Sell Property",
                    "Event Management"
                ]
            ];
        }

        if ($state === 'ROUTE_SELECTION') {
            $dateStr = date('d M Y');
            if (Str::contains($lowInput, ['build', 'construct', 'villa', 'house'])) {
                $this->session->update(['state' => 'CONSTRUCTION_Q1', 'title' => 'Construction Enquiry - ' . $dateStr]);
                return [
                    'text' => "Great! Building a dream home is a big step. To start, do you already own a plot of land?",
                    'options' => ["Yes, I have land", "No, I need to find land"]
                ];
            }
            if (Str::contains($lowInput, ['interior', 'design', 'decor'])) {
                $this->session->update(['state' => 'INTERIORS_Q1', 'title' => 'Interior Design - ' . $dateStr]);
                return [
                    'text' => "Excellent choice. Are you looking to design a generic apartment, a villa, or a commercial space?",
                    'options' => ["Apartment", "Villa", "Commercial/Office"]
                ];
            }
            if (Str::contains($lowInput, ['real estate', 'buy', 'sell', 'property', 'invest'])) {
                $this->session->update(['state' => 'ESTATE_Q1', 'title' => 'Real Estate - ' . $dateStr]);
                return [
                    'text' => "Understood. Are you looking to Buy, Sell, or Invest?",
                    'options' => ["Buy Property", "Sell Property", "Investment"]
                ];
            }
            if (Str::contains($lowInput, ['event', 'party', 'wedding'])) {
                $this->session->update(['state' => 'EVENT_Q1', 'title' => 'Event Management - ' . $dateStr]); // Simple placeholder
                return [
                    'text' => "We can help with events via TheStage365. What kind of event are you planning?",
                    'options' => ["Wedding", "Corporate", "Private Party"]
                ];
            }

            // Fallback
            return [
                'text' => "I didn't quite catch that. Please select one of our core services:",
                'options' => [
                    "Build a House / Villa",
                    "Interior Design",
                    "Buy / Sell Property",
                    "Event Management"
                ]
            ];
        }

        // --- CONSTRUCTION FLOW ---
        if ($state === 'CONSTRUCTION_Q1') { // Own Land?
            $data['has_land'] = Str::contains($lowInput, 'yes') ? 'Yes' : 'No';
            $this->session->update(['data' => $data, 'state' => 'CONSTRUCTION_Q2']);
            return [
                'text' => "Okay. what is the approximate size of the plot (or required size)? (e.g., 1200 sqft, 2400 sqft)",
                'options' => ["1200 sq.ft (30x40)", "1500 sq.ft (30x50)", "2400 sq.ft (40x60)", "Other"]
            ];
        }

        if ($state === 'CONSTRUCTION_Q2') { // Size
            $data['size'] = $input;
            $this->session->update(['data' => $data, 'state' => 'CONSTRUCTION_Q3']);
            return [
                'text' => "Got it. What is your estimated budget for construction?",
                'options' => ["Under ₹50 Lakhs", "₹50L - ₹1 Cr", "₹1 Cr - ₹2 Cr", "Above ₹2 Cr"]
            ];
        }

        if ($state === 'CONSTRUCTION_Q3') { // Budget
            $data['budget'] = $input;
            $this->session->update(['data' => $data, 'state' => 'CONSTRUCTION_Q4']);
            return [
                'text' => "And when are you planning to start this project?",
                'options' => ["Immediately", "3-6 Months", "Just Planning"]
            ];
        }

        if ($state === 'CONSTRUCTION_Q4') { // Timeline -> ASK LEAD
            $data['timeline'] = $input;
            $data['service'] = 'Construction';
            $this->session->update(['data' => $data, 'state' => 'ASK_PHONE']);
            return [
                'text' => "Thank you! Based on your requirements (Size: {$data['size']}, Budget: {$data['budget']}), we have some great turnkey packages. Could you please share your Name and Phone Number so our engineer can send you a preliminary estimate?",
            ];
        }

        // --- ESTATE FLOW ---
        if ($state === 'ESTATE_Q1') {
            $data['service'] = 'Real Estate';
            $data['requirement'] = $input; // Buy/Sell/Invest
            $this->session->update(['data' => $data, 'state' => 'ASK_PHONE']);

            return [
                'text' => "To help you {$input} at the best price, our property expert needs to contact you. Please share your Name and Phone Number.",
            ];
        }

        // --- EVENT FLOW ---
        if ($state === 'EVENT_Q1') {
            $data['service'] = 'Event Management';
            $data['event_type'] = $input;
            $this->session->update(['data' => $data, 'state' => 'ASK_PHONE']);

            return [
                'text' => "Great! For a flawless {$input}, our planners at TheStage365 need a few details. Please start by sharing your Name and Phone Number.",
            ];
        }

        // --- INTERIORS FLOW ---
        if ($state === 'INTERIORS_Q1') { // Type
            $data['property_type'] = $input;
            $this->session->update(['data' => $data, 'state' => 'INTERIORS_Q2']);
            return [
                'text' => "What is the approximate carpet area?",
                'options' => ["2BHK (Standard)", "3BHK (Standard)", "Villa (>2500 sqft)", "Other"]
            ];
        }

        if ($state === 'INTERIORS_Q2') { // Area
            $data['area'] = $input;
            $this->session->update(['data' => $data, 'state' => 'INTERIORS_Q3']);
            return [
                'text' => "What is your preferred design style?",
                'options' => ["Modern", "Minimalist", "Luxury", "Traditional"]
            ];
        }

        if ($state === 'INTERIORS_Q3') { // Style
            $data['style'] = $input;
            $this->session->update(['data' => $data, 'state' => 'INTERIORS_Q4']);
            return [
                'text' => "What is your budget range for interiors?",
                'options' => ["₹5L - ₹10L", "₹10L - ₹20L", "₹20L - ₹40L", "Premium (> ₹40L)"]
            ];
        }

        if ($state === 'INTERIORS_Q4') { // Budget -> ASK LEAD
            $data['budget'] = $input;
            $data['service'] = 'Interiors';
            $this->session->update(['data' => $data, 'state' => 'ASK_PHONE']);
            return [
                'text' => "Perfect. Nesthetix Designs creates stunning {$data['style']} interiors. To share our portfolio and a quote, may I have your Name and Phone Number?",
            ];
        }

        // --- LEAD CAPTURE FINALIZATION ---
        if ($state === 'ASK_PHONE') {
            // If we reached here, regex didn't catch a phone in the *previous* global check, or user typed text.
            // Let's assume input is name if no phone found, and ask for phone again if needed.
            if (isset($data['phone'])) {
                $this->session->update(['state' => 'FINAL']);
                return $this->finalizeLead();
            } else {
                return [
                    'text' => "I'll need a valid 10-digit phone number to arrange a callback from our expert. Please simply type your number."
                ];
            }
        }

        if ($state === 'FINAL') {
            return [
                'text' => "We have already received your details. Someone from our team will contact you shortly! Is there anything else you'd like to ask?",
                'options' => ["Go to Home", "Start New Chat"]
            ];
        }

        return ['text' => "I am listening..."];
    }

    protected function finalizeLead()
    {
        $data = $this->session->data;

        // Save to Leads Table
        Lead::create([
            'phone' => $data['phone'] ?? 'Unknown',
            'service' => $data['service'] ?? 'General',
            'message' => json_encode($data), // Save all context
            'name' => $data['name'] ?? 'Guest'
        ]);

        $redirect = '/';

        return [
            'text' => "Thank you! Your details are saved. Our expert from the relevant department will call you soon with a personalized plan. (Phone: {$data['phone']})",
            // 'redirect' => $redirect
        ];
    }
}
