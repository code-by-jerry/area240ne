import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePage } from '@inertiajs/react';
import 'lenis/dist/lenis.css';

export default function SmoothScrollManager() {
    const lenisRef = useRef<Lenis | null>(null);
    const { url } = usePage();

    useEffect(() => {
        // defined excluded paths
        const excludedPaths = ['/admin', '/dashboard', '/login', '/register', '/auth'];
        const isExcluded = excludedPaths.some((path) => url.startsWith(path));

        if (isExcluded) {
            // If we are on an excluded page, ensure lenis is destroyed
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            // Remove the lenis css class from html if it exists
            document.documentElement.classList.remove('lenis', 'lenis-smooth');
            return;
        }

        // Initialize Lenis if not already active
        if (!lenisRef.current) {
            const lenis = new Lenis({
                duration: 2.0, // "Sluggish" / Slow motion feel (default is usually 1.0-1.2)
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.8, // Slower scrolling speed
                touchMultiplier: 1.5,
            });

            lenisRef.current = lenis;

            // Connect Lenis to the animation frame
            const raf = (time: number) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        }

        // Cleanup on unmount
        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [url]); // Re-run when URL changes to check exclusion rules

    return null;
}
