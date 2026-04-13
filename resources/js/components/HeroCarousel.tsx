import ChatMockup from '@/components/ChatMockup';
import ChatWidget from '@/components/ChatWidget';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface HeroSlide {
    id: number;
    image_path: string;
    tag?: string;
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

const DEFAULT_SLIDE: HeroSlide = {
    id: 0,
    image_path:
        'https://ik.imagekit.io/area24onestorage/area24one%20layout%20images/slide%20default.jpg',
    tag: 'Premium Property Solutions',
    title: 'Intelligent Consultation. Expert Execution.',
    description:
        'Transform your property vision into reality with Area 24. We provide data-driven insights and expert management for Construction, Interiors, Real Estate, and more.',
    button_text: 'Get Started',
    button_link: '/chat',
    order: 0,
    is_active: true,
};

// Memoized slide content to prevent unnecessary re-renders
const SlideContent = memo(
    ({
        slide,
        index,
        prefersReducedMotion,
    }: {
        slide: HeroSlide;
        index: number;
        prefersReducedMotion: boolean;
    }) => {
        const animationProps = prefersReducedMotion
            ? { initial: false, animate: false }
            : {
                  initial: { y: 15, opacity: 0 },
                  animate: { y: 0, opacity: 1 },
              };

        const isFirstSlide = index === 0;

        return (
            <div className="relative z-10 flex h-full items-center justify-center px-4 py-8 md:px-12 md:py-0 lg:px-20">
                <div
                    className={`flex w-full flex-col justify-center gap-4 md:gap-8 lg:flex-row lg:items-center ${isFirstSlide ? 'lg:gap-24' : 'max-w-5xl'}`}
                >
                    {/* Text Content */}
                    <div
                        className={`text-center ${isFirstSlide ? 'max-w-xl lg:text-left' : 'mx-auto max-w-3xl space-y-2 md:space-y-6'}`}
                    >
                        {slide.tag && (
                            <motion.div
                                {...animationProps}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.5,
                                    ease: 'easeOut',
                                }}
                                className="mb-1 inline-flex items-center gap-2 md:mb-3"
                            >
                                <div className="h-px w-4 bg-[#C7A14A]/60 md:w-8" />
                                <span className="text-[8px] font-bold tracking-[0.2em] text-[#C7A14A] uppercase md:text-[10px]">
                                    {slide.tag}
                                </span>
                                <div className="h-px w-4 bg-[#C7A14A]/60 md:w-8" />
                            </motion.div>
                        )}

                        {slide.title && (
                            <motion.h1
                                {...animationProps}
                                transition={{
                                    delay: 0.2,
                                    duration: 0.6,
                                    ease: 'easeOut',
                                }}
                                className={`leading-[1.1] font-black tracking-tighter text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
                                    isFirstSlide
                                        ? 'mb-2 text-xl md:mb-4 md:text-5xl lg:text-6xl'
                                        : 'text-2xl md:text-6xl'
                                }`}
                            >
                                {slide.title.split(' ').map((word, i) => (
                                    <span
                                        key={i}
                                        className={
                                            word.toLowerCase() === 'expert' ||
                                            word.toLowerCase() ===
                                                'intelligent' ||
                                            word.toLowerCase() ===
                                                'consultation.'
                                                ? 'text-[#C7A14A]'
                                                : ''
                                        }
                                    >
                                        {word}{' '}
                                    </span>
                                ))}
                            </motion.h1>
                        )}

                        {slide.description && (
                            <motion.p
                                {...animationProps}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.6,
                                    ease: 'easeOut',
                                }}
                                className={`font-medium text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
                                    isFirstSlide
                                        ? 'mb-4 text-[11px] opacity-90 md:mb-8 md:text-lg lg:text-xl'
                                        : 'mx-auto max-w-2xl text-[12px] opacity-90 md:text-xl'
                                }`}
                            >
                                {slide.description}
                            </motion.p>
                        )}

                        {slide.button_text && slide.button_link && (
                            <motion.div
                                {...animationProps}
                                transition={{
                                    delay: 0.4,
                                    duration: 0.6,
                                    ease: 'easeOut',
                                }}
                                className={`flex flex-row items-center gap-3 md:gap-4 ${isFirstSlide ? 'justify-center lg:justify-start' : 'justify-center'}`}
                            >
                                <Link
                                    href={slide.button_link}
                                    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-4 py-1.5 text-[11px] font-bold transition-all hover:scale-105 hover:shadow-[#C7A14A]/20 active:scale-95 md:px-8 md:py-3 md:text-base ${
                                        isFirstSlide
                                            ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/40 md:shadow-2xl'
                                            : 'bg-white text-brand-dark shadow-xl shadow-white/10 md:shadow-2xl'
                                    }`}
                                >
                                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#C7A14A]/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                                    <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                                        {slide.button_text}
                                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                                    </span>
                                </Link>

                                {isFirstSlide && (
                                    <Link
                                        href="/estimate"
                                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95 md:px-8 md:py-3 md:text-base"
                                    >
                                        <span className="relative z-10">
                                            Estimate Cost
                                        </span>
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Simulation Chat Widget - Always hidden on mobile */}
                    {isFirstSlide && (
                        <motion.div
                            initial={
                                prefersReducedMotion
                                    ? false
                                    : { x: 100, opacity: 0, rotate: 5 }
                            }
                            animate={
                                prefersReducedMotion
                                    ? false
                                    : { x: 0, opacity: 1, rotate: 0 }
                            }
                            transition={{
                                delay: 0.5,
                                duration: 0.8,
                                ease: 'easeOut',
                            }}
                            className="hidden w-full max-w-md lg:block xl:max-w-lg"
                        >
                            <div className="group relative">
                                <div className="absolute -inset-4 rounded-[2.5rem] bg-brand-primary/20 blur-3xl transition-colors duration-700 group-hover:bg-[#C7A14A]/20" />
                                <div className="absolute -inset-8 rounded-[3rem] bg-[#C7A14A]/10 opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                                <div className="relative scale-95 transform-gpu transition-transform duration-700 hover:scale-105 xl:scale-100">
                                    <ChatMockup />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    },
);

SlideContent.displayName = 'SlideContent';

export const HeroCarousel = memo(function HeroCarousel({
    slides,
}: HeroCarouselProps) {
    const slidesWithDefault = useMemo(() => {
        // Ensure slides is an array and filter out any invalid entries
        const validSlides = Array.isArray(slides) ? slides : [];

        // Sort dynamic slides by 'order' strictly (ascending)
        const sortedDynamicSlides = [...validSlides].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
        );

        // Strictly Enforce Order: Static Chat slide (DEFAULT_SLIDE) is ALWAYS index 0
        return [DEFAULT_SLIDE, ...sortedDynamicSlides];
    }, [slides]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Preload only the current and next slide to reduce startup bandwidth.
    useEffect(() => {
        if (!slidesWithDefault || slidesWithDefault.length <= 1) return;

        const currentSlide = slidesWithDefault[currentIndex];
        const nextSlide =
            slidesWithDefault[(currentIndex + 1) % slidesWithDefault.length];

        const currentImage = new Image();
        currentImage.src = currentSlide.image_path;
        currentImage.onload = () => setIsLoaded(true);

        if (nextSlide.image_path !== currentSlide.image_path) {
            const nextImage = new Image();
            nextImage.src = nextSlide.image_path;
        }
    }, [currentIndex, slidesWithDefault]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (isPaused) return;

        timerRef.current = setInterval(() => {
            setCurrentIndex(
                (prev) => (prev + 1) % (slidesWithDefault?.length || 1),
            );
        }, 8000);
    }, [slidesWithDefault, isPaused]);

    useEffect(() => {
        if (!slidesWithDefault || slidesWithDefault.length <= 1) return;
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [slidesWithDefault, startTimer, isPaused]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        startTimer();
    }, [startTimer]);

    const nextSlide = useCallback(() => {
        if (!slidesWithDefault) return;
        setCurrentIndex((prev) => (prev + 1) % slidesWithDefault.length);
        resetTimer();
    }, [slidesWithDefault, resetTimer]);

    const prevSlide = useCallback(() => {
        if (!slidesWithDefault) return;
        setCurrentIndex(
            (prev) =>
                (prev - 1 + slidesWithDefault.length) %
                slidesWithDefault.length,
        );
        resetTimer();
    }, [slidesWithDefault, resetTimer]);

    if (!slidesWithDefault || slidesWithDefault.length === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-brand-dark text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Welcome to Area 24</h1>
                    <p className="mt-4 text-lg opacity-80">
                        Premium Construction & Interiors
                    </p>
                </div>
            </div>
        );
    }

    const currentSlide = slidesWithDefault[currentIndex];
    const transitionDuration = prefersReducedMotion ? 0.3 : 0.5;

    return (
        <div
            className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-brand-dark pt-[72px] sm:pt-[76px] md:h-screen md:min-h-screen md:pt-[72px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 z-50 h-1 w-full bg-white/10">
                {!prefersReducedMotion && (
                    <motion.div
                        key={currentIndex + (isPaused ? '-paused' : '-active')}
                        initial={{ width: '0%' }}
                        animate={isPaused ? { width: '0%' } : { width: '100%' }}
                        transition={{
                            duration: isPaused ? 0 : 8,
                            ease: 'linear',
                        }}
                        className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    />
                )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: transitionDuration,
                        ease: 'easeOut',
                    }}
                    className="absolute inset-0 h-full w-full"
                    style={{ zIndex: 0 }}
                >
                    {/* Image Layer - Optimized */}
                    <div
                        className={`absolute inset-0 h-full w-full transition-all duration-700 ${currentIndex === 0 ? '' : 'bg-black'}`}
                    >
                        {/* Background Filler Layer - Only for large screens and non-first slides */}
                        {currentIndex !== 0 && (
                            <div
                                className="absolute inset-0 hidden h-full w-full opacity-60 blur-3xl lg:block"
                                style={{
                                    backgroundImage: `url(${currentSlide.image_path})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transform: 'scale(1.2)', // Prevent white edges from blur
                                }}
                            />
                        )}

                        {/* Focused Image Layer */}
                        <div
                            className="absolute inset-0 h-full w-full"
                            style={{
                                backgroundImage: `url(${currentSlide.image_path})`,
                                backgroundSize:
                                    currentIndex === 0 ? 'cover' : 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                transform: isLoaded
                                    ? 'scale(1.02)'
                                    : 'scale(1)',
                                transition: 'transform 8s ease-out',
                            }}
                        />

                        {/* Linear Blur/Gradient Edges for non-first slides */}
                        {currentIndex !== 0 && (
                            <>
                                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent lg:w-32" />
                                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent lg:w-32" />

                                {/* Top/Bottom subtle fade for better integration */}
                                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                            </>
                        )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent" />

                    {/* Content Layer */}
                    <SlideContent
                        slide={currentSlide}
                        index={currentIndex}
                        prefersReducedMotion={!!prefersReducedMotion}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {slidesWithDefault.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="group absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/50 md:left-10 md:p-3"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="group absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/50 md:right-10 md:p-3"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 md:bottom-10 md:gap-2">
                        {slidesWithDefault.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    resetTimer();
                                }}
                                onMouseEnter={() => {
                                    setCurrentIndex(index);
                                    resetTimer();
                                }}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-4 bg-white'
                                        : 'w-1 bg-white/40 hover:bg-white/70'
                                } md:h-1.5 ${index === currentIndex ? 'md:w-8' : 'md:w-2'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Real ChatWidget floating at the bottom right for other slides or always visible */}
            {currentIndex !== 0 && (
                <div className="absolute right-6 bottom-6 z-30 md:right-10 md:bottom-10">
                    <ChatWidget />
                </div>
            )}
        </div>
    );
});
