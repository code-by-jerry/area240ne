import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const STORY_THUMBNAILS = [
    '/image/hero/construction.jpg',
    '/image/hero/interior.jpg',
    '/image/hero/realty.jpg',
    '/image/hero/developer.jpg',
    '/image/hero/event.jpg',
    '/image/build (1).jpeg',
    '/image/build (2).jpeg',
    '/image/build (3).jpeg',
    '/image/build (4).jpeg',
    '/image/build (5).jpeg',
    '/image/build (6).jpeg',
    '/image/build (7).jpeg',
    '/image/build (8).jpeg',
];

const rawStories = [
    {
        id: 1,
        video: 'https://www.pexels.com/download/video/5824192/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 2,
        video: 'https://www.pexels.com/download/video/29681897/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 3,
        video: 'https://www.pexels.com/download/video/32144168/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 4,
        video: 'https://www.pexels.com/download/video/29681899/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 5,
        video: 'https://www.pexels.com/download/video/34292919/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 6,
        video: 'https://www.pexels.com/download/video/34208839/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 7,
        video: 'https://www.pexels.com/download/video/34010377/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 8,
        video: 'https://www.pexels.com/download/video/34236991/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 9,
        video: 'https://www.pexels.com/download/video/34154109/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 10,
        video: 'https://www.pexels.com/download/video/34292914/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 11,
        video: 'https://www.pexels.com/download/video/35458123/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 12,
        video: 'https://www.pexels.com/download/video/34237009/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 13,
        video: 'https://www.pexels.com/download/video/29532430/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 14,
        video: 'https://www.pexels.com/download/video/34593442/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 15,
        video: 'https://www.pexels.com/download/video/32477168/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 16,
        video: 'https://www.pexels.com/download/video/28514875/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 17,
        video: 'https://www.pexels.com/download/video/34373823/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 18,
        video: 'https://www.pexels.com/download/video/28514866/',
        title: 'Residential Space',
        duration: '0:15',
    },
    {
        id: 19,
        video: 'https://www.pexels.com/download/video/36065026/',
        title: 'Pool',
        duration: '0:15',
    },
    {
        id: 20,
        video: 'https://www.pexels.com/download/video/27682746/',
        title: 'Pool',
        duration: '0:15',
    },
    {
        id: 21,
        video: 'https://www.pexels.com/download/video/29138315/',
        title: 'Pool',
        duration: '0:15',
    },
    {
        id: 22,
        video: 'https://www.pexels.com/download/video/6617117/',
        title: 'Pool',
        duration: '0:15',
    },
    {
        id: 23,
        video: 'https://www.pexels.com/download/video/36065027/',
        title: 'Lounge & City View',
        duration: '0:15',
    },
    {
        id: 24,
        video: 'https://www.pexels.com/download/video/29532359/',
        title: 'Gym',
        duration: '0:15',
    },
];

const stories = rawStories.map((story, index) => ({
    ...story,
    thumbnail: STORY_THUMBNAILS[index % STORY_THUMBNAILS.length],
}));

const INITIAL_STORY_COUNT = 8;
const STORY_BATCH_SIZE = 8;

// Memoized story card to prevent unnecessary re-renders
const StoryCard = memo(
    ({
        story,
        onClick,
    }: {
        story: (typeof stories)[0];
        onClick: () => void;
    }) => {
        return (
            <div
                onClick={onClick}
                className="group relative aspect-[9/16] min-w-[180px] cursor-pointer snap-center overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-zinc-900/5 transition-transform hover:-translate-y-1 hover:shadow-xl md:min-w-[220px]"
            >
                <img
                    src={story.thumbnail}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                        <Play className="h-6 w-6 fill-white text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <div className="mb-1 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full border-2 border-brand-primary p-0.5">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-primary/20">
                                <span className="text-[10px] font-bold text-white">
                                    A24
                                </span>
                            </div>
                        </div>
                        <span className="truncate text-xs font-medium text-white/90">
                            {story.title}
                        </span>
                    </div>
                </div>
            </div>
        );
    },
);

