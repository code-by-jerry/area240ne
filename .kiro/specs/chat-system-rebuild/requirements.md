# Requirements Document

## Introduction

Area24ONE is a Karnataka-based group operating across five verticals: Construction (Atha Construction Pvt. Ltd.), Interiors (Nesthetix Designs LLP), Real Estate (Area24 Developers / Area24 Realty), Events (Stage365), and Land Development (Area24 Developers – Land Division). The existing chat system uses a hardcoded state machine with service keywords, lead questions, and brand data embedded directly in PHP. This rebuild replaces that with a fully database-driven, admin-managed system featuring branching chat flows, a keyword-based intent/response bank, and structured lead capture — all configurable without code changes.

The existing ChatApp.tsx frontend and AdminMiddleware remain in place. The rebuild targets the backend data model, admin CRUD interfaces, and the chat engine that drives conversations.

---

## Glossary

- **Admin**: An authenticated user with `role = 'admin'`, granted access via AdminMiddleware.
- **Chat_Engine**: The Laravel service responsible for processing incoming user messages and producing bot responses.
- **Chat_Session**: A single conversation thread between a visitor and the Chat_Engine, identified by a UUID.
- **Chat_Message**: A single message within a Chat_Session, attributed to either the user or the bot.
- **Company_Profile**: A singleton admin-managed record storing Area24ONE's global brand details (name, logo URL, intro text, contact info, social links).
- **Service**: A top-level business vertical (Construction, Interiors, Real Estate, Event, Land Development) managed by the Admin.
- **Flow**: An ordered, branching graph of Flow_Nodes associated with a specific Service, defining the conversation path for that service.
- **Flow_Node**: A single step in a Flow. Has a type: `message`, `question`, or `condition`.
- **Flow_Node_Option**: A quick-reply button attached to a `question` Flow_Node, carrying a label and a pointer to the next Flow_Node.
- **Intent**: An admin-managed record pairing a set of keywords with a response text, optionally scoped to a Service.
- **Intent_Bank**: The full collection of Intents used for keyword-based fallback matching.
- **Lead**: A captured visitor record containing contact details and qualification answers, linked to a Chat_Session.
- **Lead_Capture_Node**: A special Flow_Node type that triggers the lead capture form sequence (name, phone, service, location, q1–q3).
- **Keyword_Match_Score**: A numeric confidence value (0.0–1.0) computed by the Chat_Engine when comparing user input against an Intent's keyword list.
- **Fallback_Response**: A generic bot reply returned when no Intent reaches the minimum Keyword_Match_Score threshold.
- **Session_State**: A JSON blob stored on Chat_Session tracking the visitor's current position in a Flow and any collected data.

---

## Requirements

### Requirement 1: Company Profile Management

**User Story:** As an Admin, I want to manage Area24ONE's company details in one place, so that the chat greeting, contact info, and social links stay current without touching code.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a Company Profile form with fields: company name, logo URL, intro/greeting text, primary phone (array), secondary phone (optional), email, website URL, Instagram URL, Facebook URL, LinkedIn URL, and a projects-completed count.
2. WHEN the Admin submits the Company Profile form with all required fields populated, THE Admin_Panel SHALL persist the record to the `company_profile` table and display a success confirmation.
3. IF the Admin submits the Company Profile form with the company name field empty, THEN THE Admin_Panel SHALL reject the submission and display a field-level validation error.
4. WHEN the Company Profile record is updated, THE Chat_Engine SHALL use the updated intro text for all new Chat_Sessions started after the update.
5. THE Company_Profile SHALL be a singleton record — THE Admin_Panel SHALL prevent creation of a second Company_Profile row and SHALL only expose an edit form.

---

### Requirement 2: Service Management

**User Story:** As an Admin, I want to create and manage the five business verticals as Services, so that each service has its own brand details, detection keywords, and chat flow.

#### Acceptance Criteria

