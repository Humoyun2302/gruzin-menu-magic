import type { Category, MenuItem } from "@/types/menu";

export const SEED_CATEGORIES: Category[] = [
  {
    id: "mangal",
    name_ru: "Кавказский мангал",
    name_en: "Caucasian Grill",
    sort_order: 10,
    is_active: true,
  },
  { id: "hot", name_ru: "Горячие блюда", name_en: "Hot Dishes", sort_order: 20, is_active: true },
  { id: "soups", name_ru: "Первые блюда", name_en: "Soups", sort_order: 30, is_active: true },
  { id: "salads", name_ru: "Салаты", name_en: "Salads", sort_order: 40, is_active: true },
  {
    id: "cold",
    name_ru: "Холодные закуски",
    name_en: "Cold Appetizers",
    sort_order: 50,
    is_active: true,
  },
  {
    id: "hotapps",
    name_ru: "Горячие закуски",
    name_en: "Hot Appetizers",
    sort_order: 60,
    is_active: true,
  },
  {
    id: "khachapuri",
    name_ru: "Хачапури из печи",
    name_en: "Khachapuri",
    sort_order: 70,
    is_active: true,
  },
  { id: "khinkali", name_ru: "Хинкали", name_en: "Khinkali", sort_order: 80, is_active: true },
  { id: "sides", name_ru: "Гарниры", name_en: "Sides", sort_order: 90, is_active: true },
  { id: "sauces", name_ru: "Соусы", name_en: "Sauces", sort_order: 100, is_active: true },
  { id: "bread", name_ru: "Хлеб", name_en: "Bread", sort_order: 110, is_active: true },
  { id: "kids", name_ru: "Детское меню", name_en: "Kids Menu", sort_order: 120, is_active: true },
  { id: "desserts", name_ru: "Десерты", name_en: "Desserts", sort_order: 130, is_active: true },
];

let _o = 0;
const ord = () => ++_o;

const mk = (
  categoryId: string,
  name_ru: string,
  price: number,
  extras: Partial<MenuItem> = {},
): MenuItem => ({
  id: `${categoryId}-${name_ru
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .slice(0, 40)}-${ord()}`,
  categoryId,
  name_ru,
  price,
  is_available: true,
  is_new: false,
  is_popular: false,
  is_seasonal: false,
  sort_order: _o,
  ...extras,
});

