import { Badge } from "@/components/ui/menu-badge";
import { formatPrice, itemName, itemDesc, t } from "@/lib/translations";
import type { Lang, MenuItem } from "@/types/menu";
import { UtensilsCrossed } from "lucide-react";

export function MenuItemCard({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-[1.05rem] border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-22px_rgba(20,15,10,0.25)] md:rounded-xl">
      <FoodImage src={item.image_url} alt={itemName(item, lang)} />
      <div className="flex flex-1 flex-col gap-1.5 p-2.5 md:gap-2.5 md:p-4">
        <div className="flex min-h-4 flex-wrap items-start gap-1 md:min-h-0 md:gap-1.5">
          {item.is_popular && (
            <Badge className="px-1.5 text-[9px] md:px-2.5 md:text-[10px]" variant="popular">
              {t(lang, "popular")}
            </Badge>
          )}
          {item.is_new && (
            <Badge className="px-1.5 text-[9px] md:px-2.5 md:text-[10px]" variant="new">
              {t(lang, "new")}
            </Badge>
          )}
          {item.is_seasonal && (
            <Badge className="px-1.5 text-[9px] md:px-2.5 md:text-[10px]" variant="seasonal">
              {t(lang, "seasonal")}
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.15] text-foreground md:font-display md:text-lg md:leading-tight">
          {itemName(item, lang)}
        </h3>
        {itemDesc(item, lang) && (
          <p className="line-clamp-2 text-[12px] leading-[1.35] text-muted-foreground md:text-sm md:leading-5">
            {itemDesc(item, lang)}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/70 pt-2 md:gap-3 md:pt-3">
          <span className="text-[16px] font-bold leading-none tracking-tight text-foreground md:text-base">
            {formatPrice(item.price)}
          </span>
          {item.weight && (
            <span className="text-[11px] font-medium uppercase leading-none tracking-wide text-muted-foreground md:text-xs">
              {item.weight}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function FoodImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[color:var(--cream-deep)]">
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
