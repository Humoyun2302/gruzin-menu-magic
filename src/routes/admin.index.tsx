import { createFileRoute, Link } from "@tanstack/react-router";
import { useMenuStore, getCategories } from "@/lib/menuStore";
import { UtensilsCrossed, Tags, Eye, EyeOff, Star } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const state = useMenuStore();
  const totalItems = state.items.length;
  const available = state.items.filter((i) => i.is_available).length;
  const unavailable = totalItems - available;
  const popular = state.items.filter((i) => i.is_popular).length;
  const cats = getCategories(state).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Админ-панель</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Дашборд</h1>
        <p className="mt-2 text-muted-foreground">Управление меню ресторана GRUZIN.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={UtensilsCrossed} label="Всего блюд" value={totalItems} />
        <Stat icon={Tags} label="Категорий" value={cats} />
        <Stat icon={Eye} label="Доступно" value={available} />
        <Stat icon={EyeOff} label="Скрыто" value={unavailable} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-semibold">Быстрые действия</h2>
          <div className="mt-4 flex flex-col gap-2">
            <ActionLink to="/admin/items" label="Управлять блюдами" />
            <ActionLink to="/admin/categories" label="Управлять категориями" />
            <ActionLink to="/" label="Открыть меню для гостей" />
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-semibold">Популярные блюда</h2>
          <p className="mt-1 text-sm text-muted-foreground">{popular} отмечено как популярное</p>
          <ul className="mt-4 space-y-2 text-sm">
            {state.items.filter((i) => i.is_popular).slice(0, 6).map((i) => (
              <li key={i.id} className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-[color:var(--gold)]" />
                {i.name_ru}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">{children}</div>
  );
}

function ActionLink({ to, label }: { to: "/admin/items" | "/admin/categories" | "/"; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-secondary"
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}
