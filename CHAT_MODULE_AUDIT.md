# Chat Module & Sessions — Audit Report

## 1. Session handling

### 1.1 ChatWidget — Critical

| Issue | Severity | Detail |
|------|----------|--------|
| **No `session_id` sent or stored** | High | Widget POSTs only `{ message }`. Backend creates a new session when `session_id` is missing. Every message from the widget starts or continues a different conversation: first message creates session A; second message sends no `session_id` → backend creates session B. Result: **no continuous thread in the widget**, and many one-message sessions for guests. |
| **Hardcoded first message** | Low | Initial state is a static bot message instead of calling the backend once to get the real intro and `session_id`. |

**Fix:** In ChatWidget, keep `session_id` in state (and optionally in `sessionStorage`). After first POST, set `session_id` from response and send it on every later POST.

---

### 1.2 ChatApp — Session flow

| Item | Status | Note |
|------|--------|------|
| Sends `session_id` | OK | Uses `sessionId` from response and sends it on every message. |
| New chat | OK | `startNewChat()` clears `sessionId`, clears messages, calls `fetchBotResponse('', null)`. |
| Load session | OK | `loadSession(id)` fetches session + messages and sets `sessionId`. |
| Duplicate bot message | OK | Dedupes when last message is same bot reply. |

---

### 1.3 getHistory cleanup vs intro session

| Issue | Severity | Detail |
|------|----------|--------|
| **Intro session deleted for logged-in users** | Medium | On ChatApp load, `fetchBotResponse('', null)` creates a session with one bot message (intro) and no user message. `getHistory()` runs and deletes all sessions where `user_id = auth()->id()` and count of user messages &lt; 1. So the **intro session is deleted** right after creation. Frontend still has its `session_id` in state; on first real message the backend does `find($sessionId)`, gets null, and creates a **new** session. Outcome: extra DB churn and a “stale” session id in state until first send. |

**Fix options:**  
- Don’t delete sessions with 0 user messages if they have exactly 1 bot message and were created in the last N minutes; or  
- Don’t run the “empty session” cleanup on the same request that might have just created the intro session; or  
- Omit cleanup for sessions created in the last 1–2 minutes.

---

## 2. Security

### 2.1 Guest session access

| Issue | Severity | Detail |
|------|----------|--------|
| **Any guest can load/delete any guest session** | Medium | `loadSession($id)` and `deleteSession($id)` only enforce: `if ($session->user_id && $session->user_id !== auth()->id()) abort(403)`. For **guest sessions** (`user_id` is null), this is false, so any unauthenticated user can load or delete any guest session by UUID. Risk: enumeration or abuse if UUIDs are guessable or leaked. |

**Fix:** For guest sessions, either:  
- Require the session to be “owned” by the current guest (e.g. store session id in cookie/session and only allow that), or  
- Return 403 for guest access to load/delete unless the request is “own” session (e.g. same cookie/session store).

### 2.2 Authenticated session access

| Item | Status |
|------|--------|
| sendMessage | OK — ChatService checks session ownership when `session_id` is provided. |
| getHistory | OK — Only sessions for `auth()->id()`. |
| loadSession / deleteSession | OK for owned sessions; guest sessions as above. |

### 2.3 CSRF

Web routes use Laravel’s default web stack; POST `/chat` is protected by CSRF. Axios/Inertia on same origin with cookies will send the token. No change needed.

---

## 3. Backend logic

### 3.1 ChatService::handle()

| Item | Status | Note |
|------|--------|------|
| Empty `$userMessage` | OK | No user message row created; bot reply still saved. Session has only intro bot message → later deleted by getHistory for logged-in users (see above). |
| Invalid / missing `session_id` | OK | `find()` returns null → new session created. |
| Ownership check | OK | If session has `user_id`, must match `auth()->id()`. |

### 3.2 Data consistency

| Item | Status | Note |
|------|--------|------|
| `chat_sessions.lead_id` | No FK | Migration adds `lead_id` without `constrained()`. Orphan or invalid ids possible if leads are deleted elsewhere. Low risk if only ChatService sets it. |
| Messages cascade | OK | `chat_messages.session_id` has FK to `chat_sessions` with `onDelete('cascade')`. |

---

## 4. UX / behaviour

| Issue | Severity | Detail |
|------|----------|--------|
| **Session title always "New Chat"** | Low | `title` is set once on create and never updated. History list is less useful. |
| **Widget: no quick-reply options** | Medium | Bot can return `options` (buttons); ChatApp shows them, ChatWidget does not. |
| **Widget: no link/bold parsing** | Low | Long intro and brand links show as plain text. |
| **Errors shown raw in UI** | Low | Controller returns 200 with `reply: "Error: ..."`. User sees stack trace or technical message. |

---

## 5. Summary

| Priority | Issue | Action |
|----------|--------|--------|
| P0 | Widget never sends/stores `session_id` | Add session state (and optional sessionStorage); send `session_id` after first reply. |
| P1 | getHistory deletes intro session for logged-in user | Relax cleanup (e.g. keep sessions with 0 user messages if they have 1 bot message and are very recent). |
| P1 | Guest sessions loadable/deletable by anyone | Restrict load/delete to “owner” (e.g. same session cookie or 403 for guest-on-guest). |
| P2 | Widget: no options, no link parsing | Add option buttons and reuse ChatApp-style parsing in widget. |
| P2 | Session title never updated | Set/update `title` when service is confirmed (e.g. “Interiors – Bangalore”). |
| P3 | `lead_id` no FK | Optional: add FK to `leads.id` and handle lead delete (null out or restrict). |
| P3 | Error response in UI | Return 5xx or a generic message and optional `error_details` for logs. |

---

## 6. Files to change (by priority)

1. **ChatWidget.tsx** — Session state, send `session_id`, optional: options + link parsing.  
2. **ChatController.php** — getHistory: adjust empty-session cleanup; loadSession/deleteSession: guest ownership or 403.  
3. **ChatService.php** — Optional: set/update `title` when entering SERVICE_CONFIRMATION or LEAD_QUALIFICATION.  
4. **ChatController.php** — sendMessage: error response (status code + safe message).