1. THE Admin_Panel SHALL allow the Admin to create a Service with fields: name, description, icon/emoji, brand name, brand short name, website URL, Instagram URL, Facebook URL, LinkedIn URL, phone numbers (array), projects count, CEO name, CEO website, CEO experience, and detection keywords (array).
2. WHEN the Admin saves a Service with a duplicate name, THE Admin_Panel SHALL reject the submission and display an error stating the service name already exists.
3. THE Admin_Panel SHALL allow the Admin to edit any field of an existing Service and save changes.
4. WHEN a Service is deleted and one or more Flows reference that Service, THE Admin_Panel SHALL prevent deletion and display an error listing the dependent Flows.
5. THE Chat_Engine SHALL load Service detection keywords from the database and SHALL NOT use any hardcoded keyword arrays.
6. THE Admin_Panel SHALL display all Services in a list with name, icon, and an active/inactive toggle.
7. WHILE a Service is marked inactive, THE Chat_Engine SHALL exclude that Service from detection and SHALL NOT route visitors into its Flow.

---

### Requirement 3: Chat Flow Builder — Node Management

**User Story:** As an Admin, I want to build branching chat flows per service using a node-based editor, so that different visitor answers lead to different conversation paths.

#### Acceptance Criteria

1. THE Admin_Panel SHALL allow the Admin to create a Flow scoped to a specific Service, with a name and an optional description.
2. THE Admin_Panel SHALL allow the Admin to add Flow_Nodes of three types to a Flow: `message` (bot sends text), `question` (bot sends text + quick-reply options), and `lead_capture` (triggers lead collection sequence).
3. WHEN the Admin adds a `message` Flow_Node, THE Admin_Panel SHALL require a non-empty message text field and an optional pointer to the next Flow_Node.
4. WHEN the Admin adds a `question` Flow_Node, THE Admin_Panel SHALL require a non-empty question text field and at least two Flow_Node_Options, each with a label and a pointer to the next Flow_Node.
5. WHEN the Admin adds a `lead_capture` Flow_Node, THE Admin_Panel SHALL allow configuration of: which of the three qualification questions (q1, q2, q3) to ask, the question text for each enabled question, and the quick-reply options for each enabled question.
6. THE Admin_Panel SHALL allow the Admin to reorder Flow_Nodes within a Flow using drag-and-drop or explicit ordering controls.
7. THE Admin_Panel SHALL allow the Admin to delete a Flow_Node, and WHEN a deleted node is referenced as a next-node pointer by another node, THE Admin_Panel SHALL clear that pointer and display a warning.
8. THE Admin_Panel SHALL allow the Admin to set one Flow_Node as the entry point (start node) of the Flow.
9. IF the Admin attempts to save a Flow with no entry point defined, THEN THE Admin_Panel SHALL reject the save and display an error.
10. THE Admin_Panel SHALL allow the Admin to preview the Flow as a linear walkthrough of the happy path (entry node → first option of each question node → lead_capture).

---

### Requirement 4: Chat Flow Builder — Branching and Conditions

**User Story:** As an Admin, I want question nodes to branch to different next nodes based on the visitor's answer, so that the conversation adapts to what the visitor tells us.

#### Acceptance Criteria

1. WHEN the Admin configures a `question` Flow_Node, THE Admin_Panel SHALL allow each Flow_Node_Option to point to a different next Flow_Node (enabling branching).
2. THE Admin_Panel SHALL allow the Admin to create a `condition` Flow_Node that evaluates a stored session variable (e.g., a previously collected answer) against a set of string-match rules and routes to different next Flow_Nodes based on the match result.
3. WHEN the Admin configures a `condition` Flow_Node, THE Admin_Panel SHALL require: the session variable key to evaluate, at least one match rule (value → next node), and a default next node for unmatched cases.
4. THE Chat_Engine SHALL evaluate `condition` Flow_Nodes at runtime using the current Session_State data and SHALL route to the matching next Flow_Node.
5. IF a `condition` Flow_Node's evaluated variable is not present in Session_State, THEN THE Chat_Engine SHALL route to the default next node.
6. THE Chat_Engine SHALL support Flow graphs with up to 50 nodes without degradation in response time beyond 500ms per message.

