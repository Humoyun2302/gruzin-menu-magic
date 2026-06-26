import { createClient } from "@supabase/supabase-js";
import type { Category, MenuItem } from "@/types/menu";

type CategoryRow = {
  id: string;
  name_ru: string;
  name_uz: string | null;
  name_en: string | null;
  sort_order: number;
  is_active: boolean;
};

type MenuItemRow = {
  id: string;
  category_id: string;
  name_ru: string;
  name_uz: string | null;
  name_en: string | null;
  description_ru: string | null;
  description_uz: string | null;
  description_en: string | null;
  price: number;
  weight: string | null;
  image_url: string | null;
  is_available: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_seasonal: boolean;
  sort_order: number;
  needs_verification: boolean | null;
};

type Database = {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: CategoryRow;
        Update: Partial<CategoryRow>;
      };
      menu_items: {
        Row: MenuItemRow;
        Insert: MenuItemRow;
        Update: Partial<MenuItemRow>;
      };
    };
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const FOOD_IMAGES_BUCKET = "food-images";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function fetchMenuFromSupabase() {
  if (!supabase) return null;

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_items").select("*").order("sort_order", { ascending: true }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (itemsResult.error) throw itemsResult.error;

  return {
    categories: (categoriesResult.data ?? []).map(categoryFromRow),
    items: (itemsResult.data ?? []).map(itemFromRow),
  };
}

export async function seedMenuInSupabase(categories: Category[], items: MenuItem[]) {
  if (!supabase) return;

  const { error: categoriesError } = await supabase
    .from("categories")
    .upsert(categories.map(categoryToRow), { onConflict: "id" });
  if (categoriesError) throw categoriesError;

  const { error: itemsError } = await supabase
    .from("menu_items")
    .upsert(items.map(itemToRow), { onConflict: "id" });
  if (itemsError) throw itemsError;
}

export async function saveCategoryToSupabase(category: Category) {
  if (!supabase) return;
  const { error } = await supabase.from("categories").upsert(categoryToRow(category));
  if (error) throw error;
}

export async function saveCategoriesToSupabase(categories: Category[]) {
  if (!supabase) return;
  const { error } = await supabase.from("categories").upsert(categories.map(categoryToRow));
  if (error) throw error;
}

export async function deleteCategoryFromSupabase(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function saveItemToSupabase(item: MenuItem) {
  if (!supabase) return;
  const { error } = await supabase.from("menu_items").upsert(itemToRow(item));
  if (error) throw error;
}

export async function saveItemsToSupabase(items: MenuItem[]) {
  if (!supabase) return;
  const { error } = await supabase.from("menu_items").upsert(items.map(itemToRow));
  if (error) throw error;
}

export async function deleteItemFromSupabase(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadFoodImage(file: File) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const extension = extensionForFile(file);
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(FOOD_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(FOOD_IMAGES_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error("Could not create a public image URL.");
  return data.publicUrl;
}

function categoryFromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name_ru: row.name_ru,
    name_uz: row.name_uz ?? "",
    name_en: row.name_en ?? "",
    sort_order: row.sort_order,
    is_active: row.is_active,
  };
}

function categoryToRow(category: Category): CategoryRow {
  return {
    id: category.id,
    name_ru: category.name_ru,
    name_uz: category.name_uz || null,
    name_en: category.name_en || null,
    sort_order: category.sort_order,
    is_active: category.is_active,
  };
}

function itemFromRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name_ru: row.name_ru,
    name_uz: row.name_uz ?? "",
    name_en: row.name_en ?? "",
    description_ru: row.description_ru ?? "",
    description_uz: row.description_uz ?? "",
    description_en: row.description_en ?? "",
    price: row.price,
    weight: row.weight ?? "",
    image_url: row.image_url ?? "",
    is_available: row.is_available,
    is_new: row.is_new,
    is_popular: row.is_popular,
    is_seasonal: row.is_seasonal,
    sort_order: row.sort_order,
    needs_verification: row.needs_verification ?? false,
  };
}

function itemToRow(item: MenuItem): MenuItemRow {
  return {
    id: item.id,
    category_id: item.categoryId,
    name_ru: item.name_ru,
    name_uz: item.name_uz || null,
    name_en: item.name_en || null,
    description_ru: item.description_ru || null,
    description_uz: item.description_uz || null,
    description_en: item.description_en || null,
    price: item.price,
    weight: item.weight || null,
    image_url: item.image_url || null,
    is_available: item.is_available,
    is_new: item.is_new,
    is_popular: item.is_popular,
    is_seasonal: item.is_seasonal,
    sort_order: item.sort_order,
    needs_verification: item.needs_verification ?? false,
  };
}

function extensionForFile(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}
