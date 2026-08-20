import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI, DAYBED_TYPES } from "@/web3/contracts";
import { Calendar, MapPin, Clock, ExternalLink, Loader2, XCircle, CheckCircle } from "lucide-react";

const MyBookings = () => {
  const { address, isConnected } = useAccount();
  const { tf } = useLang();
  const [cancellingId, setCancellingId] = useState<bigint | null>(null);
  const { writeContractAsync } = useWriteContract();

  const { data: bookings, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: "getUserBookings",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleCancel = async (bookingId: bigint) => {
    setCancellingId(bookingId);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookingEscrow,
        abi: BOOKING_ESCROW_ABI,
        functionName: "cancelBooking",
        args: [bookingId],
      });
      refetch();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
    setCancellingId(null);
  };

  if (!isConnected) {
    return (
      <div>
        <PageHero
          eyebrow={{ id: "Reservasi Saya", en: "My Bookings", ru: "Мои бронирования", ko: "내 예약" }}
          title={{ id: "Reservasi Saya", en: "My Bookings", ru: "Мои бронирования", ko: "내 예약" }}
          subtitle={{ id: "Hubungkan wallet untuk melihat reservasi on-chain kamu.", en: "Connect wallet to view your on-chain reservations.", ru: "Подключите кошелёк для просмотра бронирований в блокчейне.", ko: "지갑을 연결하여 온체인 예약을 확인하세요." }}
        />
        <section className="py-16 px-5 md:px-8">
          <div className="container mx-auto max-w-2xl text-center">
            <ConnectButton label={tf({ id: "Hubungkan Wallet", en: "Connect Wallet", ru: "Подключить кошелёк", ko: "지갑 연결" })} />
          </div>
        </section>
      </div>
    );
  }

  const bookingList = bookings ? Array.from(bookings) : [];

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Reservasi Saya", en: "My Bookings", ru: "Мои бронирования", ko: "내 예약" }}
        title={{ id: "Reservasi Saya", en: "My Bookings", ru: "Мои бронирования", ko: "내 예약" }}
        subtitle={{ id: "Semua reservasi kamu tercatat di Monad Testnet blockchain.", en: "All your reservations are recorded on Monad Testnet blockchain.", ru: "Все ваши бронирования записаны в блокчейне Monad Testnet.", ko: "모든 예약이 Monad 테스트넷 블록체인에 기록됩니다." }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div className="text-center text-slate-400 py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              {tf({ id: "Memuat reservasi...", en: "Loading bookings...", ru: "Загрузка бронирований...", ko: "예약 로딩 중..." })}
            </div>
          ) : bookingList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">
                {tf({ id: "Belum ada reservasi.", en: "No bookings yet.", ru: "Бронирований пока нет.", ko: "아직 예약이 없습니다." })}
              </p>
              <Button variant="luxury" onClick={() => window.location.href = "/booking"}>
                {tf({ id: "Buat Reservasi", en: "Make a Booking", ru: "Создать бронирование", ko: "예약하기" })}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookingList.map((b, i) => {
                const daybedName = DAYBED_TYPES[b.daybedType]?.name || `Type ${b.daybedType}`;
                const visitDate = new Date(Number(b.visitTimestamp) * 1000).toLocaleDateString("en-US", {
                  weekday: "short", day: "numeric", month: "short", year: "numeric"
                });
                const isCancelled = b.cancelled;
                const isSettled = b.settled;
                const isCheckedIn = b.checkedIn;
                const canCancel = !isCancelled && !isSettled && !isCheckedIn;

                return (
                  <Reveal key={Number(b.bookingId)} delay={i * 60}>
                    <Card className={`glass rounded-2xl ${isCancelled ? "border-rose-500/30" : isSettled ? "border-emerald-500/30" : "border-amber-300/20"}`}>
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-amber-300 font-bold text-lg">#{String(b.bookingId)}</span>
                              <Badge variant={isCancelled ? "destructive" : isSettled ? "default" : "secondary"} className={
                                isCancelled ? "bg-rose-500/20 text-rose-400" :
                                isSettled ? "bg-emerald-500/20 text-emerald-400" :
                                "bg-amber-500/20 text-amber-400"
                              }>
                                {isCancelled ? tf({ id: "Dibatalkan", en: "Cancelled", ru: "Отменено", ko: "취소됨" }) :
                                 isSettled ? tf({ id: "Selesai", en: "Settled", ru: "Завершено", ko: "완료됨" }) :
                                 isCheckedIn ? tf({ id: "Check-in", en: "Checked In", ru: "Заезд", ko: "체크인" }) :
                                 tf({ id: "Escrow Aktif", en: "Active Escrow", ru: "Активный эскроу", ko: "활성 에스크로" })}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                              <MapPin className="h-4 w-4 text-amber-400" />
                              <span className="font-semibold">{daybedName}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{visitDate}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Number(b.depositAmount) / 1e18} MON
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {canCancel && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={cancellingId === b.bookingId}
                                onClick={() => handleCancel(b.bookingId)}
                                className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                              >
                                {cancellingId === b.bookingId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <><XCircle className="h-4 w-4 mr-1" />{tf({ id: "Batal", en: "Cancel", ru: "Отмена", ko: "취소" })}</>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyBookings;
