import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { EXPERIENCES, ASSETS } from "@/data/whiterock";
import { Waves, Sun, Music, Flower2, Camera, GlassWater, Flame, Heart, ArrowRight, CalendarHeart, Play } from "lucide-react";

const GRID: { icon: any; key: string; title: { id: string; en: string }; desc: { id: string; en: string }; to: string; accent: string }[] = [
  { icon: Waves, key: "w", title: { id: "Beach Club Day", en: "Beach Club Day" }, desc: { id: "Free entrance, daybed, dan infinity view seharian.", en: "Free entrance, daybed, and all-day infinity views." }, to: "/daybeds-suites", accent: "from-amber-500/20" },
  { icon: Sun, key: "s", title: { id: "Sunset Sessions", en: "Sunset Sessions" }, desc: { id: "Chill house & melodic techno saat matahari terbenam.", en: "Chill house & melodic techno as the sun sets." }, to: "/events", accent: "from-amber-500/20" },
  { icon: Music, key: "m", title: { id: "Weekend Party Wave", en: "Weekend Party Wave" }, desc: { id: "DJ headline & laser show Jumat–Sabtu malam.", en: "Headline DJs & laser shows Fri–Sat nights." }, to: "/events", accent: "from-rose-500/20" },
  { icon: Flower2, key: "sp", title: { id: "Cliffside Spa Day", en: "Cliffside Spa Day" }, desc: { id: "Pijat aromaterapi dengan angin laut dari tebing.", en: "Aromatherapy massage with sea breeze from the cliff." }, to: "/spa-wellness", accent: "from-yellow-600/20" },
  { icon: Camera, key: "c", title: { id: "Virtual Tour", en: "Virtual Tour" }, desc: { id: "Jelajahi klub 360° dari mana aja, kapan aja.", en: "Explore the club in 360° from anywhere, anytime." }, to: "/daybeds-suites", accent: "from-orange-500/20" },
  { icon: GlassWater, key: "g", title: { id: "Mixology Masterclass", en: "Mixology Masterclass" }, desc: { id: "Belajar bikin cocktail botanikal Bali bareng bartender.", en: "Learn Balinese botanical cocktails with our bartender." }, to: "/dining", accent: "from-amber-500/20" },
  { icon: Flame, key: "f", title: { id: "Full Moon Festival", en: "Full Moon Festival" }, desc: { id: "Perayaan pantai di bawah cahaya tebing Melasti.", en: "Beachfront celebration under the Melasti cliff glow." }, to: "/events", accent: "from-orange-500/20" },
  { icon: Heart, key: "h", title: { id: "Wedding & MICE", en: "Wedding & MICE" }, desc: { id: "Pernikahan pantai & event korporat eksklusif.", en: "Beach weddings & exclusive corporate events." }, to: "/weddings-mice", accent: "from-rose-500/20" },
];

