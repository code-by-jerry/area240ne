import '../css/app.css';

import axios from 'axios';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import SmoothScrollManager from '@/components/SmoothScrollManager';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Simple route helper fallback for frontend
(window as any).route = (name: string, params: any = {}) => {
    const routes: Record<string, string> = {
        'home': '/',
        'cost-estimator.create': '/cost-estimator',
        'cost-estimator.store': '/cost-estimator',
        'cost-estimation.show': '/cost-estimation/:uuid',
    };
    
    let path = routes[name] || name;
    
    // Replace params like :uuid
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            path = path.replace(`:${key}`, params[key]);
        });
    } else if (params && (typeof params === 'string' || typeof params === 'number')) {
        // Handle single param case like route('name', id)
        path = path.replace(/:[a-zA-Z0-9_]+/, String(params));
    }
    
    return path;
};

// CSRF for axios (fixes 419 on POST /chat from widget and ChatApp)
const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
if (csrfToken) {
    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
}
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ).then((module: any) => {
            const page = module.default;
            const defaultLayout = page.layout;
            page.layout = (pageNode: any) => (
                <>
                    <SmoothScrollManager />
                    {defaultLayout ? defaultLayout(pageNode) : pageNode}
                </>
            );
            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#0B1220',
    },
});

// This will set light / dark mode on load...
initializeTheme();
