"use client";

import { STEPS } from "@/lib/creator-helpers";

export default function StepIndicator({
  current,
  onGo,
}: {
  current: number;
  onGo: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
      {STEPS.map((step) => (
        <button
          key={step.id}
          onClick={() => step.id < current && onGo(step.id)}
          disabled={step.id > current}
          className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs whitespace-nowrap transition-all shrink-0 ${
            step.id === current
              ? "bg-accent text-white"
              : step.id < current
                ? "bg-accent/10 text-accent cursor-pointer hover:bg-accent/20"
                : "bg-cream text-muted/40"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
              step.id === current
                ? "bg-white/20 text-white"
                : step.id < current
                  ? "bg-accent/20 text-accent"
                  : "bg-muted/10 text-muted/30"
            }`}
          >
            {step.id < current ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.id
            )}
          </span>
          <span className="hidden sm:inline">{step.shortTitle}</span>
        </button>
      ))}
    </div>
  );
}
