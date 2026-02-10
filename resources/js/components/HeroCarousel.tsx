import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Preload next image to prevent flickering
    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        const nextIndex = (currentIndex + 1) % slides.length;
        const img = new Image();
        img.src = slides[nextIndex].image_path;
    }, [currentIndex, slides]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
    }, [slides?.length]);

    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [slides?.length, startTimer]);

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        startTimer();
    };

    const nextSlide = () => {
        if (!slides) return;
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        resetTimer();
    };

    const prevSlide = () => {
        if (!slides) return;
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        resetTimer();
    };

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

    return (
        <div className="relative h-screen w-full overflow-hidden bg-brand-dark">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ zIndex: 0 }}
                >
                    {/* Image Layer */}
                    <img
                        src={slides[currentIndex].image_path}
                        alt={slides[currentIndex].title || "Hero Slide"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10000ms] ease-linear hover:scale-105"
                        loading={currentIndex === 0 ? "eager" : "lazy"}
                        style={{ willChange: 'transform, opacity' }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
                    
                    {/* Content Layer */}
                    <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
                        <div className="max-w-5xl space-y-8">
                            {slides[currentIndex].title && (
                                <motion.h1 
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
                                >
                                    {slides[currentIndex].title}
                                </motion.h1>
                            )}
                            
                            {slides[currentIndex].description && (
                                <motion.p 
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mx-auto max-w-2xl text-lg text-slate-200 md:text-2xl"
                                >
                                    {slides[currentIndex].description}
                                </motion.p>
                            )}

                            {slides[currentIndex].button_text && slides[currentIndex].button_link && (
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    <Link
                                        href={slides[currentIndex].button_link}
                                        className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-brand-dark transition-all hover:scale-105 hover:bg-slate-100 hover:shadow-lg hover:shadow-white/20"
                                    >
                                        {slides[currentIndex].button_text}
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Outside AnimatePresence to remain clickable */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="group absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:left-10"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-8 w-8 transition-transform group-hover:-translate-x-1" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="group absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 md:right-10"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="h-8 w-8 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); resetTimer(); }}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    index === currentIndex ? 'w-12 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
