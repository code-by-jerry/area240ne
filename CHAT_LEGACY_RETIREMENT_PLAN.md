# Chat Legacy Retirement Plan

## Current status

The live chat assistant now runs fully on the new admin-managed modules:

- `chat_settings`
- `chat_services`
- `chat_intents`
- `chat_knowledge_items`
- `chat_response_templates`
- `chat_qualification_flows`
- `chat_import_logs`
- `chat_sessions`
- `chat_messages`

The old app-level intent and service-config workflow has been removed from runtime, admin pages, imports, and seeders.

## What is intentionally still present

Some old database migrations are still in the repo as historical migration records.

These include migrations for tables such as:

- `intents`
- `responses`
- `intent_conversions`
- `keyword_searches`
- `service_configs`

They are not used by the current runtime anymore.

## Why they were not deleted

Old migrations are part of Laravel migration history. Removing them from the repo can create environment drift and can break setup for anyone rebuilding the project from scratch.

For safety, the app code was cleaned first, and database retirement is left as a deliberate operational step.

## Safe retirement sequence

1. Run the new system in staging and confirm all chat flows work only through the `chat_*` modules.
2. Take a database backup.
3. Inspect production data in the legacy tables and confirm nothing business-critical still depends on them.
4. Create a dedicated cleanup migration to drop only the confirmed-unused legacy tables.
5. Apply that cleanup migration only after sign-off.

## Recommended legacy tables to review for drop

- `intents`
- `responses`
- `intent_conversions`
- `keyword_searches`
- `service_configs`

## Recommended rule

Do not delete historical migrations retroactively.

If we want to remove legacy tables from actual databases, do it with a new forward migration such as:

- `drop_legacy_chat_tables`

That keeps the migration chain standard and safe.

## Implemented in code

A forward cleanup migration has now been added:

- `database/migrations/2026_04_04_160600_drop_legacy_chat_tables.php`

It drops these old unused tables if they still exist:

- `responses`
- `keyword_searches`
- `intent_conversions`
- `service_configs`
- `intents`

This migration does not touch the new `chat_*` tables, chat sessions, chat messages, or lead records.
