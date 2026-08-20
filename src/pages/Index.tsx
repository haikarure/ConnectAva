import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BgVideo } from "@/components/layout/BgVideo";
import { useLang } from "@/lib/i18n";
import {
  ASSETS,
  STATS,
  DAYBEDS,
  EXPERIENCES,
  KITCHEN_MENU,
  BAR_MENU,
  TESTIMONIALS,
  CONTACT,
} from "@/data/whiterock";
import {
  Waves,
  Sun,
  Music,
  Sparkles,
  Camera,
  GlassWater,
  Flame,
  Heart,
  ArrowRight,
  Star,
  MessageCircle,
  MapPin,
  Volume2,
} from "lucide-react";

const EXP_ICONS: Record<string, any> = { waves: Waves, sun: Sun, music: Music, spa: Sparkles, camera: Camera, glass: GlassWater, flame: Flame, heart: Heart };

export default function Index() {
  const { tf, formatPrice } = useLang();
  const navigate = useNavigate();
  const openSarah = () => {
    const ev = new CustomEvent("open-sarah");
    window.dispatchEvent(ev);
  };

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center overflow-hidden ambient">
        <BgVideo
          className="opacity-55"
          poster={ASSETS.aerial}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%/0.6)] via-[hsl(222_47%_6%/0.45)] to-[hsl(222_47%_6%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,transparent,rgba(0,0,0,0.45))]" />

        <div className="relative z-10 container mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-amber-300/90 mb-6">
              {tf({ id: "Melasti Beach • Uluwatu, Bali", en: "Melasti Beach • Uluwatu, Bali", ru: "Пляж Меласти • Улувату, Бали", ko: "멜라스티 비치 • 울루와투, 발리" })}
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-cinzel font-bold tracking-wide leading-[0.95] text-slate-50 text-glow-gold text-5xl sm:text-7xl md:text-8xl">
              {tf({ id: "RASAKAN", en: "FEEL THE", ru: "ПОЧУВСТВУЙ", ko: "느껴보세요" })}
              <br />
              <span className="text-gold">{tf({ id: "PENGALAMANNYA", en: "EXPERIENCE", ru: "ВПЕЧАТЛЕНИЕ", ko: "경험을" })}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-7 text-base md:text-xl font-light text-slate-200/85 max-w-2xl mx-auto">
              {tf({
                id: "Beach club & resort tepi pantai terbaik di Bali. Free entrance, daybed mewah, sunset DJ, dan AI concierge 24 jam yang siap bantu booking dalam sekejap.",
                en: "The best beachfront club & resort in Bali. Free entrance, luxe daybeds, sunset DJs, and a 24/7 AI concierge that books you in seconds.",
                ru: "Лучший пляжный клуб и курорт на Бали. Бесплатный вход, роскошные шезлонги, закатные диджеи и AI-консьерж 24/7, который забронирует вам за секунды.",
                ko: "발리 최고의 비치프론트 클럽 & 리조트. 무료 입장, 럭셔리 데이베드, 선셋 DJ, 그리고 몇 초 만에 예약해 주는 24시간 AI 컨시어지.",
              })}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="luxury" size="xl" onClick={() => navigate("/booking")} className="group">
                {tf({ id: "Reservasi Daybed", en: "Reserve a Daybed", ru: "Забронировать шезлонг", ko: "데이베드 예약" })}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="hero" size="xl" onClick={() => navigate("/experiences")}>
                {tf({ id: "Lihat Experiences", en: "Explore Experiences", ru: "Откройте для себя впечатления", ko: "체험 둘러보기" })}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-300/60">
          <span className="text-[10px] uppercase tracking-[0.3em]">{tf({ id: "Gulir", en: "Scroll", ru: "Прокрутите", ko: "스크롤" })}</span>
          <div className="h-12 w-px bg-gradient-to-b from-amber-300/60 to-transparent" />
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="py-10 border-y border-white/10 bg-[hsl(222_47%_9%)]">
        <div className="container mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="font-cinzel text-3xl md:text-4xl font-bold text-gold">
                <CountUp end={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
              </div>
              <div className="text-xs md:text-sm text-slate-400 mt-1">{tf(s.label)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- DAYBEDS SHOWCASE ---------- */}
      <section className="py-24 px-5 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={tf({ id: "Koleksi Daybed", en: "The Daybed Collection", ru: "Коллекция шезлонгов", ko: "데이베드 컬렉션" })}
            title={tf({ id: "Lounging di Tepi Pantai", en: "Lounging by the Shoreline", ru: "Отдых у берега", ko: "해변가에서의 여유" })}
            subtitle={tf({
              id: "Dari sofa intim untuk berdua sampai party suite untuk 15 orang — semua dengan view laut langsung dan service kelas atas.",
              en: "From intimate two-seat sofas to 15-guest party suites — all with direct ocean views and top-tier service.",
              ru: "От уютных диванов для двоих до праздничных люксов на 15 гостей — все с прямым видом на океан и первоклассным сервисом.",
              ko: "둘만을 위한 아늑한 소파부터 15명 규모의 파티 스위트까지 — 모두 바다 전망과 최고급 서비스를 갖추고 있습니다.",
            })}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DAYBEDS.map((d, i) => (
              <Reveal key={d.id} delay={i * 90}>
                <Card className="glow-card overflow-hidden bg-transparent rounded-3xl h-full">
                  <div className={`relative h-48 bg-gradient-to-br ${d.accent} overflow-hidden`}>
                    <img src={d.image} alt={tf(d.name)} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90" />
                    <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-xs font-semibold text-white">
                      {d.capacity}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-cinzel text-xl font-bold text-white mb-2">{tf(d.name)}</h3>
                    <p className="text-sm text-slate-400 font-light mb-4 leading-relaxed">{tf(d.desc)}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-slate-400">
                        {tf({ id: "Min. spend", en: "Min. spend", ru: "Мин. заказ", ko: "최소 이용" })}: <span className="text-amber-300 font-semibold">{formatPrice(d.minSpendIdr)}</span>
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => navigate("/booking")} className="text-amber-300">
                        {tf({ id: "Booking", en: "Book", ru: "Забронировать", ko: "예약" })}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="elegant" onClick={() => navigate("/daybeds-suites")}>
              {tf({ id: "Lihat semua daybed", en: "View all daybeds", ru: "Смотреть все шезлонги", ko: "모든 데이베드 보기" })} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- EXPERIENCES ---------- */}
      <section className="py-24 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 ambient opacity-60" />
        <div className="relative container mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={tf({ id: "World-Class Entertainment", en: "World-Class Entertainment", ru: "Развлечения мирового класса", ko: "세계적 수준의 엔터테인먼트" })}
            title={tf({ id: "Sunset Sessions & DJ Events", en: "Sunset Sessions & DJ Events", ru: "Закатные сессии и DJ-события", ko: "선셋 세션 & DJ 이벤트" })}
            subtitle={tf({
              id: "DJ tamu internasional, saxophone sunset, dan produksi pesta monumental di atas tebing Melasti.",
              en: "International guest DJs, live saxophone sunsets, and monumental party productions above the Melasti cliffs.",
              ru: "Международные приглашённые диджеи, закаты под живой саксофон и грандиозные вечеринки на скалах Меласти.",
              ko: "국제 게스트 DJ, 라이브 색소폰 선셋, 그리고 멜라스티 절벽 위에서 펼쳐지는 거대한 파티 프로덕션.",
            })}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERIENCES.map((e, i) => {
              const Icon = EXP_ICONS[e.icon];
              return (
                <Reveal key={e.id} delay={i * 90}>
                  <div className="glow-card glass rounded-3xl p-7 h-full">
                    <Icon className="h-9 w-9 text-amber-300 mb-5" />
                    <h3 className="font-cinzel text-xl font-bold text-white mb-3">{tf(e.title)}</h3>
                    <p className="text-sm text-slate-300/80 font-light leading-relaxed">{tf(e.desc)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- DINING SPLIT ---------- */}
      <section className="py-24 px-5 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-300/90 font-semibold">
                  {tf({ id: "Sunset Dining", en: "Sunset Dining", ru: "Закатный ужин", ko: "선셋 다이닝" })}
                </span>
                <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-slate-50 text-glow-gold">
                  {tf({ id: "Dari Laut ke Gelas", en: "From the Sea to the Glass", ru: "От моря к бокалу", ko: "바다에서 잔까지" })}
                </h2>
                <p className="text-slate-300/80 font-light leading-relaxed">
                  {tf({
                    id: "White Rock Kitchen menyajikan seafood Jimbaran bakar, Wagyu sliders, dan wood-fired pizza. Cliffside Mixology Bar mix signature cocktail dengan botanikal Bali lokal.",
                    en: "White Rock Kitchen serves chargrilled Jimbaran seafood, Wagyu sliders, and wood-fired pizza. The Cliffside Mixology Bar crafts signature cocktails with local Balinese botanicals.",
                    ru: "White Rock Kitchen подает гриль-морепродукты Джимбарана, бургеры из мраморной говядины и пиццу на дровах. Клифсайд-бар миксологии создаёт фирменные коктейли на местных балийских ботаникалах.",
                    ko: "White Rock Kitchen은 짐바란 그릴 해산물, 와규 슬라이더, 우드파이어 피자를 제공합니다. Cliffside Mixology Bar는 현지 발리 식물 재료로 시그니처 칵테일을 만듭니다.",
                  })}
                </p>
                <div className="flex flex-wrap gap-8">
                  {[
                    { l: tf({ id: "Happy Hour 4-7 PM", en: "Happy Hour 4-7 PM", ru: "Счастливый час 16-19", ko: "해피 아워 16-19시" }), v: "🍹" },
                    { l: tf({ id: "Buka 10-23", en: "Open 10AM-11PM", ru: "Открыто 10-23", ko: "운영 10-23시" }), v: "🍽️" },
                    { l: tf({ id: "Champagne & Botol", en: "Champagne & Bottles", ru: "Шампанское и бутылки", ko: "샴페인 & 보틀" }), v: "🥂" },
                  ].map((x, i) => (
                    <div key={i}>
                      <div className="text-2xl">{x.v}</div>
                      <div className="text-sm text-slate-400 mt-1">{x.l}</div>
                    </div>
                  ))}
                </div>
                <Button variant="luxury" onClick={() => navigate("/dining")}>
                  {tf({ id: "Lihat Menu", en: "View Menu", ru: "Посмотреть меню", ko: "메뉴 보기" })} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid gap-4">
                {[...KITCHEN_MENU.slice(0, 2), ...BAR_MENU.slice(0, 1)].map((m, i) => (
                  <div key={i} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">{tf(m.name)}</div>
                      <div className="text-sm text-slate-400 font-light">{tf(m.desc)}</div>
                    </div>
                    <div className="text-amber-300 font-bold whitespace-nowrap">{formatPrice(m.priceIdr)}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- AI CONCIERGE SPOTLIGHT ---------- */}
      <section className="py-24 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190_95%_20%/0.25)] via-transparent to-[hsl(45_90%_30%/0.2)]" />
        <div className="relative container mx-auto max-w-6xl">
          <Reveal>
            <div className="glass-strong rounded-[2rem] p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center border border-amber-400/20">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-4">
                  <Volume2 className="h-4 w-4" /> {tf({ id: "Fitur Eksklusif", en: "Exclusive Feature", ru: "Эксклюзивная функция", ko: "독점 기능" })}
                </span>
                <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white text-glow-gold leading-tight">
                  {tf({ id: "Ngobrol sama Sarah, AI VIP Host", en: "Meet Sarah, your AI VIP Host", ru: "Познакомьтесь с Сарой, вашим AI VIP-хостом", ko: "여러분의 AI VIP 호스트 사라를 만나보세요" })}
                </h2>
                <p className="text-slate-300/85 font-light mt-5 leading-relaxed">
                  {tf({
                    id: "Tanya apa aja dalam bahasa lisan — booking daybed, cek cuaca & pasang, rekomendasi menu — Sarah jawab langsung via suara. Concierge nyata, 24 jam.",
                    en: "Ask anything by voice — book a daybed, check weather & tides, get menu recs — Sarah replies live. A real concierge, 24/7.",
                    ru: "Спрашивайте что угодно голосом — бронируйте шезлонг, проверяйте погоду и приливы, получайте рекомендации по меню — Сара отвечает вживую. Настоящий консьерж, 24/7.",
                    ko: "음성으로 무엇이든 물어보세요 — 데이베드 예약, 날씨와 조수 확인, 메뉴 추천 — 사라가 실시간으로 답해줍니다. 진짜 컨시어지, 24시간.",
                  })}
                </p>
                <Button variant="luxury" size="lg" onClick={openSarah} className="mt-7 group">
                  <MessageCircle className="h-5 w-5" />
                  {tf({ id: "Ngobrol dgn Sarah", en: "Talk to Sarah", ru: "Поговорить с Сарой", ko: "사라와 대화하기" })}
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl glass overflow-hidden grid place-items-center shimmer">
                  <div className="text-center">
                    <div className="mx-auto h-24 w-24 rounded-full gold-gradient grid place-items-center animate-glow-pulse">
                      <span className="font-cinzel text-3xl font-bold text-[hsl(222_47%_8%)]">S</span>
                    </div>
                    <div className="mt-5 text-white font-semibold">Sarah</div>
                    <div className="text-xs text-amber-300">{tf({ id: "AI VIP Host · Online", en: "AI VIP Host · Online", ru: "AI VIP Host · В сети", ko: "AI VIP Host · 온라인" })}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PARTNERS MARQUEE ---------- */}
      <section className="py-14 border-y border-white/10 overflow-hidden">
        <div className="container mx-auto px-5 mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            {tf({ id: "Featured in", en: "Featured in", ru: "О нас пишут", ko: "소개된 매체" })}
          </p>
        </div>
        <Marquee>
          {["TRAVEL + LEISURE", "CONDE NAST", "TIME OUT", "VOGUE", "FORBES", "BBB"].map((b, i) => (
            <span key={i} className="font-cinzel text-xl md:text-2xl font-bold text-slate-500/70 tracking-widest whitespace-nowrap">
              {b}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="py-24 px-5 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={tf({ id: "Guest Love", en: "Guest Love", ru: "Гости в восторге", ko: "고객 사랑" })}
            title={tf({ id: "Cerita dari Pantai", en: "Stories from the Shore", ru: "Истории с побережья", ko: "해변의 이야기" })}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 90}>
                <Card className="glow-card glass rounded-3xl h-full">
                  <CardContent className="p-7">
                    <div className="flex gap-1 text-amber-300 mb-4">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-200/90 font-light leading-relaxed mb-6">"{tf(t.quote)}"</p>
                    <div>
                      <div className="font-semibold text-white">{t.author}</div>
                      <div className="text-sm text-slate-400">{tf(t.role)}</div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="relative py-28 px-5 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${ASSETS.aerial})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%/0.7)] to-[hsl(222_47%_6%)]" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-slate-50 text-glow-gold mb-6">
              {tf({ id: "Mulai petualanganmu", en: "Start Your Escape", ru: "Начните своё побег", ko: "당신의 여정을 시작하세요" })}
            </h2>
            <p className="text-slate-200/85 font-light mb-9 max-w-xl mx-auto">
              {tf({ id: "Free entrance setiap hari. Booking daybed atau tanya Sarah sekarang.", en: "Free entrance, every day. Book a daybed or just ask Sarah now.", ru: "Бесплатный вход каждый день. Забронируйте шезлонг или просто спросите Сару прямо сейчас.", ko: "매일 무료 입장. 지금 데이베드를 예약하거나 사라에게 물어보세요." })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="xl" onClick={() => navigate("/booking")}>
                {tf({ id: "Reservasi Sekarang", en: "Reserve Now", ru: "Забронировать сейчас", ko: "지금 예약" })}
              </Button>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <Button variant="hero" size="xl">
                  <MapPin className="h-5 w-5" /> WhatsApp
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
