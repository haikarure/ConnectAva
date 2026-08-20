import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ASSETS, CONTACT } from "@/data/whiterock";
import { useLang, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  MessageCircle,
  Bed,
  Utensils,
  Sparkles,
  Music,
  Shirt,
  Waves,
  CalendarHeart,
  CloudSun,
} from "lucide-react";

const NAV: {
  label: { id: string; en: string; ru?: string; ko?: string };
  to: string;
  children?: { label: { id: string; en: string; ru?: string; ko?: string }; to: string; icon?: any }[];
}[] = [
  {
    label: { id: "Daybeds & Suite", en: "Daybeds & Suites", ru: "Шезлонги и люксы", ko: "데이베드 및 스위트" },
    to: "/daybeds-suites",
    children: [
      { label: { id: "Semua Daybed", en: "All Daybeds", ru: "Все шезлонги", ko: "모든 데이베드" }, to: "/daybeds-suites", icon: Bed },
      { label: { id: "VIP Cabana", en: "VIP Cabana", ru: "VIP кабана", ko: "VIP 카바나" }, to: "/daybeds-suites#vip", icon: Sparkles },
      { label: { id: "Reservasi", en: "Reserve", ru: "Забронировать", ko: "예약" }, to: "/booking", icon: CalendarHeart },
    ],
  },
  {
    label: { id: "Dining", en: "Dining", ru: "Рестораны", ko: "다이닝" },
    to: "/dining",
    children: [
      { label: { id: "White Rock Kitchen", en: "White Rock Kitchen", ru: "White Rock Kitchen", ko: "White Rock Kitchen" }, to: "/dining", icon: Utensils },
      { label: { id: "Cliffside Bar", en: "Cliffside Bar", ru: "Клифсайд бар", ko: "클리프사이드 바" }, to: "/dining#bar", icon: Waves },
    ],
  },
  {
    label: { id: "Experiences", en: "Experiences", ru: "Впечатления", ko: "체험" },
    to: "/experiences",
    children: [
      { label: { id: "Semua Aktivitas", en: "All Activities", ru: "Все активности", ko: "모든 액티비티" }, to: "/experiences", icon: Sparkles },
      { label: { id: "DJ & Events", en: "DJ & Events", ru: "DJ и события", ko: "DJ 및 이벤트" }, to: "/events", icon: Music },
      { label: { id: "NYE 2026", en: "NYE 2026", ru: "NYE 2026", ko: "NYE 2026" }, to: "/nye", icon: CalendarHeart },
    ],
  },
  {
    label: { id: "Wellness", en: "Wellness", ru: "Велнес", ko: "웰니스" },
    to: "/spa-wellness",
    children: [
      { label: { id: "Spa & Wellness", en: "Spa & Wellness", ru: "Спа и велнес", ko: "스파 및 웰니스" }, to: "/spa-wellness", icon: Sparkles },
      { label: { id: "Fitness Center", en: "Fitness Center", ru: "Фитнес-центр", ko: "피트니스 센터" }, to: "/fitness-center", icon: Waves },
    ],
  },
  {
    label: { id: "Events & MICE", en: "Events & MICE", ru: "События и MICE", ko: "이벤트 및 MICE" },
    to: "/weddings-mice",
    children: [
      { label: { id: "Weddings", en: "Weddings", ru: "Свадьбы", ko: "웨딩" }, to: "/weddings-mice#weddings", icon: CalendarHeart },
      { label: { id: "MICE / Corporate", en: "MICE / Corporate", ru: "MICE / корпоратив", ko: "MICE / 기업 행사" }, to: "/weddings-mice#mice", icon: Sparkles },
      { label: { id: "Merchandise", en: "Merchandise", ru: "Мерч", ko: "머천다이즈" }, to: "/merch", icon: Shirt },
    ],
  },
  {
    label: { id: "Info", en: "Info", ru: "Информация", ko: "정보" },
    to: "/live-weather",
    children: [
      { label: { id: "Live Weather & Tide", en: "Live Weather & Tide", ru: "Погода и приливы в реальном времени", ko: "실시간 날씨 및 조수" }, to: "/live-weather", icon: CloudSun },
      { label: { id: "Kontak", en: "Contact", ru: "Контакты", ko: "연락처" }, to: "/contact", icon: MessageCircle },
      { label: { id: "FAQ", en: "FAQ", ru: "Часто задаваемые вопросы", ko: "자주 묻는 질문" }, to: "/faq", icon: Globe },
      { label: { id: "Karir", en: "Careers", ru: "Карьера", ko: "채용" }, to: "/careers", icon: Sparkles },
    ],
  },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: "id", label: "ID" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "ko", label: "KO" },
];

