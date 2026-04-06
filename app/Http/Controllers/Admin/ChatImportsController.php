<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatImportLog;
use App\Services\Chat\ChatImportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatImportsController extends Controller
{
    public function __construct(
        protected ChatImportService $importService,
    ) {}

    public function index()
    {
        return Inertia::render('Admin/ChatImports', [
            'logs' => ChatImportLog::query()
                ->with('createdBy:id,name')
                ->latest()
                ->limit(25)
                ->get(),
            'modules' => [
                ['value' => 'chat_services', 'label' => 'Chat Services'],
                ['value' => 'chat_intents', 'label' => 'Chat Intents'],
                ['value' => 'chat_knowledge_items', 'label' => 'Chat Knowledge Items'],
                ['value' => 'chat_response_templates', 'label' => 'Response Templates'],
                ['value' => 'chat_qualification_flows', 'label' => 'Qualification Flows'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module' => ['required', 'in:chat_services,chat_intents,chat_knowledge_items,chat_response_templates,chat_qualification_flows'],
            'file' => ['required', 'file', 'mimes:csv,txt,json'],
            'overwrite' => ['nullable', 'boolean'],
        ]);

        $result = $this->importService->import(
            $validated['module'],
            $request->file('file'),
            (bool) ($validated['overwrite'] ?? false),
            auth()->id(),
        );

        return redirect()->back()->with('success', sprintf(
            'Import finished: %d succeeded, %d failed.',
            $result['success_rows'],
            $result['failed_rows'],
        ));
    }

    public function downloadTemplate(string $module, string $format): StreamedResponse
    {
        abort_unless(
            in_array($module, ['chat_services', 'chat_intents', 'chat_knowledge_items', 'chat_response_templates', 'chat_qualification_flows'], true),
            404,
        );

        abort_unless(in_array($format, ['csv', 'json'], true), 404);

        $rows = match ($module) {
            'chat_services' => [[
                'name' => 'Construction',
                'slug' => 'construction',
                'icon' => 'construction',
                'is_active' => true,
                'short_summary' => 'End-to-end construction support',
                'description' => 'Full construction planning and execution.',
                'who_its_for' => 'Home owners, Villa projects',
                'offerings' => 'Turnkey construction, Renovation support',
                'pricing_note' => 'Pricing depends on area and finish level.',
                'timeline_note' => 'Timeline varies by scope and approvals.',
                'cta_text' => 'Share your project type, location, budget, and timeline.',
                'locations' => 'Bangalore, Mysore, Ballari',
                'sort_order' => 1,
            ]],
            'chat_intents' => [[
                'name' => 'Construction pricing',
                'slug' => 'construction-pricing',
                'service_slug' => 'construction',
                'keywords' => 'price, cost, budget, pricing',
                'response_text' => 'Pricing depends on area, scope, and finish level.',
                'redirect_url' => '/cost-estimator',
                'category' => 'pricing',
                'priority' => 80,
                'conversion_rate' => 0,
                'priority_score' => 0,
                'is_high_value' => true,
                'is_active' => true,
            ]],
            'chat_knowledge_items' => [[
                'title' => 'Construction pricing',
                'slug' => 'construction-pricing',
                'category' => 'pricing',
                'service_slug' => 'construction',
                'question_patterns' => 'price, cost, budget, pricing',
                'answer' => 'Pricing depends on area, scope, and finish level.',
                'short_answer' => 'Pricing depends on area and finish level.',
                'tags' => 'pricing, cost, budget',
                'priority' => 80,
                'is_active' => true,
            ]],
            'chat_response_templates' => [[
                'name' => 'Fallback Template',
                'slug' => 'fallback-template',
                'type' => 'fallback',
                'title' => '',
                'body' => 'Tell me which service you need, or describe your requirement in one line.',
                'quick_replies' => '',
                'highlight' => false,
                'requires_input' => false,
                'ui_variant' => '',
                'is_active' => true,
            ]],
            'chat_qualification_flows' => [[
                'service_slug' => 'construction',
                'field_key' => 'budget',
                'label' => 'Budget',
                'question' => 'What is your approximate budget range?',
                'answer_type' => 'option',
                'quick_options' => 'Under 50 Lakhs, 50 Lakhs to 1 Crore, Above 1 Crore',
                'step_order' => 1,
                'is_required' => true,
                'is_active' => true,
                'validation_rules' => 'required',
            ]],
        };

        $filename = "{$module}_template.{$format}";

        if ($format === 'json') {
            return response()->streamDownload(
                static function () use ($rows) {
                    echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                },
                $filename,
                ['Content-Type' => 'application/json'],
            );
        }

        return response()->streamDownload(
            static function () use ($rows) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, array_keys($rows[0]));
                foreach ($rows as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            },
            $filename,
            ['Content-Type' => 'text/csv'],
        );
    }
}
