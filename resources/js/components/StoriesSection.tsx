import { ChevronLeft, ChevronRight, Play, VolumeX, Volume2, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const STORIES = [
    { id: 1,  title: 'Dream Villa',        category: 'Construction', video: '/video/Dream Villa.mp4' },
    { id: 2,  title: 'Modern Villa',        category: 'Construction', video: '/video/Modern villa.mp4' },
    { id: 3,  title: 'Premium Villa',       category: 'Construction', video: '/video/premium villa.mp4' },
    { id: 4,  title: 'Interior Designs',    category: 'Interiors',    video: '/video/interior designs.mp4' },
    { id: 5,  title: 'Modern Interiors',    category: 'Interiors',    video: '/video/modern interiors.mp4' },
    { id: 6,  title: 'Premium Interiors',   category: 'Interiors',    video: '/video/premium interiors.mp4' },
    { id: 7,  title: 'Realty Area',         category: 'Real Estate',  video: '/video/Realty Area.mp4' },
    { id: 8,  title: 'Plotted Development', category: 'Development',  video: '/video/plotted developement.mp4' },
    { id: 9,  title: 'Plots',               category: 'Development',  video: '/video/plots.mp4' },
    { id: 10, title: 'Dream Events',        category: 'Events',       video: '/video/dream events.mp4' },
    { id: 11, title: 'Luxury Events',       category: 'Events',       video: '/video/luxury events.mp4' },
];

const StoryCard = memo(({ story, onClick }: { story: typeof STORIES[0]; onClick: () => void }) => (
    <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`Watch ${story.title}`}
        className="group relative aspect-[9/16] min-w-[160px] cursor-pointer snap-center overflow-hidden rounded-2xl bg-zinc-900 shadow-md md:min-w-[200px]"
    >
        {/* Video first frame as thumbnail — no custom image needed */}
        <video
            src={story.video}
            preload="metadata"
            muted
            playsInline
            className="h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-3">
                <Play className="h-5 w-5 fill-white text-white" />
            </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-0 left-0 w-full p-3">
            <span className="mb-1 block text-[10px] font-semibold tracking-widest text-[#C7A14A] uppercase">
                {story.category}
            </span>
            <span className="text-xs font-medium text-white">{story.title}</span>
        </div>
    </div>
));
StoryCard.displayName = 'StoryCard';

export const StoriesSection = memo(function StoriesSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [muted, setMuted] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const close = useCallback(() => setActiveIndex(null), []);
    const prev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveIndex(i => (i !== null && i > 0 ? i - 1 : i));
    }, []);
    const next = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveIndex(i => (i !== null && i < STORIES.length - 1 ? i + 1 : null));
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeIndex, close, next, prev]);

    // Pause/reset video when switching stories
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [activeIndex]);

    return (
        <section className="bg-zinc-50 py-14 dark:bg-black/20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-2 inline-flex items-center gap-2">
                        <div className="h-px w-6 bg-[#C7A14A]" />
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C7A14A] uppercase">
                            Visual Stories
                        </span>
                    </div>
                    <h2 className="text-xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                        A glimpse into our world of{' '}
                        <span className="text-[#C7A14A]">construction, design & development</span>
                    </h2>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                        className="absolute top-1/2 -left-10 z-10 hidden -translate-y-1/2 rounded-full p-2 text-zinc-400 hover:text-brand-primary xl:block"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {STORIES.map((story, i) => (
                            <StoryCard key={story.id} story={story} onClick={() => setActiveIndex(i)} />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                        className="absolute top-1/2 -right-10 z-10 hidden -translate-y-1/2 rounded-full p-2 text-zinc-400 hover:text-brand-primary xl:block"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                </div>
            </div>

            {/* Lightbox — only mounts when a story is open */}
            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
                    onClick={close}
                >
                    {/* Close */}
                    <button
                        onClick={close}
                        aria-label="Close"
                        className="absolute top-5 right-5 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div
                        className="relative aspect-[9/16] h-full max-h-[88vh] w-full max-w-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Progress dots */}
                        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                            {STORIES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 flex-1 rounded-full ${idx === activeIndex ? 'bg-white' : idx < activeIndex ? 'bg-white/50' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>

                        {/* Video */}
                        <video
                            ref={videoRef}
                            src={STORIES[activeIndex].video}
                            className="h-full w-full rounded-2xl object-cover"
                            autoPlay
                            playsInline
                            loop
                            muted={muted}
                            preload="metadata"
                        />

                        {/* Header overlay */}
                        <div className="absolute top-8 left-3 right-3 z-20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                                    A24
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">{STORIES[activeIndex].title}</p>
                                    <p className="text-[10px] text-white/60">{STORIES[activeIndex].category}</p>
                                </div>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); setMuted(m => !m); }}
                                aria-label={muted ? 'Unmute' : 'Mute'}
                                className="rounded-full bg-black/30 p-1.5 text-white"
                            >
                                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Tap zones */}
                        <div className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={prev} />
                        <div className="absolute inset-y-0 right-0 z-10 w-1/3" onClick={next} />
                    </div>
                </div>
            )}
        </section>
    );
});

StoriesSection.displayName = 'StoriesSection';
