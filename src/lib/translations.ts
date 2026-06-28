import type { Lang, Category } from "@/types/menu";

export const formatPrice = (price: number): string => {
  if (price <= 0) return "Новое меню";
  return `${price.toLocaleString("ru-RU").replace(/,/g, " ")} сум`;
};

export const LANG_LABELS: Record<Lang, string> = { ru: "RU", uz: "UZ", en: "EN" };

export const UI: Record<Lang, Record<string, string>> = {
  ru: {
    subtitle: "Georgian Restaurant",
    service: "Обслуживание 10%",
    search: "Поиск по меню…",
    all: "Все",
    empty: "Ничего не найдено",
    popular: "Популярное",
    new: "Новинка",
    seasonal: "Сезонное",
    unavailable: "Недоступно",
    backToTop: "Наверх",
    menu: "Меню",
    tagline: "Вкус Грузии в каждом блюде",
    more: "Подробнее",
    detailsHint: "Нажмите для подробностей",
    dishDetails: "Подробности блюда",
    descriptionSoon: "Описание скоро появится",
    category: "Категория",
    weight: "Вес",
    close: "Закрыть",
    noPrice: "Новое меню",
  },
  uz: {
    subtitle: "Gruzin Restorani",
    service: "Xizmat haqi 10%",
    search: "Menyudan qidirish…",
    all: "Hammasi",
    empty: "Hech narsa topilmadi",
    popular: "Mashhur",
    new: "Yangi",
    seasonal: "Mavsumiy",
    unavailable: "Mavjud emas",
    backToTop: "Tepaga",
    menu: "Menyu",
    tagline: "Har bir taomda Gruziya ta'mi",
    more: "Batafsil",
    detailsHint: "Batafsil ko'rish uchun bosing",
    dishDetails: "Taom tafsilotlari",
    descriptionSoon: "Tavsif tez orada qo'shiladi",
    category: "Kategoriya",
    weight: "Vazn",
    close: "Yopish",
    noPrice: "Yangi menyu",
  },
  en: {
    subtitle: "Georgian Restaurant",
    service: "Service charge 10%",
    search: "Search the menu…",
    all: "All",
    empty: "Nothing found",
    popular: "Popular",
    new: "New",
    seasonal: "Seasonal",
    unavailable: "Unavailable",
    backToTop: "Top",
    menu: "Menu",
    tagline: "The taste of Georgia in every dish",
    more: "Details",
    detailsHint: "Tap for details",
    dishDetails: "Dish details",
    descriptionSoon: "Description coming soon",
    category: "Category",
    weight: "Weight",
    close: "Close",
    noPrice: "New menu",
  },
};

export const t = (lang: Lang, key: string) => UI[lang][key] ?? UI.ru[key] ?? key;

export const itemName = (
  item: { name_ru: string; name_uz?: string; name_en?: string },
  lang: Lang,
) => (lang === "uz" && item.name_uz) || (lang === "en" && item.name_en) || item.name_ru;

export const itemDesc = (
  item: { description_ru?: string; description_uz?: string; description_en?: string },
  lang: Lang,
) =>
  (lang === "uz" && item.description_uz) ||
  (lang === "en" && item.description_en) ||
  item.description_ru ||
  "";

export const categoryName = (cat: Category, lang: Lang) =>
  (lang === "uz" && cat.name_uz) || (lang === "en" && cat.name_en) || cat.name_ru;
