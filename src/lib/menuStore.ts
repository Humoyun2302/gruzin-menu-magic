// Client-side store with localStorage persistence. Ready to swap for Lovable Cloud.
import { useSyncExternalStore } from "react";
import type { Category, MenuItem } from "@/types/menu";
import { SEED_CATEGORIES, SEED_ITEMS } from "@/data/menuData";

const LS_KEY = "gruzin-menu-v1";

type State = { categories: Category[]; items: MenuItem[] };

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return { categories: SEED_CATEGORIES, items: SEED_ITEMS };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return { categories: SEED_CATEGORIES, items: SEED_ITEMS };
    const parsed = JSON.parse(raw) as State;
    if (!parsed.categories?.length || !parsed.items?.length)
      return { categories: SEED_CATEGORIES, items: SEED_ITEMS };
    return parsed;
  } catch {
    return { categories: SEED_CATEGORIES, items: SEED_ITEMS };
  }
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

export const menuStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot(): State {
    return state;
  },
const SERVER_SNAPSHOT: State = { categories: SEED_CATEGORIES, items: SEED_ITEMS };

export const menuStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot(): State {
    return state;
  },
  getServerSnapshot(): State {
    return SERVER_SNAPSHOT;
  },

  // categories
  addCategory(c: Omit<Category, "id" | "sort_order"> & { sort_order?: number }) {
    const id = c.name_ru.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 30) + "-" + Date.now();
    const sort_order = c.sort_order ?? (Math.max(0, ...state.categories.map((x) => x.sort_order)) + 10);
    setState({ ...state, categories: [...state.categories, { ...c, id, sort_order }] });
  },
  updateCategory(id: string, patch: Partial<Category>) {
    setState({
      ...state,
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  },
  deleteCategory(id: string) {
    setState({
      categories: state.categories.filter((c) => c.id !== id),
      items: state.items.filter((i) => i.categoryId !== id),
    });
  },
  reorderCategory(id: string, dir: -1 | 1) {
    const sorted = [...state.categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx], b = sorted[swap];
    const tmp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tmp;
    setState({ ...state, categories: [...state.categories] });
  },

  // items
  addItem(item: Omit<MenuItem, "id" | "sort_order">) {
    const id = item.categoryId + "-" + Date.now();
    const sort_order =
      Math.max(0, ...state.items.filter((i) => i.categoryId === item.categoryId).map((i) => i.sort_order)) +
      1;
    setState({ ...state, items: [...state.items, { ...item, id, sort_order }] });
  },
  updateItem(id: string, patch: Partial<MenuItem>) {
    setState({ ...state, items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  },
  deleteItem(id: string) {
    setState({ ...state, items: state.items.filter((i) => i.id !== id) });
  },

  reset() {
    setState({ categories: SEED_CATEGORIES, items: SEED_ITEMS });
  },
};

export function useMenuStore(): State {
  return useSyncExternalStore(menuStore.subscribe, menuStore.getSnapshot, menuStore.getServerSnapshot);
}

// Helpers
export const getCategories = (s: State) =>
  [...s.categories].filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);

export const getMenuItems = (s: State) => s.items;

export const getItemsByCategory = (s: State, categoryId: string) =>
  s.items.filter((i) => i.categoryId === categoryId).sort((a, b) => a.sort_order - b.sort_order);

export const searchMenuItems = (s: State, q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return s.items;
  return s.items.filter((i) =>
    [i.name_ru, i.name_uz, i.name_en, i.description_ru, i.description_uz, i.description_en]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(query)),
  );
};
