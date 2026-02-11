import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface HeroSlide {
    id: number;
    image_path: string;
    title?: string;
    description?: string;
    button_text?: string;
    button_link?: string;
    order: number;
    is_active: boolean;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
}

// Memoized slide content to prevent unnecessary re-renders
const SlideContent = memo(({ slide, prefersReducedMotion }: { slide: HeroSlide; prefersReducedMotion: boolean }) => {
    const animationProps = prefersReducedMotion 
        ? { initial: false, animate: false }
        : { 
            initial: { y: 30, opacity: 0 },
            animate: { y: 0, opacity: 1 },
          };

    return (
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <div className="max-w-5xl space-y-8">
                {slide.title && (
                    <motion.h1 
                        {...animationProps}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
                    >
                        {slide.title}
                    </motion.h1>
                )}
                
                {slide.description && (
                    <motion.p 
                        {...animationProps}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mx-auto max-w-2xl text-lg text-slate-200 md:text-2xl"
                    >
                        {slide.description}
                    </motion.p>
                )}

                {slide.button_text && slide.button_link && (
                    <motion.div
                        {...animationProps}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <Link
                            href={slide.button_link}
                            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-brand-dark transition-transform hover:scale-105 hover:bg-slate-100"
                        >
                            {slide.button_text}
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
});

SlideContent.displayName = 'SlideContent';

export const HeroCarousel = memo(function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Preload images for smoother transitions
    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        
        const preloadImages = () => {
            slides.forEach((slide, index) => {
                const img = new Image();
                img.src = slide.image_path;
                if (index === 0) {
                    img.onload = () => setIsLoaded(true);
                }
            });
        };
        
        preloadImages();
    }, [slides]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (slides?.length || 1));
        }, 5000); // Reduced from 6000ms
    }, [slides]);

    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [slides, startTimer]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        startTimer();
    }, [startTimer]);

    const nextSlide = useCallback(() => {
        if (!slides) return;
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        resetTimer();
    }, [slides, resetTimer]);

    const prevSlide = useCallback(() => {
        if (!slides) return;
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        resetTimer();
    }, [slides, resetTimer]);

    if (!slides || slides.length === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-brand-dark text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to Area 24</h1>
                    <p className="mt-4 text-lg opacity-80">Premium Construction & Interiors</p>
                </div>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];
    const transitionDuration = prefersReducedMotion ? 0.3 : 0.5;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-brand-dark">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: transitionDuration, ease: "easeOut" }}
                    className="absolute inset-0"
                    style={{ zIndex: 0 }}
                >
                    {/* Image Layer - Optimized */}
                    <div 
                        className="absolute inset-0 h-full w-full"
                        style={{
                            backgroundImage: `url(${currentSlide.image_path})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: isLoaded ? 'scale(1.02)' : 'scale(1)',
                            transition: 'transform 8s ease-out',
                        }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
                    
                    {/* Content Layer */}
                    <SlideContent slide={currentSlide} prefersReducedMotion={!!prefersReducedMotion} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:left-10"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:right-10"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => { setCurrentIndex(index); resetTimer(); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});
