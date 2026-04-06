<?php

namespace App\Services\Chat;

use App\Models\ChatImportLog;
use App\Models\ChatIntent;
use App\Models\ChatKnowledgeItem;
use App\Models\ChatQualificationFlow;
use App\Models\ChatResponseTemplate;
use App\Models\ChatServiceItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatImportService
{
    public function import(string $module, UploadedFile $file, bool $overwrite = false, ?int $userId = null): array
    {
        $rows = $this->parseFile($file);
        $result = [
            'module' => $module,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'status' => 'success',
            'total_rows' => count($rows),
            'success_rows' => 0,
            'failed_rows' => 0,
            'errors' => [],
        ];

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                try {
                    $normalized = $this->normalizeRow($module, $row);
                    if ($normalized === null) {
                        continue;
                    }

                    $this->persistRow($module, $normalized, $overwrite);
                    $result['success_rows']++;
                } catch (\Throwable $e) {
                    $result['failed_rows']++;
                    $result['errors'][] = 'Row ' . ($index + 1) . ': ' . $e->getMessage();
                }
            }

            if ($result['failed_rows'] > 0) {
                $result['status'] = $result['success_rows'] > 0 ? 'partial' : 'failed';
            }

            ChatImportLog::create([
                'module' => $module,
                'file_name' => $result['file_name'],
                'file_type' => $result['file_type'],
                'status' => $result['status'],
                'total_rows' => $result['total_rows'],
                'success_rows' => $result['success_rows'],
                'failed_rows' => $result['failed_rows'],
                'error_summary' => empty($result['errors']) ? null : implode("\n", array_slice($result['errors'], 0, 20)),
                'payload_snapshot' => [
                    'overwrite' => $overwrite,
                    'errors' => array_slice($result['errors'], 0, 20),
                ],
                'created_by' => $userId,
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        return $result;
    }

    protected function parseFile(UploadedFile $file): array
    {
        $extension = Str::lower($file->getClientOriginalExtension());

        if ($extension === 'json') {
            $decoded = json_decode($file->get(), true);
            if (! is_array($decoded)) {
                throw new \RuntimeException('Invalid JSON structure. Expected an array of rows.');
            }
            return array_values($decoded);
        }

        if (! in_array($extension, ['csv', 'txt'], true)) {
            throw new \RuntimeException('Only CSV and JSON files are supported right now.');
        }

        $handle = fopen($file->getRealPath(), 'r');
        if (! $handle) {
            throw new \RuntimeException('Unable to read the uploaded file.');
        }

        $headers = fgetcsv($handle);
        if (! $headers) {
            fclose($handle);
            return [];
        }

        $headers = array_map(fn ($header) => Str::snake(trim((string) $header)), $headers);
        $rows = [];

        while (($row = fgetcsv($handle)) !== false) {
            if ($row === [null] || $row === false) {
                continue;
            }
            $rows[] = array_combine($headers, array_pad($row, count($headers), null));
        }

        fclose($handle);

        return $rows;
    }

    protected function normalizeRow(string $module, array $row): ?array
    {
        return match ($module) {
            'chat_services' => $this->normalizeServiceRow($row),
            'chat_intents' => $this->normalizeIntentRow($row),
            'chat_knowledge_items' => $this->normalizeKnowledgeRow($row),
            'chat_response_templates' => $this->normalizeResponseTemplateRow($row),
            'chat_qualification_flows' => $this->normalizeQualificationRow($row),
            default => throw new \RuntimeException('Unsupported import module.'),
        };
    }

    protected function persistRow(string $module, array $row, bool $overwrite): void
    {
        match ($module) {
            'chat_services' => $this->persistServiceRow($row, $overwrite),
            'chat_intents' => $this->persistIntentRow($row, $overwrite),
            'chat_knowledge_items' => $this->persistKnowledgeRow($row, $overwrite),
            'chat_response_templates' => $this->persistResponseTemplateRow($row, $overwrite),
            'chat_qualification_flows' => $this->persistQualificationRow($row, $overwrite),
            default => throw new \RuntimeException('Unsupported import module.'),
        };
    }

    protected function normalizeServiceRow(array $row): ?array
    {
        $name = trim((string) ($row['name'] ?? ''));
        if ($name === '') {
            return null;
        }

        return [
            'name' => $name,
            'slug' => trim((string) ($row['slug'] ?? Str::slug($name))),
            'icon' => $this->nullable($row['icon'] ?? null),
            'is_active' => $this->toBool($row['is_active'] ?? true),
            'short_summary' => $this->nullable($row['short_summary'] ?? null),
            'description' => $this->nullable($row['description'] ?? null),
            'who_its_for' => $this->toList($row['who_its_for'] ?? null),
            'offerings' => $this->toList($row['offerings'] ?? null),
            'pricing_note' => $this->nullable($row['pricing_note'] ?? null),
            'timeline_note' => $this->nullable($row['timeline_note'] ?? null),
            'cta_text' => $this->nullable($row['cta_text'] ?? null),
            'locations' => $this->toList($row['locations'] ?? null),
            'meta' => [
                'aliases' => $this->toList($row['aliases'] ?? $row['meta_aliases'] ?? null),
            ],
            'sort_order' => (int) ($row['sort_order'] ?? 0),
            'published_at' => now(),
        ];
    }

    protected function normalizeIntentRow(array $row): ?array
    {
        $name = trim((string) ($row['name'] ?? ''));
        if ($name === '') {
            return null;
        }

        return [
            'name' => $name,
            'slug' => trim((string) ($row['slug'] ?? Str::slug($name))),
            'service_id' => $this->resolveServiceId($row['service_id'] ?? $row['service_slug'] ?? $row['service_name'] ?? null),
            'keywords' => $this->toList($row['keywords'] ?? null),
            'response_text' => trim((string) ($row['response_text'] ?? '')),
            'redirect_url' => $this->nullable($row['redirect_url'] ?? null),
            'category' => $this->nullable($row['category'] ?? null),
            'priority' => (int) ($row['priority'] ?? 50),
            'conversion_rate' => (float) ($row['conversion_rate'] ?? 0),
            'priority_score' => (int) ($row['priority_score'] ?? 0),
            'is_high_value' => $this->toBool($row['is_high_value'] ?? false),
            'is_active' => $this->toBool($row['is_active'] ?? true),
            'published_at' => now(),
        ];
    }

    protected function normalizeKnowledgeRow(array $row): ?array
    {
        $title = trim((string) ($row['title'] ?? ''));
        if ($title === '') {
            return null;
        }

        return [
            'title' => $title,
            'slug' => trim((string) ($row['slug'] ?? Str::slug($title))),
            'category' => trim((string) ($row['category'] ?? 'faq')),
            'service_id' => $this->resolveServiceId($row['service_id'] ?? $row['service_slug'] ?? $row['service_name'] ?? null),
            'question_patterns' => $this->toList($row['question_patterns'] ?? null),
            'answer' => trim((string) ($row['answer'] ?? '')),
            'short_answer' => $this->nullable($row['short_answer'] ?? null),
            'tags' => $this->toList($row['tags'] ?? null),
            'priority' => (int) ($row['priority'] ?? 0),
            'is_active' => $this->toBool($row['is_active'] ?? true),
            'published_at' => now(),
        ];
    }

    protected function normalizeResponseTemplateRow(array $row): ?array
    {
        $name = trim((string) ($row['name'] ?? ''));
        if ($name === '') {
            return null;
        }

        return [
            'name' => $name,
            'slug' => trim((string) ($row['slug'] ?? Str::slug($name))),
            'type' => trim((string) ($row['type'] ?? 'fallback')),
            'title' => $this->nullable($row['title'] ?? null),
            'body' => trim((string) ($row['body'] ?? '')),
            'quick_replies' => $this->toList($row['quick_replies'] ?? null),
            'highlight' => $this->toBool($row['highlight'] ?? false),
            'requires_input' => $this->toBool($row['requires_input'] ?? false),
            'ui_variant' => $this->nullable($row['ui_variant'] ?? null),
            'is_active' => $this->toBool($row['is_active'] ?? true),
        ];
    }

    protected function normalizeQualificationRow(array $row): ?array
    {
        $serviceId = $this->resolveServiceId($row['service_id'] ?? $row['service_slug'] ?? $row['service_name'] ?? null);
        $fieldKey = trim((string) ($row['field_key'] ?? ''));

        if (! $serviceId || $fieldKey === '') {
            return null;
        }

        return [
            'service_id' => $serviceId,
            'field_key' => $fieldKey,
            'label' => $this->nullable($row['label'] ?? null),
            'question' => trim((string) ($row['question'] ?? '')),
            'answer_type' => trim((string) ($row['answer_type'] ?? 'text')),
            'quick_options' => $this->toList($row['quick_options'] ?? null),
            'step_order' => (int) ($row['step_order'] ?? 0),
            'is_required' => $this->toBool($row['is_required'] ?? true),
            'is_active' => $this->toBool($row['is_active'] ?? true),
            'validation_rules' => $this->toList($row['validation_rules'] ?? null),
        ];
    }

    protected function persistServiceRow(array $row, bool $overwrite): void
    {
        if (empty($row['meta']['aliases'])) {
            $row['meta'] = null;
        }

        $existing = ChatServiceItem::query()->where('slug', $row['slug'])->first();
        if ($existing && ! $overwrite) {
            return;
        }
        ChatServiceItem::query()->updateOrCreate(['slug' => $row['slug']], $row);
    }

    protected function persistIntentRow(array $row, bool $overwrite): void
    {
        if ($row['response_text'] === '') {
            throw new \RuntimeException('Chat intent response_text is required.');
        }

        $existing = ChatIntent::query()->where('slug', $row['slug'])->first();
        if ($existing && ! $overwrite) {
            return;
        }
        ChatIntent::query()->updateOrCreate(['slug' => $row['slug']], $row);
    }

    protected function persistKnowledgeRow(array $row, bool $overwrite): void
    {
        if ($row['answer'] === '') {
            throw new \RuntimeException('Knowledge item answer is required.');
        }

        $existing = ChatKnowledgeItem::query()->where('slug', $row['slug'])->first();
        if ($existing && ! $overwrite) {
            return;
        }
        ChatKnowledgeItem::query()->updateOrCreate(['slug' => $row['slug']], $row);
    }

    protected function persistResponseTemplateRow(array $row, bool $overwrite): void
    {
        if ($row['body'] === '') {
            throw new \RuntimeException('Response template body is required.');
        }

        $existing = ChatResponseTemplate::query()->where('slug', $row['slug'])->first();
        if ($existing && ! $overwrite) {
            return;
        }
        ChatResponseTemplate::query()->updateOrCreate(['slug' => $row['slug']], $row);
    }

    protected function persistQualificationRow(array $row, bool $overwrite): void
    {
        if ($row['question'] === '') {
            throw new \RuntimeException('Qualification question is required.');
        }

        $criteria = [
            'service_id' => $row['service_id'],
            'field_key' => $row['field_key'],
        ];

        $existing = ChatQualificationFlow::query()->where($criteria)->first();
        if ($existing && ! $overwrite) {
            return;
        }
        ChatQualificationFlow::query()->updateOrCreate($criteria, $row);
    }

    protected function resolveServiceId(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        $string = trim((string) $value);
        $service = ChatServiceItem::query()
            ->where('slug', Str::slug($string))
            ->orWhere('name', $string)
            ->first();

        return $service?->id;
    }

    protected function toList(mixed $value): ?array
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_array($value)) {
            return array_values(array_filter(array_map(fn ($item) => trim((string) $item), $value)));
        }

        $trimmed = trim((string) $value);
        $decoded = json_decode($trimmed, true);
        if (is_array($decoded)) {
            return array_values(array_filter(array_map(fn ($item) => trim((string) $item), $decoded)));
        }

        return array_values(array_filter(array_map(
            'trim',
            preg_split('/\r\n|\r|\n|,/', $trimmed),
        )));
    }

    protected function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
    }

    protected function nullable(mixed $value): ?string
    {
        $value = trim((string) ($value ?? ''));
        return $value === '' ? null : $value;
    }
}
