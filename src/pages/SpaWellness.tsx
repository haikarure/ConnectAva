import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { CONTACT } from "@/data/whiterock";
import {
  Clock,
  Sparkles,
  Waves,
  Flower2,
  Heart,
  Phone,
  Calendar,
} from "lucide-react";

const Treatments = () => {
  const { tf } = useLang();
  const navigate = useNavigate();

  const treatments = [
    { name: "Signature Relaxation Massage", nameId: "Pijat Relaksasi Signature", duration: "60 mins", price: "IDR 2.8M", desc: "Full-body therapeutic massage with aromatic oils", descId: "Pijat terapi seluruh tubuh dengan minyak aromaterapi" },
    { name: "Deep Tissue Massage", nameId: "Pijat Deep Tissue", duration: "90 mins", price: "IDR 3.7M", desc: "Intensive muscle therapy for tension relief", descId: "Terapi otot intensif untuk meredakan ketegangan" },
    { name: "Couples Spa Package", nameId: "Paket Spa Pasangan", duration: "120 mins", price: "IDR 7M", desc: "Side-by-side massage with champagne service", descId: "Pijat berdampingan dengan layanan champagne" },
    { name: "Rejuvenating Facial", nameId: "Facial Menyegarkan", duration: "75 mins", price: "IDR 2.5M", desc: "Customized facial treatment for all skin types", descId: "Perawatan wajah sesuai jenis kulit" },
    { name: "Hot Stone Therapy", nameId: "Terapi Batu Hangat", duration: "90 mins", price: "IDR 3.4M", desc: "Heated volcanic stones for deep muscle relaxation", descId: "Batu vulkanik panas untuk relaksasi otot dalam" },
    { name: "Aromatherapy Session", nameId: "Sesi Aromaterapi", duration: "60 mins", price: "IDR 2.6M", desc: "Essential oil therapy for mind and body wellness", descId: "Terapi minyak esensial untuk pikiran & tubuh" },
  ];

  const facilities = [
    { icon: Waves, name: "Infinity Pool", nameId: "Kolam Infinity", desc: "Temperature-controlled pool with ocean views", descId: "Kolam bersuhu terkontrol dengan pemandangan laut" },
    { icon: Sparkles, name: "Steam Room", nameId: "Ruang Uap", desc: "Eucalyptus-infused steam for detoxification", descId: "Uap eukaliptus untuk detoksifikasi" },
    { icon: Flower2, name: "Meditation Garden", nameId: "Taman Meditasi", desc: "Tranquil outdoor space for mindfulness", descId: "Ruang terbuka tenang untuk ketenangan pikiran" },
    { icon: Heart, name: "Wellness Lounge", nameId: "Lounge Kesehatan", desc: "Relaxation area with herbal teas", descId: "Area relaksasi dengan teh herbal" },
  ];

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Wellness & Relaxation", en: "Wellness & Relaxation", ru: "Велнес и релакс", ko: "웰니스 & 휴식" }}
        title={{ id: "Spa & Wellness", en: "Spa & Wellness", ru: "СПА и велнес", ko: "스파 & 웰니스" }}
        subtitle={{
          id: "Escapes ke sanctuary spa kelas dunia kami — treatment premium, fasilitas modern, dan terapis ahli yang dedikasi untuk perjalanan wellness kamu.",
          en: "Escape to our world-class spa sanctuary featuring premium treatments, state-of-the-art facilities, and expert therapists dedicated to your wellness journey.",
          ru: "Откройте для себя наш спа-санктуарий мирового класса с премиальными процедурами, современными удобствами и опытными терапевтами, посвятившими себя вашему пути к велнесу.",
          ko: "프리미엄 트리트먼트, 최첨단 시설, 그리고 여러분의 웰니스 여정을 위해 헌신하는 전문 테라피스트가 있는 세계적 수준의 스파 산책처로 빠져보세요.",
        }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow-gold">{tf({ id: "Signature Treatments", en: "Signature Treatments", ru: "Фирменные процедуры", ko: "시그니처 트리트먼트" })}</h2>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                {tf({ id: "Nikmati pilihan treatment terapi kurasi kami yang dirancang untuk memulihkan, meremajakan, dan menghidupkan kembali tubuh & pikiran.", en: "Indulge in our carefully curated selection of therapeutic treatments designed to restore, rejuvenate, and revitalize your body and mind.", ru: "Насладитесь нашей тщательно подобранной подборкой терапевтических процедур, созданных, чтобы восстановить, обновить и оживить ваше тело и разум.", ko: "신체와 마음을 회복하고 재생하며 활력을 되찾도록 설계된 엄선된 테라피 트리트먼트를 즐겨보세요." })}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((t, i) => (
              <Reveal key={i} delay={i * 60}>
                <Card className="glow-card glass rounded-2xl h-full hover:border-amber-300/40 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <CardTitle className="text-lg text-white">{tf({ id: t.nameId, en: t.name })}</CardTitle>
                      <Badge variant="secondary" className="gold-gradient text-[hsl(222_47%_8%)] shrink-0">{t.price}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-300">
                      <Clock className="h-4 w-4" /> {t.duration}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm">{tf({ id: t.descId, en: t.desc })}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8 bg-white/[0.02]">
        <div className="container mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow-gold">{tf({ id: "Premium Facilities", en: "Premium Facilities", ru: "Премиальные удобства", ko: "프리미엄 시설" })}</h2>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                {tf({ id: "Tenggelam dalam amenities mewah kami yang dirancang untuk meningkatkan pengalaman wellness dan relaksasi total.", en: "Immerse yourself in our luxurious amenities designed to enhance your wellness experience and promote complete relaxation.", ru: "Погрузитесь в наши роскошные удобства, созданные для повышения качества велнес-опыта и полного расслабления.", ko: "완전한 휴식과 웰니스 경험을 높이도록 설계된 호화로운 편의 시설 속에 빠져보세요." })}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <Card className="glow-card glass rounded-2xl text-center h-full hover:border-amber-300/40 transition-all">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 rounded-full gold-gradient flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-[hsl(222_47%_8%)]" />
                      </div>
                      <CardTitle className="text-lg text-white">{tf({ id: f.nameId, en: f.name })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm">{tf({ id: f.descId, en: f.desc })}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal>
              <Card className="glass rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-amber-300" /> {tf({ id: "Jam Operasional", en: "Operating Hours", ru: "Часы работы", ko: "운영 시간" })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-300">
                  <div className="flex justify-between"><span>{tf({ id: "Senin - Jumat", en: "Monday - Friday", ru: "Понедельник — пятница", ko: "월요일 - 금요일" })}</span><span className="font-medium text-white">6:00 AM - 10:00 PM</span></div>
                  <div className="flex justify-between"><span>{tf({ id: "Sabtu - Minggu", en: "Saturday - Sunday", ru: "Суббота — воскресенье", ko: "토요일 - 일요일" })}</span><span className="font-medium text-white">7:00 AM - 11:00 PM</span></div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-sm text-slate-400">{tf({ id: "Booking treatment terakhir diterima 90 menit sebelum tutup.", en: "Last treatment bookings accepted 90 minutes before closing.", ru: "Последнее бронирование процедур принимается за 90 минут до закрытия.", ko: "마지막 트리트먼트 예약은 폐장 90분 전까지 받습니다." })}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="glass rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">{tf({ id: "Kebijakan Spa", en: "Spa Policies", ru: "Правила спа", ko: "스파 규정" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• {tf({ id: "Datang 15 menit lebih awal untuk janji temu", en: "Arrive 15 minutes early for your appointment", ru: "Приходите за 15 минут до записи", ko: "예약 시간 15분 전에 도착하세요" })}</li>
                    <li>• {tf({ id: "Berlaku kebijakan pembatalan 24 jam", en: "24-hour cancellation policy applies", ru: "Действует политика отмены за 24 часа", ko: "24시간 취소 정책 적용" })}</li>
                    <li>• {tf({ id: "Jubah & sandal gratis disediakan", en: "Complimentary robes and slippers provided", ru: "Халаты и тапочки предоставляются бесплатно", ko: "로브와 슬리퍼 무료 제공" })}</li>
                    <li>• {tf({ id: "Hp dimatikan di area spa", en: "Mobile phones must be silenced in spa areas", ru: "Мобильные телефоны должны быть на беззвучном в зоне спа", ko: "스파 구역에서는 휴대폰을 무음으로 해주세요" })}</li>
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg" onClick={() => navigate("/booking")} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {tf({ id: "Booking Treatment", en: "Book Treatment", ru: "Забронировать процедуру", ko: "트리트먼트 예약" })}
              </Button>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-amber-300/40 text-amber-200">
                  <Phone className="h-4 w-4" /> {tf({ id: "Hubungi Spa", en: "Call Spa", ru: "Позвонить в спа", ko: "스파 전화" })}
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Treatments;
