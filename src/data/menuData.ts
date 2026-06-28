import type { Category, MenuItem } from "@/types/menu";

export const SEED_CATEGORIES: Category[] = [
  {
    id: "mangal",
    name_ru: "Кавказский мангал",
    name_en: "Caucasian Grill",
    sort_order: 10,
    is_active: true,
  },
  { id: "soups", name_ru: "Первые блюда", name_en: "Soups", sort_order: 20, is_active: true },
  { id: "bread", name_ru: "Хлеб", name_en: "Bread", sort_order: 30, is_active: true },
  { id: "kids", name_ru: "Детское меню", name_en: "Kids Menu", sort_order: 40, is_active: true },
  { id: "hot", name_ru: "Горячие блюда", name_en: "Hot Dishes", sort_order: 50, is_active: true },
  { id: "lunches", name_ru: "Ланчи", name_en: "Lunches", sort_order: 60, is_active: true },
  { id: "sides", name_ru: "Гарниры", name_en: "Sides", sort_order: 70, is_active: true },
  { id: "sauces", name_ru: "Соусы", name_en: "Sauces", sort_order: 80, is_active: true },
  { id: "desserts", name_ru: "Десерты", name_en: "Desserts", sort_order: 90, is_active: true },
  { id: "salads", name_ru: "Салаты", name_en: "Salads", sort_order: 100, is_active: true },
  {
    id: "khachapuri",
    name_ru: "Хачапури из печи",
    name_en: "Khachapuri",
    sort_order: 110,
    is_active: true,
  },
  {
    id: "cold",
    name_ru: "Холодные закуски",
    name_en: "Cold Appetizers",
    sort_order: 120,
    is_active: true,
  },
  { id: "khinkali", name_ru: "Хинкали", name_en: "Khinkali", sort_order: 130, is_active: true },
  {
    id: "hotapps",
    name_ru: "Горячие закуски",
    name_en: "Hot Appetizers",
    sort_order: 140,
    is_active: true,
  },
];

export const CATEGORY_NOTES: Record<string, string> = {
  mangal: "Вес указан в сыром виде",
  kids: "У нас также есть отдельное меню пицц — более 20 видов",
  lunches: "Будние дни, 12:00–16:00",
  sauces: "Все соусы — 12 000",
};

let order = 0;

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

const mk = (
  categoryId: string,
  name_ru: string,
  price: number,
  extras: Partial<MenuItem> = {},
): MenuItem => ({
  id: `${categoryId}-${slug(name_ru)}`,
  categoryId,
  name_ru,
  price,
  is_available: true,
  is_new: false,
  is_popular: false,
  is_seasonal: false,
  sort_order: (order += 10),
  ...extras,
});

