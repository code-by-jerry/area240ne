# Chat Module — Analysis & Completion Plan

## 1. Overview

The chat module is a **conversational lead-qualification bot** for Area24ONE. It routes users by intent (Construction, Interiors, Real Estate, Event, Land Development), confirms service, collects Q1/Q2/Q3 + location + name + phone, creates a **Lead**, then continues in **COMPLETE** with contextual answers (IntentMatcher, Construction packages).

- **Backend:** Laravel — `ChatController`, `ChatService`, `ChatSession`, `ChatMessage`, `Lead`, `Intent`, `IntentMatcher`, `ConstructionPackageService`.
- **Frontend:** Inertia + React — full-page **ChatApp** (`/chat`) and floating **ChatWidget** (in app-layout).
- **Auth:** Optional. Guests can chat; `user_id` on session is nullable. History/load/delete are for logged-in users only.

---

## 2. Backend

### 2.1 Models

| Model         | File                    | Purpose |
|---------------|-------------------------|---------|
| **ChatSession** | `app/Models/ChatSession.php` | UUID, `state`, `data` (JSON), `user_id`, `lead_id`, `title`. Relations: `messages()`, `user()`, `lead()`. |
| **ChatMessage** | `app/Models/ChatMessage.php` | `session_id`, `sender` (user/bot), `message` (text), `options` (JSON nullable). |
| **Lead**        | `app/Models/Lead.php`       | `name`, `phone`, `email`, `service`, `message`, `location`, `q1_answer`, `q2_answer`, `q3_answer`, + conversion fields. |
| **Intent**      | `app/Models/Intent.php`     | Keyword-based intents: `keywords` (array), `service_vertical`, `intent_slug`, `response_text`, `redirect_url`, etc. `findBestMatch()`, `getFormattedResponse()`. |

### 2.2 Migrations (chat)

- `create_chat_sessions_table`: uuid, state, data (json).
- `add_user_id_to_chat_sessions_table`: user_id (nullable FK), title.
- `add_lead_id_to_chat_sessions_table`: lead_id (nullable).
- `create_chat_messages_table`: session_id (FK), sender, message, options (json).

### 2.3 ChatController

| Method        | Route / Method | Purpose |
|---------------|----------------|---------|
| `sendMessage` | `POST /chat`   | Body: `message`, `session_id` (optional). Returns `reply`, `options`, `highlight`, `requires_input`, `session_id`. |
| `getHistory`  | `GET /chat/history` | Auth required. Returns list of sessions (id, title, updated_at). Cleans empty sessions (no user messages). |
| `loadSession` | `GET /chat/session/{id}` | Auth check: only own session. Returns session + messages. |
| `deleteSession` | `DELETE /chat/session/{id}` | Auth check; deletes session. |

### 2.4 ChatService — State Machine

**States:** `INIT` → `INTENT_DETECTION` → `SERVICE_CONFIRMATION` / `SERVICE_SELECTION` → `LEAD_QUALIFICATION` → `COMPLETE`.

| State                 | Trigger / Logic |
|-----------------------|------------------|
| **INIT**              | New session. If user message has HIGH service intent → go to SERVICE_CONFIRMATION; else show intro → INTENT_DETECTION. |
| **INTENT_DETECTION**  | Greeting → show service options. Keyword match → SERVICE_CONFIRMATION or SERVICE_SELECTION (menu). |
| **SERVICE_CONFIRMATION** | "Is that correct?" Yes → LEAD_QUALIFICATION with brand response + Q1. No / different service → SERVICE_SELECTION or re-confirm. |
| **SERVICE_SELECTION**  | User picks from 5 services (buttons or text) → SERVICE_CONFIRMATION. |
| **LEAD_QUALIFICATION** | Q1 → Q2 → Q3 → location → name → phone. "Other" opens custom input. Rejection/change service → back to SERVICE_SELECTION. |
| **COMPLETE**          | Lead created, session.lead_id set. Construction: pricing/package via `ConstructionPackageService`. All: `IntentMatcher->match()` for contextual replies. New service intent → SERVICE_CONFIRMATION. Greeting → friendly reply. Fallback → generic help. |

**Important:** User message and bot reply are both persisted in `ChatMessage` inside `handle()`.

### 2.5 Supporting Services

- **IntentMatcher** — `match($userInput, $serviceVertical)`: uses `Intent::findBestMatch()`; returns `found`, `response`, `redirect_url`, etc. Used in COMPLETE.
- **ConstructionPackageService** — Used in COMPLETE when service is Construction: pricing query, package details (e.g. ₹1849), comparison. **InteriorPackageService** exists but is **not** wired in ChatService COMPLETE.

---

## 3. Frontend

### 3.1 ChatApp (`/chat`)

- **Page:** `resources/js/pages/ChatApp.tsx`.
- **Route:** `GET /chat` → Inertia render `ChatApp`.
- **Features:**
  - Sidebar: New chat, history (if auth), session list, delete session, user block or “Back to Home”.
  - Main: Message list, bot options as buttons, loading indicator, input + send.
  - Parses bot text: URLs as links, `**bold**` supported (`parseTextWithLinks`).
  - Highlight/requires_input styling for name/phone prompts.
  - Sends `session_id` with every message after first reply; stores `session_id` from response.
  - Initial load: if auth, fetch history; then `fetchBotResponse('', null)` to start new session and show intro.

