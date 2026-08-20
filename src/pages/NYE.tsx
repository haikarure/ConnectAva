import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { ASSETS } from "@/data/whiterock";
import { Ticket, Sparkles, Music, Wine, ArrowRight, Check } from "lucide-react";

const TICKETS = [
  { name: { id: "Early Bird", en: "Early Bird", ru: "Early Bird", ko: "얼리버드" }, priceIdr: 1_500_000, perks: [true, true, false], accent: "from-amber-500/20" },
  { name: { id: "VIP Gala", en: "VIP Gala", ru: "VIP Gala", ko: "VIP 갈라" }, priceIdr: 4_500_000, perks: [true, true, true], accent: "from-amber-500/20" },
  { name: { id: "Cabana Package", en: "Cabana Package", ru: "Кабана-пакет", ko: "카바나 패키지" }, priceIdr: 25_000_000, perks: [true, true, true], accent: "from-rose-500/20" },
];

const PERK_LABELS = [
  { id: "Akses all-night + fireworks", en: "All-night access + fireworks", ru: "Доступ всю ночь + фейерверк", ko: "밤새 이용 + 불꽃놀이" },
  { id: "Welcome drink & F&B credit", en: "Welcome drink & F&B credit", ru: "Welcome drink и кредит F&B", ko: "웰컴 드링크 및 F&B 크레딧" },
  { id: "Private cabana & bottle", en: "Private cabana & bottle", ru: "Приватная кабана и бутылка", ko: "프라이빗 카바나 및 보틀" },
];

export default function NYE() {
  const { tf, formatPrice } = useLang();
  const navigate = useNavigate();

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        video
        eyebrow={tf({ id: "31 Desember 2026", en: "December 31, 2026", ru: "31 декабря 2026", ko: "2026년 12월 31일" })}
        title={tf({ id: "NYE 2026", en: "NYE 2026", ru: "NYE 2026", ko: "NYE 2026" })}
        subtitle={tf({
          id: "Pesta pergantian tahun paling epik di Bali — di atas tebing Melasti dengan fireworks, DJ internasional, dan laut di bawah kaki kamu.",
          en: "Bali's most epic New Year's party — above the Melasti cliffs with fireworks, international DJs, and the ocean at your feet.",
          ru: "Самая эпичная новогодняя вечеринка на Bali — над скалами Melasti с фейерверком, международными DJ и океаном у ваших ног.",
          ko: "Bali에서 가장 화려한 새해 파티 — Melasti 절벽 위에서 불꽃놀이, 인터내셔널 DJ, 그리고 발아래 펼쳐진 바다와 함께.",
        })}
      />

      {/* Highlights */}
      <section className="py-16 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(190_95%_20%/0.2)] via-transparent to-[hsl(45_90%_30%/0.18)]" />
        <div className="relative container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Music, t: { id: "DJ Internasional", en: "International DJs", ru: "Международные DJ", ko: "인터내셔널 DJ" } },
              { icon: Sparkles, t: { id: "Fireworks Pantai", en: "Beachside Fireworks", ru: "Фейерверк у пляжа", ko: "해변 불꽃놀이" } },
              { icon: Wine, t: { id: "Open Bar & Bottle", en: "Open Bar & Bottle", ru: "Открытый бар и бутылки", ko: "오픈 바 및 보틀" } },
              { icon: Sparkles, t: { id: "Golden Hour Countdown", en: "Golden Hour Countdown", ru: "Обратный отсчёт на закате", ko: "골든 아워 카운트다운" } },
            ].map((h, i) => {
              const Icon = h.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className="glow-card glass rounded-2xl p-6 text-center h-full">
                    <Icon className="h-9 w-9 text-amber-300 mx-auto mb-3" />
                    <div className="font-semibold text-white text-sm">{tf(h.t)}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-5 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={tf({ id: "Tiket", en: "Tickets", ru: "Билеты", ko: "티켓" })}
            title={tf({ id: "Pilih Paketmu", en: "Choose Your Package", ru: "Выберите свой пакет", ko: "패키지 선택" })}
            subtitle={tf({ id: "Early bird terbatas — harga naik tiap batch.", en: "Limited early bird — price rises each batch.", ru: "Ограниченный early bird — цена растёт с каждой партией.", ko: "한정된 얼리버드 — 배치마다 가격 인상." })}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {TICKETS.map((t, i) => (
              <Reveal key={i} delay={i * 90}>
                <Card className="glow-card glass rounded-3xl overflow-hidden h-full">
                  <div className={`h-2 bg-gradient-to-r ${t.accent}`} />
                  <CardContent className="p-7">
                    <h3 className="font-cinzel text-2xl font-bold text-white mb-1">{tf(t.name)}</h3>
                    <div className="text-amber-300 font-bold text-xl mb-5">{formatPrice(t.priceIdr)}</div>
                    <ul className="space-y-3 mb-6">
                      {PERK_LABELS.map((p, k) => (
                        <li key={k} className={`flex items-center gap-2 text-sm ${t.perks[k] ? "text-slate-200" : "text-slate-600 line-through"}`}>
                          {t.perks[k] ? <Check className="h-4 w-4 text-amber-300 shrink-0" /> : <Check className="h-4 w-4 text-slate-600 shrink-0" />}
                          {tf(p)}
                        </li>
                      ))}
                    </ul>
                    <Button variant="luxury" className="w-full" onClick={() => navigate("/booking")}>
                      {tf({ id: "Beli Tiket", en: "Get Tickets", ru: "Купить билеты", ko: "티켓 구매" })} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
