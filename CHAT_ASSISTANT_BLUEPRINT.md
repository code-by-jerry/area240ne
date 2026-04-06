# Admin-Driven Chat Assistant Blueprint

## Purpose

Build a chat assistant where the **content, structure, intents, and responses are managed from the admin panel**.

This means:

- no large hardcoded chat logic in `ChatService`
- no hardcoded service answers in PHP
- no hardcoded flow text in the frontend
- admins can create, edit, import, activate, and reorder chat data

The assistant should still be **rule-based and predictable**, but the business content should be fully dynamic.

---

## Main Goal

The assistant should do 4 jobs:

1. answer questions from approved knowledge
2. guide the user to the right service
3. collect lead details in a controlled way
4. allow admins to manage all assistant behavior from the backend

---

## Core Product Decision

This should be an **admin-managed knowledge + rule assistant**.

- `Knowledge` is dynamic content managed by admin
- `Rules` are the flow engine managed by system logic
- `Intent mapping` is dynamic and editable by admin
- `Responses` are dynamic templates managed by admin

So the product is:

- dynamic in content
- structured in behavior
- maintainable in admin

---

## What Should Be Dynamic

The following should be editable or importable from admin:

### 1. Welcome Content

- welcome title
- welcome body
- service buttons
- fallback opening text

### 2. Service Knowledge

For each service:

- name
- short summary
- description
- who it is for
- offerings
- process
- timeline note
- pricing note
- locations served
- CTA text
- FAQs

### 3. Intents

Admins should manage:

- intent name
- intent slug
- intent type
- match keywords
- sample phrases
- priority
- active/inactive status
- service mapping

### 4. Response Templates

Admins should manage:

- response type
- response title
- response body
- follow-up question
- quick replies
- highlight flag
- requires input flag

### 5. Qualification Flow

Admins should manage:

- which fields to collect for each service
- question text
- quick options
- field order
- required or optional

### 6. Global Settings

Admins should manage:

- fallback reply
- no-match reply
- escalation reply
- contact details
- active services
- chat assistant status

### 7. Importable Data

Admins should be able to import:

- intents
- FAQs
- service knowledge
- response templates
- qualification questions

Supported import formats:

- CSV
- JSON
- manual admin form entry

---

## Recommended High-Level Architecture

Keep the system split into two parts:

### Part A: Runtime Chat Engine

This is what runs when the user chats.

### Part B: Admin Chat CMS

This is what admins use to manage the assistant.

---

## Runtime Architecture

### 1. ChatController

Responsibility:

- accept frontend requests
- validate payload
- call chat engine
- return response JSON

This should stay thin.

### 2. ChatService

Responsibility:

- coordinate the chat flow
- load session
- save messages
- ask intent resolver what the user wants
- fetch content from repository
- build response

This should be orchestration only.

### 3. IntentResolver

Responsibility:

- detect user intent from admin-managed intent data

Input:

- user message
- current session state
- selected service

Output:

- resolved intent
- confidence
- related service

### 4. KnowledgeRepository

Responsibility:

- fetch dynamic content from database

Examples:

- service content
- FAQs
- response templates
- welcome message
- CTA content

### 5. QualificationManager

Responsibility:

- decide which lead field to ask next
- load question definitions from admin data
- save collected answers in session data

### 6. ResponseBuilder

Responsibility:

- create final frontend payload

It should return:

- `reply`
- `options`
- `type`
- `highlight`
- `requires_input`

---

## Admin Architecture

Create a dedicated group of admin modules for chat.

### Admin Chat Modules

Recommended modules:

1. `Chat Dashboard`
2. `Chat Settings`
3. `Chat Services`
4. `Chat Intents`
5. `Chat Knowledge Base`
6. `Chat Responses`
7. `Chat Qualification Flows`
8. `Chat Imports`
9. `Chat Testing Console`

---

## Admin Module Details

### 1. Chat Dashboard

Purpose:

- overall assistant status
- last updated content
- active intents count
- active services count
- quick links to manage data

Should show:

- assistant enabled/disabled
- active services
- total FAQs
- total intents
- total response templates

### 2. Chat Settings

Purpose:

- global assistant settings

Fields:

- assistant name
- welcome message
- fallback reply
- escalation reply
- no-result reply
- show service options on open
- lead capture enabled
- chat enabled/disabled

### 3. Chat Services

Purpose:

- manage service-specific knowledge

This can evolve from your current `ServiceConfigs` module.

Each service record should include:

- service name
- slug
- icon
- active status
- short summary
- full description
- locations served
- pricing note
- timeline note
- CTA
- qualification flow link

### 4. Chat Intents

Purpose:

- manage how user intent is detected

This can evolve from your current `Intents` module.

Each intent should include:

- name
- slug
- active status
- priority
- service mapping
- intent type
- keywords
- sample phrases
- response template mapping

### 5. Chat Knowledge Base

Purpose:

- manage FAQs and structured answers

Each knowledge item should include:

- title
- category
- service
- question patterns
- answer
- tags
- priority
- active status

Example categories:

- service_info
- pricing
- process
- locations
- materials
- FAQ
- contact

