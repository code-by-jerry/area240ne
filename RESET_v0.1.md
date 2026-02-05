# 🔄 CHAT WORKFLOW - RESET v0.1

## ✅ Reset Complete - Starting from ZERO

**Status**: Workflow fully reset to minimal greeting only.

---

## 📍 Files Involved in Real-Time Conversation Storage

### 1. **ChatService.php** (Core Logic)

- **Location**: `app/Services/ChatService.php`
- **Size**: Now just 96 lines (was 282 lines)
- **Purpose**: Handles all chat workflow and state management
- **Current States**:
    - `INIT` → Show greeting "Hello! 👋 May I assist you?"
    - `GREETING` → Echo back message (placeholder for next phase)

### 2. **ChatSession Model** (Session Storage)

- **Location**: `app/Models/ChatSession.php`
- **Database Table**: `chat_sessions`
- **Stores**:
    - Session ID
    - User ID
    - Current state (`INIT`, `GREETING`, etc.)
    - Session title
    - Session data (JSON)
    - Created/Updated timestamps

### 3. **ChatMessage Model** (Message Storage)

- **Location**: `app/Models/ChatMessage.php`
- **Database Table**: `chat_messages`
- **Stores**:
    - Message content
    - Sender (`user` or `bot`)
    - Session relationship
    - Created/Updated timestamps

### 4. **ChatApp.tsx** (Frontend)

- **Location**: `resources/js/pages/ChatApp.tsx`
- **Purpose**: React component that displays chat UI
- **Behavior**: Sends user messages to API, displays bot responses

### 5. **API Endpoint** (Request Handler)

- **Location**: `routes/api.php`
- **Endpoint**: `/api/chat` (POST)
- **Flow**: Frontend → API → ChatService → Database → Response

---

## 🔄 Chat Flow Architecture

```
User Types Message
       ↓
ChatApp.tsx (Frontend)
       ↓
POST /api/chat (API Route)
       ↓
ChatService.php (Logic)
       ↓
ChatSession Model (Save state)
       ↓
ChatMessage Model (Save messages)
       ↓
Response back to Frontend
       ↓
Display on ChatApp.tsx
```

---

## 📊 Current State Machine (v0.1)

```
START
  ↓
INIT
  ↓ (Greeting shown: "Hello! 👋 May I assist you?")
GREETING
  ↓ (Wait for user response)
[Ready for next phase]
```

---

## 💾 How Conversations Are Stored in Real-Time

1. **User sends message**:
    - ChatApp.tsx sends POST request to `/api/chat`
    - Includes `sessionId` and `userMessage`

2. **ChatService receives**:
    - Gets or creates `ChatSession`
    - Saves **user message** to `ChatMessage` table
    - Processes state and generates response
    - Saves **bot response** to `ChatMessage` table

3. **Database stores**:
    - `chat_sessions` - Session metadata and state
    - `chat_messages` - All individual messages with sender type

4. **Response sent back**:
    - Returns `session_id` and `reply` to frontend
    - Frontend updates UI with new messages

---

## 🚀 Next Steps (Ready to Build)

### Phase 1: Add Custom Questions

Modify the `processState()` method in ChatService.php to add your own flow.

### Phase 2: Add Dynamic Responses

Create new states for collecting specific information.

### Phase 3: Add Form/Options

Return `options` array in response to show buttons.

### Phase 4: Data Collection

Store collected data in `ChatSession.data` JSON field.

---

## 📝 Example: Adding Next State

```php
// In processState() method:
if ($state === 'GREETING') {
    // After user responds, move to next state
    $this->session->update(['state' => 'YOUR_NEXT_STATE']);
    return ['text' => 'Your next question here?'];
}
```

---

## 🔧 Database Tables Used

### chat_sessions

```sql
id (primary key)
user_id (relationship to users)
state (current state: INIT, GREETING, etc.)
title (session title)
data (JSON field for storing any data)
created_at
updated_at
```

### chat_messages

```sql
id (primary key)
session_id (foreign key to chat_sessions)
sender (user or bot)
message (text content)
options (JSON array - optional)
created_at
updated_at
```

---

## ✨ System Status

- **ChatService.php**: ✅ Reset to v0.1 (96 lines)
- **Database Models**: ✅ Ready (ChatSession, ChatMessage)
- **Frontend**: ✅ Ready (ChatApp.tsx)
- **API**: ✅ Ready
- **Current Greeting**: ✅ "Hello! 👋 May I assist you?"

---

## 🎯 You are now ready to build the chat flow from scratch!

Start by modifying the `processState()` method in ChatService.php to add your desired workflow.
