import { Badge } from "@/components/ui/menu-badge";
import { formatPrice, itemName, itemDesc, t } from "@/lib/translations";
import type { Lang, MenuItem } from "@/types/menu";
import { UtensilsCrossed } from "lucide-react";

export function MenuItemCard({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-22px_rgba(20,15,10,0.25)]">
      <FoodImage src={item.image_url} alt={itemName(item, lang)} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-start gap-1.5">
          {item.is_popular && <Badge variant="popular">{t(lang, "popular")}</Badge>}
          {item.is_new && <Badge variant="new">{t(lang, "new")}</Badge>}
          {item.is_seasonal && <Badge variant="seasonal">{t(lang, "seasonal")}</Badge>}
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
          {itemName(item, lang)}
        </h3>
        {itemDesc(item, lang) && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{itemDesc(item, lang)}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <span className="text-base font-bold tracking-tight text-foreground">
            {formatPrice(item.price)}
          </span>
          {item.weight && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
            "repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.04) 10px 11px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-foreground/40">
        <UtensilsCrossed className="h-10 w-10" strokeWidth={1.25} />
        <span
          className="inline-block bg-foreground/30"
          style={{ width: 10, height: 10, transform: "rotate(45deg)" }}
        />
      </div>
    </div>
  );
}
