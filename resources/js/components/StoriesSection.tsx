import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stories = [
    {
        id: 1,
        video: '/video/section video.mp4',
        title: 'Featured Highlight',
        duration: '0:30'
    },
    {
        id: 2,
        video: '/video/story (1).mp4',
        title: 'Modern Living',
        duration: '0:15'
    },
    {
        id: 3,
        video: '/video/story (2).mp4',
        title: 'Interior Excellence',
        duration: '0:15'
    },
    {
        id: 4,
        video: '/video/story (3).mp4',
        title: 'Construction Quality',
        duration: '0:15'
    },
    {
        id: 5,
        video: '/video/story (4).mp4',
        title: 'Design Details',
        duration: '0:15'
    },
    {
        id: 6,
        video: '/video/story (5).mp4',
        title: 'Client Stories',
        duration: '0:15'
    },
    {
        id: 7,
        video: '/video/story (6).mp4',
        title: 'Site Progress',
        duration: '0:15'
    },
    {
        id: 8,
        video: '/video/story (7).mp4',
        title: 'Architectural Tour',
        duration: '0:15'
    },
    {
        id: 9,
        video: '/video/story (8).mp4',
        title: 'Material Selection',
        duration: '0:15'
    },
    {
        id: 10,
        video: '/video/story (9).mp4',
        title: 'Safety First',
        duration: '0:15'
    },
    {
        id: 11,
        video: '/video/story (10).mp4',
        title: 'Team at Work',
        duration: '0:15'
    },
    {
        id: 12,
        video: '/video/story (11).mp4',
        title: 'Finishing Touches',
        duration: '0:15'
    },
    {
        id: 13,
        video: '/video/story (12).mp4',
        title: 'Smart Planning',
        duration: '0:15'
    },
    {
        id: 14,
        video: '/video/story (13).mp4',
        title: 'Project Milestones',
        duration: '0:15'
    },
    {
        id: 15,
        video: '/video/story (14).mp4',
        title: 'Community Impact',
        duration: '0:15'
    },
    {
        id: 16,
        video: '/video/story (15).mp4',
        title: 'Future Vision',
        duration: '0:15'
    }
];

export function StoriesSection() {
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const modalVideoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const openStory = (index: number) => {
        setSelectedStoryIndex(index);
        setIsMuted(false);
    };

    const closeStory = () => {
        setSelectedStoryIndex(null);
    };

    const nextStory = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedStoryIndex !== null && selectedStoryIndex < stories.length - 1) {
            setSelectedStoryIndex(selectedStoryIndex + 1);
        } else {
            closeStory();
        }
    };

    const prevStory = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
            setSelectedStoryIndex(selectedStoryIndex - 1);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedStoryIndex === null) return;
            
            if (e.key === 'Escape') closeStory();
            if (e.key === 'ArrowRight') nextStory();
            if (e.key === 'ArrowLeft') prevStory();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedStoryIndex]);

    return (
        <section className="py-16 bg-zinc-50 dark:bg-black/20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-brand-primary dark:text-white sm:text-3xl">
                            Visual Stories
                        </h2>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-xl">
                            A glimpse into our world of construction, design, and development.
                        </p>
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
                            <motion.div
                                key={story.id}
                                layoutId={`story-${story.id}`}
                                onClick={() => openStory(index)}
                                className="group relative min-w-[180px] md:min-w-[220px] aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-zinc-900/5 transition-transform hover:-translate-y-1 hover:shadow-xl snap-center"
                            >
                                <video
                                    ref={el => videoRefs.current[index] = el}
                                    src={story.video}
                                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                    muted
                                    playsInline
                                    preload="metadata"
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                                
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
                                layoutId={`story-${stories[selectedStoryIndex].id}`}
                                className="relative h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
                            >
                                <video
                                    ref={modalVideoRef}
                                    key={selectedStoryIndex} // Force remount on change
                                    src={stories[selectedStoryIndex].video}
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    playsInline
                                    loop
                                    muted={isMuted}
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
}