### 6. Chat Responses

Purpose:

- manage reusable response templates

Each response template should include:

- template name
- template type
- message body
- optional title
- quick replies
- highlight flag
- requires_input flag
- active status

Example response types:

- welcome
- fallback
- service_answer
- lead_prompt
- qualification
- summary
- escalation

### 7. Chat Qualification Flows

Purpose:

- manage lead question flow per service

Each flow should include:

- service
- stage order
- field key
- question text
- quick options
- required yes/no
- answer type

Example field keys:

- goal
- location
- budget
- timeline
- property_type
- area
- event_size
- contact_name
- contact_phone

### 8. Chat Imports

Purpose:

- bulk import data into assistant modules

Import targets:

- services
- intents
- knowledge items
- response templates
- qualification questions

Required features:

- preview before import
- validation summary
- skip invalid rows
- import log

### 9. Chat Testing Console

Purpose:

- allow admin to test the assistant without going to public chat

Features:

- type a test message
- inspect matched intent
- inspect matched service
- inspect selected template
- inspect next qualification step

This will save a lot of debugging time.

---

## Recommended Database Structure

Use clear tables instead of storing everything in one model.

### 1. `chat_settings`

Stores global assistant settings.

Suggested columns:

- `id`
- `assistant_name`
- `welcome_message`
- `fallback_message`
- `escalation_message`
- `chat_enabled`
- `lead_capture_enabled`
- `show_service_options`
- `created_at`
- `updated_at`

### 2. `chat_services`

Stores service-specific assistant content.

Suggested columns:

- `id`
- `name`
- `slug`
- `icon`
- `is_active`
- `short_summary`
- `description`
- `pricing_note`
- `timeline_note`
- `cta_text`
- `locations`
- `meta`
- `created_at`
- `updated_at`

Notes:

- `locations` can be JSON
- `meta` can hold future extensions

### 3. `chat_intents`

Stores dynamic intent definitions.

Suggested columns:

- `id`
- `name`
- `slug`
- `type`
- `service_id` nullable
- `priority`
- `keywords`
- `sample_phrases`
- `response_template_id` nullable
- `is_active`
- `created_at`
- `updated_at`

### 4. `chat_knowledge_items`

Stores FAQ and knowledge content.

Suggested columns:

- `id`
- `title`
- `category`
- `service_id` nullable
- `question_patterns`
- `answer`
- `tags`
- `priority`
- `is_active`
- `created_at`
- `updated_at`

### 5. `chat_response_templates`

Stores reusable messages.

Suggested columns:

- `id`
- `name`
- `slug`
- `type`
- `title`
- `body`
- `quick_replies`
- `highlight`
- `requires_input`
- `is_active`
- `created_at`
- `updated_at`

### 6. `chat_qualification_flows`

Stores question definitions for lead capture.

Suggested columns:

- `id`
- `service_id`
- `field_key`
- `question`
- `answer_type`
- `quick_options`
- `step_order`
- `is_required`
- `is_active`
- `created_at`
- `updated_at`

### 7. `chat_import_logs`

Stores import history.

Suggested columns:

- `id`
- `module`
- `file_name`
- `status`
- `total_rows`
- `success_rows`
- `failed_rows`
- `error_summary`
- `created_by`
- `created_at`

---

## Session Data Structure

Keep using:

- `chat_sessions`
- `chat_messages`

Store dynamic conversation state inside `chat_sessions.data`.

Suggested structure:

```php
[
    'service_id' => 1,
    'service_slug' => 'construction',
    'intent_slug' => 'lead_interest',
    'qualification' => [
        'goal' => 'Build a villa',
        'location' => 'Mysore',
        'budget' => '80 lakhs',
        'timeline' => null,
    ],
    'last_question_key' => 'timeline',
]
```

---

## Recommended Backend File Structure

```text
app/
  Http/
    Controllers/
      ChatController.php
      Admin/
        ChatSettingsController.php
        ChatServicesController.php
        ChatIntentsController.php
        ChatKnowledgeItemsController.php
        ChatResponseTemplatesController.php
        ChatQualificationFlowsController.php
        ChatImportsController.php

  Models/
    ChatSetting.php
    ChatServiceItem.php
    ChatIntent.php
    ChatKnowledgeItem.php
    ChatResponseTemplate.php
    ChatQualificationFlow.php
    ChatImportLog.php

  Services/
    Chat/
      ChatService.php
      IntentResolver.php
      KnowledgeRepository.php
      QualificationManager.php
      ResponseBuilder.php
      Import/
        ChatImportService.php
```

---

## Recommended Frontend Admin Pages

```text
resources/js/pages/Admin/
  ChatDashboard.tsx
  ChatSettings.tsx
  ChatServices.tsx
  ChatIntents.tsx
  ChatKnowledgeItems.tsx
  ChatResponseTemplates.tsx
  ChatQualificationFlows.tsx
  ChatImports.tsx
  ChatTester.tsx
```

You already have:

- `Admin/Intents.tsx`
- `Admin/ServiceConfigs.tsx`

These can either be:

