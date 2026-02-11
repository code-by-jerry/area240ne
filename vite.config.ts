import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Manual chunk splitting for better caching
                manualChunks: {
                    'vendor': [
                        'react',
                        'react-dom',
                        'framer-motion',
                        '@inertiajs/react',
                    ],
                    'ui': [
                        'lucide-react',
                    ],
                },
            },
        },
        // Minification options
        minify: 'esbuild',
        target: 'es2020',
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'framer-motion',
            '@inertiajs/react',
            'lucide-react',
            'lenis',
        ],
    },
});
