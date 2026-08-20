import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";

const Booking = () => {
  const navigate = useNavigate();
  const { tf } = useLang();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Reservasi", en: "Reservation", ru: "Бронирование", ko: "예약" }}
        title={{ id: "Reserve VIP Daybed", en: "Reserve VIP Daybed", ru: "Забронировать VIP Daybed", ko: "VIP 데이베드 예약" }}
        subtitle={{
          id: "Pilih tanggal kunjungan kamu ke White Rock Beach Club, Melasti Bali.",
          en: "Select your visit date at White Rock Beach Club, Melasti Bali.",
          ru: "Выберите дату визита в White Rock Beach Club, Melasti Bali.",
          ko: "White Rock Beach Club, Melasti Bali 방문 날짜를 선택하세요.",
        }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-2xl">
          <Reveal>
            <Card className="glow-card glass rounded-3xl">
              <CardHeader>
                <CardTitle className="text-center text-white text-2xl font-cinzel">
                  {tf({ id: "Pilih Tanggal Kunjungan", en: "Select Visit Date", ru: "Выберите дату визита", ko: "방문 날짜 선택" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md text-white"
                    disabled={(d) => d < new Date()}
                  />
                </div>
                <Button
                  size="lg"
                  variant="luxury"
                  className="px-12 rounded-full"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (date) params.set("checkin", date.toISOString().split("T")[0]);
                    navigate(`/bookingconfirmation?${params.toString()}`);
                  }}
                >
                  {tf({ id: "Cari Daybed Tersedia", en: "Search Available Daybeds", ru: "Найти доступные Daybed", ko: "예약 가능한 데이베드 찾기" })}
                </Button>
                <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400">
                  <ArrowLeft className="h-4 w-4" /> {tf({ id: "Kembali ke Home", en: "Back to Home", ru: "Вернуться на главную", ko: "홈으로 돌아가기" })}
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Booking;
