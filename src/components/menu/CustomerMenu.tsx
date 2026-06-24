import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GruzinLogo } from "@/components/menu/GruzinLogo";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { useMenuStore, getCategories, getItemsByCategory, searchMenuItems } from "@/lib/menuStore";
import { categoryName, t, LANG_LABELS } from "@/lib/translations";
import type { Lang } from "@/types/menu";
import { cn } from "@/lib/utils";

export function CustomerMenu() {
  const state = useMenuStore();
  const [lang, setLang] = useState<Lang>("ru");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const categories = useMemo(() => getCategories(state), [state]);
  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? searchMenuItems(state, query).filter((i) => i.is_available) : []),
    [state, query, isSearching],
  );

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isSearching) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveCat((visible[0].target as HTMLElement).dataset.cat ?? null);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [categories, isSearching]);

  const scrollToCat = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border bg-[color:var(--cream-deep)]/40">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 pb-10 pt-8 text-center md:pt-14">
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {t(lang, "service")}
            </span>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <GruzinLogo className="mt-4" />
          <p className="font-display text-lg italic text-muted-foreground md:text-xl">
            {t(lang, "subtitle")}
          </p>
          <p className="max-w-md text-sm text-muted-foreground">{t(lang, "tagline")}</p>
          <div className="relative mt-4 w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "search")}
              className="h-12 rounded-full border-border bg-card pl-11 text-base shadow-[var(--shadow-soft)] focus-visible:ring-[color:var(--gold)]"
            />
          </div>
        </div>
      </header>

      {/* STICKY CATEGORY TABS */}
      {!isSearching && (
        <nav className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToCat(c.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                  activeCat === c.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {categoryName(c, lang)}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-6">
        {isSearching ? (
          <section>
            <h2 className="mb-5 font-display text-2xl font-semibold">
              {t(lang, "search")} — “{query}”
            </h2>
            {searchResults.length === 0 ? (
              <p className="py-16 text-center text-muted-foreground">{t(lang, "empty")}</p>
            ) : (
              <Grid>
                {searchResults.map((i) => (
                  <MenuItemCard key={i.id} item={i} lang={lang} />
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
                className="scroll-mt-24 py-8 md:py-10"
              >
                <div className="mb-6 flex flex-col items-center text-center">
                  <span className="diamond-row text-foreground/50" />
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    {categoryName(c, lang)}
                  </h2>
                </div>
                <Grid>
                  {items.map((i) => (
                    <MenuItemCard key={i.id} item={i} lang={lang} />
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
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {children}
    </div>
  );
}

function LanguageSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-[var(--shadow-soft)]">
      {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold tracking-wider transition",
            lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
