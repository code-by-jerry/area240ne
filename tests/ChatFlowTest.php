<?php

namespace Tests;

use App\Models\ChatSession;
use App\Services\ChatService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ChatFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    public function test_service_handles_a_complete_runtime_flow_without_looping(): void
    {
        $service = app(ChatService::class);

        $welcome = $service->handle(null, '');
        $this->assertSame('welcome', $welcome['type']);

        $sessionId = $welcome['session_id'];

        $serviceSelection = $service->handle($sessionId, 'Construction');
        $this->assertSame('qualification_prompt', $serviceSelection['type']);

        $session = ChatSession::query()->findOrFail($sessionId);
        $this->assertSame('QUALIFYING', $session->state);
        $this->assertSame('project_type', $session->data['last_question_key']);

        foreach ([
            'Residential',
            '50L-1Cr',
            '6-12 months',
            'Mysore',
            'Jane Doe',
            '9999999999',
        ] as $answer) {
            $final = $service->handle($sessionId, $answer);
        }

        $session->refresh();

        $this->assertSame('QUALIFIED', $session->state);
        $this->assertSame('qualification_complete', $final['type']);
        $this->assertNotNull($session->lead_id);
    }
}
