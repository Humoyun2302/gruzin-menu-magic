export type Lang = "ru" | "uz" | "en";

export type Category = {
  id: string;
  name_ru: string;
  name_uz?: string;
  name_en?: string;
  sort_order: number;
  is_active: boolean;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name_ru: string;
  name_uz?: string;
  name_en?: string;
  description_ru?: string;
  description_uz?: string;
  description_en?: string;
  price: number;
  weight?: string;
  image_url?: string;
  is_available: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_seasonal: boolean;
  sort_order: number;
  needs_verification?: boolean;
};
