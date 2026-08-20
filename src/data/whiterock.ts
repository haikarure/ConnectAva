import {
  lagoonBedImage,
  partyBedImage,
  singleBedImage,
  aerialImage,
} from "@/assets/whiterock-assets";

export const ASSETS = {
  logoLight: "/assets/whiterock/logo-light.png",
  bgVideo: "/assets/whiterock/bg-2m.mp4",
  bgVideoWebm: "/assets/whiterock/bg-2m.webm",
  bgVideoFull: "/assets/whiterock/bg-video.mp4",
  aerial: aerialImage,
  lagoonBed: lagoonBedImage,
  partyBed: partyBedImage,
  singleBed: singleBedImage,
};

export const CONTACT = {
  name: "White Rock Beach Club",
  location: { id: "Melasti Beach • Ungasan, Uluwatu, Bali", en: "Melasti Beach • Ungasan, Uluwatu, Bali", ru: "Melasti Beach • Унгасан, Улувату, Bali", ko: "Melasti Beach • Ungasan, Uluwatu, Bali" },
  whatsapp: "+62 811 3803 003",
  email: "reservations@whiterockbali.com",
  hours: { id: "BUKA SETIAP HARI • 10:00 - 22:00", en: "OPEN DAILY • 10:00 AM - 10:00 PM", ru: "ОТКРЫТО ЕЖЕДНЕВНО • 10:00 - 22:00", ko: "매일 운영 • 10:00 - 22:00" },
  maps: "https://maps.google.com/?q=Melasti+Beach+Ungasan+Bali",
};

export const STATS = [
  { value: 350, suffix: "+", label: { id: "Sun Loungers & Daybeds", en: "Sun Loungers & Daybeds", ru: "Шезлонги и Daybed", ko: "선베드 및 데이베드" } },
  { value: 12, suffix: "M", label: { id: "Pantai Privat Melasti", en: "Private Melasti Beachfront", ru: "Приватный пляж Melasti", ko: "Melasti 프라이빗 해변" } },
  { value: 4.9, suffix: "★", label: { id: "Rating Tamu", en: "Guest Rating", ru: "Рейтинг гостей", ko: "고객 평점" } },
  { value: 24, suffix: "h", label: { id: "Concierge AI Aktif", en: "AI Concierge Live", ru: "AI-консьерж онлайн", ko: "AI 컨시어지 운영중" } },
];

export type Daybed = {
  id: string;
  name: { id: string; en: string };
  capacity: string;
  minSpendIdr: number;
  desc: { id: string; en: string };
  features: { id: string; en: string }[];
  image: string;
  accent: string;
};

