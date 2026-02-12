import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, useCallback, memo } from 'react';

const stories = [
    {
        id: 1,
        video: 'https://www.pexels.com/download/video/5824192/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 2,
        video: 'https://www.pexels.com/download/video/29681897/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 3,
        video: 'https://www.pexels.com/download/video/32144168/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 4,
        video: 'https://www.pexels.com/download/video/29681899/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 5,
        video: 'https://www.pexels.com/download/video/34292919/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 6,
        video: 'https://www.pexels.com/download/video/34208839/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 7,
        video: 'https://www.pexels.com/download/video/34010377/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 8,
        video: 'https://www.pexels.com/download/video/34236991/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 9,
        video: 'https://www.pexels.com/download/video/34154109/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 10,
        video: 'https://www.pexels.com/download/video/34292914/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 11,
        video: 'https://www.pexels.com/download/video/35458123/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 12,
        video: 'https://www.pexels.com/download/video/34237009/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 13,
        video: 'https://www.pexels.com/download/video/29532430/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 14,
        video: 'https://www.pexels.com/download/video/34593442/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 15,
        video: 'https://www.pexels.com/download/video/32477168/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 16,
        video: 'https://www.pexels.com/download/video/28514875/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 17,
        video: 'https://www.pexels.com/download/video/34373823/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 18,
        video: 'https://www.pexels.com/download/video/28514866/',
        title: 'Residential Space',
        duration: '0:15'
    },
    {
        id: 19,
        video: 'https://www.pexels.com/download/video/36065026/',
        title: 'Pool',
        duration: '0:15'
    },
    {
        id: 20,
        video: 'https://www.pexels.com/download/video/27682746/',
        title: 'Pool',
        duration: '0:15'
    },
    {
        id: 21,
        video: 'https://www.pexels.com/download/video/29138315/',
        title: 'Pool',
        duration: '0:15'
    },
    {
        id: 22,
        video: 'https://www.pexels.com/download/video/6617117/',
        title: 'Pool',
        duration: '0:15'
    },
    {
        id: 23,
        video: 'https://www.pexels.com/download/video/36065027/',
        title: 'Lounge & City View',
        duration: '0:15'
    },
    {
        id: 24,
        video: 'https://www.pexels.com/download/video/29532359/',
        title: 'Gym',
        duration: '0:15'
    }
];

// Memoized story card to prevent unnecessary re-renders
const StoryCard = memo(({ 
    story, 
    index, 
    onClick,
    prefersReducedMotion 
}: { 
    story: typeof stories[0]; 
    index: number; 
    onClick: () => void;
    prefersReducedMotion: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (videoRef.current && isVisible) {
            videoRef.current.play().catch(() => {});
        }
    }, [isVisible]);

    const handleMouseLeave = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, []);

    const motionProps = prefersReducedMotion 
        ? {}
        : { layoutId: `story-${story.id}` };

    return (
        <motion.div
            ref={cardRef}
            {...motionProps}
            onClick={onClick}
            className="group relative min-w-[180px] md:min-w-[220px] aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-zinc-900/5 transition-transform hover:-translate-y-1 hover:shadow-xl snap-center"
        >
            {isVisible ? (
                <video
                    ref={videoRef}
                    src={story.video}
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    muted
                    playsInline
                    preload="metadata"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            ) : (
                <div className="h-full w-full bg-zinc-800 animate-pulse" />
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                    <Play className="h-6 w-6 fill-white text-white" />
                </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 rounded-full border-2 border-brand-primary p-0.5">
                        <div className="h-full w-full rounded-full bg-brand-primary/20 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">A24</span>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-white/90 truncate">{story.title}</span>
                </div>
            </div>
        </motion.div>
    );
});

StoryCard.displayName = 'StoryCard';

export const StoriesSection = memo(function StoriesSection() {
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const modalVideoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const openStory = useCallback((index: number) => {
        setSelectedStoryIndex(index);
        setIsMuted(false);
    }, []);

    const closeStory = useCallback(() => {
        setSelectedStoryIndex(null);
    }, []);

    const nextStory = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedStoryIndex(prev => {
            if (prev !== null && prev < stories.length - 1) {
                return prev + 1;
            }
            return null;
        });
    }, []);

    const prevStory = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedStoryIndex(prev => {
            if (prev !== null && prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    }, []);

    const toggleMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(prev => !prev);
    }, []);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedStoryIndex === null) return;
            
            if (e.key === 'Escape') closeStory();
            if (e.key === 'ArrowRight') nextStory();
            if (e.key === 'ArrowLeft') prevStory();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedStoryIndex, closeStory, nextStory, prevStory]);

    return (
        <section className="py-16 bg-zinc-50 dark:bg-black/20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2">
                            <div className="h-px w-6 bg-[#C7A14A]" />
                            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                Visual Stories
                            </span>
                        </div>
                        <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            A glimpse into our world of{' '}
                            <span className="text-[#C7A14A]">construction, design, and development</span>
                        </h2>
                    </div>
                </div>

                {/* Stories Carousel */}
                <div className="relative group/carousel">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 text-zinc-400 hover:text-brand-primary dark:text-zinc-600 dark:hover:text-white transition-colors hidden xl:block"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft className="h-10 w-10" />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                        {stories.map((story, index) => (
                            <StoryCard
                                key={story.id}
                                story={story}
                                index={index}
                                onClick={() => openStory(index)}
                                prefersReducedMotion={!!prefersReducedMotion}
                            />
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 text-zinc-400 hover:text-brand-primary dark:text-zinc-600 dark:hover:text-white transition-colors hidden xl:block"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight className="h-10 w-10" />
                    </button>
                </div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedStoryIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
                        onClick={closeStory}
                    >
                        <button
                            onClick={closeStory}
                            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div 
                            className="relative h-full max-h-[90vh] w-full max-w-md aspect-[9/16]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                {...(prefersReducedMotion ? {} : { layoutId: `story-${stories[selectedStoryIndex].id}` })}
                                className="relative h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
                            >
                                <video
                                    ref={modalVideoRef}
                                    src={stories[selectedStoryIndex].video}
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    playsInline
                                    loop
                                    muted={isMuted}
                                    preload="auto"
                                />

                                {/* Progress Bar (Visual only for now) */}
                                <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                                    {stories.map((_, idx) => (
                                        <div key={idx} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                                            <div 
                                                className={`h-full bg-white transition-all duration-300 ${
                                                    idx === selectedStoryIndex ? 'w-full' : idx < selectedStoryIndex ? 'w-full' : 'w-0'
                                                }`} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Header */}
                                <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white">
                                            A24
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white text-shadow-sm">Area 24 One</p>
                                            <p className="text-xs text-white/70">Original Audio</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={toggleMute}
                                        className="rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-md"
                                    >
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Navigation Areas */}
                                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prevStory} />
                                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={nextStory} />

                                {/* Mobile Controls Hints */}
                                {selectedStoryIndex > 0 && (
                                    <button 
                                        onClick={prevStory}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 p-2 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-md hidden md:block"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                )}
                                {selectedStoryIndex < stories.length - 1 && (
                                    <button 
                                        onClick={nextStory}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 p-2 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-md hidden md:block"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
});

StoriesSection.displayName = 'StoriesSection';
