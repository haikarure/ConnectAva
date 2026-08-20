import { Link } from "react-router-dom";
import { ASSETS, CONTACT } from "@/data/whiterock";
import { useLang } from "@/lib/i18n";
import {
  Instagram,
  Facebook,
  Youtube,
  Music2,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const COLS = [
  {
    title: { id: "Jelajahi", en: "Explore", ru: "Исследуйте", ko: "둘러보기" },
    links: [
      { label: { id: "Daybeds & Suite", en: "Daybeds & Suites", ru: "Шезлонги и люксы", ko: "데이베드 및 스위트" }, to: "/daybeds-suites" },
      { label: { id: "Dining", en: "Dining", ru: "Рестораны", ko: "다이닝" }, to: "/dining" },
      { label: { id: "Experiences", en: "Experiences", ru: "Впечатления", ko: "체험" }, to: "/experiences" },
      { label: { id: "Events", en: "Events", ru: "События", ko: "이벤트" }, to: "/events" },
      { label: { id: "Reservasi", en: "Book a Daybed", ru: "Забронировать шезлонг", ko: "데이베드 예약" }, to: "/booking" },
    ],
  },
  {
    title: { id: "Pengalaman", en: "Experiences", ru: "Впечатления", ko: "체험" },
    links: [
      { label: { id: "Spa & Wellness", en: "Spa & Wellness", ru: "Спа и велнес", ko: "스파 및 웰니스" }, to: "/spa-wellness" },
      { label: { id: "Fitness Center", en: "Fitness Center", ru: "Фитнес-центр", ko: "피트니스 센터" }, to: "/fitness-center" },
      { label: { id: "Weddings & MICE", en: "Weddings & MICE", ru: "Свадьбы и MICE", ko: "웨딩 및 MICE" }, to: "/weddings-mice" },
      { label: { id: "Merchandise", en: "Merchandise", ru: "Мерч", ko: "머천다이즈" }, to: "/merch" },
      { label: { id: "Valet Parking", en: "Valet Parking", ru: "Парковка с швейцаром", ko: "발레 파킹" }, to: "/valet-parking" },
    ],
  },
  {
    title: { id: "Perusahaan", en: "Company", ru: "Компания", ko: "회사" },
    links: [
      { label: { id: "Live Weather", en: "Live Weather & Tide", ru: "Погода и приливы в реальном времени", ko: "실시간 날씨 및 조수" }, to: "/live-weather" },
      { label: { id: "Kontak", en: "Contact", ru: "Контакты", ko: "연락처" }, to: "/contact" },
      { label: { id: "FAQ", en: "FAQ", ru: "Часто задаваемые вопросы", ko: "자주 묻는 질문" }, to: "/faq" },
      { label: { id: "Karir", en: "Careers", ru: "Карьера", ko: "채용" }, to: "/careers" },
      { label: { id: "NYE 2026", en: "NYE 2026", ru: "NYE 2026", ko: "NYE 2026" }, to: "/nye" },
    ],
  },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com" },
  { Icon: Facebook, href: "https://facebook.com" },
  { Icon: Youtube, href: "https://youtube.com" },
  { Icon: Music2, href: "https://tiktok.com" },
];

export function Footer() {
  const { tf, lang } = useLang();
  return (
    <footer className="relative bg-[hsl(222_47%_4%)] border-t border-white/10 pt-16 pb-8">
      <div className="absolute inset-x-0 top-0 h-px hairline" />
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <img src={ASSETS.logoLight} alt="White Rock Bali" className="h-12 w-auto" />
            <p className="text-slate-400 font-light text-sm max-w-sm leading-relaxed">
              {tf({
                id: "Beach club & resort tepi pantai paling epik di Melasti, Uluwatu. Free entrance, vibe mewah, dan AI concierge 24 jam.",
                en: "The most epic beachfront club & resort in Melasti, Uluwatu. Free entrance, luxe vibes, and a 24/7 AI concierge.",
                ru: "Самый эпичный пляжный клуб и курорт на побережье в Меласти, Улувату. Бесплатный вход, роскошная атмосфера и AI-консьерж 24/7.",
                ko: "Melasti, Uluwatu 해변 최고의 에픽한 비치 클럽 & 리조트. 무료 입장, 럭셔리한 분위기, 그리고 24시간 AI 컨시어지.",
              })}
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 grid place-items-center rounded-full glass hover:border-amber-400/50 hover:text-amber-300 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title.en}>
              <h4 className="font-cinzel text-amber-300/90 text-sm font-semibold tracking-wider uppercase mb-4">
                {tf(col.title)}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label.en}>
                    <Link
                      to={l.to}
                      className="text-slate-400 hover:text-white text-sm font-light transition-colors"
                    >
                      {tf(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 text-sm text-slate-400">
          <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <MapPin className="h-4 w-4 text-amber-300" /> {tf(CONTACT.location)}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail className="h-4 w-4 text-amber-300" /> {CONTACT.email}
          </a>
          <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="h-4 w-4 text-amber-300" /> WhatsApp {CONTACT.whatsapp}
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 {CONTACT.name} · Melasti Beach, Bali. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-glow-pulse" />
            {tf({ id: "Powered by Sarah · AI VIP Host", en: "Powered by Sarah · AI VIP Host", ru: "Работает на Sarah · AI VIP Host", ko: "Powered by Sarah · AI VIP Host" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