export const DAYBEDS: Daybed[] = [
  {
    id: "lagoon",
    name: { id: "Lagoon Bed", en: "Lagoon Bed", ru: "Лагунная кровать", ko: "라군 베드" },
    capacity: "4 pax",
    minSpendIdr: 500_000,
    desc: {
      id: "Tempat berjemur di tepi laguna dengan air tenang, sempurna untuk berpasangan atau keluarga kecil.",
      en: "Shoreline lounging by the calm lagoon — perfect for couples or a small family.",
      ru: "Загорание у спокойной лагуны — идеально для пары или небольшой семьи.",
      ko: "잔잔한 라군 가장자리에서의 휴식 — 커플이나 소가족에게 완벽합니다.",
    },
    features: [
      { id: "Tepi laguna tenang", en: "Calm lagoon edge", ru: "Спокойный край лагуны", ko: "잔잔한 라군 가장자리" },
      { id: "Payung & handuk premium", en: "Premium umbrella & towels", ru: "Премиум зонт и полотенца", ko: "프리미엄 파라솔 및 타월" },
      { id: "Welcome drink", en: "Welcome drink", ru: "Welcome drink", ko: "웰컴 드링크" },
    ],
    image: lagoonBedImage,
    accent: "from-amber-500/30 to-orange-600/10",
  },
  {
    id: "vip-cabana",
    name: { id: "VIP Cabana", en: "VIP Cabana", ru: "VIP Кабана", ko: "VIP 카바나" },
    capacity: "12 pax",
    minSpendIdr: 4_500_000,
    desc: {
      id: "Cabana eksklusif dengan tirai privat, sofa empuk, dan service dedicated untuk rombongan VIP.",
      en: "Exclusive cabana with private drapes, plush sofas, and a dedicated host for VIP groups.",
      ru: "Эксклюзивная кабана с приватными занавесями, мягкими диванами и персональным хостом для VIP-групп.",
      ko: "프라이빗 커튼, 편안한 소파, 전담 호스트를 갖춘 VIP 그룹 전용 카바나.",
    },
    features: [
      { id: "Area privat ber-tirai", en: "Curtained private area", ru: "Приватная занавешенная зона", ko: "커튼 친 프라이빗 공간" },
      { id: "Sofa & daybed king", en: "King sofa & daybed", ru: "Большой диван и daybed", ko: "킹 소파 및 데이베드" },
      { id: "Dedicated server", en: "Dedicated server", ru: "Персональный официант", ko: "전담 서버" },
    ],
    image: partyBedImage,
    accent: "from-amber-500/30 to-yellow-600/10",
  },
  {
    id: "party-suite",
    name: { id: "Party Executive Suite", en: "Party Executive Suite", ru: "Представительский праздничный сьют", ko: "파티 이그제큐티브 스위트" },
    capacity: "15 pax",
    minSpendIdr: 8_000_000,
    desc: {
      id: "Suite pesta mewah dengan sound system sendiri, meja botol, dan view sunset terbaik klub.",
      en: "Lavish party suite with its own sound system, bottle service, and the club's best sunset view.",
      ru: "Роскошный праздничный сьют со собственной звуковой системой, бутылочным сервисом и лучшим видом на закат в клубе.",
      ko: "전용 사운드 시스템, 보틀 서비스, 클럽 최고의 석양 뷰를 갖춘 호화 파티 스위트.",
    },
    features: [
      { id: "Private sound system", en: "Private sound system", ru: "Приватная звуковая система", ko: "프라이빗 사운드 시스템" },
      { id: "Bottle service", en: "Bottle service", ru: "Бутылочный сервис", ko: "보틀 서비스" },
      { id: "Best sunset view", en: "Best sunset view", ru: "Лучший вид на закат", ko: "최고의 석양 뷰" },
    ],
    image: partyBedImage,
    accent: "from-rose-500/30 to-amber-600/10",
  },
  {
    id: "single-sofa",
    name: { id: "Single Sofa", en: "Single Sofa", ru: "Одноместный диван", ko: "싱글 소파" },
    capacity: "2 pax",
    minSpendIdr: 300_000,
    desc: {
      id: "Sofa intim untuk dua orang, dekat bar dan sunrise point — pilihan hemat namun stylish.",
      en: "Intimate two-seat sofa near the bar and sunrise point — chic on a budget.",
      ru: "Интимный диван на двоих у бара и точки восхода — стильно и по доступной цене.",
      ko: "바와 일출 포인트 근처의 아늑한 2인 소파 — 합리적인 가격에 세련된 선택.",
    },
    features: [
      { id: "Dekat cliffside bar", en: "Near cliffside bar", ru: "Рядом с cliffside-баром", ko: "절벽 바 근처" },
      { id: "Sunrise point", en: "Sunrise point", ru: "Точка восхода", ko: "일출 포인트" },
      { id: "Best value", en: "Best value", ru: "Лучшая ценность", ko: "최고의 가성비" },
    ],
    image: singleBedImage,
    accent: "from-yellow-500/30 to-amber-600/10",
  },
];

export type Experience = {
  id: string;
  title: { id: string; en: string };
  desc: { id: string; en: string };
  icon: "waves" | "sun" | "music" | "spa" | "camera" | "glass" | "flame" | "heart";
};

