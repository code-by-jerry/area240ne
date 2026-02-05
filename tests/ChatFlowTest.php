<?php

namespace Tests;

use App\Models\ChatSession;
use App\Services\ChatService;

class ChatFlowTest extends TestCase
{
    public function test_complete_interior_design_flow_no_loops()
    {
        $service = app(ChatService::class);

        echo "\n✓ Starting End-to-End Chat Flow Test\n";
        echo "════════════════════════════════════════════════════════════\n";

        // Test 1: Greeting → INTENT_DETECTION (intro shown)
        echo "\n📝 Test 1: User Greeting\n";
        echo "User: Hi there!\n";
        $response = $service->handle(null, 'Hi there!');
        $sessionId = $response['session_id'] ?? null;
        echo "Bot: " . substr($response['reply'], 0, 120) . "...\n";

        $session = ChatSession::find($sessionId);
        echo "State: " . $session->state . "\n";
        $this->assertNotNull($session, 'Session should be created');
        $this->assertEquals('INTENT_DETECTION', $session->state);

        // Test 2: Service intent → SERVICE_CONFIRMATION
        echo "\n📝 Test 2: Service Selection (Interior Design)\n";
        echo "User: I want to do interior design\n";
        $response = $service->handle($sessionId, 'I want to do interior design');
        echo "Bot: " . substr($response['reply'], 0, 120) . "...\n";

        $session->refresh();
        echo "State: " . $session->state . "\n";
        $this->assertEquals('SERVICE_CONFIRMATION', $session->state);

        // Test 3: Confirm service → LEAD_QUALIFICATION (Q1)
        echo "\n📝 Test 3: Confirm Service\n";
        echo "User: Yes, exactly!\n";
        $response = $service->handle($sessionId, 'Yes, exactly!');
        echo "Bot: " . substr($response['reply'], 0, 120) . "...\n";

        $session->refresh();
        echo "State: " . $session->state . "\n";
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 4: Answer Q1
        echo "\n📝 Test 4: Answer Q1\n";
        echo "User: Residential home\n";
        $response = $service->handle($sessionId, 'Residential home');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 5: Answer Q2
        echo "\n📝 Test 5: Answer Q2\n";
        echo "User: 1000-2000 sqft\n";
        $response = $service->handle($sessionId, '1000-2000 sqft');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 6: Answer Q3
        echo "\n📝 Test 6: Answer Q3\n";
        echo "User: Modern\n";
        $response = $service->handle($sessionId, 'Modern');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 7: Answer location
        echo "\n📝 Test 7: Location\n";
        echo "User: Bangalore\n";
        $response = $service->handle($sessionId, 'Bangalore');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 8: Name
        echo "\n📝 Test 8: Name\n";
        echo "User: John Smith\n";
        $response = $service->handle($sessionId, 'John Smith');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        $this->assertEquals('LEAD_QUALIFICATION', $session->state);

        // Test 9: Phone → COMPLETE, lead created
        echo "\n📝 Test 9: Phone\n";
        echo "User: 9876543210\n";
        $response = $service->handle($sessionId, '9876543210');
        echo "Bot: " . substr($response['reply'], 0, 80) . "...\n";

        $session->refresh();
        echo "State: " . $session->state . "\n";
        $this->assertEquals('COMPLETE', $session->state);

        // Test 10: Verify Lead Created
        echo "\n📝 Test 10: Verify Lead Created\n";
        $lead = $session->lead;
        $this->assertNotNull($lead, 'Lead should be created');
        $this->assertEquals('Interiors', $lead->service);
        $this->assertEquals('John Smith', $lead->name);
        $this->assertEquals('9876543210', $lead->phone);
        echo "Lead Service: " . $lead->service . "\n";

        echo "\n════════════════════════════════════════════════════════════\n";
        echo "✅ TEST PASSED: No loops detected!\n";
        echo "   Flow: Greeting → Intent → Confirm → Q1→Q2→Q3 → Location → Name → Phone → Complete\n";
        echo "   Status: All transitions successful, lead captured\n";
    }
}
