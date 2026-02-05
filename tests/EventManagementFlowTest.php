<?php

namespace Tests;

use App\Models\ChatSession;
use App\Services\ChatService;

class EventManagementFlowTest extends TestCase
{
    public function test_event_management_service_selection()
    {
        $service = app(ChatService::class);

        echo "\n✓ Testing Event Management Service Selection\n";
        echo "════════════════════════════════════════════════════════════\n";

        // Test 1: Greeting
        echo "\n📝 Test 1: User Greeting\n";
        $response = $service->handle(null, 'Hi there!');
        $sessionId = $response['session_id'] ?? null;
        echo "Bot: " . substr($response['reply'], 0, 100) . "...\n";
        echo "Options shown: Build House, Interior Design, Buy Property, Event Management, Land Dev\n";

        $session = ChatSession::find($sessionId);
        $this->assertEquals('SERVICE_SELECT', $session->state);

        // Test 2: Select Event Management (the critical test)
        echo "\n📝 Test 2: User Selects Event Management\n";
        echo "User: Event Management\n";
        $response = $service->handle($sessionId, 'Event Management');
        echo "Bot: " . substr($response['reply'], 0, 150) . "...\n";

        $session->refresh();
        echo "State: " . $session->state . "\n";
        echo "Service: " . ($session->data['service'] ?? 'NOT SET') . "\n";

        // THIS IS THE FIX: Should be Event Management_Q1, not showing dataset question
        $this->assertEquals('Event Management_Q1', $session->state, 'Should move to Event Management_Q1');
        $this->assertEquals('Event Management', $session->data['service'] ?? null);

        echo "\n✅ Event Management service properly detected and loaded!\n";
        echo "════════════════════════════════════════════════════════════\n";
    }
}