export const EXPERIENCES: Experience[] = [
  {
    id: "sunset",
    title: { id: "Oceanic Sunset Sessions", en: "Oceanic Sunset Sessions", ru: "Океанские сессии заката", ko: "오션 선셋 세션" },
    desc: {
      id: "Chill house & melodic techno dengan view matahari terbenam Melasti yang mendebarkan.",
      en: "Chill house & melodic techno with breathtaking Melasti sunset views.",
      ru: "Chill house и мелодичный техно с захватывающими видами заката Melasti.",
      ko: "잔잔한 하우스와 멜로딕 테크노와 함께하는 압도적인 Melasti 석양 뷰.",
    },
    icon: "sun",
  },
  {
    id: "weekend",
    title: { id: "Weekend Party Wave", en: "Weekend Party Wave", ru: "Волна вечеринок выходного дня", ko: "주말 파티 웨이브" },
    desc: {
      id: "DJ headline, laser show, dan parade botol poolside setiap Jumat & Sabtu malam.",
      en: "Headline DJs, laser shows, and poolside bottle parades every Fri & Sat night.",
      ru: "Хедлайнеры-DJ, лазер-шоу и парады бутылок у бассейна каждые пятницу и субботу вечером.",
      ko: "헤드라인 DJ, 레이저 쇼, 그리고 매주 금·토 밤 풀사이드 보틀 퍼레이드.",
    },
    icon: "music",
  },
  {
    id: "fullmoon",
    title: { id: "Full Moon Festival", en: "Full Moon Festival", ru: "Фестиваль полнолуния", ko: "풀 문 페스티벌" },
    desc: {
      id: "Perayaan pantai tak terlupakan di bawah cahaya tebing Melasti yang tersinar.",
      en: "Unforgettable beachfront celebration under the illuminated Melasti cliffs.",
      ru: "Незабываемое празднование на пляже под освещёнными скалами Melasti.",
      ko: "빛나는 Melasti 절벽 아래에서 펼쳐지는 잊을 수 없는 해변 축제.",
    },
    icon: "flame",
  },
  {
    id: "spaday",
    title: { id: "Cliffside Spa Day", en: "Cliffside Spa Day", ru: "День спа у скал", ko: "클리프사이드 스파 데이" },
    desc: {
      id: "Pijat aromaterapi dan facial rejuvenasi dengan angin laut dari atas tebing.",
      en: "Aromatherapy massage and rejuvenating facials with sea breeze from the cliff.",
      ru: "Ароматерапевтический массаж и омолаживающие процедуры лица с морским бризом со скалы.",
      ko: "절벽에서 불어오는 바닷바람과 함께하는 아로마테라피 마사지와 리주버네이팅 페이셜.",
    },
    icon: "spa",
  },
];

export type MenuItem = {
  name: { id: string; en: string };
  desc: { id: string; en: string };
  priceIdr: number;
  tag?: { id: string; en: string };
};

