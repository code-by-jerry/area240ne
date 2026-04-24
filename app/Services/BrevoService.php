<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BrevoService
{
    private string $apiKey;
    private string $senderEmail;
    private string $senderName;
    private string $toEmail;
    private string $toName;
    private string $apiUrl = 'https://api.brevo.com/v3/smtp/email';

    public function __construct()
    {
        $this->apiKey       = config('services.brevo.api_key');
        $this->senderEmail  = config('services.brevo.sender_email');
        $this->senderName   = config('services.brevo.sender_name');
        $this->toEmail      = config('services.brevo.to_email');
        $this->toName       = config('services.brevo.to_name');
    }

    /**
     * Send a new lead notification email.
     */
    public function sendLeadNotification(array $lead): bool
    {
        $name     = $lead['name']     ?? 'Unknown';
        $phone    = $lead['phone']    ?? 'N/A';
        $email    = $lead['email']    ?? 'N/A';
        $service  = $lead['service']  ?? 'N/A';
        $location = $lead['location'] ?? 'N/A';
        $message  = $lead['message']  ?? '';
        $q1       = $lead['q1_answer'] ?? '';
        $q2       = $lead['q2_answer'] ?? '';
        $q3       = $lead['q3_answer'] ?? '';

        $subject = "🔔 New Lead: {$name} — {$service}";

        $html = "
        <div style='font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;'>
            <div style='background:#0A1628;padding:20px 24px;border-radius:8px 8px 0 0;'>
                <h2 style='color:#C7A14A;margin:0;font-size:18px;'>New Lead — Area24One</h2>
                <p style='color:#ffffff80;margin:4px 0 0;font-size:13px;'>Submitted via area24one.com</p>
            </div>
            <div style='background:#ffffff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;'>
                <table style='width:100%;border-collapse:collapse;font-size:14px;'>
                    <tr><td style='padding:8px 0;color:#64748b;width:140px;'>Name</td><td style='padding:8px 0;font-weight:600;color:#0f172a;'>{$name}</td></tr>
                    <tr><td style='padding:8px 0;color:#64748b;'>Phone</td><td style='padding:8px 0;font-weight:600;color:#0f172a;'>{$phone}</td></tr>
                    <tr><td style='padding:8px 0;color:#64748b;'>Email</td><td style='padding:8px 0;color:#0f172a;'>{$email}</td></tr>
                    <tr><td style='padding:8px 0;color:#64748b;'>Service</td><td style='padding:8px 0;'><span style='background:#0A1628;color:#C7A14A;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;'>{$service}</span></td></tr>
                    <tr><td style='padding:8px 0;color:#64748b;'>Location</td><td style='padding:8px 0;color:#0f172a;'>{$location}</td></tr>
                    " . ($q1 ? "<tr><td style='padding:8px 0;color:#64748b;'>Q1 Answer</td><td style='padding:8px 0;color:#0f172a;'>{$q1}</td></tr>" : '') . "
                    " . ($q2 ? "<tr><td style='padding:8px 0;color:#64748b;'>Q2 Answer</td><td style='padding:8px 0;color:#0f172a;'>{$q2}</td></tr>" : '') . "
                    " . ($q3 ? "<tr><td style='padding:8px 0;color:#64748b;'>Q3 Answer</td><td style='padding:8px 0;color:#0f172a;'>{$q3}</td></tr>" : '') . "
                    " . ($message ? "<tr><td style='padding:8px 0;color:#64748b;vertical-align:top;'>Message</td><td style='padding:8px 0;color:#0f172a;'>{$message}</td></tr>" : '') . "
                </table>
                <div style='margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;'>
                    <a href='https://area24one.com/dashboard' style='background:#0A1628;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;'>View in Dashboard →</a>
                </div>
            </div>
            <p style='text-align:center;color:#94a3b8;font-size:11px;margin-top:16px;'>Area24One · Bangalore, Karnataka</p>
        </div>";

        return $this->send($subject, $html);
    }

    /**
     * Core send method via Brevo API.
     */
    private function send(string $subject, string $htmlContent): bool
    {
        try {
            $response = Http::withHeaders([
                'api-key'      => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'sender'      => ['name' => $this->senderName, 'email' => $this->senderEmail],
                'to'          => [['name' => $this->toName, 'email' => $this->toEmail]],
                'subject'     => $subject,
                'htmlContent' => $htmlContent,
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::warning('Brevo send failed', ['status' => $response->status(), 'body' => $response->body()]);
            return false;

        } catch (\Throwable $e) {
            Log::error('Brevo exception', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
