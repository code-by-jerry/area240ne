import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
    /**
     * Optional custom class for the marquee container.
     */
    className?: string;
    /**
     * Whether to reverse the animation direction.
     * @default false
     */
    reverse?: boolean;
    /**
     * Whether to pause the animation on hover.
     * @default false
     */
    pauseOnHover?: boolean;
    /**
     * The content to be scrolled in the marquee.
     */
    children?: React.ReactNode;
    /**
     * Whether to animate vertically instead of horizontally.
     * @default false
     */
    vertical?: boolean;
    /**
     * The number of times to repeat the content.
     * @default 2
     */
    repeat?: number;
}

export function Marquee({
    className,
    reverse,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 2,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex shrink-0 justify-around [gap:var(--gap)]",
                            {
                                "animate-marquee flex-row": !vertical && !reverse,
                                "animate-marquee-reverse flex-row": !vertical && reverse,
                                "animate-marquee-vertical flex-col": vertical,
                                "group-hover:[animation-play-state:paused]": pauseOnHover,
                            },
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
