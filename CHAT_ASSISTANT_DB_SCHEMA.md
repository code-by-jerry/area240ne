# Chat Assistant DB Schema

## Purpose

This document defines the database structure for the new **admin-driven chat assistant**.

The goal is:

- all chat content should come from admin-managed data
- chat runtime logic should stay small
- data should be structured enough for dynamic rendering, matching, and qualification

This schema is designed for the current Laravel project and takes into account what already exists:

- `chat_sessions`
- `chat_messages`
- `intents`
- `service_configs`

---

## Design Principle

Split the chat system into 3 layers of data:

1. `Runtime data`
- sessions
- messages
- collected lead info

2. `Admin content data`
- welcome content
- services
- intents
- knowledge items
- response templates
- qualification questions

3. `Admin operations data`
- imports
- publishing
- audit / update tracking

---

## Existing Tables To Keep

These tables should stay:

### `chat_sessions`

Use for:

- current conversation state
- user ownership
- title
- session data JSON

Keep and extend if needed.

### `chat_messages`

Use for:

- user messages
- bot messages
- response history

Keep and extend if needed.

---

## Existing Tables To Reuse Carefully

### `service_configs`

This already stores a lot of service-level content.

Short-term:

- reuse it during migration

Long-term:

- either evolve it into `chat_services`
- or replace it with a cleaner chat-specific table

### `intents`

This already stores intent-like logic.

Short-term:

- reuse the data if possible

Long-term:

- either evolve it
- or replace it with `chat_intents`

Recommendation:

- keep old tables alive during migration
- move runtime to new chat tables gradually

---

## Recommended New Tables

These are the main tables for the new assistant.

### 1. `chat_settings`

Stores global assistant settings.

#### Purpose

- global welcome message
- fallback messages
- assistant status
- feature flags

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| assistant_name | string | display name |
| welcome_title | string nullable | optional title |
| welcome_message | text | main intro text |
| fallback_message | text | reply when no intent matches |
| escalation_message | text nullable | when handoff needed |
| no_result_message | text nullable | when no KB match exists |
| chat_enabled | boolean | allow/disable chat |
| lead_capture_enabled | boolean | qualification on/off |
| show_service_options | boolean | show quick replies on open |
| default_response_type | string nullable | optional default UI type |
| published_at | timestamp nullable | draft/publish support |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Notes

- keep only one active row, or support versioning with one published row

---

### 2. `chat_services`

Stores service-specific knowledge and metadata.

#### Purpose

- dynamic service cards/options
- service descriptions
- pricing note
- timeline note
- service CTA

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| name | string | display name |
| slug | string unique | `construction`, `interiors`, etc |
| icon | string nullable | icon or asset reference |
| is_active | boolean | service enabled in chat |
| short_summary | text nullable | short answer |
| description | longText nullable | full description |
| who_its_for | json nullable | list of use cases |
| offerings | json nullable | list of services |
| pricing_note | text nullable | pricing explanation |
| timeline_note | text nullable | process/timeline note |
| cta_text | string nullable | next step text |
| locations | json nullable | served cities/regions |
| sort_order | integer default 0 | admin ordering |
| meta | json nullable | future-proof field |
| published_at | timestamp nullable | optional |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Notes

- this can replace most of the chat-related content currently living inside `service_configs`

---

### 3. `chat_intents`

Stores dynamic intent definitions.

#### Purpose

- detect what the user wants
- map user input to response behavior

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| name | string | admin label |
| slug | string unique | `pricing_question`, `lead_interest` |
| type | string | intent type |
| service_id | foreignId nullable | optional service-specific intent |
| category | string nullable | grouping |
| keywords | json nullable | keyword list |
| sample_phrases | json nullable | example user phrases |
| response_template_id | foreignId nullable | default response |
| priority | integer default 0 | higher first |
| is_active | boolean | active/inactive |
| pauses_flow | boolean default false | optional flow control |
| triggers_qualification | boolean default false | lead capture hint |
| redirect_url | string nullable | optional |
| meta | json nullable | future rule config |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Notes

- `keywords` and `sample_phrases` should both be editable from admin
- actual matching logic stays in code

