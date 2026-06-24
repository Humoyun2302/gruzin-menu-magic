import { cn } from "@/lib/utils";

type Variant = "popular" | "new" | "seasonal" | "unavailable" | "muted";

export function Badge({
  variant = "muted",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    popular: "bg-foreground text-background",
    new: "bg-[color:var(--gold)] text-foreground",
    seasonal: "bg-[color:var(--cream-deep)] text-foreground border border-border",
    unavailable: "bg-destructive/15 text-destructive border border-destructive/30",
    muted: "bg-secondary text-secondary-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
