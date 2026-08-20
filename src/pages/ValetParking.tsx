import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { CONTACT } from "@/data/whiterock";
import { PageHero } from "@/components/layout/PageHero";
import {
  Clock,
  Car,
  Shield,
  Key,
  Sparkles,
  Phone,
  Check,
} from "lucide-react";

const ValetParking = () => {
  const { tf } = useLang();

  const services = [
    { icon: Car, name: "Premium Valet Service", nameId: "Layanan Valet Premium", desc: "Professional attendants park and retrieve your vehicle", descId: "Petugas profesional parkir & ambil kendaraan kamu", price: "IDR 550K/malam" },
    { icon: Sparkles, name: "Car Detailing", nameId: "Detailing Mobil", desc: "Interior and exterior cleaning while you stay", descId: "Pembersihan interior & eksterior selama menginap", price: "IDR 1.3M/layanan" },
    { icon: Key, name: "Concierge Car Service", nameId: "Layanan Mobil Concierge", desc: "Vehicle maintenance and service coordination", descId: "Koordinasi perawatan & servis kendaraan", price: "Quote on request" },
    { icon: Shield, name: "Secure Storage", nameId: "Penyimpanan Aman", desc: "24/7 monitored underground parking garage", descId: "Garasi bawah tanah dipantau 24/7", price: "Included" },
  ];

  const features = [
    { id: "Petugas valet 24/7", en: "24/7 valet attendant coverage" },
    { id: "Garasi parkir tertutup", en: "Covered parking garage" },
    { id: "Kamera CCTV & pemantauan", en: "Security cameras and monitoring" },
    { id: "Lingkungan ber-AC", en: "Climate-controlled environment" },
    { id: "Stasiun cas kendaraan listrik", en: "Electric vehicle charging stations" },
    { id: "Ahli penanganan mobil mewah", en: "Luxury vehicle handling expertise" },
    { id: "Layanan ambil cepat (<5 menit)", en: "Quick retrieval service (under 5 minutes)" },
    { id: "Cuci mobil gratis untuk stay panjang", en: "Complimentary car wash for extended stays" },
  ];

  const pricingPlans = [
    { name: "Standard Valet", nameId: "Valet Standar", price: "IDR 550K", period: { id: "per malam", en: "per night" }, features: ["Vehicle parking & retrieval", "Secure garage storage", "24/7 attendant service", "Basic vehicle protection"] },
    { name: "Premium Plus", nameId: "Premium Plus", price: "IDR 850K", period: { id: "per malam", en: "per night" }, features: ["All Standard features", "Priority retrieval", "Daily exterior wash", "Interior protection", "EV charging available"] },
    { name: "Luxury Experience", nameId: "Pengalaman Mewah", price: "IDR 1.3M", period: { id: "per malam", en: "per night" }, features: ["All Premium Plus features", "Complete detailing service", "Concierge car services", "Maintenance coordination", "White-glove treatment"] },
  ];

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Premium Services", en: "Premium Services", ru: "Премиум-услуги", ko: "프리미엄 서비스" }}
        title={{ id: "Valet Parking Mewah", en: "Luxury Valet Parking", ru: "Роскошный валет-паркинг", ko: "럭셔리 발렛 파킹" }}
        subtitle={{
          id: "Rasakan kemudahan ultimate dengan layanan valet profesional kami — dari kedatangan hingga kepergian, kendaraan kamu kami rawat.",
          en: "Experience the ultimate convenience with our professional valet services. From arrival to departure, we ensure your vehicle receives the care it deserves.",
          ru: "Ощутите абсолютное удобство с нашими профессиональными услугами валет-паркинга — от прибытия до отъезда мы заботимся о вашем автомобиле.",
          ko: "전문 발렛 서비스로 궁극의 편리함을 경험하세요. 도착부터 출발까지 차량이 합당한 관리를 받도록 보장합니다.",
        }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <Card className="glow-card glass rounded-2xl h-full hover:border-amber-300/40 transition-all">
                    <CardHeader>
                      <span className="gold-gradient w-12 h-12 rounded-xl flex items-center justify-center mb-4"><Icon className="h-6 w-6 text-[hsl(222_47%_8%)]" /></span>
                      <CardTitle className="text-white text-lg">{tf({ id: s.nameId, en: s.name })}</CardTitle>
                      <div className="text-amber-300 font-bold text-sm">{s.price}</div>
                    </CardHeader>
                    <CardContent><p className="text-slate-400 text-sm">{tf({ id: s.descId, en: s.desc })}</p></CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8 bg-white/[0.02]">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow-gold mb-6">{tf({ id: "Why Choose Us", en: "Why Choose Us", ru: "Почему мы", ko: "저희를 선택하는 이유" })}</h2>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300"><Check className="h-5 w-5 text-amber-300 shrink-0" /> {tf(f)}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-3 gap-5">
              {pricingPlans.map((p, i) => (
                <Card key={i} className="glow-card glass rounded-2xl p-5 text-center hover:border-amber-300/40 transition-all">
                  <CardHeader className="p-0"><CardTitle className="text-white text-base">{tf({ id: p.nameId, en: p.name })}</CardTitle></CardHeader>
                  <CardContent className="p-0 mt-3">
                    <div className="text-amber-300 font-bold text-lg">{p.price}</div>
                    <div className="text-xs text-slate-400 mb-3">{tf(p.period)}</div>
                    <ul className="space-y-1 text-xs text-slate-400 text-left">
                      {p.features.map((ft, k) => <li key={k} className="flex gap-1"><Check className="h-3.5 w-3.5 text-amber-300 shrink-0 mt-0.5" />{ft}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <Reveal>
            <Card className="glass rounded-2xl">
              <CardHeader><CardTitle className="text-white">{tf({ id: "Kebijakan & Informasi", en: "Policies & Information", ru: "Правила и информация", ko: "규정 및 안내" })}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-400 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  <li>• {tf({ id: "SIM wajib untuk semua tamu", en: "Valid driver's license required for all guests", ru: "Действующие водительские права обязательны для всех гостей", ko: "모든 투숙객은 유효한 운전면허증 필요" })}</li>
                  <li>• {tf({ id: "Asuransi tanggung jawab $500.000 termasuk", en: "$500,000 liability insurance coverage included", ru: "Страховое покрытие ответственности $500 000 включено", ko: "5억 달러 책임 보험 포함" })}</li>
                  <li>• {tf({ id: "Kendaraan besar butuh pemberitahuan awal", en: "Oversized vehicles accommodated with advance notice", ru: "Крупногабаритные автомобили размещаются по предварительной договорённости", ko: "대형 차량은 사전 통보 시 이용 가능" })}</li>
                  <li>• {tf({ id: "Valet gratis untuk tamu Presidential Suite", en: "Complimentary valet for Presidential Suite guests", ru: "Бесплатный валет для гостей Presidential Suite", ko: "Presidential Suite 투숙객 무료 발레" })}</li>
                  <li>• {tf({ id: "Cas EV tersedia (biaya tambahan)", en: "Electric vehicle charging available (additional fees apply)", ru: "Доступна зарядка электромобилей (взимается дополнительная плата)", ko: "전기차 충전 가능 (추가 요금 적용)" })}</li>
                  <li>• {tf({ id: "Biaya ganti tiket hilang: $25", en: "Lost ticket replacement fee: $25", ru: "Плата за восстановление утерянного талона: $25", ko: "분실 티켓 재발급 수수료: $25" })}</li>
                </ul>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal>
            <div className="mt-8 flex justify-center">
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <Button variant="luxury" size="lg" className="flex items-center gap-2"><Phone className="h-4 w-4" /> {tf({ id: "Hubungi Valet", en: "Call Valet", ru: "Позвонить валету", ko: "발레 전화" })}</Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ValetParking;
