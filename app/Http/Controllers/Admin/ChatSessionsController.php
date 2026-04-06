<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChatSessionsController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('q', ''));

        $query = ChatSession::query()
            ->with(['user:id,name,email'])
            ->withCount('messages')
            ->orderByDesc('updated_at');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $sessions = $query
            ->limit(50)
            ->get([
                'id',
                'title',
                'state',
                'user_id',
                'lead_id',
                'data',
                'created_at',
                'updated_at',
            ]);

        $selectedId = $request->query('session') ?: $sessions->first()?->id;

        $selectedSession = null;
        if ($selectedId) {
            $selectedSession = ChatSession::query()
                ->with([
                    'user:id,name,email',
                    'messages' => fn ($messageQuery) => $messageQuery->orderBy('created_at'),
                ])
                ->find($selectedId, [
                    'id',
                    'title',
                    'state',
                    'user_id',
                    'lead_id',
                    'data',
                    'created_at',
                    'updated_at',
                ]);
        }

        $stats = [
            'total_sessions' => ChatSession::count(),
            'open_sessions' => ChatSession::where('state', 'OPEN')->count(),
            'qualifying_sessions' => ChatSession::where('state', 'QUALIFYING')->count(),
            'qualified_sessions' => ChatSession::where('state', 'QUALIFIED')->count(),
            'today_sessions' => ChatSession::whereDate('created_at', now()->toDateString())->count(),
            'total_messages' => ChatMessage::count(),
            'user_messages' => ChatMessage::where('sender', 'user')->count(),
            'bot_messages' => ChatMessage::where('sender', 'bot')->count(),
        ];

        $topMessageTypes = ChatMessage::query()
            ->select('type', DB::raw('COUNT(*) as total'))
            ->whereNotNull('type')
            ->groupBy('type')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'total' => (int) $row->total,
            ])
            ->values();

        return Inertia::render('Admin/ChatSessions', [
            'sessions' => $sessions,
            'selectedSession' => $selectedSession,
            'filters' => [
                'q' => $search,
                'session' => $selectedId,
            ],
            'stats' => $stats,
            'topMessageTypes' => $topMessageTypes,
        ]);
    }
}
