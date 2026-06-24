import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { menuStore, useMenuStore } from "@/lib/menuStore";
import type { Category } from "@/types/menu";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

type Draft = Omit<Category, "id" | "sort_order">;

function CategoriesAdmin() {
  const state = useMenuStore();
  const cats = [...state.categories].sort((a, b) => a.sort_order - b.sort_order);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [draft, setDraft] = useState<Draft>({ name_ru: "", name_uz: "", name_en: "", is_active: true });

  const startNew = () => {
    setEditing(null);
    setDraft({ name_ru: "", name_uz: "", name_en: "", is_active: true });
    setOpen(true);
  };
  const startEdit = (c: Category) => {
    setEditing(c);
    setDraft({ name_ru: c.name_ru, name_uz: c.name_uz ?? "", name_en: c.name_en ?? "", is_active: c.is_active });
    setOpen(true);
  };
  const save = () => {
    if (!draft.name_ru.trim()) return;
    if (editing) menuStore.updateCategory(editing.id, draft);
    else menuStore.addCategory(draft);
    setOpen(false);
  };

  const countFor = (id: string) => state.items.filter((i) => i.categoryId === id).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Меню</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Категории</h1>
        </div>
        <Button onClick={startNew}><Plus className="mr-1 h-4 w-4" /> Новая категория</Button>
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {cats.map((c, idx) => (
          <div key={c.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <div className="flex flex-col">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                disabled={idx === 0}
                onClick={() => menuStore.reorderCategory(c.id, -1)}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                disabled={idx === cats.length - 1}
                onClick={() => menuStore.reorderCategory(c.id, 1)}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{c.name_ru}</div>
              <div className="text-xs text-muted-foreground">{countFor(c.id)} блюд · {c.is_active ? "Активна" : "Скрыта"}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
            <DeleteConfirm
              title="Удалить категорию?"
              description={`Удалить «${c.name_ru}» и все блюда в ней (${countFor(c.id)} шт.)?`}
              onConfirm={() => menuStore.deleteCategory(c.id)}
              trigger={
                <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              }
            />
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Редактировать категорию" : "Новая категория"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="Название (RU) *">
              <Input value={draft.name_ru} onChange={(e) => setDraft({ ...draft, name_ru: e.target.value })} />
            </Field>
            <Field label="Название (UZ)">
              <Input value={draft.name_uz ?? ""} onChange={(e) => setDraft({ ...draft, name_uz: e.target.value })} />
            </Field>
            <Field label="Название (EN)">
              <Input value={draft.name_en ?? ""} onChange={(e) => setDraft({ ...draft, name_en: e.target.value })} />
            </Field>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm">Активна</span>
              <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={save}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
