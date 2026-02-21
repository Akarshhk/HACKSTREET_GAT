import React from "react";
import { cn } from "../../lib/cn"; // use relative import for safety

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function GlassCard({ className, children }: Props) {
  return (
    <div
      className={cn(
        "hover:bg-red-500", 
        // Base glass look
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-[0_10px_40px_rgba(0,0,0,0.25)]",

        // Smooth animation
        "transition-all duration-300 ease-out",

        // Hover effect (very visible)
        "hover:-translate-y-2",
        "hover:border-cyan-300/40",
        "hover:bg-white/[0.08]",
        "hover:shadow-[0_0_45px_rgba(0,255,255,0.25),0_25px_70px_rgba(0,0,0,0.35)]",

        // Dark mode adjustments
        "dark:bg-white/[0.06] dark:border-white/10",

        className
      )}
    >
      {children}
    </div>
  );
}