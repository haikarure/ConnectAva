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
  Dumbbell,
  Activity,
  Users,
  Heart,
  Phone,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import fitnessCardioArea from "@/assets/fitness-cardio-area.jpg";
import fitnessStrengthArea from "@/assets/fitness-strength-area.jpg";
import fitnessGroupClass from "@/assets/fitness-group-class.jpg";
import fitnessFunctionalTraining from "@/assets/fitness-functional-training.jpg";

const FitnessCenter = () => {
  const { tf } = useLang();
  const navigate = useNavigate();

  const equipment = [
    { category: "Cardio Equipment", categoryId: "Alat Kardio", icon: Heart, image: fitnessCardioArea, items: ["12 Treadmills with personal TVs", "8 Elliptical machines", "6 Stationary bikes", "4 Rowing machines", "2 StairMasters"] },
    { category: "Strength Training", categoryId: "Latihan Kekuatan", icon: Dumbbell, image: fitnessStrengthArea, items: ["Complete free weight section (5-100 lbs)", "Olympic lifting platform", "Cable machine systems", "Smith machine", "Leg press machines"] },
    { category: "Functional Training", categoryId: "Latihan Fungsional", icon: Target, image: fitnessFunctionalTraining, items: ["TRX suspension trainers", "Battle ropes", "Medicine balls", "Kettlebells (10-80 lbs)", "Resistance bands"] },
    { category: "Specialized Machines", categoryId: "Mesin Khusus", icon: Zap, image: fitnessGroupClass, items: ["Multi-station gym equipment", "Assisted pull-up machines", "Cable crossover machines", "Plate-loaded machines", "Pneumatic resistance equipment"] },
  ];

  const classes = [
    { name: "High-Intensity Interval Training", nameId: "High-Intensity Interval Training (HIIT)", time: "6:00 AM, 12:00 PM, 6:00 PM", duration: "45 mins", level: "All Levels", levelId: "Semua Level" },
    { name: "Yoga & Mindfulness", nameId: "Yoga & Mindfulness", time: "7:00 AM, 5:30 PM", duration: "60 mins", level: "Beginner to Advanced", levelId: "Pemula - Lanjut" },
    { name: "Strength & Conditioning", nameId: "Kekuatan & Kondisi", time: "8:00 AM, 1:00 PM", duration: "50 mins", level: "Intermediate", levelId: "Menengah" },
    { name: "Spin Class", nameId: "Kelas Spin", time: "6:30 AM, 12:30 PM, 7:00 PM", duration: "45 mins", level: "All Levels", levelId: "Semua Level" },
    { name: "Pilates", nameId: "Pilates", time: "9:00 AM, 4:00 PM", duration: "55 mins", level: "All Levels", levelId: "Semua Level" },
    { name: "Aqua Fitness", nameId: "Fitness Akuatik", time: "10:00 AM, 2:00 PM", duration: "45 mins", level: "All Levels", levelId: "Semua Level" },
  ];

  const amenities = [
    { icon: Users, name: "Personal Training", nameId: "Personal Training", desc: "Certified trainers available for one-on-one sessions", descId: "Trainer bersertifikat untuk sesi satu-satu" },
    { icon: Activity, name: "Group Classes", nameId: "Kelas Grup", desc: "Daily fitness classes for all skill levels", descId: "Kelas fitness harian untuk semua level" },
    { icon: Heart, name: "Wellness Assessment", nameId: "Penilaian Kesehatan", desc: "Complimentary fitness evaluations and goal setting", descId: "Evaluasi fitness & penetapan tujuan gratis" },
    { icon: Zap, name: "Recovery Zone", nameId: "Zona Pemulihan", desc: "Massage chairs and stretching area", descId: "Kursi pijat & area peregangan" },
  ];

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Health & Vitality", en: "Health & Vitality", ru: "Здоровье и энергия", ko: "건강 & 활력" }}
        title={{ id: "Fitness Center", en: "Fitness Center", ru: "Фитнес-центр", ko: "피트니스 센터" }}
        subtitle={{
          id: "Pusat kebugaran komersial-grade dengan peralatan terbaru, trainer bersertifikat, dan kelas harian dengan pemandangan tebing Melasti.",
          en: "A commercial-grade fitness center with the latest equipment, certified trainers, and daily classes overlooking the Melasti cliffs.",
          ru: "Фитнес-центр коммерческого уровня с новейшим оборудованием, сертифицированными тренерами и ежедневными занятиями с видом на скалы Меласти.",
          ko: "최신 장비, 자격증을 갖춘 트레이너, 멜라스티 절벽이 내려다보이는 일일 클래스를 갖춘 상업급 피트니스 센터.",
        }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow-gold">{tf({ id: "Premium Equipment", en: "Premium Equipment", ru: "Премиальное оборудование", ko: "프리미엄 장비" })}</h2>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                {tf({ id: "Fitness center kami dilengkapi peralatan komersial terbaru dari manufaktur terkemuka untuk pengalaman workout superior.", en: "Our fitness center features the latest commercial-grade equipment from leading manufacturers, ensuring a superior workout experience.", ru: "Наш фитнес-центр оснащён новейшим коммерческим оборудованием от ведущих производителей, обеспечивая превосходную тренировку.", ko: "저희 피트니스 센터는 주요 제조사의 최신 상업용 장비를 갖추고 있어 완벽한 운동 경험을 선사합니다." })}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {equipment.map((section, i) => {
              const Icon = section.icon;
              return (
                <Reveal key={i} delay={i * 70}>
                  <Card className="glow-card glass rounded-2xl overflow-hidden h-full hover:border-amber-300/40 transition-all">
                    <div className="relative h-48">
                      <img src={section.image} alt={section.category} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222_47%_8%)] to-transparent" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-white">
                        <span className="gold-gradient p-2 rounded-lg"><Icon className="h-5 w-5 text-[hsl(222_47%_8%)]" /></span>
                        {tf({ id: section.categoryId, en: section.category })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-slate-400">
                        {section.items.map((item, k) => <li key={k} className="flex items-center gap-2"><span className="text-amber-300/70">•</span>{item}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8 bg-white/[0.02]">
        <div className="container mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-glow-gold">{tf({ id: "Daily Classes", en: "Daily Classes", ru: "Ежедневные занятия", ko: "매일 수업" })}</h2>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                {tf({ id: "Jadwal kelas yang dipimpin instruktur untuk semua level kebugaran.", en: "Instructor-led class schedules for all fitness levels.", ru: "Расписание занятий под руководством инструктора для всех уровней подготовки.", ko: "모든 수준의 회원을 위한 강사 주도 수업 일정." })}
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c, i) => (
              <Reveal key={i} delay={i * 50}>
                <Card className="glow-card glass rounded-2xl h-full hover:border-amber-300/40 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <CardTitle className="text-lg text-white">{tf({ id: c.nameId, en: c.name })}</CardTitle>
                      <Badge variant="secondary" className="border border-amber-300/30 text-amber-200 shrink-0">{tf({ id: c.levelId, en: c.level })}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-300"><Clock className="h-4 w-4" /> {c.duration}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm">{tf({ id: "Jadwal", en: "Schedule", ru: "Расписание", ko: "일정" })}: {c.time}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-white mb-6 text-glow-gold">{tf({ id: "Amenitas", en: "Amenities", ru: "Удобства", ko: "편의 시설" })}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {amenities.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <Reveal key={i} delay={i * 60}>
                        <Card className="glow-card glass rounded-2xl h-full hover:border-amber-300/40 transition-all">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white text-base">
                              <span className="gold-gradient p-2 rounded-lg"><Icon className="h-5 w-5 text-[hsl(222_47%_8%)]" /></span>
                              {tf({ id: a.nameId, en: a.name })}
                            </CardTitle>
                          </CardHeader>
                          <CardContent><p className="text-slate-400 text-sm">{tf({ id: a.descId, en: a.desc })}</p></CardContent>
                        </Card>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Card className="glass rounded-2xl h-full">
                <CardHeader>
                  <CardTitle className="text-white">{tf({ id: "Kebijakan Fitness Center", en: "Fitness Center Policies", ru: "Правила фитнес-центра", ko: "피트니스 센터 규정" })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-400 text-sm">
                  <li>• {tf({ id: "Pakaian olahraga & sepatu tertutup wajib", en: "Proper athletic attire and closed-toe shoes required", ru: "Обязательна спортивная одежда и закрытая обувь", ko: "적절한 운동복과 막힌 코드 신발 착용 필수" })}</li>
                  <li>• {tf({ id: "Handuk & botol air gratis", en: "Towels and water bottles provided complimentary", ru: "Полотенца и бутылки для воды предоставляются бесплатно", ko: "수건과 물병 무료 제공" })}</li>
                  <li>• {tf({ id: "Personal training butuh booking awal", en: "Personal training sessions require advance booking", ru: "Для персональных тренировок требуется предварительное бронирование", ko: "개인 트레이닝은 사전 예약 필요" })}</li>
                  <li>• {tf({ id: "Anak di bawah 16 tahun wajib didampingi", en: "Children under 16 must be accompanied by an adult", ru: "Дети до 16 лет должны быть в сопровождении взрослых", ko: "16세 미만 어린이는 보호자 동반 필수" })}</li>
                  <li>• {tf({ id: "Lap peralatan setelah dipakai", en: "Please wipe down equipment after use", ru: "Пожалуйста, протирайте оборудование после использования", ko: "사용 후 장비를 닦아주세요" })}</li>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg" onClick={() => navigate("/booking")} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {tf({ id: "Jadwalkan Training", en: "Schedule Training", ru: "Записаться на тренировку", ko: "트레이닝 예약" })}
              </Button>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-amber-300/40 text-amber-200">
                  <Phone className="h-4 w-4" /> {tf({ id: "Hubungi Fitness", en: "Call Fitness", ru: "Позвонить в фитнес-центр", ko: "피트니스 센터 전화" })}
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default FitnessCenter;
