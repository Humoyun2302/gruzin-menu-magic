import { useSyncExternalStore } from "react";
import type { Category, MenuItem } from "@/types/menu";
import { SEED_CATEGORIES, SEED_ITEMS } from "@/data/menuData";
import {
  deleteCategoryFromSupabase,
  deleteItemFromSupabase,
  fetchMenuFromSupabase,
  isSupabaseConfigured,
  saveCategoriesToSupabase,
  saveCategoryToSupabase,
  saveItemToSupabase,
  seedMenuInSupabase,
} from "@/lib/supabase";

const LS_KEY = "gruzin-menu-v1";

type SyncStatus = "local" | "syncing" | "ready" | "error";
type State = {
  categories: Category[];
  items: MenuItem[];
  syncStatus: SyncStatus;
  syncError?: string;
};

let state: State = load();
const listeners = new Set<() => void>();
let didInit = false;

function load(): State {
  const fallback = {
    categories: SEED_CATEGORIES,
    items: SEED_ITEMS,
    syncStatus: isSupabaseConfigured ? "syncing" : "local",
  } satisfies State;
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed.categories?.length || !parsed.items?.length) return fallback;
    return {
      categories: parsed.categories,
      items: parsed.items,
      syncStatus: isSupabaseConfigured ? "syncing" : "local",
    };
  } catch {
    return fallback;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LS_KEY,
    JSON.stringify({ categories: state.categories, items: state.items }),
  );
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

function patchState(patch: Partial<State>) {
  setState({ ...state, ...patch });
}

function markSyncError(error: unknown) {
  patchState({
    syncStatus: "error",
    syncError: error instanceof Error ? error.message : "Supabase sync failed.",
  });
}

async function runSupabaseWrite(task: () => Promise<void>) {
  if (!isSupabaseConfigured) return;
  try {
    await task();
    patchState({ syncStatus: "ready", syncError: undefined });
  } catch (error) {
    markSyncError(error);
    console.error("[GRUZIN] Supabase sync failed:", error);
  }
}

const SERVER_SNAPSHOT: State = {
  categories: SEED_CATEGORIES,
  items: SEED_ITEMS,
  syncStatus: isSupabaseConfigured ? "syncing" : "local",
};

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
  async init() {
    if (didInit || !isSupabaseConfigured) return;
    didInit = true;
    patchState({ syncStatus: "syncing", syncError: undefined });
    try {
      const remote = await fetchMenuFromSupabase();
      if (!remote) return;

      if (!remote.categories.length && !remote.items.length) {
        await seedMenuInSupabase(SEED_CATEGORIES, SEED_ITEMS);
        setState({
          categories: SEED_CATEGORIES,
          items: SEED_ITEMS,
          syncStatus: "ready",
          syncError: undefined,
        });
        return;
      }

      setState({
        categories: remote.categories.length ? remote.categories : SEED_CATEGORIES,
        items: remote.items.length ? remote.items : SEED_ITEMS,
        syncStatus: "ready",
        syncError: undefined,
      });
    } catch (error) {
      markSyncError(error);
      console.error("[GRUZIN] Could not load Supabase menu:", error);
    }
  },

  // categories
  addCategory(c: Omit<Category, "id" | "sort_order"> & { sort_order?: number }) {
    const id =
      c.name_ru
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .slice(0, 30) +
      "-" +
      Date.now();
    const sort_order =
      c.sort_order ?? Math.max(0, ...state.categories.map((x) => x.sort_order)) + 10;
    const category = { ...c, id, sort_order };
    setState({ ...state, categories: [...state.categories, category] });
    void runSupabaseWrite(() => saveCategoryToSupabase(category));
    return category;
  },
  updateCategory(id: string, patch: Partial<Category>) {
    let nextCategory: Category | undefined;
    const categories = state.categories.map((c) => {
      if (c.id !== id) return c;
      nextCategory = { ...c, ...patch };
      return nextCategory;
    });
    setState({
      ...state,
      categories,
    });
    if (nextCategory) void runSupabaseWrite(() => saveCategoryToSupabase(nextCategory));
  },
  deleteCategory(id: string) {
    setState({
      ...state,
      categories: state.categories.filter((c) => c.id !== id),
      items: state.items.filter((i) => i.categoryId !== id),
    });
    void runSupabaseWrite(() => deleteCategoryFromSupabase(id));
  },
  reorderCategory(id: string, dir: -1 | 1) {
    const sorted = [...state.categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    const a = { ...sorted[idx] };
    const b = { ...sorted[swap] };
    const tmp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tmp;
    const categories = state.categories.map((category) => {
      if (category.id === a.id) return a;
      if (category.id === b.id) return b;
      return category;
    });
    setState({ ...state, categories });
    void runSupabaseWrite(() => saveCategoriesToSupabase([a, b]));
  },

  // items
  addItem(item: Omit<MenuItem, "id" | "sort_order">) {
    const id = item.categoryId + "-" + Date.now();
    const sort_order =
      Math.max(
        0,
        ...state.items.filter((i) => i.categoryId === item.categoryId).map((i) => i.sort_order),
      ) + 1;
    const nextItem = { ...item, id, sort_order };
    setState({ ...state, items: [...state.items, nextItem] });
    void runSupabaseWrite(() => saveItemToSupabase(nextItem));
  },
  updateItem(id: string, patch: Partial<MenuItem>) {
    let nextItem: MenuItem | undefined;
    const items = state.items.map((i) => {
      if (i.id !== id) return i;
      nextItem = { ...i, ...patch };
      return nextItem;
    });
    setState({ ...state, items });
    if (nextItem) void runSupabaseWrite(() => saveItemToSupabase(nextItem));
  },
  deleteItem(id: string) {
    setState({ ...state, items: state.items.filter((i) => i.id !== id) });
    void runSupabaseWrite(() => deleteItemFromSupabase(id));
  },

  reset() {
    setState({
      categories: SEED_CATEGORIES,
      items: SEED_ITEMS,
      syncStatus: isSupabaseConfigured ? "syncing" : "local",
      syncError: undefined,
    });
    void runSupabaseWrite(() => seedMenuInSupabase(SEED_CATEGORIES, SEED_ITEMS));
  },
};

if (typeof window !== "undefined") {
  void menuStore.init();
}

export function useMenuStore(): State {
  return useSyncExternalStore(
    menuStore.subscribe,
    menuStore.getSnapshot,
    menuStore.getServerSnapshot,
  );
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