export const SEED_ITEMS: MenuItem[] = [
  // КАВКАЗСКИЙ МАНГАЛ
  mk("mangal", "Каре барашка", 79000, {
    weight: "100 г",
    description_ru: "На лаваше, с соусом сациби",
    is_popular: true,
  }),
  mk("mangal", "Мякоть барашка", 137000, { weight: "250 г" }),
  mk("mangal", "Шашлык из бон филе", 157000, { weight: "250 г", is_popular: true }),
  mk("mangal", "Люля кебаб из баранины", 89000),
  mk("mangal", "Хачапури на огне", 77000, {
    weight: "250 г",
    description_ru: "Сулугуни на шампуре",
    is_popular: true,
  }),
  mk("mangal", "Куриные крылья", 72000, { weight: "300 г" }),
  mk("mangal", "Куриная грудка", 82000, { weight: "250 г" }),
  mk("mangal", "Филе из куриных бедер", 82000, { weight: "250 г" }),
  mk("mangal", "Сочный цыпленок по-аджарски", 118000, { weight: "800 г" }),
  mk("mangal", "Тигровые креветки", 146000, { weight: "150 г" }),
  mk("mangal", "Шашлык из форели", 167000, { weight: "200 г" }),
  mk("mangal", "Дорада", 162000, { weight: "400 г" }),
  mk("mangal", "Бэби картофель с курдючным салом", 61000, { weight: "200 г" }),
  mk("mangal", "Овощи на мангале", 67000, {
    weight: "400 г",
    description_ru: "Перец, баклажан, кабачки, кукуруза, помидоры, шампиньоны, лук",
  }),
  mk("mangal", "Шампиньоны на мангале", 68000),

  // ПЕРВЫЕ БЛЮДА
  mk("soups", "Суп харчо", 62000, { is_popular: true }),
  mk("soups", "Домашняя куриная лапша", 41000),
  mk("soups", "Домашние пельмени", 51000),
  mk("soups", "Суп грибной", 52000),
  mk("soups", "Суп чечевичный", 38000),
  mk("soups", "Наваристый антипохмельный хаш", 69000),
  mk("soups", "Окрошка", 41000, { description_ru: "Сезонно", is_seasonal: true }),

  // ХЛЕБ
  mk("bread", "Хлебная корзина", 27000, { description_ru: "Пури, лаваш, черный хлеб" }),
  mk("bread", "Пури", 18000),
  mk("bread", "Лаваш", 13000),
  mk("bread", "Черный хлеб", 9000),

  // ДЕТСКОЕ МЕНЮ
  mk("kids", "Бантики с курицей", 52000),
  mk("kids", "Куриная котлета с картофельным пюре", 65000),
  mk("kids", "Куриные нагетсы", 42000),

  // ГОРЯЧИЕ БЛЮДА
  mk("hot", "Чанахи из бон-филе", 128000),
  mk("hot", "Чакапули", 122000, { description_ru: "Мякоть барашка, тархун" }),
  mk("hot", "Стейк из форели", 175000, {
    description_ru: "С картофелем и голландским соусом",
  }),
  mk("hot", "Оджахури из бон филе", 138000),
  mk("hot", "Орагули с телятиной и грибами", 138000, { description_ru: "Кеци, сыр" }),
  mk("hot", "Фетучини альфредо", 68000, { description_ru: "С курицей и грибами" }),
  mk("hot", "Медальоны из говяжьей вырезки", 198000, {
    description_ru: "Сливочный соус, пюре",
    is_popular: true,
  }),
  mk("hot", "Чашушули из баранины", 128000),
  mk("hot", "Спагетти с креветками и помидорами черри", 97000),
  mk("hot", "Телячьи щечки с картофельным пюре", 168000),
  mk("hot", "Долма", 79000, { description_ru: "С чесночным соусом" }),
  mk("hot", "Метехи", 134000, {
    description_ru: "Бон филе, картошка, вешенки, сливочный соус",
  }),
  mk("hot", "Телятина под острым томатным соусом", 118000, {
    description_ru: "Томленая в кеци. Проверить — на фото указано 1 118 000",
    needs_verification: true,
  }),
  mk("hot", "Оджахури с курицей", 84000),
  mk("hot", "Цыпленок чкмерули", 146000, { is_popular: true }),
  mk("hot", "Орагули с курицей и грибами", 89000),
  mk("hot", "Бон филе с овощами хоровац", 145000),
  mk("hot", "Чахохбили из курицы", 84000),

  // ЛАНЧИ
  mk("lunches", "Салат, суп, горячее блюдо, компот, хлеб из печи каждый день", 0, {
    description_ru: "Новое меню",
    is_new: true,
  }),

  // ГАРНИРЫ
  mk("sides", "Картофель фри", 33000),
  mk("sides", "Картофельное пюре", 27000),
  mk("sides", "Картофель по-домашнему с луком", 49000),
  mk("sides", "Картофель по-домашнему с бон филе", 110000),
  mk("sides", "Лук фри", 35000),
  mk("sides", "Отварной рис", 19000),

  // СОУСЫ
  mk("sauces", "Сметанно-чесночный", 12000),
  mk("sauces", "Аджика", 12000),
  mk("sauces", "Ткемали", 12000),
  mk("sauces", "Сациели", 12000),
  mk("sauces", "Наршараб", 12000),
  mk("sauces", "Сметана", 12000),

  // ДЕСЕРТЫ
  mk("desserts", "Медовик", 32000, { is_popular: true }),
  mk("desserts", "Наполеон", 45000),
  mk("desserts", "Яблочный пирог", 49000),
  mk("desserts", "Шоколадный фондан с мороженым", 58000, { is_popular: true }),
  mk("desserts", "Мороженое", 35000),
  mk("desserts", "Фруктовое ассорти", 140000),

  // САЛАТЫ
  mk("salads", "Грузин", 89000, { is_popular: true }),
  mk("salads", "Оджахури", 69000),
  mk("salads", "Греческий", 79000),
  mk("salads", "Салат из карамелизированных баклажан", 74000),
  mk("salads", "Запеченная свекла с мягким сыром", 72000),
  mk("salads", "Батуми", 69000),
  mk("salads", "Теплый салат с фасолью", 67000),
  mk("salads", "Капрезе", 78000),
  mk("salads", "Страчателла", 82000),
  mk("salads", "Аццили", 78000),
  mk("salads", "Боржоми", 70000),
  mk("salads", "Салат с копченой форелью", 74000),
  mk("salads", "Тбилиси", 76000),
  mk("salads", "Цезарь с курицей", 75000),
  mk("salads", "Цезарь с креветками", 110000),
  mk("salads", "Салат с куриной печенью, рукколой и ананасом", 72000),
  mk("salads", "Зеленый салат с апельсинами", 69000),

  // ХАЧАПУРИ ИЗ ПЕЧИ
  mk("khachapuri", "Хачапури по-аджарски (600 г)", 117000, {
    weight: "600 г",
    is_popular: true,
  }),
  mk("khachapuri", "Хачапури по-аджарски (300 г)", 78000, {
    weight: "300 г",
    is_popular: true,
  }),
  mk("khachapuri", "Хачапури по-аджарски с шампиньонами (600 г)", 119000, {
    weight: "600 г",
  }),
  mk("khachapuri", "Хачапури по-аджарски с шампиньонами (300 г)", 82000, {
    weight: "300 г",
  }),
  mk("khachapuri", "Хачапури по-аджарски с помидорами (600 г)", 119000, {
    weight: "600 г",
  }),
  mk("khachapuri", "Хачапури по-аджарски с помидорами (300 г)", 82000, {
    weight: "300 г",
  }),
  mk("khachapuri", "Хачапури по-аджарски со шпинатом (600 г)", 121000, {
    weight: "600 г",
  }),
  mk("khachapuri", "Хачапури по-аджарски со шпинатом (300 г)", 82000, {
    weight: "300 г",
  }),
  mk("khachapuri", "Хачапури по-имеретински", 111000, { weight: "600 г" }),
  mk("khachapuri", "Хачапури по-мегрельски", 119000, { weight: "600 г" }),
  mk("khachapuri", "Царский хачапури", 135000, { weight: "700 г" }),
  mk("khachapuri", "Хачапури со шпинатом и сыром", 120000, { weight: "600 г" }),
  mk("khachapuri", "Пеновани", 99000, { weight: "500 г", description_ru: "Слоеное тесто" }),
  mk("khachapuri", "Кубдари", 107000, { weight: "500 г" }),

  // ХОЛОДНЫЕ ЗАКУСКИ
  mk("cold", "Паштет из куриной печени", 62000),
  mk("cold", "Сациви из курицы", 69000),
  mk("cold", "Ассорти из свежей зелени с сулугуни", 79000),
  mk("cold", "Сырное ассорти", 147000),
  mk("cold", "Овощное ассорти по-грузински", 72000),
  mk("cold", "Маринованные шампиньоны с луком", 41000),
  mk("cold", "Пхали ассорти", 87000),
  mk("cold", "Мжаве", 70000),
  mk("cold", "Бадриджани", 69000),
  mk("cold", "Селедочка с молодым картофелем", 67000),
  mk("cold", "Хумус", 59000),
  mk("cold", "Сюзьма по-грузински с мятой", 39000),
  mk("cold", "Хоровац", 68000),
  mk("cold", "Холодец", 60000, { description_ru: "Сезонное", is_seasonal: true }),

  // ХИНКАЛИ
  mk("khinkali", "Хинкали отварные", 17000),
  mk("khinkali", "Хинкали жареные", 21000),
  mk("khinkali", "Мама хинкали", 118000),
  mk("khinkali", "Хинкали ассорти", 76000, { weight: "4 шт" }),
  mk("khinkali", "Хинкали со шпинатом и сыром", 19000),
  mk("khinkali", "Хинкали с грибами и сливками", 17000),
  mk("khinkali", "Хинкали с сыром", 17000),
  mk("khinkali", "Хинкали в соусе сацебели", 79000),
  mk("khinkali", "Хинкали в сливочном соусе чкмерули", 82000, { weight: "5 шт" }),
  mk("khinkali", "Хинкали с тигровыми креветками", 97000, { weight: "5 шт" }),

  // ГОРЯЧИЕ ЗАКУСКИ
  mk("hotapps", "Лобио", 63000),
  mk("hotapps", "Запеченный сулугуни", 69000),
  mk("hotapps", "Шляпки шампиньонов", 79000),
  mk("hotapps", "Шакшука", 66000),
  mk("hotapps", "Колбаски из индейки", 95000, { weight: "3 шт" }),
  mk("hotapps", "Колбаски говяжьи", 125000, { weight: "3 шт" }),
  mk("hotapps", "Хрустящие вешенки", 69000),
  mk("hotapps", "Кучмачи", 57000),
  mk("hotapps", "Запеченный баклажан", 79000),
  mk("hotapps", "Говяжий язык", 92000),
  mk("hotapps", "Рулетики", 83000),
  mk("hotapps", "Ачма", 72000),
  mk("hotapps", "Жареные пельмени", 58000),
  mk("hotapps", "Кутабы с зеленью и сыром", 42000, { weight: "3 шт" }),
  mk("hotapps", "Кутабы с мясом", 48000, { weight: "3 шт" }),
  mk("hotapps", "Чесночные гренки", 39000),
];