---

### 4. `chat_knowledge_items`

Stores FAQs and structured knowledge content.

#### Purpose

- answer user questions dynamically
- support service-specific FAQs
- support global FAQs

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| title | string | admin label |
| slug | string nullable | optional unique key |
| category | string | `faq`, `pricing`, `process`, etc |
| service_id | foreignId nullable | optional service link |
| question_patterns | json nullable | phrases / patterns |
| answer | longText | answer body |
| short_answer | text nullable | optional shorter version |
| tags | json nullable | search tags |
| priority | integer default 0 | ranking |
| is_active | boolean | active/inactive |
| published_at | timestamp nullable | optional |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Recommended Categories

- `service_info`
- `pricing`
- `timeline`
- `process`
- `location`
- `faq`
- `contact`
- `portfolio`

---

### 5. `chat_response_templates`

Stores reusable bot messages.

#### Purpose

- dynamic welcome message type
- fallback message templates
- qualification prompts
- escalation replies

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| name | string | admin label |
| slug | string unique | template key |
| type | string | `welcome`, `fallback`, etc |
| title | string nullable | optional |
| body | longText | message body |
| quick_replies | json nullable | quick reply buttons |
| highlight | boolean default false | frontend rendering hint |
| requires_input | boolean default false | frontend hint |
| ui_variant | string nullable | optional UI style |
| is_active | boolean | active/inactive |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Recommended Types

- `welcome`
- `fallback`
- `service_answer`
- `pricing_answer`
- `timeline_answer`
- `qualification_prompt`
- `summary`
- `escalation`

---

### 6. `chat_qualification_flows`

Stores lead qualification question definitions.

#### Purpose

- dynamic question flow per service
- no hardcoded question sequence in code

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| service_id | foreignId | related service |
| field_key | string | `goal`, `location`, `budget`, etc |
| label | string nullable | admin label |
| question | text | question shown to user |
| answer_type | string | `text`, `number`, `option`, `phone`, etc |
| quick_options | json nullable | button options |
| step_order | integer | order within service |
| is_required | boolean | required or optional |
| is_active | boolean | active/inactive |
| validation_rules | json nullable | optional future validation |
| updated_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Example `field_key` values

- `goal`
- `property_type`
- `location`
- `budget`
- `timeline`
- `area`
- `event_size`
- `contact_name`
- `contact_phone`

---

### 7. `chat_import_logs`

Stores import history.

#### Purpose

- track CSV/JSON imports
- debugging and admin visibility

#### Fields

| Field | Type | Notes |
|---|---|---|
| id | bigint / uuid | primary key |
| module | string | target module |
| file_name | string | uploaded file name |
| file_type | string nullable | csv/json |
| status | string | success / partial / failed |
| total_rows | integer default 0 | |
| success_rows | integer default 0 | |
| failed_rows | integer default 0 | |
| error_summary | longText nullable | import errors |
| payload_snapshot | json nullable | optional import summary |
| created_by | foreignId nullable | admin user |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## Optional Supporting Tables

These are useful, but not mandatory for phase 1.

### 8. `chat_service_synonyms`

Use if service matching becomes more advanced.

Fields:

- id
- service_id
- phrase
- is_active

This can help map phrases like:

- `villa construction`
- `home building`
- `buy flat`
- `interior decor`

### 9. `chat_publish_logs`

Use if you want draft/publish history.

Fields:

- id
- module
- record_id
- action
- changed_by
- snapshot
- created_at

---

## Existing Table Upgrades

Some existing tables may need small changes.

### `chat_messages`

Current table is fine, but consider adding:

| Field | Type | Notes |
|---|---|---|
| type | string nullable | `welcome`, `answer`, `fallback` |
| meta | json nullable | service, intent, template info |

Why:

- cleaner frontend rendering
- easier debugging
- better analytics later

### `chat_sessions`

Current table is mostly fine, but ensure `data` is used for:

- selected service
- intent
- qualification answers
- last question key

Possible extra fields later:

| Field | Type | Notes |
|---|---|---|
| last_intent_slug | string nullable | optional |
| status | string nullable | open / qualified / escalated |

---

## Relationships

