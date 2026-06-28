import { memo } from "react";
import { Badge } from "@/components/ui/menu-badge";
import { OptimizedFoodImage } from "@/components/menu/OptimizedFoodImage";
import { formatPrice, itemName, itemDesc, t } from "@/lib/translations";
import type { Lang, MenuItem } from "@/types/menu";

export const MenuItemCard = memo(function MenuItemCard({
  item,
  lang,
  onSelect,
  priority = false,
}: {
  item: MenuItem;
  lang: Lang;
  onSelect: (item: MenuItem) => void;
  priority?: boolean;
}) {
  const name = itemName(item, lang);
  const description = itemDesc(item, lang);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(item);
        }
      }}
      className="group flex min-h-full w-full cursor-pointer flex-col overflow-hidden rounded-[1.05rem] border border-border bg-card text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-22px_rgba(20,15,10,0.25)] focus:outline-none focus:ring-2 focus:ring-foreground/25 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.99] md:rounded-xl"
      aria-label={`${t(lang, "dishDetails")}: ${name}`}
    >
      <OptimizedFoodImage src={item.image_url} alt={name} priority={priority} />
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
          {name}
        </h3>
        {description && (
          <p className="line-clamp-2 min-h-[2.7em] text-[12px] leading-[1.35] text-muted-foreground md:line-clamp-3 md:min-h-[3.75rem] md:text-sm md:leading-5">
            {description}
          </p>
        )}
        <div className="mt-auto grid gap-2 border-t border-border/70 pt-2 md:gap-3 md:pt-3">
          <div className="flex items-end justify-between gap-2 md:gap-3">
            <span className="text-[16px] font-bold leading-none tracking-tight text-foreground md:text-base">
              {item.price > 0 ? formatPrice(item.price) : t(lang, "noPrice")}
            </span>
            {item.weight && (
              <span className="text-[11px] font-medium uppercase leading-none tracking-wide text-muted-foreground md:text-xs">
                {item.weight}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/65 transition group-hover:text-foreground md:text-xs">
            {t(lang, "more")}
          </span>
        </div>
      </div>
    </article>
  );
});
