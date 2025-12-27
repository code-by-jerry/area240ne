<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ChatService;

class ChatController extends Controller
{
    protected $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'nullable|string',
            'session_id' => 'nullable|string'
        ]);

        try {
            $message = (string) $request->input('message', ''); // Force string cast
            $sessionId = $request->input('session_id');

            $response = $this->chatService->handle($sessionId, $message);

            return response()->json($response);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return response()->json([
                'reply' => "Error: " . $e->getMessage(),
                'error_details' => $e->getTraceAsString()
            ], 200); // Return 200 to see message in UI
        }
    }

    public function getHistory()
    {
        if (!auth()->check()) {
            return response()->json([]);
        }

        // Cleanup empty sessions (sessions where user hasn't replied yet - only 1 bot message)
        \App\Models\ChatSession::where('user_id', auth()->id())
            ->whereHas('messages', function ($q) {
                $q->where('sender', 'user');
            }, '<', 1)
            ->delete();

        $sessions = \App\Models\ChatSession::where('user_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->select('id', 'title', 'updated_at')
            ->get();

        return response()->json($sessions);
    }

    public function loadSession($id)
    {
        $session = \App\Models\ChatSession::where('id', $id)
            ->with([
                'messages' => function ($q) {
                    $q->orderBy('created_at', 'asc');
                }
            ])
            ->firstOrFail();

        // Security check
        if ($session->user_id && $session->user_id !== auth()->id()) {
            abort(403);
        }

        return response()->json($session);
    }

    public function deleteSession($id)
    {
        $session = \App\Models\ChatSession::where('id', $id)->firstOrFail();

        // Security check
        if ($session->user_id && $session->user_id !== auth()->id()) {
            abort(403);
        }

        $session->delete();

        return response()->json(['success' => true]);
    }
}