Recommended relationships:

### `chat_services`

- hasMany `chat_intents`
- hasMany `chat_knowledge_items`
- hasMany `chat_qualification_flows`

### `chat_response_templates`

- hasMany `chat_intents`

### `chat_sessions`

- hasMany `chat_messages`
- belongsTo `users`

### `chat_intents`

- belongsTo `chat_services` nullable
- belongsTo `chat_response_templates` nullable

### `chat_knowledge_items`

- belongsTo `chat_services` nullable

### `chat_qualification_flows`

- belongsTo `chat_services`

---

## Runtime Query Model

When the user sends a message, the runtime engine should roughly do this:

1. load active `chat_settings`
2. load session and messages
3. resolve service from `chat_services`
4. resolve intent from `chat_intents`
5. if needed, search `chat_knowledge_items`
6. if needed, get `chat_response_templates`
7. if lead capture is active, load next `chat_qualification_flows` step
8. save bot reply into `chat_messages`

This keeps runtime data-driven.

---

## Migration Plan

Use a phased migration, not a big-bang rewrite.

### Phase 1: Create New Tables

Create:

- `chat_settings`
- `chat_services`
- `chat_intents`
- `chat_knowledge_items`
- `chat_response_templates`
- `chat_qualification_flows`
- `chat_import_logs`

Do not delete old tables yet.

### Phase 2: Seed From Existing Data

Map old data into new tables:

- `service_configs` -> `chat_services`
- `intents` -> `chat_intents`
- old response content -> `chat_response_templates` where possible

### Phase 3: Refactor Runtime

Update runtime chat engine to read from new tables.

Keep old tables read-only during transition if needed.

### Phase 4: Build Admin UI

Build admin modules for:

- settings
- services
- intents
- knowledge items
- response templates
- qualification flows
- imports

### Phase 5: Deprecate Old Structure

Once runtime no longer depends on old tables:

- archive old tables
or
- migrate completely and remove old dependencies

---

## Suggested Naming Recommendation

To avoid confusion with old models:

- new chat content tables should use `chat_*`
- old generic tables like `intents` can remain temporarily

Recommended new model names:

- `ChatSetting`
- `ChatServiceItem`
- `ChatIntent`
- `ChatKnowledgeItem`
- `ChatResponseTemplate`
- `ChatQualificationFlow`
- `ChatImportLog`

This avoids collisions with old `Intent` and `ServiceConfig`.

---

## Admin UI Mapping To Tables

| Admin Module | Main Table |
|---|---|
| Chat Settings | `chat_settings` |
| Chat Services | `chat_services` |
| Chat Intents | `chat_intents` |
| Chat Knowledge Base | `chat_knowledge_items` |
| Chat Responses | `chat_response_templates` |
| Qualification Flows | `chat_qualification_flows` |
| Chat Imports | `chat_import_logs` |

---

## Recommended First Migrations To Build

Build in this order:

1. `create_chat_settings_table`
2. `create_chat_services_table`
3. `create_chat_response_templates_table`
4. `create_chat_intents_table`
5. `create_chat_knowledge_items_table`
6. `create_chat_qualification_flows_table`
7. `create_chat_import_logs_table`
8. `add_type_and_meta_to_chat_messages_table`

This order supports foreign keys cleanly.

---

## What Should Stay In Code

Not everything should move to admin.

These should remain in code:

- session creation logic
- message persistence
- intent matching algorithm
- qualification step engine
- API response shaping
- import parsing and validation

Important principle:

- `data` should be dynamic
- `execution engine` should stay in code

---

## Final Recommendation

The correct long-term schema is:

- keep runtime chat tables
- add dedicated admin-managed chat content tables
- migrate old `intents` and `service_configs` into the new structure
- keep matching and flow orchestration in code

That gives you:

- dynamic admin control
- import capability
- clear structure
- maintainable chat logic

---

## Best Next Step

The best implementation step after this document is:

1. create the first migration set for the new `chat_*` tables
2. add matching Eloquent models
3. build `Chat Settings` and `Chat Services` admin pages first

If you want, I can proceed next and generate the actual Laravel migration files and model classes for phase 1.