export const SEED_ITEMS: MenuItem[] = [
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
  mk("mangal", "Сочный цыпленок по аджарски", 118000, { weight: "600 гр", is_popular: true }),
  mk("mangal", "Тигровые креветки", 146000, { weight: "150 гр" }),
  mk("mangal", "Шашлык из форели", 167000, { weight: "200 гр" }),
  mk("mangal", "Дорада", 162000, { weight: "400 гр" }),
  mk("mangal", "Бэби картофель с курдючным салом", 61000, { weight: "200 гр" }),
  mk("mangal", "Овощи на мангале", 67000, {
    weight: "400 гр",
    description_ru: "Болгарский перец, баклажан, кабачки, кукуруза, помидоры, шампиньоны, лук",
  }),
  mk("mangal", "Шампиньоны на мангале", 68000, { weight: "200 гр" }),

  // ГОРЯЧИЕ БЛЮДА
  mk("hot", "Чанахи из бон филе", 128000, { description_ru: "С овощами, томленое в горшочке" }),
  mk("hot", "Оджахури из бон филе", 138000, { description_ru: "Картофель, мясо, овощи и грибы" }),
  mk("hot", "Медальоны из говяжьей вырезки", 198000, {
    description_ru: "Под сливочным соусом с картофельным пюре",
    is_popular: true,
  }),
  mk("hot", "Телячьи щёчки с картофельным пюре", 168000),
  mk("hot", "Телятина под острым томатным соусом", 118000, { description_ru: "Томленая в кеци" }),
  mk("hot", "Цыпленок чкмерули", 146000, {
    description_ru: "Обжаренный до корочки цыпленок в сливочно-чесночном соусе",
    is_popular: true,
  }),
  mk("hot", "Бон филе с овощами хороваи", 145000),
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
  mk("hot", "Чахохбили из курицы", 84000),
  mk("hot", "Стейк из форели", 175000, {
    description_ru: "Подаем с картофельными дольками и голландским соусом",
  }),
  mk("hot", "Фетучини альфредо", 68000, { description_ru: "С курицей и грибами" }),
  mk("hot", "Спагетти с креветками", 97000, { description_ru: "И помидоры черри" }),
  mk("hot", "Метехи", 134000, {
    description_ru: "Бон филе с жареной картошкой, вяленым луком, залеваем под сливочным соусом",
  }),

  // ПЕРВЫЕ БЛЮДА
  mk("soups", "Суп харчо", 62000, {
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

  // САЛАТЫ
  mk("salads", "Грузин", 89000, { description_ru: "Фирменный салат с грузинской заправкой" }),
  mk("salads", "Страчателла", 82000),
  mk("salads", "Оджахури", 69000),
  mk("salads", "Ачичук", 78000, { description_ru: "Свежие томаты, огурцы, лук, базилик" }),
  mk("salads", "Греческий", 73000),
  mk("salads", "Боржоми", 84000, {
    description_ru: "Авокадо, томаты, огурцы, шпинат, оливковое масло",
  }),
  mk("salads", "Тбилиси", 76000, {
    description_ru:
      "Фасоль, отварная говядина, болгарский перец, картофель и домашняя грузинская специя",
  }),
  mk("salads", "Салат с копченой форелью", 74000),
  mk("salads", "Цезарь с курицей", 75000),
  mk("salads", "Цезарь с креветками", 110000),
  mk("salads", "Салат с куриной печенью, рукколой и ананасом", 72000),
  mk("salads", "Зеленый салат с апельсинами", 69000),
  mk("salads", "Капрезе", 78000, {
    description_ru: "Помидоры, моцарелла, руккола, оливковое масло, песто соус",
  }),
  mk("salads", "Теплый салат с фасолью", 67000),
  mk("salads", "Запеченная свекла с мягким сыром", 69000),
  mk("salads", "Салат из карамелизированных баклажанов", 74000),
  mk("salads", "Батуми", 72000),

  // ХОЛОДНЫЕ ЗАКУСКИ
  mk("cold", "Лобио", 63000, { description_ru: "Красная фасоль, томленая в горшочке" }),
  mk("cold", "Пхали ассорти", 87000, {
    description_ru: "Закуска из шпината, свеклы и моркови с орехом",
  }),
  mk("cold", "Мжаве (маринованные овощи)", 70000),
  mk("cold", "Бадрджани", 69000, { description_ru: "Рулетики из запеченных баклажанов" }),
  mk("cold", "Селедочка с молодым картофелем", 87000),
  mk("cold", "Хумус", 59000),
  mk("cold", "Снэзьма", 39000),
  mk("cold", "Хороваи", 68000),
  mk("cold", "Холодец", 60000, { is_seasonal: true }),

  // ГОРЯЧИЕ ЗАКУСКИ
  mk("hotapps", "Запеченный сулугуни", 89000, { description_ru: "С томатами в горшочке" }),
  mk("hotapps", "Сациви из курицы", 69000),
  mk("hotapps", "Ассорти из свежей зелени с сулугуни", 79000),
  mk("hotapps", "Сырное ассорти", 147000),
  mk("hotapps", "Овощное ассорти по-грузински", 72000, {
    description_ru:
      "Помидоры, огурцы, болгарский перец, редис, острая стручковая перец, кинза, мята",
  }),
  mk("hotapps", "Маринованные шампиньоны с луком", 41000),
  mk("hotapps", "Шляпки шампиньонов", 79000),
  mk("hotapps", "Шашлычки колбаски (250 гр)", 66000, { weight: "250 гр" }),
  mk("hotapps", "Шашлычки колбаски (100 гр)", 95000, { weight: "100 гр" }),
  mk("hotapps", "Шашлычки колбаски (100/100 гр)", 125000, { weight: "100/100 гр" }),
  mk("hotapps", "Купаты говяжий", 79000),
  mk("hotapps", "Хрустящие вешенки", 69000),
  mk("hotapps", "Кучмачи", 57000),
  mk("hotapps", "Запеченный баклажан с сыром и помидорами", 79000),
  mk("hotapps", "Говяжий язык", 92000),
  mk("hotapps", "Рулетики из хрустящего лаваша", 83000),
  mk("hotapps", "Аджа", 72000, { needs_verification: true }),
  mk("hotapps", "Жареные пельмени", 58000),
  mk("hotapps", "Кутабы (сыр)", 42000),
  mk("hotapps", "Кутабы (мясо)", 48000),
  mk("hotapps", "Кутабы (зелень)", 39000),
  mk("hotapps", "Чесночные гренки", 39000),

  // ХАЧАПУРИ
  mk("khachapuri", "Хачапури по-аджарски (600 гр)", 117000, { weight: "600 гр", is_popular: true }),
  mk("khachapuri", "Хачапури по-аджарски (300 гр)", 78000, { weight: "300 гр", is_popular: true }),
  mk("khachapuri", "Хачапури по-мегрельски", 119000, { weight: "600 гр" }),
  mk("khachapuri", "Хачапури по-аджарски с шампиньонами (600 гр)", 119000, { weight: "600 гр" }),
  mk("khachapuri", "Хачапури по-аджарски с шампиньонами (300 гр)", 82000, { weight: "300 гр" }),
  mk("khachapuri", "Царский хачапури", 135000, { weight: "700 гр" }),
  mk("khachapuri", "Хачапури по-аджарски с помидорами (600 гр)", 119000, { weight: "600 гр" }),
  mk("khachapuri", "Хачапури по-аджарски с помидорами (300 гр)", 82000, { weight: "300 гр" }),
  mk("khachapuri", "Хачапури со шпинатом и сыром", 120000, { weight: "600 гр" }),
  mk("khachapuri", "Пеновани-хачапури из слоеного теста", 99000, { weight: "500 гр" }),
  mk("khachapuri", "Хачапури по-аджарски со шпинатом (800 гр)", 121000, { weight: "800 гр" }),
  mk("khachapuri", "Хачапури по-аджарски со шпинатом (300 гр)", 82000, { weight: "300 гр" }),
  mk("khachapuri", "Хачапури по-имеретински", 111000, { weight: "800 гр" }),
  mk("khachapuri", "Кубдари", 107000, {
    weight: "500 гр",
    description_ru: "Традиционный хачапури с мясом и свенскими специями",
  }),

  // ХИНКАЛИ
  mk("khinkali", "Хинкали со шпинатом и сыром", 19000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали с грибами и сливками", 17000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали с сыром", 17000, { weight: "1 шт" }),
  mk("khinkali", "Хинкали в соусе саджбели", 79000, { is_popular: true }),
  mk("khinkali", "Хинкали в сливочном соусе чкмерули", 82000),
  mk("khinkali", "Хинкали с тигровыми креветками", 97000),
  mk("khinkali", "Мама хинкали ассорти", 76000, { weight: "4 шт" }),
  mk("khinkali", "Хинкали отварные", 17000, { weight: "1 шт", description_ru: "С говядиной" }),
  mk("khinkali", "Хинкали жареные", 21000, { weight: "1 шт", description_ru: "С говядиной" }),
  mk("khinkali", "Хинкали по-грузински с мятой", 39000),

  // ГАРНИРЫ
  mk("sides", "Картофель фри", 33000),
  mk("sides", "Картофельное пюре", 27000),
  mk("sides", "Картофель по-домашнему с луком", 49000),
  mk("sides", "Картофель по-домашнему с бон филе", 110000),
  mk("sides", "Лук фри", 35000),
  mk("sides", "Отварной рис", 19000),

  // СОУСЫ
  mk("sauces", "Сметанно-чесночный соус", 12000),
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
  mk("kids", "Куриные наггетсы", 42000),

  // ДЕСЕРТЫ
  mk("desserts", "Медовик", 32000, { is_popular: true }),
  mk("desserts", "Наполеон", 45000),
  mk("desserts", "Яблочный пирог", 49000),
  mk("desserts", "Шоколадный фондан с мороженым", 58000, { is_popular: true }),
  mk("desserts", "Мороженое", 35000),
  mk("desserts", "Фруктовое ассорти", 140000),
];
