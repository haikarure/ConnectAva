import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { KITCHEN_MENU, BAR_MENU } from "@/data/whiterock";
import { ChefHat, GlassWater, Clock, ArrowRight, Flame } from "lucide-react";

function MenuList({
  items,
  accent,
}: {
  items: typeof KITCHEN_MENU;
  accent: string;
}) {
  const { tf, formatPrice } = useLang();
  return (
    <div className="space-y-4">
      {items.map((m, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="glass rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-amber-400/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-white text-lg">{tf(m.name)}</h4>
                {m.tag && (
                  <Badge className={`${accent} text-black text-[10px] uppercase tracking-wider`}>{tf(m.tag)}</Badge>
                )}
              </div>
              <p className="text-sm text-slate-400 font-light mt-1">{tf(m.desc)}</p>
            </div>
            <div className="text-amber-300 font-bold whitespace-nowrap">{formatPrice(m.priceIdr)}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Dining() {
  const { tf } = useLang();
  const navigate = useNavigate();

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        bgImage="/assets/whiterock/aerial.jpg"
        eyebrow={tf({ id: "Dining & Bar", en: "Dining & Bar", ru: "Ресторан и бар", ko: "다이닝 & 바" })}
        title={tf({ id: "Dari Laut ke Gelas", en: "From the Sea to the Glass", ru: "От моря к бокалу", ko: "바다에서 잔까지" })}
        subtitle={tf({
          id: "White Rock Kitchen & Cliffside Mixology Bar — makanan laut segar dan cocktail botani Bali dengan view sunset Melasti.",
          en: "White Rock Kitchen & Cliffside Mixology Bar — fresh seafood and Balinese botanical cocktails with Melasti sunset views.",
          ru: "White Rock Kitchen и Cliffside Mixology Bar — свежие морепродукты и балийские ботанические коктейли с видами на закат Melasti.",
          ko: "White Rock Kitchen 및 Cliffside Mixology Bar — 신선한 해산물과 발리의 보태니컬 칵테일, Melasti의 석양 뷰.",
        })}
      />

      {/* Kitchen */}
      <section className="py-20 px-5 md:px-8" id="kitchen">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            align="left"
            eyebrow={tf({ id: "Restoran", en: "Restaurant", ru: "Ресторан", ko: "레스토랑" })}
            title={tf({ id: "White Rock Kitchen", en: "White Rock Kitchen", ru: "White Rock Kitchen", ko: "White Rock Kitchen" })}
            subtitle={tf({
              id: "Seafood Jimbaran bakar, Wagyu sliders, wood-fired pizza, dan tropical bowls — buka setiap hari 10:00 - 23:00.",
              en: "Grilled Jimbaran seafood, Wagyu sliders, wood-fired pizza, and tropical bowls — served daily 10:00 AM - 11:00 PM.",
              ru: "Жареные морепродукты Jimbaran, бургеры Wagyu, пицца на дровах и тропические боулы — ежедневно с 10:00 до 23:00.",
              ko: "구운 Jimbaran 해산물, Wagyu 슬라이더, 화덕 피자, 트로피컬 보울 — 매일 10:00 - 23:00 운영.",
            })}
          />
          <MenuList items={KITCHEN_MENU} accent="bg-amber-400" />
        </div>
      </section>

      {/* Bar */}
      <section className="py-20 px-5 md:px-8 relative overflow-hidden" id="bar">
        <div className="absolute inset-0 ambient opacity-50" />
        <div className="relative container mx-auto max-w-5xl">
          <SectionHeading
            align="left"
            eyebrow={tf({ id: "Cliffside Bar", en: "Cliffside Bar", ru: "Cliffside Bar", ko: "Cliffside Bar" })}
            title={tf({ id: "Cliffside Mixology", en: "Cliffside Mixology", ru: "Cliffside Mixology", ko: "Cliffside Mixology" })}
            subtitle={tf({
              id: "Signature cocktail dengan botanikal lokal, champagne import, dan premium bottle service. Happy Hour 16:00 - 19:00.",
              en: "Signature cocktails with local botanicals, imported champagne, and premium bottle service. Happy Hour 4:00 - 7:00 PM.",
              ru: "Авторские коктейли с местными ботаникалами, импортный шампанское и премиальный bottle service. Happy Hour 16:00 - 19:00.",
              ko: "현지 보태니컬 시그니처 칵테일, 수입 샴페인, 프리미엄 보틀 서비스. 해피 아워 16:00 - 19:00.",
            })}
          />
          <MenuList items={BAR_MENU} accent="bg-amber-400" />
        </div>
      </section>

      {/* Happy hour banner */}
      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <Reveal>
            <div className="glass-strong rounded-[2rem] p-8 md:p-12 grid md:grid-cols-3 gap-6 items-center border border-amber-400/20">
              <div className="md:col-span-2 space-y-3">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">
                  <Flame className="h-4 w-4" /> {tf({ id: "Happy Hour", en: "Happy Hour", ru: "Happy Hour", ko: "해피 아워" })}
                </span>
                <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white">
                  {tf({ id: "4 PM - 7 PM Setiap Hari", en: "4 PM - 7 PM Daily", ru: "4 PM - 7 PM ежедневно", ko: "매일 4 PM - 7 PM" })}
                </h3>
                <p className="text-slate-300/80 font-light flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-300" /> {tf({ id: "Setiap hari • Free entrance", en: "Every day • Free entrance", ru: "Каждый день • Вход свободный", ko: "매일 • 무료 입장" })}
                </p>
              </div>
              <Button variant="luxury" size="lg" className="md:justify-self-end" onClick={() => navigate("/booking")}>
                {tf({ id: "Reservasi Meja", en: "Reserve a Table", ru: "Забронировать стол", ko: "테이블 예약" })} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
