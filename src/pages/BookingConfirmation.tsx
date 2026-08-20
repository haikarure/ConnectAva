import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, MapPin, Phone, Mail, Clock, ArrowLeft, ExternalLink, Link2, QrCode } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { ASSETS, CONTACT } from "@/data/whiterock";
import { QRCodeSVG } from "qrcode.react";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tf } = useLang();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bookingId = searchParams.get("bookingId") || "—";
  const txHash = searchParams.get("tx") || "";
  const roomType = searchParams.get("room") || "Lagoon Bed";
  const checkInRaw = searchParams.get("checkin");
  const checkIn = checkInRaw
    ? new Date(checkInRaw + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Today";
  const isWeb3 = !!txHash;

  return (
    <div>
      <div className="relative w-full overflow-hidden flex items-center min-h-[40vh] ambient">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%/0.7)] via-[hsl(222_47%_6%/0.55)] to-[hsl(222_47%_6%)]" />
        <div className="relative z-10 container mx-auto px-5 md:px-8 text-center max-w-3xl py-16">
          <div className={`mx-auto mb-4 flex justify-center transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <CheckCircle className="h-16 w-16 text-amber-300" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white text-glow-gold">
            {isWeb3
              ? tf({ id: "Reservasi Tercatat di Blockchain!", en: "Reservation Recorded on Blockchain!", ru: "Бронирование записано в блокчейне!", ko: "블록체인에 예약이 기록되었습니다!" })
              : tf({ id: "VIP Pass Dikonfirmasi!", en: "VIP Pass Confirmed!", ru: "VIP-пропуск подтверждён!", ko: "VIP 패스가 확인되었습니다!" })}
          </h1>
          <p className="text-slate-300 mt-3 text-lg">
            {isWeb3
              ? tf({
                  id: "Deposit escrow kamu sudah diamankan di smart contract Monad Testnet.",
                  en: "Your escrow deposit is secured in a Monad Testnet smart contract.",
                  ru: "Ваш депозит защищён смарт-контрактом Monad Testnet.",
                  ko: "에스크로 입금이 Monad 테스트넷 스마트 컨트랙트에 안전하게 보관됩니다.",
                })
              : tf({ id: "Terima kasih memilih White Rock Beach Club.", en: "Thank you for choosing White Rock Beach Club.", ru: "Спасибо, что выбрали White Rock Beach Club.", ko: "White Rock Beach Club을 선택해 주셔서 감사합니다." })}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Reservation Details */}
            <Card className="glass border-white/10 shadow-xl text-white">
              <CardHeader>
                <CardTitle className="text-amber-300">{tf({ id: "Detail Reservasi", en: "Reservation Details", ru: "Детали бронирования", ko: "예약 세부 정보" })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isWeb3 && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">Booking ID</label>
                    <p className="text-lg font-bold text-amber-300">#{bookingId}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-slate-400">{tf({ id: "Area VIP / Tipe Daybed", en: "VIP Area / Daybed Type", ru: "VIP-зона / тип Daybed", ko: "VIP 구역 / 데이베드 유형" })}</label>
                  <p className="text-lg font-semibold text-amber-400">{roomType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">{tf({ id: "Tanggal Kunjungan", en: "Visit Date", ru: "Дата визита", ko: "방문 날짜" })}</label>
                    <p className="text-lg">{checkIn}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">{tf({ id: "Status", en: "Status", ru: "Статус", ko: "상태" })}</label>
                    <p className="text-lg text-emerald-400 font-semibold">
                      {isWeb3 ? "Escrowed" : "Confirmed"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* On-Chain Details */}
            {isWeb3 && (
              <Card className="glass border-white/10 shadow-xl text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-300">
                    <Link2 className="h-5 w-5" />
                    {tf({ id: "Detail On-Chain", en: "On-Chain Details", ru: "Данные в блокчейне", ko: "온체인 상세" })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Network</label>
                    <p className="text-lg">Monad Testnet</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Transaction Hash</label>
                    <a
                      href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-300 hover:text-amber-200 text-sm font-mono break-all"
                    >
                      {txHash.slice(0, 16)}...{txHash.slice(-10)}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Smart Contract</label>
                    <a
                      href={`https://testnet.monadexplorer.com/address/${CONTACT.bookingContract || "0x0000"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-300 hover:text-amber-200 text-xs font-mono"
                    >
                      BookingEscrow
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                    <p className="text-emerald-400 text-xs font-semibold">
                      ✓ {tf({ id: "Deposit diamankan di escrow. Refund 100% jika batal 24h sebelumnya.", en: "Deposit secured in escrow. 100% refund if cancelled 24h prior.", ru: "Депозит защищён в эскроу. 100% возврат при отмене за 24ч.", ko: "보증금이 에스크로에 보관됩니다. 24시간 전 취소 시 100% 환불." })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code for Check-In */}
            {isWeb3 && (
              <Card className="glass border-white/10 shadow-xl text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-300">
                    <QrCode className="h-5 w-5" />
                    {tf({ id: "QR Code Check-In", en: "Check-In QR Code", ru: "QR-код для регистрации", ko: "체크인 QR 코드" })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-slate-400 text-sm text-center">
                    {tf({ id: "Tunjukkan QR ini ke staff saat tiba di venue.", en: "Show this QR to staff upon arrival at venue.", ru: "Покажите этот QR staff по прибытии.", ko: "도착 시 이 QR을 스태프에게 보여주세요." })}
                  </p>
                  <div className="bg-white p-4 rounded-2xl">
                    <QRCodeSVG
                      value={JSON.stringify({
                        bookingId: Number(bookingId),
                        guest: "guest",
                        visitTimestamp: checkInRaw ? Math.floor(new Date(checkInRaw + "T00:00:00").getTime() / 1000) : 0,
                      })}
                      size={180}
                      level="M"
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Booking #{bookingId}</p>
                </CardContent>
              </Card>
            )}

            {/* VIP Arrival Info */}
            <Card className="glass border-white/10 shadow-xl md:col-span-2 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <Clock className="h-5 w-5" />
                  {tf({ id: "Info Kedatangan VIP", en: "VIP Arrival Info", ru: "Информация о прибытии VIP", ko: "VIP 도착 안내" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-300">
                <p>
                  {isWeb3
                    ? tf({
                        id: "Tunjukkan Booking ID kamu di pintu masuk VIP utama White Rock saat tiba di Pantai Melasti. Staff akan memverifikasi on-chain.",
                        en: "Show your Booking ID at the White Rock main VIP entrance upon arrival at Melasti Beach. Staff will verify on-chain.",
                        ru: "Покажите ваш Booking ID у главного VIP-входа White Rock по прибытии на пляж Melasti. Персонал проверит в блокчейне.",
                        ko: "Melasti Beach 도착 시 White Rock 메인 VIP 입구에서 Booking ID를 보여주세요. 스태프가 온체인에서 확인합니다.",
                      })
                    : tf({
                        id: "Tunjukkan konfirmasi email digital kamu di pintu masuk VIP utama White Rock saat tiba di Pantai Melasti.",
                        en: "Please show your digital email confirmation at the White Rock main VIP entrance upon arrival at Melasti Beach.",
                        ru: "Пожалуйста, покажите цифровое подтверждение по email у главного VIP-входа White Rock по прибытии на пляж Melasti.",
                        ko: "Melasti Beach에 도착하시면 White Rock 메인 VIP 입구에서 디지털 이메일 확인서를 보여주세요.",
                      })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Venue Info */}
          <Card className="glass border-white/10 mt-6 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <MapPin className="h-5 w-5" />
                {tf({ id: "Info Venue", en: "Venue Information", ru: "Информация о площадке", ko: "장소 정보" })}
              </CardTitle>
            </CardHeader>
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button size="lg" variant="luxury" onClick={() => navigate("/")} className="rounded-full px-8 py-3">
              {tf({ id: "Kembali ke Home", en: "Return to White Rock Homepage", ru: "Вернуться на главную White Rock", ko: "White Rock 홈페이지로 돌아가기" })}
            </Button>
            {isWeb3 && (
              <Button variant="outline" size="lg" onClick={() => window.print()} className="border-white/20 text-slate-300 hover:bg-white/5 rounded-full px-8 py-3">
                {tf({ id: "Cetak Bukti", en: "Print Receipt", ru: "Распечатать квитанцию", ko: "영수증 인쇄" })}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