- upgraded and reused
or
- replaced by cleaner `Chat*` modules

Recommendation:

- keep old modules temporarily
- build new `Chat*` modules cleanly
- migrate data later

---

## Runtime Flow

### Flow 1: First Load

1. create or load session
2. fetch active chat settings
3. fetch welcome response template
4. show service quick replies if enabled

### Flow 2: User Sends Message

1. save user message
2. resolve intent from active admin intents
3. resolve service if possible
4. fetch matching knowledge or response template
5. check if qualification should start
6. build reply
7. save bot message

### Flow 3: Qualification

1. find active flow for selected service
2. check which required field is missing
3. ask the next configured question
4. store answer in session data
5. continue until all required fields are complete

---

## Intent Resolution Logic

Use **dynamic DB-driven rules**, not hardcoded arrays.

### Matching Order

Recommended order:

1. exact quick reply match
2. exact intent keyword match
3. partial keyword match
4. question pattern match from knowledge item
5. fallback

### Important Rule

Use admin data to define intent matching, but keep the matching engine in code.

Meaning:

- admin controls the data
- system controls how matching works

This is the safest design.

---

## Response Strategy

Responses should also come from admin data.

### Example

If intent = `pricing_question` and service = `construction`

System should:

1. get pricing note from `chat_services`
2. get response template for `pricing_question`
3. inject service-specific content into template

Example output:

```text
Construction pricing depends on built-up area, scope, materials, and finish level.

If you share your location, approximate budget, and timeline, I can guide you to the next step.
```

---

## Import Design

The import module should support:

### Supported File Types

- CSV
- JSON

### Import Workflow

1. upload file
2. choose target module
3. preview parsed rows
4. validate rows
5. show errors and warnings
6. confirm import
7. save import log

### Import Targets

- services
- intents
- knowledge items
- response templates
- qualification flows

---

## Recommended API Response Shape

Use a response structure that supports better frontend rendering.

```json
{
  "reply": "string",
  "options": ["optional", "array"],
  "type": "welcome|answer|qualification|fallback|summary",
  "highlight": false,
  "requires_input": false,
  "session_id": "uuid",
  "meta": {
    "intent": "pricing_question",
    "service": "construction"
  }
}
```

Recommended additions:

- `type`
- `meta.intent`
- `meta.service`

This will make the frontend much cleaner.

---

## Admin Permissions

Not every admin should edit everything.

Recommended roles:

### 1. Super Admin

- full access
- can publish changes
- can import
- can edit settings

### 2. Content Admin

- can edit services
- can edit knowledge items
- can edit response templates

### 3. Operations Admin

- can view chat logs
- can test flows
- can update qualification steps

---

## Versioning and Safety

Because chat content affects live user experience, add simple version control.

Recommended:

- `draft` and `published` status for admin content
- publish button for going live
- last updated by
- last updated at

This is especially useful for:

- welcome message
- pricing content
- qualification flow
- FAQs

---

## Migration Strategy From Current System

You already have:

- `Intents`
- `ServiceConfigs`
- `ChatSession`
- `ChatMessage`

Recommended migration:

### Step 1

Keep `ChatSession` and `ChatMessage` as-is.

### Step 2

Reuse existing `Intents` and `ServiceConfigs` data where possible.

### Step 3

Create new normalized tables:

- `chat_settings`
- `chat_knowledge_items`
- `chat_response_templates`
- `chat_qualification_flows`
- `chat_import_logs`

### Step 4

Refactor `ChatService` to use repository + resolver + builder pattern.

### Step 5

Add dedicated admin pages for chat modules.

---

## Suggested Implementation Phases

### Phase 1: Data Model

Build tables and models for:

- chat settings
- chat knowledge items
- chat response templates
- chat qualification flows

### Phase 2: Admin Modules

Build admin pages for:

- chat settings
- chat services
- chat intents
- chat knowledge items
- chat response templates

### Phase 3: Runtime Engine

Refactor runtime chat into:

- `ChatService`
- `IntentResolver`
- `KnowledgeRepository`
- `QualificationManager`
- `ResponseBuilder`

### Phase 4: Import System

Build:

- upload
- preview
- validation
- import logs

### Phase 5: Testing Tools

Build:

- admin chat tester
- intent inspection
- response preview

---

## What The Final System Should Feel Like

For developers:

- clean
- readable
- modular
- easy to maintain

For admins:

- easy to edit
- easy to import
- easy to test

For users:

- short answers
- clear guidance
- helpful follow-up questions
- smooth lead capture

---

## Final Recommendation

Do not keep the assistant content in code.

Build the chat system like a small CMS:

- content from admin
- structure from admin
- intent data from admin
- qualification flow from admin
- import support from admin
- runtime engine in code

That is the right long-term structure for this project.

---

## Best Next Step

The next implementation step should be:

1. design the new chat database tables
2. create the admin module list and routes
3. refactor `ChatService` into an engine that reads only from database-backed admin content

If you want, I can do the next step now and create a second file:

- `CHAT_ASSISTANT_DB_SCHEMA.md`

with the exact table-by-table schema, relationships, and migration plan.
