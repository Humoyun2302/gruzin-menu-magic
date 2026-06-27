import { Badge } from "@/components/ui/menu-badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { OptimizedFoodImage } from "@/components/menu/OptimizedFoodImage";
import { categoryName, formatPrice, itemDesc, itemName, t } from "@/lib/translations";
import type { Category, Lang, MenuItem } from "@/types/menu";

export function DishDetailModal({
  item,
  category,
  lang,
  open,
  onOpenChange,
}: {
  item: MenuItem | null;
  category?: Category;
  lang: Lang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;

  const name = itemName(item, lang);
  const description = itemDesc(item, lang).trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto max-h-[92vh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-t-[1.35rem] border-border bg-background p-0 shadow-[0_-20px_60px_-28px_rgba(20,15,10,0.45)] sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-h-[90vh] sm:max-w-[680px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl">
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <DialogDescription className="sr-only">{t(lang, "dishDetails")}</DialogDescription>

        <div className="max-h-[92vh] overflow-y-auto sm:max-h-[90vh]">
          <OptimizedFoodImage
            src={item.image_url}
            alt={name}
            variant="detail"
            priority
            className="aspect-[4/3] rounded-none sm:aspect-[16/9]"
            imageClassName="group-hover:scale-100"
          />

          <div className="grid gap-4 px-4 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
            <div className="flex flex-wrap gap-1.5">
              {item.is_popular && <Badge variant="popular">{t(lang, "popular")}</Badge>}
              {item.is_new && <Badge variant="new">{t(lang, "new")}</Badge>}
              {item.is_seasonal && <Badge variant="seasonal">{t(lang, "seasonal")}</Badge>}
              {!item.is_available && <Badge variant="unavailable">{t(lang, "unavailable")}</Badge>}
            </div>

            <div className="grid gap-2">
              <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {name}
              </h2>
              {category && (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {t(lang, "category")} · {categoryName(category, lang)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border bg-[color:var(--cream-deep)]/35 px-4 py-3">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {formatPrice(item.price)}
              </div>
              {item.weight && (
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t(lang, "weight")} · {item.weight}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <div className="h-px bg-border" />
              <p className="whitespace-pre-line text-[15px] leading-7 text-foreground/78">
                {description || t(lang, "descriptionSoon")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
