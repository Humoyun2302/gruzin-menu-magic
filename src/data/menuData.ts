import type { Category, MenuItem } from "@/types/menu";

export const SEED_CATEGORIES: Category[] = [
  { id: "salads", name_ru: "Салаты", name_en: "Salads", sort_order: 10, is_active: true },
  {
    id: "khachapuri",
    name_ru: "Хачапури из печи",
    name_en: "Khachapuri",
    sort_order: 20,
    is_active: true,
  },
  {
    id: "cold",
    name_ru: "Холодные закуски",
    name_en: "Cold Appetizers",
    sort_order: 30,
    is_active: true,
  },
  { id: "khinkali", name_ru: "Хинкали", name_en: "Khinkali", sort_order: 40, is_active: true },
  {
    id: "hotapps",
    name_ru: "Горячие закуски",
    name_en: "Hot Appetizers",
    sort_order: 50,
    is_active: true,
  },
  {
    id: "mangal",
    name_ru: "Кавказский мангал",
    name_en: "Caucasian Grill",
    sort_order: 60,
    is_active: true,
  },
  { id: "soups", name_ru: "Первые блюда", name_en: "Soups", sort_order: 70, is_active: true },
  { id: "hot", name_ru: "Горячие блюда", name_en: "Hot Dishes", sort_order: 80, is_active: true },
  { id: "sides", name_ru: "Гарниры", name_en: "Sides", sort_order: 90, is_active: true },
  { id: "sauces", name_ru: "Соусы", name_en: "Sauces", sort_order: 100, is_active: true },
  { id: "bread", name_ru: "Хлеб", name_en: "Bread", sort_order: 110, is_active: true },
  { id: "kids", name_ru: "Детское меню", name_en: "Kids Menu", sort_order: 120, is_active: true },
  { id: "desserts", name_ru: "Десерты", name_en: "Desserts", sort_order: 130, is_active: true },
];

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
  // САЛАТЫ
  mk("salads", "Грузин", 89000, {
    description_ru: "Фирменный салат с грузинской заправкой",
    is_popular: true,
  }),
  mk("salads", "Оджахури", 69000),
  mk("salads", "Греческий", 79000),
  mk("salads", "Салат из карамелизированных баклажанов", 74000),
  mk("salads", "Запеченная свекла с мягким сыром", 72000),
  mk("salads", "Батуми", 69000),
  mk("salads", "Тёплый салат с фасолью", 67000),
  mk("salads", "Капрезе", 78000, {
    description_ru: "Помидоры, моцарелла, руккола, оливковое масло, песто соус",
  }),
  mk("salads", "Страчателла", 82000),
  mk("salads", "Ацецилли", 78000, { needs_verification: true }),
  mk("salads", "Боржоми", 84000, {
    description_ru: "Авокадо, томаты, огурцы, шпинат, оливковое масло",
  }),
  mk("salads", "Салат с копченой форелью", 74000),
  mk("salads", "Тбилиси", 76000, {
    description_ru:
      "Фасоль, отварная говядина, болгарский перец, картофель и домашняя грузинская специя",
  }),
  mk("salads", "Цезарь с курицей", 75000),
  mk("salads", "Цезарь с креветками", 110000),
  mk("salads", "Салат с куриной печенью, рукколой и ананасом", 72000),
  mk("salads", "Зеленый салат с апельсинами", 69000),

  // ХАЧАПУРИ ИЗ ПЕЧИ
  mk("khachapuri", "Хачапури по-Аджарски (600 гр)", 117000, {
    weight: "600 гр",
    is_popular: true,
  }),
  mk("khachapuri", "Хачапури по-Аджарски (300 гр)", 78000, {
    weight: "300 гр",
    is_popular: true,
  }),
  mk("khachapuri", "Хачапури по-Аджарски с шампиньонами (600 гр)", 119000, {
    weight: "600 гр",
  }),
  mk("khachapuri", "Хачапури по-Аджарски с шампиньонами (300 гр)", 82000, {
    weight: "300 гр",
  }),
  mk("khachapuri", "Хачапури по-Аджарски с помидорами (600 гр)", 119000, {
    weight: "600 гр",
  }),
  mk("khachapuri", "Хачапури по-Аджарски с помидорами (300 гр)", 82000, {
    weight: "300 гр",
  }),
  mk("khachapuri", "Хачапури по-Аджарски со шпинатом (800 гр)", 121000, {
    weight: "800 гр",
    needs_verification: true,
  }),
  mk("khachapuri", "Хачапури по-Аджарски со шпинатом (300 гр)", 82000, {
    weight: "300 гр",
  }),
  mk("khachapuri", "Хачапури по-Имеретински", 111000, { weight: "800 гр" }),
  mk("khachapuri", "Хачапури по-Мегрельски", 119000, { weight: "600 гр" }),
  mk("khachapuri", "Царский хачапури", 135000, { weight: "700 гр" }),
  mk("khachapuri", "Хачапури со шпинатом и сыром", 120000, { weight: "600 гр" }),
  mk("khachapuri", "Пеновани (из слоеного теста)", 99000, { weight: "500 гр" }),
  mk("khachapuri", "Кубдари", 107000, {
    weight: "500 гр",
    description_ru: "Традиционный хачапури с мясом и сванскими специями",
  }),

  // ХОЛОДНЫЕ ЗАКУСКИ
  mk("cold", "Паштет из куриной печени", 62000),
  mk("cold", "Сациви из курицы", 69000),
  mk("cold", "Ассорти из свежей зелени с сулугуни", 79000),
  mk("cold", "Сырное ассорти", 147000),
  mk("cold", "Овощное ассорти по-грузински", 72000, {
    description_ru: "Помидоры, огурцы, болгарский перец, редис, острый перец, кинза, мята",
  }),
  mk("cold", "Маринованные шампиньоны с луком", 41000),
  mk("cold", "Пхали ассорти", 87000, {
    description_ru: "Закуска из шпината, свеклы и моркови с орехом",
  }),
  mk("cold", "Мжаве", 70000, { description_ru: "Маринованные овощи" }),
  mk("cold", "Бадриджани", 69000, { description_ru: "Рулетики из запеченных баклажанов" }),
  mk("cold", "Селёдочка с молодым картофелем", 67000),
  mk("cold", "Хумус", 59000),
  mk("cold", "Сюзьма по-грузински с мятой", 39000),
  mk("cold", "Хоровац", 68000),
  mk("cold", "Холодец", 60000, { is_seasonal: true }),

  // ХИНКАЛИ
  mk("khinkali", "Хинкали отварные", 17000, { weight: "1 шт", description_ru: "С говядиной" }),
  mk("khinkali", "Хинкали жареные", 21000, { weight: "1 шт", description_ru: "С говядиной" }),
  mk("khinkali", "Мама хинкали", 118000),
  mk("khinkali", "Хинкали ассорти", 76000, { weight: "4 шт" }),
  mk("khinkali", "Хинкали со шпинатом и сыром", 19000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали с грибами и сливками", 17000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали с сыром", 17000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали в соусе сацебели", 79000),
  mk("khinkali", "Хинкали в сливочном соусе Чкмерули", 82000),
  mk("khinkali", "Хинкали с тигровыми креветками", 97000),

  // ГОРЯЧИЕ ЗАКУСКИ
  mk("hotapps", "Лобио", 63000, { description_ru: "Красная фасоль, томленая в горшочке" }),
  mk("hotapps", "Запеченный сулугуни", 69000, { description_ru: "С томатами в горшочке" }),
  mk("hotapps", "Шляпки шампиньонов", 79000),
  mk("hotapps", "Шакшука", 66000, { needs_verification: true }),
  mk("hotapps", "Колбаски из индейки", 95000),
  mk("hotapps", "Колбаски из говядины", 125000),
  mk("hotapps", "Хрустящие вешенки", 69000),
  mk("hotapps", "Кучмачи", 57000),
  mk("hotapps", "Запеченный баклажан", 79000),
  mk("hotapps", "Говяжий язык", 92000),
  mk("hotapps", "Рулетики", 83000),
  mk("hotapps", "Ачма", 72000, { needs_verification: true }),
  mk("hotapps", "Жареные пельмени", 58000),
  mk("hotapps", "Кутабы с зеленью", 42000),
  mk("hotapps", "Кутабы с мясом", 48000),
  mk("hotapps", "Чесночные гренки", 39000),

  // КАВКАЗСКИЙ МАНГАЛ
  mk("mangal", "Каре барашка", 79000, {
    weight: "100 гр",
    description_ru: "Подаем на тонком лаваше с соусом сацебели",
    is_popular: true,
  }),
  mk("mangal", "Мякоть барашка", 137000, { weight: "250 гр" }),
  mk("mangal", "Шашлык из бон филе", 157000, { weight: "250 гр", is_popular: true }),
  mk("mangal", "Люля кебаб", 89000, { weight: "250 гр", description_ru: "Из баранины" }),
  mk("mangal", "Хачапури на огне", 77000, {
    weight: "250 гр",
    description_ru: "Сыр сулугуни в тонком тесте на шампуре",
    is_popular: true,
  }),
  mk("mangal", "Куриные крылья", 72000, { weight: "300 гр" }),
  mk("mangal", "Куриная грудка", 82000, { weight: "250 гр" }),
  mk("mangal", "Филе из куриных бедер", 82000, { weight: "250 гр" }),
  mk("mangal", "Сочный цыпленок по-Аджарски", 118000, { weight: "600 гр" }),
  mk("mangal", "Тигровые креветки", 146000, { weight: "150 гр" }),
  mk("mangal", "Шашлык из форели", 167000, { weight: "200 гр" }),
  mk("mangal", "Дорада", 162000, { weight: "400 гр" }),
  mk("mangal", "Бэби картофель с курдючным салом", 61000, { weight: "200 гр" }),
  mk("mangal", "Овощи на мангале", 67000, {
    weight: "400 гр",
    description_ru: "Болгарский перец, баклажан, кабачки, кукуруза, помидоры, шампиньоны, лук",
  }),
  mk("mangal", "Шампиньоны на мангале", 68000, { weight: "200 гр" }),

  // ПЕРВЫЕ БЛЮДА
  mk("soups", "Суп Харчо", 62000, {
    description_ru: "Традиционный ароматный наваристый суп из говядины",
    is_popular: true,
  }),
  mk("soups", "Домашняя куриная лапша", 41000, {
    description_ru: "Лапша собственного производства",
  }),
  mk("soups", "Домашние пельмени", 51000),
  mk("soups", "Суп грибной", 52000),
  mk("soups", "Суп чечевичный", 38000),
  mk("soups", "Наваристый антипохмельный хаш", 69000),
  mk("soups", "Окрошка", 41000, { is_seasonal: true }),

  // ГОРЯЧИЕ БЛЮДА
  mk("hot", "Чанахи из бон-филе", 128000, { description_ru: "С овощами, томленое в горшочке" }),
  mk("hot", "Оджахури из бон-филе", 138000, { description_ru: "Картофель, мясо, овощи и грибы" }),
  mk("hot", "Медальоны из говяжьей вырезки", 198000, {
    description_ru: "Под сливочным соусом с картофельным пюре",
    is_popular: true,
  }),
  mk("hot", "Телячьи щечки с картофельным пюре", 168000),
  mk("hot", "Телятина под острым томатным соусом", 118000, { description_ru: "Томленая в кеци" }),
  mk("hot", "Цыпленок Чкмерули", 146000, {
    description_ru: "Обжаренный до корочки цыпленок в сливочно-чесночном соусе",
    is_popular: true,
  }),
  mk("hot", "Бон филе с овощами Хоровац", 145000),
  mk("hot", "Чакапули", 122000, { description_ru: "Мякоть барашка, тархун" }),
  mk("hot", "Орагули с телятиной и грибами", 138000, {
    description_ru: "Запекается в кеци с сыром",
  }),
  mk("hot", "Чашушули из баранины", 128000, {
    description_ru: "Мясо, тушеное в собственном соку и томатном соусе",
  }),
  mk("hot", "Долма", 79000, { description_ru: "С чесночным соусом" }),
  mk("hot", "Оджахури с курицей", 84000, { description_ru: "Картофель, курица, овощи и грибы" }),
  mk("hot", "Орагули с курицей и грибами", 89000, { description_ru: "Запекается в кеци с сыром" }),
  mk("hot", "Хачапури из курицы", 84000, { needs_verification: true }),
  mk("hot", "Стейк из форели", 175000, {
    description_ru: "Подаем с картофельными дольками и голландским соусом",
  }),
  mk("hot", "Фетучини Альфредо", 68000, { description_ru: "С курицей и грибами" }),
  mk("hot", "Спагетти с креветками", 97000, { description_ru: "И помидоры черри" }),
  mk("hot", "Метехи", 134000, {
    description_ru: "Бон филе с жареной картошкой, вяленым луком, залеваем под сливочным соусом",
  }),

  // ГАРНИРЫ
  mk("sides", "Картофель фри", 33000),
  mk("sides", "Картофельное пюре", 27000),
  mk("sides", "Картофель по-домашнему", 49000),
  mk("sides", "Картофель по-домашнему с бон филе", 110000),
  mk("sides", "Лук фри", 35000),
  mk("sides", "Отварной рис", 19000),

  // СОУСЫ
  mk("sauces", "Сметанно-чесночный", 12000),
  mk("sauces", "Аджика", 12000, { description_ru: "Острый томатный соус" }),
  mk("sauces", "Ткемали", 12000, { description_ru: "Соус из алычи" }),
  mk("sauces", "Сацебели", 12000, { description_ru: "Соус на свежих томатах" }),
  mk("sauces", "Наршараб", 12000, { description_ru: "Гранатовый соус" }),
  mk("sauces", "Сметана", 12000),

  // ХЛЕБ
  mk("bread", "Хлебная корзина", 27000, {
    description_ru: "Пури собственного производства, лаваш и черный хлеб",
  }),
  mk("bread", "Пури", 18000),
  mk("bread", "Лаваш", 13000),
  mk("bread", "Черный хлеб", 9000),

  // ДЕТСКОЕ МЕНЮ
  mk("kids", "Бантики с курицей", 52000),
  mk("kids", "Куриная котлета с картофельным пюре", 65000),
  mk("kids", "Куриные нагетсы", 42000),

  // ДЕСЕРТЫ
  mk("desserts", "Медовик", 32000, { is_popular: true }),
  mk("desserts", "Наполеон", 45000),
  mk("desserts", "Яблочный пирог", 49000),
  mk("desserts", "Шоколадный фондан с мороженым", 58000, { is_popular: true }),
  mk("desserts", "Мороженое", 35000),
  mk("desserts", "Фруктовое ассорти", 140000),
];
