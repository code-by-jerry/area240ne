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
                duration: 1.2, // Reduced from 2.0 for better performance
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.0, // Increased from 0.8 for more responsive feel
                touchMultiplier: 1.2, // Reduced from 1.5
                infinite: false,
            });

            lenisRef.current = lenis;

            // Connect Lenis to the animation frame with frame skipping for performance
            let frameCount = 0;
            const raf = (time: number) => {
                frameCount++;
                // Skip every other frame on lower-end devices for better performance
                if (frameCount % 2 === 0 || !lenisRef.current) {
                    lenis.raf(time);
                }
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
    }, [url, isMobile]); // Re-run when URL changes or device type changes

    return null;
}