StoryCard.displayName = 'StoryCard';

export const StoriesSection = memo(function StoriesSection() {
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
        null,
    );
    const [isMuted, setIsMuted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(INITIAL_STORY_COUNT);
    const modalVideoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const visibleStories = stories.slice(0, visibleCount);

    const openStory = useCallback((index: number) => {
        setSelectedStoryIndex(index);
        setIsMuted(false);
    }, []);

    const closeStory = useCallback(() => {
        setSelectedStoryIndex(null);
    }, []);

    const nextStory = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedStoryIndex((prev) => {
            if (prev !== null && prev < stories.length - 1) {
                return prev + 1;
            }
            return null;
        });
    }, []);

    const prevStory = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedStoryIndex((prev) => {
            if (prev !== null && prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    }, []);

    const toggleMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted((prev) => !prev);
    }, []);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    const showMoreStories = useCallback(() => {
        setVisibleCount((prev) =>
            Math.min(prev + STORY_BATCH_SIZE, stories.length),
        );
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
        <section className="bg-zinc-50 py-16 dark:bg-black/20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2">
                            <div className="h-px w-6 bg-[#C7A14A]" />
                            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                                Visual Stories
                            </span>
                        </div>
                        <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            A glimpse into our world of{' '}
                            <span className="text-[#C7A14A]">
                                construction, design, and development
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Stories Carousel */}
                <div className="group/carousel relative">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 p-2 text-zinc-400 transition-colors hover:text-brand-primary xl:block dark:text-zinc-600 dark:hover:text-white"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft className="h-10 w-10" />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {visibleStories.map((story, index) => (
                            <StoryCard
                                key={story.id}
                                story={story}
                                onClick={() => openStory(index)}
                            />
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 p-2 text-zinc-400 transition-colors hover:text-brand-primary xl:block dark:text-zinc-600 dark:hover:text-white"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight className="h-10 w-10" />
                    </button>
                </div>

                {visibleCount < stories.length && (
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={showMoreStories}
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-brand-primary hover:text-brand-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-brand-primary dark:hover:text-white"
                        >
                            Load more stories
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedStoryIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
                        onClick={closeStory}
                    >
                        <button
                            onClick={closeStory}
                            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div
                            className="relative aspect-[9/16] h-full max-h-[90vh] w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div className="relative h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
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

                                {/* Progress Bar */}
                                <div className="absolute top-4 right-4 left-4 z-20 flex gap-1">
                                    {stories.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                                                idx === selectedStoryIndex
                                                    ? 'bg-white'
                                                    : idx < selectedStoryIndex
                                                      ? 'bg-white/60'
                                                      : 'bg-white/20'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Header */}
                                <div className="absolute top-8 right-4 left-4 z-20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                                            A24
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white text-shadow-sm">
                                                Area 24 One
                                            </p>
                                            <p className="text-xs text-white/70">
                                                Original Audio
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleMute}
                                        className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40"
                                    >
                                        {isMuted ? (
                                            <VolumeX className="h-4 w-4" />
                                        ) : (
                                            <Volume2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Navigation Areas */}
                                <div
                                    className="absolute inset-y-0 left-0 z-10 w-1/3"
                                    onClick={prevStory}
                                />
                                <div
                                    className="absolute inset-y-0 right-0 z-10 w-1/3"
                                    onClick={nextStory}
                                />

                                {/* Mobile Controls Hints */}
                                {selectedStoryIndex > 0 && (
                                    <button
                                        onClick={prevStory}
                                        className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-md hover:bg-black/40 hover:text-white md:block"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                )}
                                {selectedStoryIndex < stories.length - 1 && (
                                    <button
                                        onClick={nextStory}
                                        className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-md hover:bg-black/40 hover:text-white md:block"
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
