import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GruzinLogo } from "@/components/menu/GruzinLogo";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { useMenuStore, getCategories, getItemsByCategory, searchMenuItems } from "@/lib/menuStore";
import { categoryName, t, LANG_LABELS } from "@/lib/translations";
import { CATEGORY_NOTES } from "@/data/menuData";
import type { Lang, MenuItem } from "@/types/menu";
import { cn } from "@/lib/utils";

const DishDetailModal = lazy(() =>
  import("@/components/menu/DishDetailModal").then((module) => ({
    default: module.DishDetailModal,
  })),
);

export function CustomerMenu() {
  const state = useMenuStore();
  const [lang, setLang] = useState<Lang>("ru");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const categories = useMemo(() => getCategories(state), [state]);
  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? searchMenuItems(state, query).filter((i) => i.is_available) : []),
    [state, query, isSearching],
  );
  const selectedCategory = selectedDish
    ? categories.find((category) => category.id === selectedDish.categoryId)
    : undefined;

  useEffect(() => {
    if (!isSearching && !activeCat && categories[0]) {
      setActiveCat(categories[0].id);
    }
  }, [activeCat, categories, isSearching]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isSearching) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveCat((visible[0].target as HTMLElement).dataset.cat ?? null);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [categories, isSearching]);

  useEffect(() => {
    if (!activeCat) return;
    categoryButtonRefs.current[activeCat]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCat]);

  const scrollToCat = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    setActiveCat(id);
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border bg-[color:var(--cream-deep)]/40">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-2.5 px-3.5 pb-5 pt-4 text-center sm:px-5 md:gap-4 md:pb-11 md:pt-10">
          <div className="flex w-full items-center justify-between gap-3">
            <span className="max-w-[52vw] text-left text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:max-w-none sm:tracking-[0.25em]">
              {t(lang, "service")}
            </span>
            <LanguageSwitcher lang={lang} setLang={setLang} compact />
          </div>
          <GruzinLogo className="mt-0.5 md:mt-3" />
          <p className="max-w-md px-1 text-[13px] leading-5 text-muted-foreground sm:text-sm md:leading-6">
            {t(lang, "tagline")}
          </p>
          <div className="relative mt-1.5 w-full max-w-lg md:mt-3">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "search")}
              className="h-11 rounded-full border-border bg-card pl-10 pr-4 text-[15px] shadow-[var(--shadow-soft)] focus-visible:ring-[color:var(--gold)] md:h-12 md:pl-11 md:text-base"
            />
          </div>
        </div>
      </header>

      {/* STICKY CATEGORY TABS */}
      {!isSearching && (
        <nav className="sticky top-0 z-30 border-b border-border bg-background/90 shadow-[0_8px_24px_-22px_rgba(20,15,10,0.45)] backdrop-blur">
          <div className="no-scrollbar mx-auto flex max-w-6xl snap-x gap-1.5 overflow-x-auto px-2.5 py-2 sm:px-5 md:gap-2 md:py-2.5">
            {categories.map((c) => (
              <button
                key={c.id}
                ref={(el) => {
                  categoryButtonRefs.current[c.id] = el;
                }}
                onClick={() => scrollToCat(c.id)}
                className={cn(
                  "min-h-9 shrink-0 snap-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition active:scale-[0.98] md:min-h-10 md:px-4 md:py-2 md:text-sm",
                  activeCat === c.id
                    ? "border-foreground bg-foreground text-background shadow-[var(--shadow-soft)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground",
                )}
              >
                {categoryName(c, lang)}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-3.5 pb-20 pt-3 sm:px-4 md:px-6 md:pb-24 md:pt-6">
        {isSearching ? (
          <section>
            <h2 className="mb-3 font-display text-[22px] font-semibold leading-tight sm:text-2xl md:mb-5 md:text-3xl">
              {t(lang, "search")} — “{query}”
            </h2>
            {searchResults.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground md:py-16">
                {t(lang, "empty")}
              </p>
            ) : (
              <Grid>
                {searchResults.map((i, index) => (
                  <MenuItemCard
                    key={i.id}
                    item={i}
                    lang={lang}
                    onSelect={setSelectedDish}
                    priority={index < 4}
                  />
                ))}
              </Grid>
            )}
          </section>
        ) : (
          categories.map((c) => {
            const items = getItemsByCategory(state, c.id).filter((i) => i.is_available);
            if (items.length === 0) return null;
            return (
              <section
                key={c.id}
                data-cat={c.id}
                ref={(el) => {
                  sectionRefs.current[c.id] = el;
                }}
                className="scroll-mt-20 py-4 md:scroll-mt-24 md:py-10"
              >
                <div className="mb-3 flex flex-col items-center text-center md:mb-6">
                  <span className="diamond-row text-foreground/45" />
                  <h2 className="mt-2 font-display text-[24px] font-bold leading-tight sm:text-[26px] md:mt-3 md:text-4xl">
                    {categoryName(c, lang)}
                  </h2>
                  {CATEGORY_NOTES[c.id] && (
                    <p className="mt-1 max-w-lg text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground md:mt-2 md:text-sm">
                      {CATEGORY_NOTES[c.id]}
                    </p>
                  )}
                </div>
                <Grid>
                  {items.map((i, index) => (
                    <MenuItemCard
                      key={i.id}
                      item={i}
                      lang={lang}
                      onSelect={setSelectedDish}
                      priority={c.id === categories[0]?.id && index < 4}
                    />
                  ))}
                </Grid>
              </section>
            );
          })
        )}
      </main>

      {showTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t(lang, "backToTop")}
          className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-foreground p-0 text-background shadow-lg hover:bg-foreground/90"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {selectedDish && (
        <Suspense fallback={null}>
          <DishDetailModal
            item={selectedDish}
            category={selectedCategory}
            lang={lang}
            open={Boolean(selectedDish)}
            onOpenChange={(open) => {
              if (!open) setSelectedDish(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[320px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {children}
    </div>
  );
}

function LanguageSwitcher({
  lang,
  setLang,
  compact = false,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-full border border-border bg-card shadow-[var(--shadow-soft)]",
        compact ? "p-0.5 md:p-1" : "p-1",
      )}
    >
      {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            compact
              ? "min-h-7 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider transition md:min-h-8 md:px-3 md:text-xs"
              : "min-h-8 rounded-full px-3 py-1 text-xs font-semibold tracking-wider transition",
            lang === l
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
