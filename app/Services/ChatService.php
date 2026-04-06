<?php

namespace App\Services;

use App\Models\ChatMessage;
use App\Models\ChatKnowledgeItem;
use App\Models\ChatQualificationFlow;
use App\Models\ChatResponseTemplate;
use App\Models\ChatServiceItem;
use App\Models\ChatSetting;
use App\Models\ChatSession;
use App\Models\Lead;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatService
{
    protected const DEFAULT_INTRO = "Area24ONE helps with homes, interiors, property, events, and land development across Karnataka.\n\nTell me what you need, and I'll guide you to the right service.\n\nWhat can I help you with today?";

    protected ChatSession $session;

    protected ?ChatSetting $settings = null;

    protected ?Collection $services = null;

    protected ?Collection $knowledgeItems = null;

    protected ?Collection $responseTemplates = null;

    public function __construct(
        protected ChatIntentMatcher $intentMatcher,
    ) {}

    public function handle(string $sessionId = null, string $userMessage = ''): array
    {
        $this->session = $this->resolveSession($sessionId);
        $settings = $this->getSettings();

        $message = trim($userMessage);
        $data = $this->session->data ?? [];

        if ($message !== '' && $this->session->state === 'QUALIFIED' && $this->looksLikeFreshRequirement($message)) {
            $data = [];
            $this->session->update([
                'state' => 'OPEN',
                'data' => [],
                'lead_id' => null,
            ]);
        }

        if (! $settings->chat_enabled) {
            return $this->reply(...$this->buildTemplateReply(
                'disabled',
                'Chat is currently unavailable. Please contact our team directly.',
                null,
                'system',
            ));
        }

        if ($message === '' && $this->session->messages()->count() === 0) {
            return $this->reply(...$this->buildTemplateReply(
                'welcome',
                $this->getIntroText(),
                $this->getServiceOptions(),
                'welcome',
                [
                    'assistant_name' => $settings->assistant_name,
                ],
            ));
        }

        if ($message === '') {
            return $this->reply(...$this->buildTemplateReply(
                'fallback',
                $settings->fallback_message ?: 'Tell me a little about your requirement and I will point you in the right direction.',
                $this->getServiceOptions(),
                'fallback',
            ));
        }

        $this->storeMessage('user', $message, null, 'user_message');

        $qualificationReply = $this->handleQualificationAnswer($message, $data, $settings->lead_capture_enabled);

        if ($qualificationReply !== null) {
            return $qualificationReply;
        }

        if ($this->isGreeting($message)) {
            return $this->reply(...$this->buildTemplateReply(
                'greeting',
                'Hi there. Choose a service or describe what you are planning.',
                $this->getServiceOptions(),
                'greeting',
            ));
        }

        $intentMatch = $this->matchIntent($message, $data);

        if ($intentMatch !== null) {
            $data['intent'] = [
                'slug' => $intentMatch['meta']['intent_slug'] ?? null,
                'name' => $intentMatch['meta']['intent_name'] ?? null,
                'service_id' => $intentMatch['meta']['intent_service_id'] ?? null,
                'service_name' => $intentMatch['meta']['intent_service_name'] ?? null,
            ];
            $this->session->update(['data' => $data]);
            $this->maybeUpdateTitleFromMessage($message);

            return $this->reply(
                $intentMatch['response'],
                $intentMatch['options'],
                false,
                false,
                'intent_match',
                $intentMatch['meta'],
                $intentMatch['redirect'],
            );
        }

        $knowledgeMatch = $this->matchKnowledge($message, $data);

        if ($knowledgeMatch !== null) {
            $this->maybeUpdateTitleFromMessage($message);

            return $this->reply(
                $knowledgeMatch['answer'],
                null,
                false,
                false,
                'knowledge_match',
                $knowledgeMatch['meta'],
            );
        }

        $service = $this->detectService($message);

        if ($service !== null) {
            $data['service'] = [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
            ];

            $this->session->update([
                'state' => 'SERVICE_SELECTED',
                'data' => $data,
                'title' => $service->name,
            ]);

            $nextStep = $settings->lead_capture_enabled
                ? $this->getNextQualificationStep($service->id, $data)
                : null;

            if ($nextStep) {
                $data['last_question_key'] = $nextStep->field_key;
                $this->session->update([
                    'state' => 'QUALIFYING',
                    'data' => $data,
                ]);
            }

            return $this->reply(
                ...$this->buildTemplateReply(
                    $nextStep ? 'qualification_prompt' : 'service_answer',
                    $this->buildServiceReply($service, $settings->lead_capture_enabled, $nextStep?->question),
                    $nextStep?->quick_options,
                    $nextStep ? 'qualification_prompt' : 'service_match',
                    [
                        'service_id' => $service->id,
                        'service_slug' => $service->slug,
                        'field_key' => $nextStep?->field_key,
                        'service_name' => $service->name,
                    ],
                ),
            );
        }

        if (! empty($data['service'])) {
            $selectedService = $this->getSelectedServiceFromData($data);
            $serviceName = $selectedService?->name ?? (is_array($data['service']) ? ($data['service']['name'] ?? 'this service') : (string) $data['service']);

            $nextStep = $selectedService && $settings->lead_capture_enabled
                ? $this->getNextQualificationStep($selectedService->id, $data)
                : null;

            if ($nextStep) {
                $data['last_question_key'] = $nextStep->field_key;
                $this->session->update([
                    'state' => 'QUALIFYING',
                    'data' => $data,
                ]);
            }

            return $this->reply(
                ...$this->buildTemplateReply(
                    $nextStep ? 'qualification_prompt' : 'fallback',
                    $nextStep
                        ? $nextStep->question
                        : "Noted for {$serviceName}. Add any details like location, budget, timeline, or scope, and I'll help you move this forward.",
                    $nextStep?->quick_options,
                    $nextStep ? 'qualification_prompt' : 'fallback',
                    [
                        'field_key' => $nextStep?->field_key,
                        'service_name' => $serviceName,
                    ],
                ),
            );
        }

        $this->maybeUpdateTitleFromMessage($message);

        return $this->reply(...$this->buildTemplateReply(
            'fallback',
            $settings->no_result_message ?: $settings->fallback_message ?: 'Tell me which service you need, or describe your requirement in one line.',
            $this->getServiceOptions(),
            'fallback',
        ));
    }

    protected function resolveSession(?string $sessionId): ChatSession
    {
        if ($sessionId) {
            $session = ChatSession::find($sessionId);

            if ($session && $session->user_id && $session->user_id !== auth()->id()) {
                throw new \RuntimeException('Unauthorized access to chat session.');
            }

            if ($session) {
                return $session;
            }
        }

        return ChatSession::create([
            'user_id' => auth()->id(),
            'state' => 'OPEN',
            'title' => 'New Chat',
            'data' => [],
        ]);
    }

    protected function reply(
        string $text,
        ?array $options = null,
        bool $highlight = false,
        bool $requiresInput = false,
        ?string $type = null,
        ?array $meta = null,
        ?string $redirect = null,
    ): array {
        $this->storeMessage('bot', $text, $options, $type, $meta);

        return [
            'reply' => $text,
            'options' => $options,
            'type' => $type,
            'meta' => $meta,
            'redirect' => $redirect,
            'highlight' => $highlight,
            'requires_input' => $requiresInput,
            'session_id' => $this->session->id,
        ];
    }

    protected function storeMessage(
        string $sender,
        string $message,
        ?array $options = null,
        ?string $type = null,
        ?array $meta = null,
    ): void {
        ChatMessage::create([
            'session_id' => $this->session->id,
            'sender' => $sender,
            'message' => $message,
            'type' => $type,
            'meta' => $meta,
            'options' => $options,
        ]);

        $this->session->touch();
    }

    protected function detectService(string $message): ?ChatServiceItem
    {
        $normalized = Str::lower($message);

        foreach ($this->getActiveServices() as $service) {
            if (Str::lower($service->name) === $normalized || Str::lower($service->slug) === $normalized) {
                return $service;
            }
        }

        foreach ($this->getActiveServices() as $service) {
            foreach ($this->buildServiceSearchTerms($service) as $keyword) {
                if ($keyword !== '' && str_contains($normalized, $keyword)) {
                    return $service;
                }
            }
        }

        return null;
    }

    protected function looksLikeFreshRequirement(string $message): bool
    {
        return $this->detectService($message) !== null;
    }

    protected function isGreeting(string $message): bool
    {
        $normalized = Str::lower(trim($message));

        return in_array($normalized, ['hi', 'hello', 'hey', 'hii', 'namaste'], true);
    }

    protected function maybeUpdateTitleFromMessage(string $message): void
    {
        if ($this->session->title !== 'New Chat') {
            return;
        }

        $title = Str::limit(trim((string) preg_replace('/\s+/', ' ', $message)), 40, '');

        if ($title !== '') {
            $this->session->update(['title' => $title]);
        }
    }

    protected function getIntroText(): string
    {
        $settings = $this->getSettings();
        $parts = array_filter([
            $settings->welcome_title,
            $settings->welcome_message,
        ]);

        return implode("\n\n", $parts) ?: self::DEFAULT_INTRO;
    }

    protected function getSettings(): ChatSetting
    {
        if ($this->settings) {
            return $this->settings;
        }

        return $this->settings = ChatSetting::query()->firstOrCreate(
            ['id' => 1],
            [
                'assistant_name' => 'Area24ONE',
                'welcome_title' => 'Welcome',
                'welcome_message' => self::DEFAULT_INTRO,
                'fallback_message' => 'Tell me your requirement in one line and I will guide you.',
                'chat_enabled' => true,
                'lead_capture_enabled' => true,
                'show_service_options' => true,
                'default_response_type' => 'text',
            ],
        );
    }

    protected function getServiceOptions(): ?array
    {
        if (! $this->getSettings()->show_service_options) {
            return null;
        }

        $options = $this->getActiveServices()
            ->pluck('name')
            ->values()
            ->all();

        return empty($options) ? null : $options;
    }

    protected function getActiveServices(): Collection
    {
        if ($this->services) {
            return $this->services;
        }

        return $this->services = ChatServiceItem::query()
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    protected function buildServiceReply(ChatServiceItem $service, bool $leadCaptureEnabled, ?string $nextQuestion = null): string
    {
        $segments = array_filter([
            "Great, I can help with {$service->name}.",
            $service->short_summary,
            $service->timeline_note,
            $leadCaptureEnabled
                ? ($nextQuestion ?: ($service->cta_text ?: 'Share your goal, location, budget, and timeline if you know them.'))
                : null,
        ]);

        return implode(' ', $segments);
    }

    protected function matchIntent(string $message, array $sessionData): ?array
    {
        $serviceId = $sessionData['service']['id'] ?? null;
        $match = $this->intentMatcher->match($message, $serviceId ? (int) $serviceId : null);

        if (! $match || empty($match['response'])) {
            return null;
        }

        $options = null;
        if (empty($match['service_id']) && $this->getSettings()->show_service_options) {
            $options = $this->getServiceOptions();
        }

        return [
            'response' => $match['response'],
            'options' => $options,
            'redirect' => $match['redirect_url'] ?? null,
            'meta' => [
                'intent_slug' => $match['intent_slug'] ?? null,
                'intent_name' => $match['intent_name'] ?? null,
                'intent_service_id' => $match['service_id'] ?? null,
                'intent_service_name' => $match['service_name'] ?? null,
                'intent_is_clarification' => $match['is_clarification'] ?? false,
                'intent_should_pause_flow' => $match['should_pause_flow'] ?? false,
            ],
        ];
    }

    protected function buildServiceSearchTerms(ChatServiceItem $service): array
    {
        $terms = [
            Str::lower($service->name),
            Str::lower($service->slug),
            Str::lower((string) $service->short_summary),
            Str::lower((string) $service->description),
        ];

        foreach ([$service->who_its_for, $service->offerings, $service->locations] as $list) {
            foreach ($list ?? [] as $value) {
                $terms[] = Str::lower((string) $value);
            }
        }

        foreach ($this->getServiceAliases($service) as $alias) {
            $terms[] = Str::lower($alias);
        }

        return array_values(array_unique(array_filter(array_map('trim', $terms))));
    }

    protected function getServiceAliases(ChatServiceItem $service): array
    {
        $meta = $service->meta ?? [];

        return array_values(array_filter(array_map(
            static fn ($value) => trim((string) $value),
            $meta['aliases'] ?? [],
        )));
    }

    protected function getResponseTemplates(): Collection
    {
        if ($this->responseTemplates) {
            return $this->responseTemplates;
        }

        return $this->responseTemplates = ChatResponseTemplate::query()
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderBy('type')
            ->orderBy('name')
            ->get();
    }

    protected function findResponseTemplate(string $type): ?ChatResponseTemplate
    {
        return $this->getResponseTemplates()->firstWhere('type', $type);
    }

    protected function buildTemplateReply(
        string $templateType,
        string $defaultText,
        ?array $defaultOptions = null,
        ?string $messageType = null,
        ?array $meta = null,
        ?string $redirect = null,
    ): array {
        $template = $this->findResponseTemplate($templateType);
        $variables = [
            'assistant_name' => $this->getSettings()->assistant_name,
            'service_name' => $meta['service_name'] ?? null,
            'summary_lines' => $meta['summary_lines'] ?? $defaultText,
        ];

        $text = $template
            ? $this->renderTemplateBody($template, $variables, $defaultText)
            : $defaultText;

        $options = $template && ! empty($template->quick_replies)
            ? $template->quick_replies
            : $defaultOptions;

        $highlight = $template?->highlight ?? false;
        $requiresInput = $template?->requires_input ?? false;

        if ($messageType === 'qualification_prompt') {
            $requiresInput = true;
        }

        $meta = array_filter([
            ...($meta ?? []),
            'template_id' => $template?->id,
            'template_slug' => $template?->slug,
            'template_type' => $template?->type,
            'ui_variant' => $template?->ui_variant,
        ], fn ($value) => $value !== null);

        return [
            $text,
            $options,
            $highlight,
            $requiresInput,
            $messageType ?? $templateType,
            $meta,
            $redirect,
        ];
    }

    protected function renderTemplateBody(ChatResponseTemplate $template, array $variables, string $defaultText): string
    {
        $parts = array_filter([$template->title, $template->body]);
        $body = implode("\n\n", $parts);

        foreach ($variables as $key => $value) {
            $body = str_replace('{{' . $key . '}}', (string) ($value ?? ''), $body);
        }

        $body = trim(preg_replace("/\n{3,}/", "\n\n", $body) ?? '');

        return $body !== '' ? $body : $defaultText;
    }

    protected function getKnowledgeItems(): Collection
    {
        if ($this->knowledgeItems) {
            return $this->knowledgeItems;
        }

        return $this->knowledgeItems = ChatKnowledgeItem::query()
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderByDesc('priority')
            ->orderBy('title')
            ->get();
    }

    protected function matchKnowledge(string $message, array $sessionData): ?array
    {
        $selectedService = $this->getSelectedServiceFromData($sessionData);
        $normalized = Str::lower($message);
        $best = null;
        $bestScore = 0;

        foreach ($this->getKnowledgeItems() as $item) {
            if ($item->service_id && (! $selectedService || $item->service_id !== $selectedService->id)) {
                continue;
            }

            $score = 0;
            $patterns = array_merge(
                $item->question_patterns ?? [],
                $item->tags ?? [],
                [$item->title]
            );

            foreach ($patterns as $pattern) {
                $term = Str::lower(trim((string) $pattern));
                if ($term === '') {
                    continue;
                }

                if ($normalized === $term) {
                    $score = max($score, 1.0);
                } elseif (preg_match('/\b' . preg_quote($term, '/') . '\b/i', $normalized)) {
                    $score = max($score, 0.85);
                } elseif (str_contains($normalized, $term)) {
                    $score = max($score, 0.65);
                }
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $item;
            }
        }

        if (! $best || $bestScore < 0.65) {
            return null;
        }

        return [
            'answer' => $best->short_answer ?: $best->answer,
            'meta' => [
                'knowledge_item_id' => $best->id,
                'knowledge_category' => $best->category,
                'service_id' => $best->service_id,
            ],
        ];
    }

    protected function getSelectedServiceFromData(array $sessionData): ?ChatServiceItem
    {
        $serviceId = $sessionData['service']['id'] ?? null;

        if (! $serviceId) {
            return null;
        }

        return $this->getActiveServices()->firstWhere('id', $serviceId);
    }

    protected function getQualificationSteps(int $serviceId): Collection
    {
        return ChatQualificationFlow::query()
            ->where('service_id', $serviceId)
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderBy('step_order')
            ->orderBy('id')
            ->get();
    }

    protected function getNextQualificationStep(int $serviceId, array $sessionData): ?ChatQualificationFlow
    {
        $answers = $sessionData['qualification'] ?? [];

        foreach ($this->getQualificationSteps($serviceId) as $step) {
            $answered = array_key_exists($step->field_key, $answers) && filled($answers[$step->field_key]);

            if (! $answered) {
                return $step;
            }
        }

        return null;
    }

    protected function handleQualificationAnswer(string $message, array $sessionData, bool $leadCaptureEnabled): ?array
    {
        if (! $leadCaptureEnabled) {
            return null;
        }

        $selectedService = $this->getSelectedServiceFromData($sessionData);

        if (! $selectedService) {
            return null;
        }

        $pendingField = $sessionData['last_question_key'] ?? null;

        if (! $pendingField) {
            return null;
        }

        $step = $this->getQualificationSteps($selectedService->id)->firstWhere('field_key', $pendingField);

        if (! $step) {
            return null;
        }

        $qualification = $sessionData['qualification'] ?? [];
        $pendingSteps = $this->getQualificationSteps($selectedService->id)
            ->filter(function (ChatQualificationFlow $flow) use ($qualification, $pendingField) {
                if ($flow->field_key === $pendingField) {
                    return true;
                }

                return ! array_key_exists($flow->field_key, $qualification) || ! filled($qualification[$flow->field_key]);
            })
            ->values();

        $bulkAnswers = $this->extractBulkQualificationAnswers($message, $pendingSteps);

        if (empty($bulkAnswers)) {
            $qualification[$pendingField] = $this->normalizeQualificationAnswer($message, $step);
        } else {
            foreach ($bulkAnswers as $fieldKey => $value) {
                $qualification[$fieldKey] = $value;
            }
        }

        $sessionData['qualification'] = $qualification;
        unset($sessionData['last_question_key']);

        $nextStep = $this->getNextQualificationStep($selectedService->id, $sessionData);

        if ($nextStep) {
            $sessionData['last_question_key'] = $nextStep->field_key;
            $this->session->update([
                'state' => 'QUALIFYING',
                'data' => $sessionData,
            ]);

            return $this->reply(
                $nextStep->question,
                $nextStep->quick_options,
                false,
                true,
                'qualification_prompt',
                [
                    'field_key' => $nextStep->field_key,
                    'service_id' => $selectedService->id,
                ],
            );
        }

        $this->session->update([
            'state' => 'QUALIFIED',
            'data' => $sessionData,
        ]);

        $summaryParts = [];
        foreach ($qualification as $key => $value) {
            $summaryParts[] = '- ' . Str::headline($key) . ': ' . $value;
        }

        $defaultSummary = implode("\n", $summaryParts);
        $lead = $this->persistLeadFromQualification($selectedService, $qualification, $sessionData, $defaultSummary);
        $messageText = $this->renderDynamicText(
            $this->getSettings()->escalation_message
                ?: "Thanks, I've noted your {{service_name}} requirement. Our team can take it forward with these details:\n{{summary_lines}}",
            [
                'service_name' => $selectedService->name,
                'summary_lines' => $defaultSummary,
            ],
        );

        return $this->reply(
            $messageText,
            null,
            false,
            false,
            'qualification_complete',
            [
                'service_id' => $selectedService->id,
                'service_name' => $selectedService->name,
                'qualification' => $qualification,
                'summary_lines' => $defaultSummary,
                'lead_id' => $lead?->id,
            ],
        );
    }

    /**
     * Try to map a single freeform message into multiple pending qualification fields
     * when the user provides comma-separated project details in one go.
     */
    protected function extractBulkQualificationAnswers(string $message, Collection $pendingSteps): array
    {
        $tokens = array_values(array_filter(array_map(
            static fn (string $value) => trim($value),
            preg_split('/\s*,\s*|\r\n|\r|\n/', $message) ?: [],
        )));

        if (count($tokens) < 2 || $pendingSteps->count() < 2) {
            return [];
        }

        $answers = [];
        foreach ($pendingSteps as $index => $step) {
            $token = $tokens[$index] ?? null;
            if ($token === null) {
                break;
            }

            $answers[$step->field_key] = $this->normalizeQualificationAnswer($token, $step);
        }

        return count($answers) > 1 ? $answers : [];
    }

    protected function normalizeQualificationAnswer(string $value, ChatQualificationFlow $step): string
    {
        $trimmed = trim($value);
        if ($trimmed === '') {
            return $trimmed;
        }

        if ($step->answer_type === 'phone') {
            return $this->normalizePhone($trimmed) ?? $trimmed;
        }

        $rules = collect($step->validation_rules ?? [])
            ->map(fn ($rule) => trim((string) $rule))
            ->filter()
            ->values();

        $parser = $rules
            ->first(fn ($rule) => str_starts_with($rule, 'parser:'));

        if ($parser) {
            $parsed = $this->applyConfiguredParser(
                substr($parser, strlen('parser:')),
                $trimmed,
                $step->quick_options ?? [],
            );

            if ($parsed !== null) {
                return $parsed;
            }
        }

        if ($step->answer_type !== 'option' || empty($step->quick_options)) {
            return $trimmed;
        }

        $configuredAliases = $this->getConfiguredOptionAliases($rules);
        $matchedAlias = $this->matchConfiguredOptionAlias($trimmed, $step->quick_options, $configuredAliases);

        if ($matchedAlias !== null) {
            return $matchedAlias;
        }

        return $this->matchQuickOption($trimmed, $step->quick_options) ?? $trimmed;
    }

    protected function applyConfiguredParser(string $parser, string $value, array $options): ?string
    {
        return match (trim(Str::lower($parser))) {
            'budget' => $this->matchBudgetOption($value, $options),
            'timeline' => $this->matchTimelineOption($value, $options),
            default => null,
        };
    }

    protected function getConfiguredOptionAliases(Collection $rules): array
    {
        $aliases = [];

        foreach ($rules as $rule) {
            if (! str_starts_with($rule, 'alias:')) {
                continue;
            }

            $payload = substr($rule, strlen('alias:'));
            [$option, $rawSynonyms] = array_pad(explode('=', $payload, 2), 2, '');

            $option = trim($option);
            $synonyms = array_values(array_filter(array_map(
                'trim',
                preg_split('/\|/', $rawSynonyms) ?: [],
            )));

            if ($option !== '' && ! empty($synonyms)) {
                $aliases[$option] = $synonyms;
            }
        }

        return $aliases;
    }

    protected function matchConfiguredOptionAlias(string $value, array $options, array $aliases): ?string
    {
        $normalized = Str::lower(trim($value));

        foreach ($aliases as $optionLabel => $synonyms) {
            $option = collect($options)->first(function ($existingOption) use ($optionLabel) {
                return Str::lower(trim((string) $existingOption)) === Str::lower(trim($optionLabel));
            });

            if (! $option) {
                continue;
            }

            foreach ($synonyms as $synonym) {
                $normalizedSynonym = Str::lower(trim($synonym));

                if ($normalizedSynonym !== '' && (str_contains($normalized, $normalizedSynonym) || $normalized === $normalizedSynonym)) {
                    return (string) $option;
                }
            }
        }

        return null;
    }

    protected function matchBudgetOption(string $value, array $options): ?string
    {
        $normalized = Str::lower(str_replace(' ', '', $value));

        if (preg_match('/(\d+(?:\.\d+)?)\s*(cr|crore)/i', $value, $matches)) {
            $crores = (float) $matches[1];

            if ($crores < 1) {
                return $this->findOptionContaining($options, ['50l', '50l-1cr']);
            }
            if ($crores < 5) {
                return $this->findOptionContaining($options, ['1-5cr']);
            }

            return $this->findOptionContaining($options, ['5cr+']);
        }

        if (preg_match('/(\d+(?:\.\d+)?)\s*l/i', $normalized, $matches)) {
            $lakhs = (float) $matches[1];

            if ($lakhs < 50) {
                return $this->findOptionContaining($options, ['50l']);
            }
            if ($lakhs <= 100) {
                return $this->findOptionContaining($options, ['50l-1cr']);
            }
        }

        return $this->matchQuickOption($value, $options);
    }

    protected function matchTimelineOption(string $value, array $options): ?string
    {
        $normalized = Str::lower($value);

        if (preg_match('/(\d+(?:\.\d+)?)\s*year/i', $normalized, $matches)) {
            $months = (float) $matches[1] * 12;

            return match (true) {
                $months <= 3 => $this->findOptionContaining($options, ['0-3']),
                $months <= 6 => $this->findOptionContaining($options, ['3-6']),
                $months <= 12 => $this->findOptionContaining($options, ['6-12']),
                default => $this->findOptionContaining($options, ['12+']),
            };
        }

        if (preg_match('/(\d+(?:\.\d+)?)\s*month/i', $normalized, $matches)) {
            $months = (float) $matches[1];

            return match (true) {
                $months <= 3 => $this->findOptionContaining($options, ['0-3']),
                $months <= 6 => $this->findOptionContaining($options, ['3-6']),
                $months <= 12 => $this->findOptionContaining($options, ['6-12']),
                default => $this->findOptionContaining($options, ['12+']),
            };
        }

        return $this->matchQuickOption($value, $options);
    }

    protected function matchQuickOption(string $value, array $options): ?string
    {
        $normalized = Str::lower(trim($value));

        foreach ($options as $option) {
            $normalizedOption = Str::lower(trim((string) $option));
            if ($normalizedOption === $normalized) {
                return (string) $option;
            }
        }

        foreach ($options as $option) {
            $normalizedOption = Str::lower(trim((string) $option));
            if ($normalizedOption !== '' && (str_contains($normalized, $normalizedOption) || str_contains($normalizedOption, $normalized))) {
                return (string) $option;
            }
        }

        return null;
    }

    protected function findOptionContaining(array $options, array $needles): ?string
    {
        foreach ($options as $option) {
            $normalizedOption = Str::lower(str_replace(' ', '', (string) $option));

            foreach ($needles as $needle) {
                if (str_contains($normalizedOption, Str::lower($needle))) {
                    return (string) $option;
                }
            }
        }

        return null;
    }

    protected function renderDynamicText(string $text, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $text = str_replace('{{' . $key . '}}', (string) ($value ?? ''), $text);
        }

        return trim($text);
    }

    protected function persistLeadFromQualification(
        ChatServiceItem $service,
        array $qualification,
        array $sessionData,
        string $summaryText,
    ): ?Lead {
        $contact = $this->extractContactDetails($qualification);
        $authUser = auth()->user();

        $name = $contact['name']
            ?? $authUser?->name
            ?? 'Website Chat Lead';
        $phone = $contact['phone']
            ?? $authUser?->phone
            ?? null;
        $email = $contact['email']
            ?? $authUser?->email
            ?? null;

        if (! filled($phone)) {
            return null;
        }

        $serviceAnswers = collect($qualification)
            ->reject(fn ($value, $key) => in_array($key, [
                'contact_name',
                'name',
                'contact_phone',
                'phone',
                'contact_email',
                'email',
                'location',
                'site_location',
                'project_location',
            ], true))
            ->values();

        $leadPayload = [
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'service' => $service->name,
            'message' => $summaryText,
            'location' => $qualification['location']
                ?? $qualification['site_location']
                ?? $qualification['project_location']
                ?? null,
            'q1_answer' => $serviceAnswers->get(0),
            'q2_answer' => $serviceAnswers->get(1),
            'q3_answer' => $serviceAnswers->get(2),
            'intent_slug' => $sessionData['intent']['slug'] ?? null,
            'conversion_score' => $phone ? 60 : 20,
            'source_keyword' => $sessionData['intent']['name'] ?? null,
            'engagement_level' => 'medium',
            'lead_status' => 'warm',
        ];

        $lead = $this->session->lead_id
            ? Lead::query()->find($this->session->lead_id)
            : null;

        if ($lead) {
            $lead->update($leadPayload);
        } else {
            $lead = Lead::query()->create($leadPayload);
        }

        $this->session->update(['lead_id' => $lead->id]);

        return $lead;
    }

    protected function extractContactDetails(array $qualification): array
    {
        return [
            'name' => $this->firstFilledValue($qualification, ['contact_name', 'name']),
            'phone' => $this->normalizePhone($this->firstFilledValue($qualification, ['contact_phone', 'phone'])),
            'email' => $this->normalizeEmail($this->firstFilledValue($qualification, ['contact_email', 'email'])),
        ];
    }

    protected function firstFilledValue(array $values, array $keys): ?string
    {
        foreach ($keys as $key) {
            $value = trim((string) ($values[$key] ?? ''));
            if ($value !== '') {
                return $value;
            }
        }

        return null;
    }

    protected function normalizePhone(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $normalized = preg_replace('/[^\d+]/', '', $value) ?? '';

        return $normalized !== '' ? $normalized : null;
    }

    protected function normalizeEmail(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        return filter_var($value, FILTER_VALIDATE_EMAIL) ? $value : null;
    }
}