---

### Requirement 5: Chat Engine — Session and Flow Execution

**User Story:** As a visitor, I want the chat to guide me through a relevant conversation based on my service interest, so that I get useful information and can connect with the right team.

#### Acceptance Criteria

1. WHEN a visitor opens the chat with an empty message, THE Chat_Engine SHALL create a new Chat_Session and respond with the Company_Profile intro text.
2. WHEN a visitor sends a message that matches a Service's detection keywords with a Keyword_Match_Score of 0.6 or above, THE Chat_Engine SHALL set the matched Service on the Session_State and enter that Service's Flow at its entry node.
3. WHEN multiple Services match the visitor's message, THE Chat_Engine SHALL select the Service whose keywords produce the highest aggregate Keyword_Match_Score.
4. IF no Service detection keyword matches the visitor's message with a score of 0.6 or above, THEN THE Chat_Engine SHALL present the visitor with a service selection menu listing all active Services.
5. WHILE a Chat_Session is executing a Flow, THE Chat_Engine SHALL advance through Flow_Nodes in the order defined by the Flow graph, following the branch selected by the visitor's answer.
6. WHEN the Chat_Engine reaches a `question` Flow_Node, THE Chat_Engine SHALL send the question text and the Flow_Node_Options as quick-reply buttons to the visitor.
7. WHEN the visitor selects a quick-reply option, THE Chat_Engine SHALL store the selected option label in Session_State under the key defined on the Flow_Node and advance to the next Flow_Node pointed to by that option.
8. WHEN the visitor types a free-text response to a `question` Flow_Node (instead of selecting a quick-reply), THE Chat_Engine SHALL store the typed text in Session_State and advance to the default next node of that question.
9. WHEN the Chat_Engine reaches a `message` Flow_Node, THE Chat_Engine SHALL send the message text and immediately advance to the next Flow_Node (or end the flow if no next node is set).
10. WHEN the Chat_Engine reaches the end of a Flow with no `lead_capture` node encountered, THE Chat_Engine SHALL present the visitor with a prompt to connect with the team and offer the lead capture sequence.

---

### Requirement 6: Intent Bank Management

**User Story:** As an Admin, I want to manage a bank of keyword-triggered Q&A responses, so that the chat can answer common questions even when the visitor is not following a structured flow.

#### Acceptance Criteria

1. THE Admin_Panel SHALL allow the Admin to create an Intent with fields: name, keywords (array of strings), response text, and an optional Service association (null = global).
2. THE Admin_Panel SHALL allow the Admin to edit and delete any Intent.
3. WHEN the Admin saves an Intent with an empty keywords array, THE Admin_Panel SHALL reject the submission and display a validation error.
4. WHEN the Admin saves an Intent with an empty response text, THE Admin_Panel SHALL reject the submission and display a validation error.
5. THE Admin_Panel SHALL display all Intents in a searchable, paginated list showing name, keyword count, associated service (or "Global"), and last-updated timestamp.
6. THE Admin_Panel SHALL allow the Admin to bulk-import Intents from a CSV file with columns: name, keywords (pipe-separated), response_text, service_name.
7. WHEN a CSV import row references a service_name that does not exist in the Services table, THE Admin_Panel SHALL skip that row and include it in an import error report shown after the import completes.

---

### Requirement 7: Chat Engine — Intent Matching Fallback

**User Story:** As a visitor, I want the chat to answer my off-flow questions using relevant responses from the knowledge base, so that I don't hit dead ends when I ask something unexpected.

#### Acceptance Criteria

