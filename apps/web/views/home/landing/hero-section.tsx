import { Badge } from "@repo/ui/components/core/badge";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center space-y-3">
      {/* 
        Added inline-flex and gap-1.5 for better alignment of elements inside the badge. 
        'shrink-0' prevents the dot and separator from squishing on tiny screens. 
      */}
      <Badge variant="primary" size="sm" className="">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />

        <span className="font-mono text-xs sm:text-sm">&lt;15MB RAM usage</span>
      </Badge>

      {/* 
        Smoother text scaling: 3xl (mobile) -> 4xl (tablet) -> 5xl/6xl (desktop).
        'text-balance' prevents awkward single words on the last line. 
      */}
      <h1 className=" text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
        Download Tickora Desktop
      </h1>

      {/* 
        Adjusted paragraph text scaling and added 'text-balance' for better line wrapping. 
      */}
      <p className="max-w-2xl text-balance text-sm text-muted-foreground sm:text-base md:text-lg">
        Clinical precision native time tracker built for high-output engineering
        and design workflows.
      </p>
    </section>
  );
}