### 3.2 ChatWidget

- **Component:** `resources/js/components/ChatWidget.tsx`.
- **Used in:** `resources/js/layouts/app-layout.tsx` (app-sidebar layout).
- **Behavior:** Floating button; open/close; messages + input; POST `/chat` with `message` only.
- **Gap:** Does **not** send or store `session_id`. So every widget message without a prior stored session creates a **new** session on the backend. Conversation in widget is effectively “one-shot” until the user leaves the page (no continuity, no history in widget).

### 3.3 Entry points

- **Full chat UI:** Links to `/chat` from welcome and elsewhere (e.g. “Start chat”, CTA).
- **Widget:** Shown on any page that uses `app-layout` (e.g. dashboard/settings if that layout is used). Welcome uses its own layout — confirm whether welcome includes ChatWidget or only link to `/chat`.

---

## 4. Implemented Features

- Session create/update with state machine.
- Intent detection (greeting, 5 services, location keywords).
- Service confirmation (Yes/No) before qualification.
- Lead qualification: Q1/Q2/Q3 + location + name + phone, with “Other” and custom input.
- Lead creation and linking to session (`lead_id`).
- Optional auth: guest chat; history/load/delete for logged-in users only.
- ChatApp: history, load session, delete session, new chat, options as buttons, link + bold parsing.
- COMPLETE state: Construction pricing/packages, IntentMatcher for all services, “new service” and greeting handling.
- Security: session access checked by `user_id` where applicable.

---

## 5. Gaps & Completion Checklist (for today)

### 5.1 Must-fix

| # | Item | Detail |
|---|------|--------|
| 1 | **ChatWidget session persistence** | Widget never sends `session_id`. Backend always creates new session when `session_id` is missing. **Fix:** In ChatWidget, store `session_id` in state (and optionally in sessionStorage keyed by e.g. `area24_chat_session`); send it in every POST after first reply. |
| 2 | **ChatWidget UX parity** | Widget does not show `options` (quick-reply buttons) or `highlight`/`requires_input`. **Fix:** Add optional `options` and render as buttons; optionally style highlight/requires_input so name/phone prompts are clear. |
| 3 | **ChatWidget link/bold parsing** | Widget shows raw bot text (no URL links, no bold). **Fix:** Reuse or mirror `parseTextWithLinks` logic in ChatWidget for bot messages. |

### 5.2 Should-do (today if time)

| # | Item | Detail |
|---|------|--------|
| 4 | **Interiors pricing in COMPLETE** | Wire `InteriorPackageService` in ChatService COMPLETE (similar to Construction) when service is Interiors and user asks pricing/packages. |
| 5 | **Tests** | `tests/ChatFlowTest.php` expects old states (e.g. Interiors_Q1, LEAD_CAPTURE). Update tests to current states: INIT, INTENT_DETECTION, SERVICE_CONFIRMATION, SERVICE_SELECTION, LEAD_QUALIFICATION, COMPLETE. |
| 6 | **Error handling in UI** | ChatController returns 200 with `reply: "Error: ..."` on exception. ChatApp/ChatWidget could show a subtle “Something went wrong” and optionally retry, instead of showing raw error message. |

### 5.3 Nice-to-have

- Session title: update when service is confirmed (e.g. “Interiors – Bangalore”) so history is meaningful.
- Rate limiting on `POST /chat` for guests.
- Optional: store `session_id` in cookie for widget so it survives refresh (same session).

---

## 6. File Reference

| Layer   | Files |
|---------|--------|
| **Routes** | `routes/web.php` — POST /chat, GET /chat/history, GET/DELETE /chat/session/{id}, GET /chat (Inertia). |
| **Controller** | `app/Http/Controllers/ChatController.php` |
| **Service** | `app/Services/ChatService.php` |
| **Models** | `app/Models/ChatSession.php`, `ChatMessage.php`, `Lead.php`, `Intent.php` |
| **Support** | `app/Services/IntentMatcher.php`, `ConstructionPackageService.php`, `InteriorPackageService.php` (not wired in chat) |
| **Frontend** | `resources/js/pages/ChatApp.tsx`, `resources/js/components/ChatWidget.tsx`, `resources/js/layouts/app-layout.tsx` |
| **Tests** | `tests/ChatFlowTest.php`, `tests/DatasetDrivenChatTest.php`, `tests/EventManagementFlowTest.php` |

---

## 7. Quick Verification

1. **New session:** Open `/chat`, send nothing or "Hi" → intro and service options.
2. **Flow:** Pick service → confirm → Q1 → Q2 → Q3 → location → name → phone → Lead created, COMPLETE.
3. **COMPLETE:** Ask “construction pricing” or “₹1849 package” → ConstructionPackageService response.
4. **History:** Log in, complete flow or have multiple sessions → sidebar shows list; load/delete work.
5. **Widget:** Use widget on a page that has it → confirm session_id fix: second message should continue same session (same conversation).

Once widget session persistence, options, and parsing are done, the chat module is feature-complete for today’s scope; Interiors pricing and test updates can follow in the same day if time allows.
