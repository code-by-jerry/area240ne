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

            // Track guest session ownership (so load/delete are restricted to sessions they created/used)
            if (! auth()->check() && ! empty($response['session_id'])) {
                $ids = session('guest_chat_sessions', []);
                $ids[] = $response['session_id'];
                session()->put('guest_chat_sessions', array_slice(array_unique($ids), -20));
            }

            return response()->json($response);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error($e);
            return response()->json([
                'reply' => 'Something went wrong. Please try again.',
            ], 500);
        }
    }

    public function getHistory()
    {
        if (!auth()->check()) {
            return response()->json([]);
        }

        // Cleanup empty sessions (0 user messages) but keep recently created intro sessions (avoid deleting just-created session)
        \App\Models\ChatSession::where('user_id', auth()->id())
            ->whereHas('messages', function ($q) {
                $q->where('sender', 'user');
            }, '<', 1)
            ->where('created_at', '<', now()->subMinutes(2))
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

        // Security: owned by user, or (guest session and id in guest's list)
        if ($session->user_id) {
            if ($session->user_id !== auth()->id()) {
                abort(403);
            }
        } elseif (! in_array($id, session('guest_chat_sessions', []), true)) {
            abort(403);
        }

        return response()->json($session);
    }

    public function deleteSession($id)
    {
        $session = \App\Models\ChatSession::where('id', $id)->firstOrFail();

        // Security: owned by user, or (guest session and id in guest's list)
        if ($session->user_id) {
            if ($session->user_id !== auth()->id()) {
                abort(403);
            }
        } elseif (! in_array($id, session('guest_chat_sessions', []), true)) {
            abort(403);
        }

        $session->delete();

        return response()->json(['success' => true]);
    }
}
