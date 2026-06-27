import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function FoodImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-[color:var(--cream-deep)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col items-center gap-1.5 text-foreground/35 md:gap-2">
        <UtensilsCrossed className="h-6 w-6 md:h-10 md:w-10" strokeWidth={1.3} />
        <span
          className="inline-block bg-foreground/30"
          style={{ width: 7, height: 7, transform: "rotate(45deg)" }}
        />
        <span className="text-[8px] font-semibold uppercase tracking-[0.2em] md:text-[10px]">
          GRUZIN
        </span>
      </div>
    </div>
  );
}
