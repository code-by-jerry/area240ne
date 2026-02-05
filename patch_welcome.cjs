
const fs = require('fs');
const path = 'resources/js/pages/welcome.tsx';
let content = fs.readFileSync(path, 'utf8');

// Aggressive cleanup of JSX spacing issues
content = content.replace(/< section/g, '<section');
content = content.replace(/<\/ section >/g, '</section>');
content = content.replace(/< div/g, '<div');
content = content.replace(/<\/ div >/g, '</div>');
content = content.replace(/className = "/g, 'className="');
content = content.replace(/ \/ >/g, ' />');
content = content.replace(/ {/g, '{'); // Careful with this one
content = content.replace(/{ /g, '{');
content = content.replace(/ }/g, '}');
content = content.replace(/ < \//g, '</');
content = content.replace(/< \/ /g, '</');
content = content.replace(/ \)/g, ')');
content = content.replace(/\( /g, '(');

// Fix the slider block specifically by line range if possible or unique pattern
// I'll replace the whole section again but with even more care for what's actually there.

// Let's find the section that starts with {/* Hero Section */} and replace until the end of that section.
const heroSectionStart = content.indexOf('{/* Hero Section */}');
const heroSectionEnd = content.indexOf('{/* Trust/Authority Strip */}');

if (heroSectionStart !== -1 && heroSectionEnd !== -1) {
    const fixedHero = \`{/* Hero Section */}
                <section className="relative min-h-screen md:h-screen lg:h-screen flex items-center overflow-hidden pt-20 md:pt-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(199,161,74,0.05),transparent_70%)]" />
                    
                    {/* Background Accents (Animated based on slide) */}
                    <div className={\`absolute top-[-10%] right-[-5%] -z-10 h-[600px] w-[600px] blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-slow transition-all duration-1000 \${
                        currentSlide === 1 ? 'bg-amber-500/10' :
                        currentSlide === 2 ? 'bg-purple-500/10' :
                        currentSlide === 3 ? 'bg-blue-500/10' :
                        currentSlide === 4 ? 'bg-emerald-500/10' :
                        currentSlide === 5 ? 'bg-rose-500/10' :
                        'bg-brand-primary/10'
                    }\`} />
                    <div className={\`absolute bottom-[-10%] left-[-10%] -z-10 h-[500px] w-[500px] blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 \${
                        currentSlide === 1 ? 'bg-amber-600/10' :
                        currentSlide === 2 ? 'bg-purple-600/10' :
                        currentSlide === 3 ? 'bg-blue-600/10' :
                        currentSlide === 4 ? 'bg-emerald-600/10' :
                        currentSlide === 5 ? 'bg-rose-600/10' :
                        'bg-[#C7A14A]/10'
                    }\`} />

                    <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                        <div className="relative overflow-hidden h-[600px]">
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={\`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out \${index === currentSlide ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none z-10'}\`}
                                >
                                    <div className="grid lg:grid-cols-12 gap-16 items-center w-full">
                                        <div className="lg:col-span-7 relative">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm transition-all duration-500">
                                                <Sparkles className="h-4 w-4 text-[#C7A14A]" />
                                                <span className="text-zinc-600 dark:text-zinc-300">{slide.tag}</span>
                                            </div>
                                            <h1 className="text-4xl font-bold tracking-tight text-brand-primary dark:text-white sm:text-6xl lg:text-7xl mb-6 leading-[1.1]">
                                                {slide.title}<br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-zinc-500 to-brand-primary dark:from-white dark:via-zinc-400 dark:to-white">
                                                    {slide.highlight}
                                                </span>
                                            </h1>
                                            <p className="mt-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl">
                                                {slide.description}
                                            </p>

                                            <div className="mt-10 flex flex-wrap gap-5 items-center">
                                                <Link href="/chat" className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-brand-primary px-8 text-base font-display font-bold text-white transition-all duration-300 hover:bg-[#C7A14A] hover:scale-105 hover:shadow-xl hover:shadow-[#C7A14A]/20 dark:bg-white dark:text-black dark:hover:bg-[#C7A14A] dark:hover:text-white overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                    <MessageSquare className="h-5 w-5 relative z-10" />
                                                    <span className="relative z-10">Start Consultation</span>
                                                </Link>
                                                <a href="#expertise" className="group flex h-14 items-center gap-2 px-6 text-base font-display font-semibold text-brand-primary dark:text-white hover:text-[#C7A14A] dark:hover:text-[#C7A14A] transition-colors">
                                                    Explore Our Expertise
                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className='lg:col-span-5 relative h-[400px] md:h-[500px] lg:h-[600px]'>
                                            <div className='absolute inset-0 bg-gradient-to-tr from-zinc-200/30 via-transparent to-transparent dark:from-[#C7A14A]/10 rounded-[2.5rem] -z-10 scale-105 blur-3xl opacity-50' />
                                            {index === 0 ? (
                                                <ChatMockup />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center relative group">
                                                    <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                                                        <img
                                                            src={slide.image}
                                                            alt={slide.highlight}
                                                            className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110 dark:invert"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Slider Controls */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={\`h-1.5 transition-all duration-300 rounded-full \${i === currentSlide ? 'w-12 bg-brand-primary dark:bg-white' : 'w-4 bg-zinc-300 dark:bg-zinc-700'}\`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                
                \`;
    const before = content.substring(0, heroSectionStart);
    const after = content.substring(heroSectionEnd);
    content = before + fixedHero + after;
}

fs.writeFileSync(path, content);
console.log('File patched successfully');