1. WHEN a visitor sends a message that does not match the expected input for the current Flow_Node, THE Chat_Engine SHALL attempt Intent matching against the Intent_Bank before returning a Fallback_Response.
2. THE Chat_Engine SHALL compute a Keyword_Match_Score for each Intent by: assigning 1.0 for an exact match, 0.8 for a whole-word match, and 0.6 for a substring match between the visitor's message and any keyword in the Intent's keyword array.
3. WHEN multiple Intents match, THE Chat_Engine SHALL select the Intent with the highest Keyword_Match_Score and return its response text.
4. WHEN the current Session_State has an active Service, THE Chat_Engine SHALL prioritize Intents scoped to that Service over global Intents when Keyword_Match_Scores are equal.
5. IF no Intent reaches a Keyword_Match_Score of 0.6 or above, THEN THE Chat_Engine SHALL return the Fallback_Response configured in the Company_Profile (or a hardcoded default if none is set).
6. WHEN an Intent match is found, THE Chat_Engine SHALL resume the visitor's current Flow position after delivering the Intent response, rather than abandoning the flow.
7. THE Chat_Engine SHALL log each Intent match event with: session_id, intent_id, matched_keyword, score, and timestamp, to support analytics.

---

### Requirement 8: Lead Capture

**User Story:** As a visitor, I want to provide my contact details and project information in a natural chat sequence, so that the Area24ONE team can follow up with me.

#### Acceptance Criteria

1. WHEN the Chat_Engine reaches a `lead_capture` Flow_Node, THE Chat_Engine SHALL collect the following fields in sequence: name, phone, service (pre-filled from Session_State), location, q1_answer, q2_answer, q3_answer.
2. THE Chat_Engine SHALL present q1, q2, and q3 as configured on the `lead_capture` Flow_Node, including their question text and quick-reply options.
3. WHEN the visitor selects "Other" for any qualification question option, THE Chat_Engine SHALL prompt the visitor for free-text input and store that text as the answer.
4. WHEN the visitor selects "Other" for the location field, THE Chat_Engine SHALL prompt the visitor for free-text input and store that text as the location.
5. WHEN the Chat_Engine collects the phone field, THE Chat_Engine SHALL validate that the input contains 10 digits (after stripping spaces, dashes, and a leading +91 or 0 prefix). IF the phone number fails validation, THEN THE Chat_Engine SHALL re-prompt the visitor with an error message.
6. WHEN all required lead fields (name, phone, service) are collected, THE Chat_Engine SHALL create a Lead record in the database and link it to the current Chat_Session via `lead_id`.
7. WHEN a Lead is created, THE Chat_Engine SHALL respond with a confirmation message displaying the visitor's name, service, and location, and SHALL transition the Chat_Session state to `COMPLETE`.
8. IF the visitor abandons the chat after providing name and phone but before completing all qualification questions, THE Chat_Engine SHALL still persist a partial Lead record with the fields collected so far.
9. THE Admin_Panel SHALL display all Leads in a paginated list with columns: name, phone, service, location, q1–q3 answers, session link, and created timestamp.
10. THE Admin_Panel SHALL allow the Admin to export the Leads list as a CSV file.

---

### Requirement 9: Chat Session and Message Persistence

**User Story:** As a logged-in visitor, I want my chat history saved so I can return to previous conversations, and as an Admin I want full session logs for review.

#### Acceptance Criteria

