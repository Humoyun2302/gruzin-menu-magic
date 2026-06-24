import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon, X } from "lucide-react";
import type { Category, MenuItem } from "@/types/menu";

type Draft = Omit<MenuItem, "id" | "sort_order">;

const empty = (categoryId = ""): Draft => ({
  categoryId,
  name_ru: "",
  name_uz: "",
  name_en: "",
  description_ru: "",
  description_uz: "",
  description_en: "",
  price: 0,
  weight: "",
  image_url: "",
  is_available: true,
  is_new: false,
  is_popular: false,
  is_seasonal: false,
});

export function ItemFormDialog({
  open,
  onOpenChange,
  initial,
  categories,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: MenuItem | null;
  categories: Category[];
  onSave: (draft: Draft, id?: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(empty(categories[0]?.id));

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : empty(categories[0]?.id));
  }, [open, initial, categories]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Редактировать блюдо" : "Новое блюдо"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Image */}
          <div className="grid gap-2">
            <Label>Изображение (URL)</Label>
            <div className="flex gap-3">
              <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                {draft.image_url ? (
                  <img src={draft.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  value={draft.image_url ?? ""}
                  onChange={(e) => set("image_url", e.target.value)}
                  placeholder="https://…"
                />
                {draft.image_url && (
                  <Button type="button" variant="outline" size="sm" onClick={() => set("image_url", "")}>
                    <X className="mr-1 h-3 w-3" /> Убрать
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Категория">
              <Select value={draft.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name_ru}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Цена (сум)">
              <Input
                type="number"
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>
            <Field label="Название (RU) *">
              <Input value={draft.name_ru} onChange={(e) => set("name_ru", e.target.value)} />
            </Field>
            <Field label="Вес / граммы">
              <Input value={draft.weight ?? ""} onChange={(e) => set("weight", e.target.value)} placeholder="250 гр" />
            </Field>
            <Field label="Название (UZ)">
              <Input value={draft.name_uz ?? ""} onChange={(e) => set("name_uz", e.target.value)} />
            </Field>
            <Field label="Название (EN)">
              <Input value={draft.name_en ?? ""} onChange={(e) => set("name_en", e.target.value)} />
            </Field>
          </div>

          <Field label="Описание (RU)">
            <Textarea
              rows={2}
              value={draft.description_ru ?? ""}
              onChange={(e) => set("description_ru", e.target.value)}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Описание (UZ)">
              <Textarea rows={2} value={draft.description_uz ?? ""} onChange={(e) => set("description_uz", e.target.value)} />
            </Field>
            <Field label="Описание (EN)">
              <Textarea rows={2} value={draft.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Toggle label="Доступно" checked={draft.is_available} onChange={(v) => set("is_available", v)} />
            <Toggle label="Популярное" checked={draft.is_popular} onChange={(v) => set("is_popular", v)} />
            <Toggle label="Новинка" checked={draft.is_new} onChange={(v) => set("is_new", v)} />
            <Toggle label="Сезонное" checked={draft.is_seasonal} onChange={(v) => set("is_seasonal", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button
            onClick={() => {
              if (!draft.name_ru.trim() || !draft.categoryId) return;
              onSave(draft, initial?.id);
              onOpenChange(false);
            }}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