export function Navbar() {
  const { lang, setLang, currency, tf } = useLang();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "bg-[hsl(222_47%_5%/0.9)] border-b border-amber-300/15 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={ASSETS.logoLight} alt="White Rock Bali" className="h-9 md:h-11 w-auto object-contain drop-shadow" />
            <span className="hidden lg:block text-[10px] uppercase tracking-[0.3em] text-amber-300/80 font-semibold border-l border-white/15 pl-3">
              {tf({ id: "Melasti Beach", en: "Melasti Beach", ru: "Пляж Меласти", ko: "멜라스티 비치" })}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.to)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    location.pathname.startsWith(item.to)
                      ? "text-amber-300"
                      : "text-slate-200/80 hover:text-white"
                  )}
                >
                  {tf(item.label)}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </Link>

                {item.children && activeMenu === item.to && (
                  <div className="absolute left-0 top-full pt-3 w-64">
                    <div className="glass-strong rounded-2xl p-2 shadow-2xl border border-white/10">
                      {item.children.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={c.to + c.label.en}
                            to={c.to}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-200/80 hover:bg-white/5 hover:text-amber-300 transition-colors"
                          >
                            {Icon && <Icon className="h-4 w-4 text-amber-300/70" />}
                            {tf(c.label)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language dropdown — shows active lang, reveals others on hover */}
            <div className="hidden md:block relative group">
              <button
                className="flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-100 hover:text-white transition-colors"
                aria-label="Select language"
              >
                {LANGS.find((l) => l.code === lang)?.label ?? "EN"}
                <ChevronDown className="h-3.5 w-3.5 text-amber-300/70" />
              </button>
              <div className="absolute right-0 top-full pt-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="glass-strong rounded-xl p-1 shadow-2xl border border-white/10">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors",
                        lang === l.code
                          ? "gold-gradient text-black"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="lg:hidden text-white p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden glass-strong border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-5 py-4 space-y-1">
            <div className="mb-3">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center justify-between w-full glass rounded-xl px-4 py-3 text-sm font-semibold text-slate-100"
              >
                <span>
                  {LANGS.find((l) => l.code === lang)?.label ?? "EN"}
                  <span className="text-slate-400 font-normal ml-2">· {currency}</span>
                </span>
                <ChevronDown className={cn("h-4 w-4 text-amber-300/70 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="grid grid-cols-2 gap-1 mt-1 px-1">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "px-3 py-2 text-xs font-semibold rounded-lg transition-colors",
                        lang === l.code ? "gold-gradient text-black" : "text-slate-300 hover:bg-white/5"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {NAV.map((item) => (
              <div key={item.to} className="py-1">
                <Link
                  to={item.to}
                  className="block px-3 py-2.5 rounded-xl text-base font-medium text-white hover:bg-white/5"
                >
                  {tf(item.label)}
                </Link>
                {item.children && (
                  <div className="pl-4 border-l border-white/10 ml-3 mt-1 space-y-0.5">
                    {item.children.map((c) => (
                      <Link
                        key={c.to + c.label.en}
                        to={c.to}
                        className="block px-3 py-2 rounded-lg text-sm text-slate-300/80 hover:text-amber-300"
                      >
                        {tf(c.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm text-slate-400 py-2"
            >
              WhatsApp: {CONTACT.whatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
