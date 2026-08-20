import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Heart, ArrowRight, MapPin } from "lucide-react";

const ROLES = [
  { title: { id: "Guest Experience Host", en: "Guest Experience Host", ru: "Хост гостевого опыта", ko: "게스트 경험 호스트" }, dept: { id: "Hospitality", en: "Hospitality", ru: "Гостеприимство", ko: "호스피탈리티" }, type: { id: "Full-time", en: "Full-time", ru: "Полная занятость", ko: "정규직" } },
  { title: { id: "Mixologist", en: "Mixologist", ru: "Миксолог", ko: "믹솔로지스트" }, dept: { id: "F&B", en: "F&B", ru: "Кухня и напитки", ko: "F&B" }, type: { id: "Full-time", en: "Full-time", ru: "Полная занятость", ko: "정규직" } },
  { title: { id: "Event Producer", en: "Event Producer", ru: "Организатор мероприятий", ko: "이벤트 프로듀서" }, dept: { id: "Events", en: "Events", ru: "Мероприятия", ko: "이벤트" }, type: { id: "Contract", en: "Contract", ru: "Контракт", ko: "계약직" } },
  { title: { id: "AI Concierge Trainer", en: "AI Concierge Trainer", ru: "Тренер AI-консьержа", ko: "AI 컨시어지 트레이너" }, dept: { id: "Tech", en: "Tech", ru: "Технологии", ko: "기술" }, type: { id: "Full-time", en: "Full-time", ru: "Полная занятость", ko: "정규직" } },
  { title: { id: "Spa Therapist", en: "Spa Therapist", ru: "Спа-терапевт", ko: "스파 테라피스트" }, dept: { id: "Wellness", en: "Wellness", ru: "Велнес", ko: "웰니스" }, type: { id: "Full-time", en: "Full-time", ru: "Полная занятость", ko: "정규직" } },
  { title: { id: "Marketing Creative", en: "Marketing Creative", ru: "Креативный маркетолог", ko: "마케팅 크리에이티브" }, dept: { id: "Marketing", en: "Marketing", ru: "Маркетинг", ko: "마케팅" }, type: { id: "Full-time", en: "Full-time", ru: "Полная занятость", ko: "정규직" } },
];

export default function Careers() {
  const { tf } = useLang();
  const navigate = useNavigate();

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        bgImage="/assets/whiterock/aerial.jpg"
        eyebrow={tf({ id: "Careers", en: "Careers", ru: "Карьера", ko: "채용" })}
        title={tf({ id: "Bergabung dengan Kami", en: "Join the Crew", ru: "Присоединяйтесь к нам", ko: "크루에 합류하세요" })}
        subtitle={tf({
          id: "Kami membangun pengalaman pantai paling magis di Bali. Kalau kamu pencinta hospitality & inovasi, mari gabung.",
          en: "We're building Bali's most magical beach experience. If you love hospitality & innovation, come join us.",
          ru: "Мы создаём самый волшебный пляжный опыт на Bali. Если вы любите гостеприимство и инновации, присоединяйтесь.",
          ko: "우리는 Bali에서 가장 마법 같은 해변 경험을 만들고 있습니다. 호스피탈리티와 혁신을 사랑한다면 함께하세요.",
        })}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            {[
              { icon: Users, t: { id: "Tim 100+", en: "100+ Crew", ru: "Команда 100+", ko: "크루 100+" } },
              { icon: Heart, t: { id: "Budaya Inklusif", en: "Inclusive Culture", ru: "Инклюзивная культура", ko: "포용적인 문화" } },
              { icon: Briefcase, t: { id: "Growth Path", en: "Growth Path", ru: "Путь развития", ko: "성장 경로" } },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className="glow-card glass rounded-2xl p-5 text-center">
                    <Icon className="h-7 w-7 text-amber-300 mx-auto mb-2" />
                    <div className="text-sm text-white font-medium">{tf(v.t)}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <SectionHeading eyebrow={tf({ id: "Open Roles", en: "Open Roles", ru: "Открытые вакансии", ko: "열린 채용" })} title={tf({ id: "Posisi Terbuka", en: "Open Positions", ru: "Доступные позиции", ko: "열린 포지션" })} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map((r, i) => (
              <Reveal key={i} delay={i * 50}>
                <Card className="glow-card glass rounded-2xl h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-white text-lg">{tf(r.title)}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-amber-300 border border-amber-400/30 rounded-full px-2 py-0.5 whitespace-nowrap">{tf(r.type)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Melasti</span>
                      <span>·</span>
                      <span>{tf(r.dept)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-amber-300 p-0 mt-4" onClick={() => navigate("/contact")}>
                      {tf({ id: "Lamarkerja", en: "Apply", ru: "Откликнуться", ko: "지원하기" })} <ArrowRight className="h-4 w-4" />
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
