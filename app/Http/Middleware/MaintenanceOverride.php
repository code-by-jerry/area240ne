<?php

namespace App\Http\Middleware;

use Closure;
use DateTime;
use DateTimeZone;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MaintenanceOverride
{
    public function handle(Request $request, Closure $next): Response
    {
        $enabled = config('app.mo_enabled');

        if (! filter_var($enabled, FILTER_VALIDATE_BOOLEAN)) {
            return $next($request);
        }

        $timezone = config('app.mo_timezone', 'UTC');
        $target = config('app.mo_target');

        try {
            $targetDate = new DateTime($target, new DateTimeZone($timezone));
            $now = new DateTime('now', new DateTimeZone($timezone));
        } catch (\Exception $e) {
            return $next($request);
        }

        if ($now >= $targetDate) {
            return response()->view('maintenance', [], 503);
        }

        return $next($request);
    }
}
