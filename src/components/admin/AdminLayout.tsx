import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, UtensilsCrossed, Tags, ExternalLink } from "lucide-react";
import { GruzinLogo } from "@/components/menu/GruzinLogo";
import { cn } from "@/lib/utils";

const NAV: ReadonlyArray<{
  to: "/admin" | "/admin/items" | "/admin/categories";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { to: "/admin/items", label: "Блюда", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Категории", icon: Tags },
];

export function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[color:var(--cream-deep)]/30">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-border bg-background md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-4 md:flex-col md:items-start md:gap-4 md:px-5 md:py-5">
            <Link to="/admin" className="block">
              <GruzinLogo small />
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:hidden">
              Админ
            </span>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-0.5 md:px-3 md:pb-5">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/"
              className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:mt-auto"
            >
              <ExternalLink className="h-4 w-4" />
              Открыть меню
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