export const KITCHEN_MENU: MenuItem[] = [
  {
    name: { id: "Jimbaran Grilled Seafood", en: "Jimbaran Grilled Seafood", ru: "Жареные морепродукты Jimbaran", ko: "Jimbaran 그릴 해산물" },
    desc: { id: "Ikan segar bakar arang, sambal matah, nasi uduk", en: "Charcoal-grilled fresh catch, sambal matah, coconut rice", ru: "Свежая рыба на углях, самбал matah, кокосовый рис", ko: "숯불 신선한 생선, 삼발 마타, 코코넛 라이스" },
    priceIdr: 320_000,
    tag: { id: "Signature", en: "Signature", ru: "Фирменное", ko: "시그니처" },
  },
  {
    name: { id: "Wagyu Sliders", en: "Wagyu Sliders", ru: "Вагю-слайдеры", ko: "와규 슬라이더" },
    desc: { id: "Mini burger daging Wagyu, keju leleh, truffle aioli", en: "Wagyu beef mini burgers, melted cheese, truffle aioli", ru: "Мини-бургеры из говядины Wagyu, плавленый сыр, трюфельный айоли", ko: "와규 비프 미니 버거, 녹은 치즈, 트러플 아이올리" },
    priceIdr: 180_000,
  },
  {
    name: { id: "Wood-Fired Pizza", en: "Wood-Fired Pizza", ru: "Пицца из дровяной печи", ko: "우드파이어 피자" },
    desc: { id: "Adonan fermentasi 48 jam, topping Mediterania", en: "48-hour fermented dough, Mediterranean toppings", ru: "Тесто 48-часовой ферментации, средиземноморские топпинги", ko: "48시간 숙성 반죽, 지중해 토핑" },
    priceIdr: 150_000,
  },
  {
    name: { id: "Tropical Açai Bowl", en: "Tropical Açai Bowl", ru: "Тропический асаи-боул", ko: "트로피컬 아사이 보울" },
    desc: { id: "Açai, buah tropis, granola kelapa", en: "Açai, tropical fruit, coconut granola", ru: "Асаи, тропические фрукты, кокосовая гранола", ko: "아사이, 트로피컬 과일, 코코넛 그라놀라" },
    priceIdr: 120_000,
  },
];

export const BAR_MENU: MenuItem[] = [
  {
    name: { id: "Melasti Sunset Spritz", en: "Melasti Sunset Spritz", ru: "Melasti Sunset Spritz", ko: "Melasti 선셋 스프리츠" },
    desc: { id: "Botanical Bali lokal, prosecco, soda jeruk", en: "Local Balinese botanicals, prosecco, citrus soda", ru: "Местные балийские ботаникалы, просекко, цитрусовая сода", ko: "현지 발리 보태니컬, 프로세코, 시트러스 소다" },
    priceIdr: 140_000,
    tag: { id: "House", en: "House", ru: "Домашний", ko: "하우스" },
  },
  {
    name: { id: "Imported Champagne", en: "Imported Champagne", ru: "Импортный шампанский", ko: "수입 샴페인" },
    desc: { id: "Pilihan champagne Perancis dingin", en: "Chilled French champagne selection", ru: "Охлаждённый выбор французского шампанского", ko: "차갑게 즐기는 프랑스 샴페인 선택" },
    priceIdr: 1_200_000,
  },
  {
    name: { id: "Premium Spirit Bottle", en: "Premium Spirit Bottle", ru: "Премиальная бутылка спиртного", ko: "프리미엄 스피릿 보틀" },
    desc: { id: "Botol import pilihan dengan mixer", en: "Selected imported bottles with mixers", ru: "Отобранные импортные бутылки с миксерами", ko: "선별된 수입 보틀과 믹서" },
    priceIdr: 2_500_000,
  },
];

export const TESTIMONIALS = [
  {
    quote: {
      id: "Tempat paling epik di Melasti. Sarah si AI host bantu booking dalam 1 menit. 10/10.",
      en: "The most epic spot in Melasti. Sarah the AI host booked us in 1 minute. 10/10.",
      ru: "Самое эпичное место в Melasti. Sarah, AI-хост, забронировала за 1 минуту. 10/10.",
      ko: "Melasti에서 가장 에픽한 곳. AI 호스트 Sarah가 1분 만에 예약해줬어요. 10/10.",
    },
    author: "Anindya R.",
    role: { id: "Jakarta", en: "Jakarta", ru: "Джакарта", ko: "자카르타" },
  },
  {
    quote: {
      id: "Sunset party-nya gila. Cabana VIP worth it banget buat rombongan kita.",
      en: "The sunset party is insane. The VIP cabana was so worth it for our group.",
      ru: "Вечеринка на закате безумная. VIP-кабана того стоила для нашей компании.",
      ko: "석양 파티가 미쳤어요. VIP 카바나는 우리 그룹에게 완전 가치 있었어요.",
    },
    author: "Marcus T.",
    role: { id: "Sydney", en: "Sydney", ru: "Сидней", ko: "시드니" },
  },
  {
    quote: {
      id: "Makanannya level restoran bintang 5, vibe beach club. Balik lagi pasti.",
      en: "Food is 5-star restaurant level, beach club vibe. We'll be back.",
      ru: "Еда уровня 5-звёздочного ресторана, вайб beach club. Точно вернёмся.",
      ko: "음식은 5성급 레스토랑 수준, 비치 클럽 분위기. 꼭 다시 올게요.",
    },
    author: "Yuki & Ken",
    role: { id: "Tokyo", en: "Tokyo", ru: "Токио", ko: "도쿄" },
  },
];

