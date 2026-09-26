import { Zap } from "lucide-react";

const steps = [
  {
    title: "Download binary",
    body: "Grab the single file executable matching your machine OS above.",
  },
  {
    title: "Launch & authenticate",
    body: "One-click magic link or OAuth with your existing workspace account.",
  },
  {
    title: "Track in flow state",
    body: "Hotkeys, micro widget, and offline auto-sync.",
  },
];

export function SetupGuide() {
  return (
    <section className="rounded-xl border border-border/50 bg-card/50 p-5 shadow-xs backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-warning" />
          <span className="text-sm font-semibold tracking-tight">
            Quick Setup
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Ready in ~30s</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 lg:gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold shadow-sm">
              {i + 1}
            </span>
            <div className="space-y-1 mt-0.5">
              <h4 className="text-[13px] font-semibold leading-none">{step.title}</h4>
              <p className="text-[12px] text-muted-foreground leading-snug">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
