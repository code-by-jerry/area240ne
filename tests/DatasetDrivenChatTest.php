<?php

namespace Tests;

use App\Models\ChatSetting;
use App\Models\ChatServiceItem;
use App\Models\ChatSession;
use App\Models\ChatQualificationFlow;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DatasetDrivenChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    public function test_it_loads_admin_driven_welcome_message_and_service_options(): void
    {
        $response = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $response->assertOk()
            ->assertJsonPath('type', 'welcome')
            ->assertJsonCount(5, 'options');

        $this->assertStringContainsString('Area24ONE helps with homes, interiors, property, events, and land development', $response->json('reply'));
        $this->assertContains('Construction', $response->json('options'));
        $this->assertContains('Interiors', $response->json('options'));
    }

    public function test_it_uses_service_specific_intents_and_knowledge_after_service_selection(): void
    {
        ChatSetting::query()->whereKey(1)->update(['lead_capture_enabled' => false]);

        $welcome = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $sessionId = $welcome->json('session_id');

        $this->postJson('/chat', [
            'message' => 'Construction',
            'session_id' => $sessionId,
        ])->assertOk();

        $intent = $this->postJson('/chat', [
            'message' => 'What is the price and budget for this?',
            'session_id' => $sessionId,
        ]);

        $intent->assertOk()
            ->assertJsonPath('type', 'intent_match')
            ->assertJsonPath('redirect', '/cost-estimator');

        $knowledge = $this->postJson('/chat', [
            'message' => 'How long does it usually take?',
            'session_id' => $sessionId,
        ]);

        $knowledge->assertOk()
            ->assertJsonPath('type', 'knowledge_match');
    }

    public function test_it_completes_qualification_and_persists_a_lead_when_contact_details_are_collected(): void
    {
        $welcome = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $sessionId = $welcome->json('session_id');

        $this->postJson('/chat', [
            'message' => 'Interiors',
            'session_id' => $sessionId,
        ])->assertOk();

        foreach ([
            'Residential home',
            '1000-2000 sqft',
            'Modern',
            'Bangalore',
            'John Smith',
            '9876543210',
        ] as $answer) {
            $response = $this->postJson('/chat', [
                'message' => $answer,
                'session_id' => $sessionId,
            ]);
        }

        $response->assertOk()
            ->assertJsonPath('type', 'qualification_complete');

        $session = ChatSession::query()->findOrFail($sessionId);

        $this->assertSame('QUALIFIED', $session->state);
        $this->assertNotNull($session->lead_id);

        $lead = Lead::query()->findOrFail($session->lead_id);

        $this->assertSame('Interiors', $lead->service);
        $this->assertSame('John Smith', $lead->name);
        $this->assertSame('9876543210', $lead->phone);
        $this->assertSame('Bangalore', $lead->location);
        $this->assertStringContainsString('Contact Phone: 9876543210', $lead->message ?? '');
    }

    public function test_it_detects_natural_construction_requests_without_requiring_exact_service_name(): void
    {
        $welcome = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $sessionId = $welcome->json('session_id');

        $response = $this->postJson('/chat', [
            'message' => 'I want to build a house for us',
            'session_id' => $sessionId,
        ]);

        $response->assertOk()
            ->assertJsonPath('type', 'qualification_prompt');

        $this->assertStringContainsString('What\'s your project?', $response->json('reply'));
    }

    public function test_it_can_unpack_freeform_construction_details_into_multiple_qualification_answers(): void
    {
        $welcome = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $sessionId = $welcome->json('session_id');

        $this->postJson('/chat', [
            'message' => 'home construction',
            'session_id' => $sessionId,
        ])->assertOk();

        $response = $this->postJson('/chat', [
            'message' => 'Apartment, 3cr, 2 years, Bangalore',
            'session_id' => $sessionId,
        ]);

        $response->assertOk()
            ->assertJsonPath('type', 'qualification_prompt');

        $session = ChatSession::query()->findOrFail($sessionId);

        $this->assertSame('Residential', $session->data['qualification']['project_type']);
        $this->assertSame('1-5Cr', $session->data['qualification']['budget']);
        $this->assertSame('12+ months', $session->data['qualification']['timeline']);
        $this->assertSame('Bangalore', $session->data['qualification']['location']);
        $this->assertSame('contact_name', $session->data['last_question_key']);
        $this->assertStringContainsString('What is your name?', $response->json('reply'));
    }

    public function test_service_detection_and_option_mapping_follow_database_config(): void
    {
        $construction = ChatServiceItem::query()->where('slug', 'construction')->firstOrFail();
        $construction->update([
            'meta' => [
                'aliases' => ['family nest build'],
            ],
        ]);

        ChatQualificationFlow::query()
            ->where('service_id', $construction->id)
            ->where('field_key', 'project_type')
            ->update([
                'validation_rules' => ['alias:Residential=nest|duplex'],
            ]);

        $welcome = $this->postJson('/chat', [
            'message' => '',
            'session_id' => null,
        ]);

        $sessionId = $welcome->json('session_id');

        $this->postJson('/chat', [
            'message' => 'family nest build',
            'session_id' => $sessionId,
        ])->assertOk();

        $response = $this->postJson('/chat', [
            'message' => 'nest, 3cr, 2 years, Bangalore',
            'session_id' => $sessionId,
        ]);

        $session = ChatSession::query()->findOrFail($sessionId);

        $this->assertSame('Residential', $session->data['qualification']['project_type']);
        $this->assertSame('1-5Cr', $session->data['qualification']['budget']);
        $this->assertSame('12+ months', $session->data['qualification']['timeline']);
        $this->assertStringContainsString('What is your name?', $response->json('reply'));
    }
}