export const FAQS = [
  {
    q: { id: "Apa ada biaya masuk?", en: "Is there an entrance fee?", ru: "Есть ли входная плата?", ko: "입장료가 있나요?" },
    a: {
      id: "Tidak — White Rock bebas masuk (FREE ENTRANCE). Anda hanya membayar minimum spend untuk daybed & F&B.",
      en: "No — White Rock is free entrance. You only pay a minimum spend for daybeds & F&B.",
      ru: "Нет — вход в White Rock бесплатный (FREE ENTRANCE). Вы платите только минимальный расход за daybed и F&B.",
      ko: "아니요 — White Rock은 무료 입장입니다. 데이베드와 F&B의 최소 이용금액만 지불하시면 됩니다.",
    },
  },
  {
    q: { id: "Bagaimana cara reservasi daybed?", en: "How do I reserve a daybed?", ru: "Как забронировать daybed?", ko: "데이베드는 어떻게 예약하나요?" },
    a: {
      id: "Lewat halaman 'Daybeds & Suites', atau ngobrol langsung dengan Sarah (AI VIP Host) di pojok kanan bawah.",
      en: "Via the 'Daybeds & Suites' page, or just talk to Sarah (AI VIP Host) at the bottom-right.",
      ru: "Через страницу «Daybeds & Suites» или просто поговорите с Sarah (AI VIP Host) в правом нижнем углу.",
      ko: "«Daybeds & Suites» 페이지에서, 또는 우측 하단의 Sarah (AI VIP Host)와 바로 대화하세요.",
    },
  },
  {
    q: { id: "Apakah ada spa & fitness?", en: "Do you have spa & fitness?", ru: "Есть ли спа и фитнес?", ko: "스파와 피트니스가 있나요?" },
    a: {
      id: "Ya — ada Cliffside Spa dan Fitness Center. Lihat di menu 'Wellness'.",
      en: "Yes — we have a Cliffside Spa and Fitness Center. See the 'Wellness' menu.",
      ru: "Да — у нас есть Cliffside Spa и Фитнес-центр. Смотрите меню «Wellness».",
      ko: "네 — Cliffside Spa와 피트니스 센터가 있습니다. «Wellness» 메뉴를 확인하세요.",
    },
  },
  {
    q: { id: "Bisa event pernikahan / MICE?", en: "Can you host weddings / MICE?", ru: "Можете ли вы проводить свадьбы / MICE?", ko: "웨딩 / MICE 행사가 가능한가요?" },
    a: {
      id: "Tentu. Kami punya multifunction hall dan paket pernikahan pantai. Cek halaman 'Weddings & MICE'.",
      en: "Absolutely. We have a multifunction hall and beach wedding packages. See 'Weddings & MICE'.",
      ru: "Конечно. У нас есть многофункциональный зал и пакеты пляжных свадеб. Смотрите страницу «Weddings & MICE».",
      ko: "물론입니다. 저희는 다목적 홀과 해변 웨딩 패키지를 갖추고 있습니다. «Weddings & MICE» 페이지를 확인하세요.",
    },
  },
];
