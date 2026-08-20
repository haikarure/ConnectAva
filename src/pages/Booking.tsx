import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Web3BookingButton } from "@/components/web3/Web3BookingButton";
import { MintPassButton } from "@/components/web3/MintPassButton";
import { NFTPassCard } from "@/components/web3/NFTPassCard";
import { DAYBED_TYPES } from "@/web3/contracts";
import { useAccount } from "wagmi";
import { useMonPrice } from "@/hooks/useMonPrice";

const DAYBED_DATA = [
  { type: 0, capacity: "4 pax", usdt: 30 },
  { type: 1, capacity: "12 pax", usdt: 270 },
  { type: 2, capacity: "15 pax", usdt: 480 },
  { type: 3, capacity: "2 pax", usdt: 18 },
];

const Booking = () => {
  const navigate = useNavigate();
  const { tf } = useLang();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDaybed, setSelectedDaybed] = useState<number | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const { isConnected } = useAccount();
  const { monPriceUsd, loading: priceLoading, usdtToMon } = useMonPrice();

  const dateStr = date ? date.toISOString().split("T")[0] : "";

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Reservasi", en: "Reservation", ru: "Бронирование", ko: "예약" }}
        title={{ id: "Reserve VIP Daybed", en: "Reserve VIP Daybed", ru: "Забронировать VIP Daybed", ko: "VIP 데이베드 예약" }}
        subtitle={{
          id: "Pilih tanggal dan tipe daybed, lalu deposit escrow di Monad Testnet.",
          en: "Select your date and daybed type, then deposit escrow on Monad Testnet.",
          ru: "Выберите дату и тип daybed, затем внесите депозит в Monad Testnet.",
          ko: "날짜와 데이베드 유형을 선택한 다음 Monad 테스트넷에 에스크로를 입금하세요.",
        }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Live MON Price Banner */}
          {monPriceUsd && (
            <Reveal>
              <div className="mb-6 p-3 rounded-xl bg-amber-300/10 border border-amber-300/20 text-center">
                <span className="text-xs text-slate-400">Live MON Price (CoinGecko): </span>
                <span className="text-amber-300 font-bold">${monPriceUsd.toFixed(4)} USD</span>
              </div>
            </Reveal>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Calendar + Daybed Selection */}
            <div className="space-y-6">
              <Reveal>
                <Card className="glow-card glass rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-center text-white text-xl font-cinzel">
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
                  </CardContent>
                </Card>
              </Reveal>

              {/* Daybed Type Selection */}
              <Reveal delay={100}>
                <Card className="glow-card glass rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-center text-white text-xl font-cinzel">
                      {tf({ id: "Pilih Tipe Daybed", en: "Select Daybed Type", ru: "Выберите тип Daybed", ko: "데이베드 유형 선택" })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DAYBED_TYPES.map((daybed, i) => (
                      <button
                        key={daybed.id}
                        onClick={() => setSelectedDaybed(daybed.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-200 text-left flex items-center justify-between
                          ${selectedDaybed === daybed.id
                            ? 'border-amber-300/50 bg-amber-300/10'
                            : 'border-white/10 bg-white/5 hover:border-amber-300/30 hover:bg-amber-300/5'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {selectedDaybed === daybed.id && (
                            <Check className="h-4 w-4 text-amber-300" />
                          )}
                          <div>
                            <div className="text-white font-semibold text-sm">{daybed.name}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Users className="h-3 w-3" />
                              {DAYBED_DATA[i].capacity}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-300 font-bold text-sm">
                            {priceLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin inline" />
                            ) : (
                              `${usdtToMon(DAYBED_DATA[i].usdt)} MON`
                            )}
                          </div>
                          <div className="text-xs text-slate-500">/ {daybed.minSpendUsdt}</div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </Reveal>
            </div>

            {/* Right: Web3 Booking + Pass Mint */}
            <div className="space-y-6">
              {/* NFT Pass Display */}
              <Reveal delay={130}>
                <NFTPassCard />
              </Reveal>

              {/* Mint Pass Section */}
              <Reveal delay={150}>
                <MintPassButton />
              </Reveal>

              {/* Booking Button */}
              <Reveal delay={200}>
                <Card className="glow-card glass rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-center text-white text-xl font-cinzel">
                      {tf({ id: "Deposit Escrow", en: "Deposit Escrow", ru: "Депозит в эскроу", ko: "에스크로 입금" })}
                    </CardTitle>
                    <p className="text-center text-slate-400 text-sm">
                      {tf({
                        id: "Dana kamu di-amankan di smart contract Monad. Refund 100% jika batal 24 jam sebelum kunjungan.",
                        en: "Your funds are secured in a Monad smart contract. 100% refund if cancelled 24h before visit.",
                        ru: "Ваши средства защищены смарт-контрактом Monad. 100% возврат при отмене за 24 часа до визита.",
                        ko: "자금은 Monad 스마트 컨트랙트에 안전하게 보관됩니다. 방문 24시간 전 취소 시 100% 환불.",
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {selectedDaybed !== null && dateStr ? (
                      <Web3BookingButton
                        daybedType={selectedDaybed}
                        dateString={dateStr}
                        onSuccess={(id, hash) => {
                          setBookingComplete(true);
                          navigate(`/bookingconfirmation?bookingId=${id}&tx=${hash}&checkin=${dateStr}&room=${DAYBED_TYPES[selectedDaybed].name}`);
                        }}
                      />
                    ) : (
                      <div className="text-center text-slate-500 text-sm py-4">
                        {tf({
                          id: "Pilih tanggal dan tipe daybed terlebih dahulu",
                          en: "Select a date and daybed type first",
                          ru: "Сначала выберите дату и тип daybed",
                          ko: "먼저 날짜와 데이베드 유형을 선택하세요",
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Reveal>

              {/* Back button */}
              <Reveal delay={250}>
                <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 w-full justify-center">
                  <ArrowLeft className="h-4 w-4" />
                  {tf({ id: "Kembali ke Home", en: "Back to Home", ru: "Вернуться на главную", ko: "홈으로 돌아가기" })}
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
