import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { CalendarHeart, Users, Sparkles, Wine, Music, Camera, ArrowRight, Check } from "lucide-react";

const WEDDING_PKGS = [
  { name: { id: "Cliffside Vows", en: "Cliffside Vows", ru: "Клятвы на утёсе", ko: "절벽side 서약" }, pax: "50 - 120", priceIdr: 250_000_000, accent: "from-rose-500/20" },
  { name: { id: "Beachfront Bliss", en: "Beachfront Bliss", ru: "Блаженство у моря", ko: "해변가 블리스" }, pax: "120 - 300", priceIdr: 450_000_000, accent: "from-amber-500/20" },
  { name: { id: "Grand Celebration", en: "Grand Celebration", ru: "Гранд-празднование", ko: "그랜드 셀레브레이션" }, pax: "300 - 800", priceIdr: 900_000_000, accent: "from-rose-500/20" },
];

const MICE_PERKS = [
  { icon: Users, t: { id: "Multifunction Hall", en: "Multifunction Hall", ru: "Многофункциональный зал", ko: "다목적 홀" }, d: { id: "Ruang 500m² fleksibel untuk gala & konferensi.", en: "500m² flexible space for galas & conferences.", ru: "Гибкое пространство 500 м² для гала и конференций.", ko: "갈라 및 컨퍼런스를 위한 500m² 유연한 공간." } },
  { icon: Wine, t: { id: "Catering Premium", en: "Premium Catering", ru: "Премиум кейтеринг", ko: "프리미엄 케이터링" }, d: { id: "Menu kurasi dari White Rock Kitchen.", en: "Curated menus from White Rock Kitchen.", ru: "Авторские меню от White Rock Kitchen.", ko: "White Rock Kitchen의 엄선된 메뉴." } },
  { icon: Music, t: { id: "AV & Production", en: "AV & Production", ru: "Звук и свет", ko: "AV 및 프로덕션" }, d: { id: "Sound, lighting, dan layar LED pantai.", en: "Sound, lighting, and beachfront LED walls.", ru: "Звук, свет и береговые LED-экраны.", ko: "사운드, 조명, 그리고 해변 LED 월." } },
  { icon: Camera, t: { id: "Photo & Drone", en: "Photo & Drone", ru: "Фото и дрон", ko: "포토 및 드론" }, d: { id: "Tim dokumentasi sunset & aerial.", en: "Sunset & aerial documentation team.", ru: "Команда съёмки заката и с воздуха.", ko: "선셋 및 공중 촬영 팀." } },
];

export default function WeddingsMice() {
  const { tf, formatPrice } = useLang();
  const navigate = useNavigate();

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        bgImage="/assets/whiterock/aerial.jpg"
        eyebrow={tf({ id: "Weddings & MICE", en: "Weddings & MICE", ru: "Свадьбы и MICE", ko: "웨딩 & MICE" })}
        title={tf({ id: "Momen Tak Terlupakan", en: "Unforgettable Moments", ru: "Незабываемые моменты", ko: "잊을 수 없는 순간" })}
        subtitle={tf({
          id: "Pernikahan pantai impian atau event korporat eksklusif di atas tebing Melasti. Tim kami urus semua detail.",
          en: "A dream beach wedding or exclusive corporate event above the Melasti cliffs. Our team handles every detail.",
          ru: "Свадьба мечты на пляже или эксклюзивное корпоративное мероприятие над утёсами Melasti. Наша команда берёт на себя все детали.",
          ko: "Melasti 절벽 위에서의 꿈같은 비치 웨딩 또는 독점적인 기업 행사. 우리 팀이 모든 디테일을 챙깁니다.",
        })}
      />

      {/* Weddings */}
      <section className="py-20 px-5 md:px-8" id="weddings">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={tf({ id: "Weddings", en: "Weddings", ru: "Свадьбы", ko: "웨딩" })}
            title={tf({ id: "Pernikahan di White Rock", en: "Weddings at White Rock", ru: "Свадьбы в White Rock", ko: "White Rock 웨딩" })}
            subtitle={tf({
              id: "Tiga paket kurasi dengan altar di tepi laut, dekorasi florals, dan resepsi di bawah bintang.",
              en: "Three curated packages with an oceanfront altar, floral decor, and a starlit reception.",
              ru: "Три авторских пакета с алтарём у моря, цветочным декором и приёмом под звёздами.",
              ko: "바다 앞 제단, 플로럴 장식, 별빛 아래 리셉션을 갖춘 세 가지 엄선 패키지.",
            })}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {WEDDING_PKGS.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <Card className="glow-card glass rounded-3xl overflow-hidden h-full">
                  <div className={`h-40 bg-gradient-to-br ${p.accent}`} />
                  <CardContent className="p-7">
                    <h3 className="font-cinzel text-2xl font-bold text-white mb-1">{tf(p.name)}</h3>
                    <div className="text-sm text-slate-400 mb-4">{p.pax} pax</div>
                    <div className="text-amber-300 font-bold mb-5">from {formatPrice(p.priceIdr)}</div>
                    <Button variant="luxury" className="w-full" onClick={() => navigate("/contact")}>
                      {tf({ id: "Request Proposal", en: "Request Proposal", ru: "Запросить предложение", ko: "제안서 요청" })} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MICE */}
      <section className="py-20 px-5 md:px-8 relative overflow-hidden" id="mice">
        <div className="absolute inset-0 ambient opacity-50" />
        <div className="relative container mx-auto max-w-7xl">
          <SectionHeading eyebrow={tf({ id: "MICE", en: "MICE", ru: "MICE", ko: "MICE" })} title={tf({ id: "Corporate & Events", en: "Corporate & Events", ru: "Корпоратив и мероприятия", ko: "기업 및 이벤트" })} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MICE_PERKS.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={i} delay={i * 70}>
                  <div className="glow-card glass rounded-2xl p-6 h-full">
                    <Icon className="h-8 w-8 text-amber-300 mb-4" />
                    <h4 className="font-cinzel text-lg font-bold text-white mb-2">{tf(m.t)}</h4>
                    <p className="text-sm text-slate-300/80 font-light">{tf(m.d)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button variant="luxury" size="lg" onClick={() => navigate("/contact")}>
              {tf({ id: "Hubungi Event Team", en: "Contact Event Team", ru: "Связаться с ивент-командой", ko: "이벤트 팀 문의" })} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <Reveal>
            <div className="glass-strong rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-amber-300/20">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-3">
                  <Sparkles className="h-4 w-4" /> {tf({ id: "Private Event", en: "Private Event", ru: "Частное мероприятие", ko: "프라이빗 이벤트" })}
                </span>
                <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-2">
                  {tf({ id: "Booking full buyout?", en: "Want a full buyout?", ru: "Хотите арендовать всё заведение?", ko: "전체 대관을 원하시나요?" })}
                </h3>
                <p className="text-slate-300/80 font-light flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-300" /> {tf({ id: "Tanya Sarah untuk penawaran eksklusif.", en: "Ask Sarah for an exclusive offer.", ru: "Спросите Sarah о эксклюзивном предложении.", ko: "독점 제안은 Sarah에게 문의하세요." })}
                </p>
              </div>
              <Button variant="luxury" size="lg" onClick={() => navigate("/contact")}>
                {tf({ id: "Mulai Rencana", en: "Start Planning", ru: "Начать планирование", ko: "계획 시작하기" })}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
