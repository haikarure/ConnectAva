import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, MapPin, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { ASSETS, CONTACT } from "@/data/whiterock";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tf } = useLang();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const guestName = searchParams.get('name') || 'VIP Guest';
  const guestEmail = searchParams.get('email') || '';
  const roomType = searchParams.get('room') || 'Lagoon Daybed';
  const guests = searchParams.get('guests') || '2';
  const checkInRaw = searchParams.get('checkin');
  const checkIn = checkInRaw
    ? new Date(checkInRaw + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Today";

  return (
    <div>
      <div className="relative w-full overflow-hidden flex items-center min-h-[40vh] ambient">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%/0.7)] via-[hsl(222_47%_6%/0.55)] to-[hsl(222_47%_6%)]" />
        <div className="relative z-10 container mx-auto px-5 md:px-8 text-center max-w-3xl py-16">
          <div className={`mx-auto mb-4 flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <CheckCircle className="h-16 w-16 text-amber-300" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white text-glow-gold">{tf({ id: "VIP Pass Dikonfirmasi!", en: "VIP Pass Confirmed!", ru: "VIP-пропуск подтверждён!", ko: "VIP 패스가 확인되었습니다!" })}</h1>
          <p className="text-slate-300 mt-3 text-lg">
            {tf({ id: "Terima kasih memilih White Rock Beach Club, Melasti Bali. VIP Pass kamu sudah diemail.", en: "Thank you for choosing White Rock Beach Club, Melasti Bali. Your VIP Pass has been emailed to you.", ru: "Спасибо, что выбрали White Rock Beach Club, Melasti Bali. Ваш VIP-пропуск отправлен вам на email.", ko: "White Rock Beach Club, Melasti Bali를 선택해 주셔서 감사합니다. VIP 패스가 이메일로 발송되었습니다." })}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass border-white/10 shadow-xl text-white">
              <CardHeader><CardTitle className="flex items-center gap-2 text-amber-300">{tf({ id: "Info Tamu", en: "Guest Information", ru: "Информация о госте", ko: "게스트 정보" })}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400">{tf({ id: "Nama Tamu", en: "Guest Name", ru: "Имя гостя", ko: "게스트 이름" })}</label>
                  <p className="text-lg font-semibold">{guestName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">{tf({ id: "Alamat Email", en: "Email Address", ru: "Адрес email", ko: "이메일 주소" })}</label>
                  <p className="text-lg text-slate-200">{guestEmail}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 shadow-xl text-white">
              <CardHeader><CardTitle className="text-amber-300">{tf({ id: "Detail Reservasi", en: "Reservation Details", ru: "Детали бронирования", ko: "예약 세부 정보" })}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400">{tf({ id: "Area VIP / Tipe Daybed", en: "VIP Area / Daybed Type", ru: "VIP-зона / тип Daybed", ko: "VIP 구역 / 데이베드 유형" })}</label>
                  <p className="text-lg font-semibold text-amber-400">{roomType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">{tf({ id: "Tamu", en: "Guests", ru: "Гости", ko: "게스트" })}</label>
                    <p className="text-lg">{guests} Pax</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">{tf({ id: "Tanggal Kunjungan", en: "Visit Date", ru: "Дата визита", ko: "방문 날짜" })}</label>
                    <p className="text-lg">{checkIn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 shadow-xl md:col-span-2 text-white">
              <CardHeader><CardTitle className="flex items-center gap-2 text-amber-300"><Clock className="h-5 w-5" />{tf({ id: "Info Kedatangan VIP", en: "VIP Arrival Info", ru: "Информация о прибытии VIP", ko: "VIP 도착 안내" })}</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-slate-300">
                <p>{tf({ id: "Tunjukkan konfirmasi email digital kamu di pintu masuk VIP utama White Rock saat tiba di Pantai Melasti.", en: "Please show your digital email confirmation at the White Rock main VIP entrance upon arrival at Melasti Beach.", ru: "Пожалуйста, покажите цифровое подтверждение по email у главного VIP-входа White Rock по прибытии на пляж Melasti.", ko: "Melasti Beach에 도착하시면 White Rock 메인 VIP 입구에서 디지털 이메일 확인서를 보여주세요." })}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-white/10 mt-6 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-amber-300"><MapPin className="h-5 w-5" />{tf({ id: "Info Venue", en: "Venue Information", ru: "Информация о площадке", ko: "장소 정보" })}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{tf({ id: "Lokasi", en: "Location", ru: "Местоположение", ko: "위치" })}</h3>
                <p className="text-slate-400">{tf(CONTACT.location)}</p>
              </div>
              <Separator className="bg-white/10" />
              <div>
                <h3 className="font-semibold mb-3">{tf({ id: "Hubungi VIP Desk", en: "Contact VIP Desk", ru: "Связаться с VIP-стойкой", ko: "VIP 데스크 문의" })}</h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-amber-400" />
                    <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{CONTACT.whatsapp}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-amber-400" />
                    <span>{CONTACT.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button size="lg" variant="luxury" onClick={() => navigate('/')} className="rounded-full px-8 py-3">
              {tf({ id: "Kembali ke Home", en: "Return to White Rock Homepage", ru: "Вернуться на главную White Rock", ko: "White Rock 홈페이지로 돌아가기" })}
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.print()} className="border-white/20 text-slate-300 hover:bg-white/5 rounded-full px-8 py-3">
              {tf({ id: "Cetak VIP Pass", en: "Print VIP Pass", ru: "Распечатать VIP-пропуск", ko: "VIP 패스 인쇄" })}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