export default function Experiences() {
  const { tf } = useLang();
  const navigate = useNavigate();

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        video
        eyebrow={tf({ id: "Experiences", en: "Experiences", ru: "Впечатления", ko: "체험" })}
        title={tf({ id: "Aktivitas & Momen", en: "Activities & Moments", ru: "Активности и моменты", ko: "활동과 순간" })}
        subtitle={tf({
          id: "Dari hari santai di beach club sampai pesta full moon — temukan cara nikmatin White Rock.",
          en: "From laid-back beach club days to full moon parties — discover how to enjoy White Rock.",
          ru: "От расслабленных дней в beach club до вечеринок в полнолуние — откройте, как насладиться White Rock.",
          ko: "비치 클럽에서의 여유로운 날부터 보름달 파티까지 — White Rock을 즐기는 방법을 발견하세요.",
        })}
      />

      <section className="py-20 px-5 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading
            title={tf({ id: "Semua yang Bisa Kamu Rasakan", en: "Everything You Can Experience", ru: "Всё, что вы можете испытать", ko: "경험할 수 있는 모든 것" })}
            subtitle={tf({
              id: "Delapan pengalaman kurasi yang bikin hari di Melasti tak terlupakan.",
              en: "Eight curated experiences that make a day in Melasti unforgettable.",
              ru: "Восемь отобранных впечатлений, которые делают день в Melasti незабываемым.",
              ko: "Melasti에서의 하루를 잊을 수 없게 만드는 여덟 가지 엄선된 경험.",
            })}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GRID.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.key} delay={i * 60}>
                  <Card className="glow-card glass rounded-3xl h-full overflow-hidden">
                    <div className={`h-32 bg-gradient-to-br ${g.accent} grid place-items-center`}>
                      <Icon className="h-12 w-12 text-white/90" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-cinzel text-lg font-bold text-white mb-2">{tf(g.title)}</h3>
                      <p className="text-sm text-slate-400 font-light leading-relaxed mb-4">{tf(g.desc)}</p>
                      <Button variant="ghost" size="sm" className="text-amber-300 p-0" onClick={() => navigate(g.to)}>
                        {tf({ id: "Pelajari", en: "Explore", ru: "Подробнее", ko: "둘러보기" })} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured: NYE + Virtual Tour */}
      <section className="py-16 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 ambient opacity-60" />
        <div className="relative container mx-auto max-w-7xl grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="glass-strong rounded-[2rem] p-8 border border-amber-300/20 h-full flex flex-col justify-between">
              <div>
                <CalendarHeart className="h-10 w-10 text-amber-300 mb-4" />
                <h3 className="font-cinzel text-3xl font-bold text-white mb-3">{tf({ id: "NYE 2026", en: "NYE 2026", ru: "NYE 2026", ko: "NYE 2026" })}</h3>
                <p className="text-slate-300/80 font-light">{tf({ id: "Pesta pergantian tahun paling epik di Bali. Early bird sekarang.", en: "The most epic New Year's party in Bali. Early bird open now.", ru: "Самая эпичная новогодняя вечеринка на Bali. Early bird уже открыт.", ko: "Bali에서 가장 화려한 새해 파티. 얼리버드 지금 오픈." })}</p>
              </div>
              <Button variant="luxury" className="mt-6 w-fit" onClick={() => navigate("/nye")}>{tf({ id: "Lihat Event", en: "View Event", ru: "Смотреть событие", ko: "이벤트 보기" })}</Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="glass-strong rounded-[2rem] p-8 border border-amber-400/20 h-full flex flex-col justify-between">
              <div>
                <Play className="h-10 w-10 text-amber-300 mb-4" />
                <h3 className="font-cinzel text-3xl font-bold text-white mb-3">{tf({ id: "Virtual Tour 360°", en: "360° Virtual Tour", ru: "Виртуальный тур 360°", ko: "360° 가상 투어" })}</h3>
                <p className="text-slate-300/80 font-light">{tf({ id: "Jelajahi daybed, bar, dan sunset deck sebelum kamu datang.", en: "Explore daybeds, the bar, and the sunset deck before you arrive.", ru: "Изучите daybed, бар и закатную палубу, ещё до приезда.", ko: "도착하기 전에 데이베드, 바, 선셋 데크를 둘러보세요." })}</p>
              </div>
              <Button variant="elegant" className="mt-6 w-fit" onClick={() => navigate("/daybeds-suites")}>{tf({ id: "Mulai Tour", en: "Start Tour", ru: "Начать тур", ko: "투어 시작" })}</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Highlight strip reusing EXPERIENCES data */}
      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading align="left" eyebrow={tf({ id: "Di atas panggung", en: "On the Stage", ru: "На сцене", ko: "무대 위에서" })} title={tf({ id: "Lineup Hiburan", en: "Entertainment Lineup", ru: "Развлекательная программа", ko: "엔터테인먼트 라인업" })} />
          <div className="grid md:grid-cols-3 gap-6">
            {EXPERIENCES.map((e, i) => {
              const Icon = { waves: Waves, sun: Sun, music: Music, spa: Flower2, camera: Camera, glass: GlassWater, flame: Flame, heart: Heart }[e.icon];
              return (
                <Reveal key={e.id} delay={i * 80}>
                  <div className="glow-card glass rounded-2xl p-6 h-full">
                    <Icon className="h-8 w-8 text-amber-300 mb-4" />
                    <h4 className="font-cinzel text-xl font-bold text-white mb-2">{tf(e.title)}</h4>
                    <p className="text-sm text-slate-300/80 font-light">{tf(e.desc)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
