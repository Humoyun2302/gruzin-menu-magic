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
  saveItemsToSupabase,
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
    throw error;
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
  async addCategory(c: Omit<Category, "id" | "sort_order"> & { sort_order?: number }) {
    const previousState = state;
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
    try {
      await runSupabaseWrite(() => saveCategoryToSupabase(category));
    } catch (error) {
      setState(previousState);
      throw error;
    }
    return category;
  },
  async updateCategory(id: string, patch: Partial<Category>) {
    const previousState = state;
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
    try {
      if (nextCategory) await runSupabaseWrite(() => saveCategoryToSupabase(nextCategory));
    } catch (error) {
      setState(previousState);
      throw error;
    }
  },
  async deleteCategory(id: string) {
    const previousState = state;
    setState({
      ...state,
      categories: state.categories.filter((c) => c.id !== id),
      items: state.items.filter((i) => i.categoryId !== id),
    });
    try {
      await runSupabaseWrite(() => deleteCategoryFromSupabase(id));
    } catch (error) {
      setState(previousState);
      throw error;
    }
  },
  async reorderCategory(id: string, dir: -1 | 1) {
    const previousState = state;
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
    try {
      await runSupabaseWrite(() => saveCategoriesToSupabase([a, b]));
    } catch (error) {
      setState(previousState);
      throw error;
    }
  },

  // items
  async addItem(item: Omit<MenuItem, "id" | "sort_order">) {
    const previousState = state;
    const id = item.categoryId + "-" + Date.now();
    const sort_order =
      Math.max(
        0,
        ...state.items.filter((i) => i.categoryId === item.categoryId).map((i) => i.sort_order),
      ) + 1;
    const nextItem = { ...item, id, sort_order };
    setState({ ...state, items: [...state.items, nextItem] });
    try {
      await runSupabaseWrite(() => saveItemToSupabase(nextItem));
    } catch (error) {
      setState(previousState);
      throw error;
    }
    return nextItem;
  },
  async updateItem(id: string, patch: Partial<MenuItem>) {
    const previousState = state;
    let nextItem: MenuItem | undefined;
    const items = state.items.map((i) => {
      if (i.id !== id) return i;
      nextItem = { ...i, ...patch };
      return nextItem;
    });
    setState({ ...state, items });
    try {
      if (nextItem) await runSupabaseWrite(() => saveItemToSupabase(nextItem));
    } catch (error) {
      setState(previousState);
      throw error;
    }
    return nextItem;
  },
  async reorderItem(id: string, dir: -1 | 1) {
    const previousState = state;
    const item = state.items.find((candidate) => candidate.id === id);
    if (!item) return;

    const sorted = state.items
      .filter((candidate) => candidate.categoryId === item.categoryId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((candidate) => candidate.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;

    const a = { ...sorted[idx] };
    const b = { ...sorted[swap] };
    const tmp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tmp;

    const items = state.items.map((candidate) => {
      if (candidate.id === a.id) return a;
      if (candidate.id === b.id) return b;
      return candidate;
    });
    setState({ ...state, items });

    try {
      await runSupabaseWrite(() => saveItemsToSupabase([a, b]));
    } catch (error) {
      setState(previousState);
      throw error;
    }
  },
  async deleteItem(id: string) {
    const previousState = state;
    setState({ ...state, items: state.items.filter((i) => i.id !== id) });
    try {
      await runSupabaseWrite(() => deleteItemFromSupabase(id));
    } catch (error) {
      setState(previousState);
      throw error;
    }
  },

  async reset() {
    const previousState = state;
    setState({
      categories: SEED_CATEGORIES,
      items: SEED_ITEMS,
      syncStatus: isSupabaseConfigured ? "syncing" : "local",
      syncError: undefined,
    });
    try {
      await runSupabaseWrite(() => seedMenuInSupabase(SEED_CATEGORIES, SEED_ITEMS));
    } catch (error) {
      setState(previousState);
      throw error;
    }
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
