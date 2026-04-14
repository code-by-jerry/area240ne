import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { usePage } from '@inertiajs/react';
import 'lenis/dist/lenis.css';

export default function SmoothScrollManager() {
    const lenisRef = useRef<Lenis | null>(null);
    const { url } = usePage();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice || isSmallScreen);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // defined excluded paths
        const excludedPaths = ['/admin', '/dashboard', '/login', '/register', '/auth'];
        const isExcluded = excludedPaths.some((path) => url.startsWith(path));

        // Disable smooth scroll on mobile for better performance
        if (isExcluded || isMobile) {
            // If we are on an excluded page or mobile, ensure lenis is destroyed
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
                duration: 0.9,
                easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out — lighter than exponential
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.0,
                touchMultiplier: 1.0,
                infinite: false,
            });

            lenisRef.current = lenis;

            // Clean RAF loop — no frame skipping (skipping causes jank, not smoothness)
            let rafId: number;
            const raf = (time: number) => {
                if (lenisRef.current) {
                    lenis.raf(time);
                    rafId = requestAnimationFrame(raf);
                }
            };
            rafId = requestAnimationFrame(raf);

            // Store rafId for cleanup
            (lenisRef as any)._rafId = rafId;
        }

        // Cleanup on unmount
        return () => {
            if (lenisRef.current) {
                const rafId = (lenisRef as any)._rafId;
                if (rafId) cancelAnimationFrame(rafId);
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [url, isMobile]); // Re-run when URL changes or device type changes

    return null;
}