1. THE Chat_Engine SHALL persist every Chat_Message (user and bot) to the `chat_messages` table with: session_id, sender (`user` or `bot`), message text, options (JSON array, nullable), and created_at timestamp.
2. THE Chat_Engine SHALL persist Session_State as a JSON blob on the `chat_sessions` table, updated after every message exchange.
3. WHEN a logged-in visitor starts a new chat, THE Chat_Engine SHALL associate the Chat_Session with the visitor's user_id.
4. WHEN a guest visitor starts a new chat, THE Chat_Engine SHALL create a Chat_Session with a null user_id and store the session UUID in the PHP session for ownership verification.
5. WHEN a logged-in visitor requests their chat history, THE Chat_Controller SHALL return all Chat_Sessions belonging to that user, ordered by updated_at descending, with id, title, and updated_at.
6. WHEN a visitor requests to load a specific Chat_Session, THE Chat_Controller SHALL verify ownership (user_id match for authenticated users, session array match for guests) and return all Chat_Messages ordered by created_at ascending. IF ownership verification fails, THEN THE Chat_Controller SHALL return HTTP 403.
7. WHEN a visitor deletes a Chat_Session, THE Chat_Controller SHALL verify ownership and permanently delete the session and all associated Chat_Messages. IF ownership verification fails, THEN THE Chat_Controller SHALL return HTTP 403.
8. THE Chat_Engine SHALL auto-generate a Chat_Session title from the first user message (truncated to 60 characters) and update it when the Service is identified (format: "{Service} – {Location}").
9. THE Admin_Panel SHALL allow the Admin to view all Chat_Sessions with filters for: date range, service, lead captured (yes/no), and user (guest vs. authenticated).

---

### Requirement 10: Admin Panel — Access Control and Navigation

**User Story:** As an Admin, I want a secure, unified admin panel to manage all chat system components, so that I can configure the system without developer involvement.

#### Acceptance Criteria

1. THE Admin_Panel SHALL be accessible only to users whose `role` field equals `admin`, enforced by AdminMiddleware on all admin routes.
2. IF a non-admin authenticated user attempts to access an admin route, THEN THE Admin_Panel SHALL redirect the user to `/chat`.
3. THE Admin_Panel SHALL provide navigation to the following sections: Company Profile, Services, Chat Flows, Intent Bank, Leads, and Chat Sessions.
4. THE Admin_Panel SHALL display a dashboard summary showing: total leads (last 30 days), total chat sessions (last 30 days), top matched intent (last 7 days), and active services count.
5. WHEN the Admin performs a destructive action (delete service, delete flow, delete intent, delete lead), THE Admin_Panel SHALL require confirmation via a modal dialog before executing the action.

---

### Requirement 11: Database Schema Redesign

**User Story:** As a developer, I want a clean, normalized database schema for the new chat system, so that all existing legacy tables are replaced and the new schema supports all admin-managed features.

#### Acceptance Criteria

1. THE System SHALL create the following new tables via Laravel migrations: `company_profile`, `services`, `flows`, `flow_nodes`, `flow_node_options`, `intents` (rebuilt), `chat_sessions` (rebuilt), `chat_messages` (rebuilt), `leads` (rebuilt), `intent_match_logs`.
2. THE System SHALL drop all legacy chat-related tables (`service_configs`, `responses`, `keyword_searches`, `intent_conversions`) as part of the migration set.
3. THE `flow_nodes` table SHALL include columns: id, flow_id, type (enum: message, question, condition, lead_capture), message_text, variable_key (for storing answer in session), next_node_id (nullable, for message/default routing), order_index, and timestamps.
4. THE `flow_node_options` table SHALL include columns: id, flow_node_id, label, next_node_id, and order_index.
5. THE `intents` table SHALL include columns: id, name, keywords (JSON), response_text, service_id (nullable FK), priority (integer, default 0), and timestamps.
6. THE `leads` table SHALL include columns: id, chat_session_id (FK), name, phone, email (nullable), service, location (nullable), q1_answer (nullable), q2_answer (nullable), q3_answer (nullable), is_partial (boolean, default false), and timestamps.
7. THE `chat_sessions` table SHALL include columns: id (UUID), user_id (nullable FK), lead_id (nullable FK), title, state (varchar), session_state (JSON), and timestamps.
8. THE System SHALL seed the five default Services (Construction, Interiors, Real Estate, Event, Land Development) with their existing brand data, detection keywords, and social links as part of a database seeder.
9. THE System SHALL seed the Company_Profile singleton with Area24ONE's existing brand data (name, intro text, contact numbers, social links) as part of a database seeder.
10. FOR ALL migrations, THE System SHALL be reversible — each migration SHALL implement a `down()` method that restores the previous state.
