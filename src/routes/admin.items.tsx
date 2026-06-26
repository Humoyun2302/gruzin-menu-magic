import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/menu-badge";
import { ItemFormDialog } from "@/components/admin/ItemFormDialog";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { menuStore, useMenuStore, getCategories } from "@/lib/menuStore";
import { formatPrice } from "@/lib/translations";
import { toast } from "sonner";
import type { MenuItem } from "@/types/menu";

export const Route = createFileRoute("/admin/items")({
  component: ItemsAdmin,
});

function ItemsAdmin() {
  const state = useMenuStore();
  const cats = useMemo(() => getCategories(state), [state]);
  const categoryOrder = useMemo(
    () => new Map(cats.map((category) => [category.id, category.sort_order])),
    [cats],
  );
  const [filterCat, setFilterCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return state.items
      .filter((i) => (filterCat === "all" ? true : i.categoryId === filterCat))
      .filter((i) => (query ? i.name_ru.toLowerCase().includes(query) : true))
      .sort(
        (a, b) =>
          (categoryOrder.get(a.categoryId) ?? 9999) - (categoryOrder.get(b.categoryId) ?? 9999) ||
          a.sort_order - b.sort_order,
      );
  }, [state.items, filterCat, q, categoryOrder]);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name_ru ?? id;
  const orderInfo = (item: MenuItem) => {
    const categoryItems = state.items
      .filter((candidate) => candidate.categoryId === item.categoryId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = categoryItems.findIndex((candidate) => candidate.id === item.id);
    return {
      first: index <= 0,
      last: index < 0 || index === categoryItems.length - 1,
    };
  };

  const reorder = async (id: string, dir: -1 | 1) => {
    try {
      await menuStore.reorderItem(id, dir);
    } catch {
      toast.error("Не удалось изменить порядок блюд");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Меню
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Блюда</h1>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> Добавить блюдо
        </Button>
      </header>

      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {cats.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name_ru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden grid-cols-[64px_minmax(0,2fr)_minmax(0,1fr)_120px_auto_auto_auto] gap-3 border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <span></span>
          <span>Название</span>
          <span>Категория</span>
          <span>Цена</span>
          <span>Вес</span>
          <span>Порядок</span>
          <span></span>
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">Ничего не найдено</p>
        )}
        {filtered.map((i) => {
          const order = orderInfo(i);
          return (
            <div
              key={i.id}
              className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3 py-3 last:border-b-0 md:grid-cols-[64px_minmax(0,2fr)_minmax(0,1fr)_120px_auto_auto_auto] md:px-4"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-muted">
                {i.image_url ? (
                  <img src={i.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">{i.name_ru}</div>
                <div className="mt-0.5 flex flex-wrap gap-1 md:hidden">
                  <span className="text-xs text-muted-foreground">
                    {catName(i.categoryId)} · {formatPrice(i.price)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {!i.is_available && <Badge variant="unavailable">Скрыто</Badge>}
                  {i.is_popular && <Badge variant="popular">Популярное</Badge>}
                  {i.is_new && <Badge variant="new">Новинка</Badge>}
                  {i.is_seasonal && <Badge variant="seasonal">Сезонное</Badge>}
                </div>
              </div>
              <span className="hidden truncate text-sm text-muted-foreground md:block">
                {catName(i.categoryId)}
              </span>
              <span className="hidden text-sm font-semibold md:block">{formatPrice(i.price)}</span>
              <span className="hidden text-xs text-muted-foreground md:block">
                {i.weight ?? "—"}
              </span>
              <div className="hidden items-center gap-1 md:flex">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={order.first}
                  onClick={() => void reorder(i.id, -1)}
                  aria-label="Поднять блюдо"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={order.last}
                  onClick={() => void reorder(i.id, 1)}
                  aria-label="Опустить блюдо"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1 justify-self-end">
                <div className="flex items-center gap-1 md:hidden">
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={order.first}
                    onClick={() => void reorder(i.id, -1)}
                    aria-label="Поднять блюдо"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={order.last}
                    onClick={() => void reorder(i.id, 1)}
                    aria-label="Опустить блюдо"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(i);
                    setOpen(true);
                  }}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteConfirm
                  title="Удалить блюдо?"
                  description={`Удалить «${i.name_ru}»? Это действие необратимо.`}
                  onConfirm={async () => {
                    try {
                      await menuStore.deleteItem(i.id);
                      toast.success("Блюдо удалено");
                    } catch {
                      toast.error("Не удалось удалить блюдо");
                      throw new Error("Delete failed");
                    }
                  }}
                  trigger={
                    <Button size="icon" variant="ghost" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <ItemFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        categories={cats}
        onSave={async (draft, id) => {
          if (id) await menuStore.updateItem(id, draft);
          else await menuStore.addItem(draft);
        }}
      />
    </div>
  );
}
