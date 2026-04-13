<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class ImageKitService
{
    public function configured(): bool
    {
        return filled(config('services.imagekit.private_key'))
            && filled(config('services.imagekit.public_key'))
            && filled(config('services.imagekit.url_endpoint'));
    }

    public function upload(UploadedFile $file, ?string $fileName = null, ?string $folder = null): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('ImageKit is not configured.');
        }

        $resolvedFolder = $folder ?? config('services.imagekit.folder', '/media-assets');
        $resolvedName = $fileName ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        $response = Http::withBasicAuth((string) config('services.imagekit.private_key'), '')
            ->asMultipart()
            ->post('https://upload.imagekit.io/api/v1/files/upload', [
                [
                    'name' => 'file',
                    'contents' => base64_encode($file->get()),
                ],
                [
                    'name' => 'fileName',
                    'contents' => $resolvedName,
                ],
                [
                    'name' => 'folder',
                    'contents' => $resolvedFolder,
                ],
                [
                    'name' => 'useUniqueFileName',
                    'contents' => 'true',
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Image upload to ImageKit failed.');
        }

        $payload = $response->json();

        return [
            'file_id' => $payload['fileId'] ?? null,
            'url' => $payload['url'] ?? null,
            'file_path' => $payload['filePath'] ?? null,
            'name' => $payload['name'] ?? null,
        ];
    }

    public function delete(?string $fileId): void
    {
        if (! $fileId || ! $this->configured()) {
            return;
        }

        Http::withBasicAuth((string) config('services.imagekit.private_key'), '')
            ->delete("https://api.imagekit.io/v1/files/{$fileId}");
    }
}