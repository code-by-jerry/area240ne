<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance</title>
    <style>
        :root {
            color-scheme: light;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #111827;
            background: #f8fafc;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        }

        .page {
            width: 100%;
            max-width: 1200px;
        }

        .card {
            display: grid;
            grid-template-columns: 1.2fr 0.9fr;
            gap: 1.5rem;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 1.25rem;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
            overflow: hidden;
        }

        .content {
            padding: 2rem;
        }

        .sidebar {
            padding: 2rem;
            background: #f8fafc;
        }

        .status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 0.9rem;
            border-radius: 999px;
            background: #e0e7ff;
            color: #3730a3;
            font-size: 0.875rem;
            font-weight: 700;
        }

        .tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 0.75rem;
            background: #4338ca;
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 700;
        }

        h1 {
            margin: 1.5rem 0 0.75rem;
            font-size: clamp(2rem, 2.5vw, 2.75rem);
            line-height: 1.05;
        }

        .subtitle {
            margin: 0;
            font-size: 1rem;
            color: #4b5563;
            line-height: 1.85;
        }

        .badge {
            display: inline-flex;
            padding: 0.5rem 0.8rem;
            border-radius: 999px;
            background: #e2e8f0;
            color: #334155;
            font-size: 0.9rem;
            margin-top: 1.5rem;
            font-weight: 600;
        }

        .panel {
            margin-top: 1.75rem;
            padding: 1.5rem;
            border-radius: 1rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
        }

        .panel strong {
            display: block;
            margin-bottom: 0.5rem;
            color: #0f172a;
        }

        .meta {
            margin-top: 1.75rem;
            color: #475569;
            font-size: 0.95rem;
            line-height: 1.8;
        }

        .meta div {
            margin-bottom: 0.95rem;
        }

        .meta span {
            display: block;
            color: #0f172a;
            font-weight: 600;
        }

        .list {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .list-item {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.2rem;
        }

        .list-item:last-child {
            margin-bottom: 0;
        }

        .list-icon {
            min-width: 0.9rem;
            margin-top: 0.2rem;
            color: #3b82f6;
            font-size: 1rem;
            line-height: 1;
        }

        .list-text {
            color: #475569;
            line-height: 1.75;
        }

        .list-text strong {
            color: #0f172a;
            font-weight: 700;
        }

        .note {
            margin-top: 1.5rem;
            color: #475569;
            font-size: 0.95rem;
            line-height: 1.7;
        }

        @media (max-width: 960px) {
            .card {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 560px) {
            .content,
            .sidebar {
                padding: 1.25rem;
            }

            .status,
            .badge {
                width: fit-content;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="card">
            <section class="content">
                <span class="status">
                    <span class="tag">IT</span>
                    Maintenance
                </span>

                <h1>Site Temporarily Unavailable</h1>
                <p class="subtitle">Due Server Resource Limits Reached — the site is currently undergoing maintenance to restore service.</p>

                <div class="badge">HTTP 503 — Service Unavailable</div>

                <div class="panel">
                    <strong>Summary:</strong>
                    The operations team is applying fixes. We expect service to be restored shortly. If you are an administrator, check the system dashboard and logs for details.
                </div>

                <div class="meta">
                    <div>
                        <span>Maintenance trigger</span>
                        2026-05-22 11:30:00 (Timezone: Asia/Kolkata)
                    </div>
                    <div>
                        <span>Support</span>
                        support@yourdomain.com
                    </div>
                    <div>
                        We apologise for the inconvenience. For urgent issues, contact the on-call engineer.
                    </div>
                </div>
            </section>

            <aside class="sidebar">
                <h2>Possible Technical Causes</h2>
                <p class="subtitle">A non-exhaustive list of issues to investigate.</p>

                <ul class="list">
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>CPU / High load:</strong> runaway processes, cron jobs, or heavy queries causing saturation.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Memory exhaustion:</strong> memory leaks, cache growth, or insufficient PHP memory limit.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Disk full:</strong> logs or uploads filling storage volumes.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Database connectivity:</strong> unreachable DB, slow queries, or connection pool exhaustion.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>External API failures:</strong> dependent service outages (payment, image CDN).</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Deployment in progress:</strong> migrations, cache clears, or service restarts.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Configuration error:</strong> invalid env values, credential rotation, or misconfigured services.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>SSL / Cert issues:</strong> expired certificate or misconfigured TLS.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Rate limiting / DDoS:</strong> traffic spikes triggering protection or throttling.</span>
                    </li>
                    <li class="list-item">
                        <span class="list-icon">•</span>
                        <span class="list-text"><strong>Storage/queue backlog:</strong> full queues, stuck jobs, or slow workers.</span>
                    </li>
                </ul>

                <p class="note">Suggested checks: monitoring dashboards, recent deploy logs, error logs, process list, disk usage, and queue workers.</p>
            </aside>
        </div>
    </div>
</body>
</html>
