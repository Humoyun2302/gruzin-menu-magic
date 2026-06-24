import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { menuStore } from "@/lib/menuStore";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Category, MenuItem } from "@/types/menu";

type Draft = Omit<MenuItem, "id" | "sort_order" | "price"> & { price: string };
type SaveDraft = Omit<MenuItem, "id" | "sort_order">;

const empty = (categoryId = ""): Draft => ({
  categoryId,
  name_ru: "",
  name_uz: "",
  name_en: "",
  description_ru: "",
  description_uz: "",
  description_en: "",
  price: "",
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
  onSave: (draft: SaveDraft, id?: string) => void;
}) {
  const defaultCategoryId = categories[0]?.id ?? "";
  const [draft, setDraft] = useState<Draft>(empty(defaultCategoryId));
  const [initialDraft, setInitialDraft] = useState<Draft>(empty(defaultCategoryId));
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next = initial
      ? { ...initial, price: String(initial.price || "") }
      : empty(defaultCategoryId);
    setDraft(next);
    setInitialDraft(next);
    setNewCategoryName("");
    setShowNewCategory(false);
    setAttemptedSave(false);
  }, [open, initial, defaultCategoryId]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const priceValue = draft.price.trim();
  const priceNumber = priceValue ? Number(priceValue) : 0;
  const errors = {
    categoryId: draft.categoryId ? "" : "Выберите категорию.",
    name_ru: draft.name_ru.trim() ? "" : "Введите название блюда.",
    price:
      priceValue && Number.isFinite(priceNumber) && priceNumber > 0 ? "" : "Введите цену больше 0.",
  };
  const isValid = !errors.categoryId && !errors.name_ru && !errors.price;
  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(initialDraft);

  const requestOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && hasUnsavedChanges) {
      const confirmed = window.confirm("Закрыть форму? Несохраненные изменения будут потеряны.");
      if (!confirmed) return;
    }
    onOpenChange(nextOpen);
  };

  const addCategoryInline = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const category = menuStore.addCategory({
      name_ru: name,
      name_uz: "",
      name_en: "",
      is_active: true,
    });
    set("categoryId", category.id);
    setNewCategoryName("");
    setShowNewCategory(false);
    toast.success("Категория добавлена", {
      description: `«${category.name_ru}» выбрана для блюда.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={requestOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Редактировать блюдо" : "Новое блюдо"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <ImageUploadField
            label="Изображение"
            value={draft.image_url}
            onChange={(value) => set("image_url", value)}
            onRemove={() => set("image_url", "")}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Категория">
              <Select value={draft.categoryId} onValueChange={(value) => set("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name_ru}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!showNewCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-fit px-0 py-0 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowNewCategory(true)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Новая категория
                </Button>
              )}
              {attemptedSave && errors.categoryId && (
                <p className="text-xs font-medium text-destructive">{errors.categoryId}</p>
              )}
            </Field>
            <Field label="Цена (сум)">
              <Input
                inputMode="numeric"
                value={draft.price}
                onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
                placeholder="100000"
              />
              {attemptedSave && errors.price && (
                <p className="text-xs font-medium text-destructive">{errors.price}</p>
              )}
            </Field>
            {showNewCategory && (
              <div className="rounded-xl border border-border bg-secondary/40 p-3 sm:col-span-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Новая категория
                </Label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Название категории"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName("");
                      }}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="button"
                      disabled={!newCategoryName.trim()}
                      onClick={addCategoryInline}
                    >
                      Добавить категорию
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <Field label="Название (RU) *">
              <Input value={draft.name_ru} onChange={(e) => set("name_ru", e.target.value)} />
              {attemptedSave && errors.name_ru && (
                <p className="text-xs font-medium text-destructive">{errors.name_ru}</p>
              )}
            </Field>
            <Field label="Вес / граммы">
              <Input
                value={draft.weight ?? ""}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="250 гр"
              />
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
              <Textarea
                rows={2}
                value={draft.description_uz ?? ""}
                onChange={(e) => set("description_uz", e.target.value)}
              />
            </Field>
            <Field label="Описание (EN)">
              <Textarea
                rows={2}
                value={draft.description_en ?? ""}
                onChange={(e) => set("description_en", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Toggle
              label="Доступно"
              checked={draft.is_available}
              onChange={(v) => set("is_available", v)}
            />
            <Toggle
              label="Популярное"
              checked={draft.is_popular}
              onChange={(v) => set("is_popular", v)}
            />
            <Toggle label="Новинка" checked={draft.is_new} onChange={(v) => set("is_new", v)} />
            <Toggle
              label="Сезонное"
              checked={draft.is_seasonal}
              onChange={(v) => set("is_seasonal", v)}
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 gap-2 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={() => requestOpenChange(false)}>
            Отмена
          </Button>
          <Button
            disabled={!isValid}
            onClick={() => {
              setAttemptedSave(true);
              if (!isValid) return;
              onSave({ ...draft, price: priceNumber }, initial?.id);
              toast.success(initial ? "Блюдо обновлено" : "Блюдо добавлено");
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
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
