{/* How It Works */ }
<section id="process" className="py-32 bg-white dark:bg-brand-dark relative overflow-hidden">
    <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] bg-brand-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

    <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-zinc-400 mb-4">How it works</h2>
            <h3 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-brand-primary dark:text-white">
                Simple. Seamless. Strategic.
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                Most people waste weeks talking to multiple vendors. We start with clarity — then route you correctly.
            </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
            {/* Vertical Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-zinc-200 dark:via-zinc-800 to-transparent -translate-x-1/2" />

            <div className="space-y-16 lg:space-y-24">
                {[
                    {
                        num: "01",
                        title: "Tell Us Your Need",
                        desc: "Briefly explain your project or requirement to our AI consultant in plain language. No forms, no hassle—just a simple conversation.",
                        icon: <MessageSquare className="h-6 w-6" />,
                        align: "left"
                    },
                    {
                        num: "02",
                        title: "Smart Consultation",
                        desc: "Our platform deepens the conversation, clarifying details and matching you to specific expertise. We ask the right questions to understand your vision.",
                        icon: <Sparkles className="h-6 w-6" />,
                        align: "right"
                    },
                    {
                        num: "03",
                        title: "The Right Expert",
                        desc: "Seamlessly connect with the specialized internal brand and expert best suited for your project. Get started with confidence.",
                        icon: <CheckCircle2 className="h-6 w-6" />,
                        align: "left"
                    }
                ].map((step, i) => (
                    <div key={i} className={`relative flex items-center ${step.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                        {/* Timeline Dot */}
                        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-accent border-4 border-white dark:border-brand-dark shadow-lg z-10" />

                        {/* Card */}
                        <div className={`w-full lg:w-[calc(50%-3rem)] ${step.align === 'right' ? 'lg:ml-auto' : ''}`}>
                            <div className="group relative bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-brand-accent/50 dark:hover:border-brand-accent/50 transition-all duration-300 hover:shadow-xl">
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 -left-4 h-14 w-14 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
                                    {step.num}
                                </div>

                                {/* Icon */}
                                <div className="mb-4 inline-flex h-12 w-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center text-brand-primary dark:text-white group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-white transition-all duration-300">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h4 className="text-2xl font-display font-bold mb-3 text-brand-primary dark:text-white">
                                    {step.title}
                                </h4>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {step.desc}
                                </p>

                                {/* Arrow Indicator (Desktop) */}
                                <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${step.align === 'right' ? '-left-8' : '-right-8'}`}>
                                    <div className={`h-8 w-8 rounded-full bg-brand-accent/10 flex items-center justify-center ${step.align === 'right' ? 'rotate-180' : ''}`}>
                                        <ArrowRight className="h-4 w-4 text-brand-accent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-20 text-center">
                <button
                    onClick={() => {
                        setSelectedService('');
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-primary dark:bg-white text-white dark:text-black font-bold hover:bg-brand-accent dark:hover:bg-brand-accent dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
</section>
