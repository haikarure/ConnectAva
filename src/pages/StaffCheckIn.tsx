import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI, DAYBED_TYPES } from "@/web3/contracts";
import { QrCode, CheckCircle, Loader2, ExternalLink, AlertTriangle, Users } from "lucide-react";

const StaffCheckIn = () => {
  const { address, isConnected } = useAccount();
  const { tf } = useLang();
  const [bookingIdInput, setBookingIdInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ success: boolean; txHash?: string; error?: string } | null>(null);

  const { writeContractAsync } = useWriteContract();

  const { data: bookingData, isLoading: isLoadingBooking, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: "getUserBookings",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleCheckIn = async () => {
    if (!bookingIdInput) return;
    setIsChecking(true);
    setResult(null);

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookingEscrow,
        abi: BOOKING_ESCROW_ABI,
        functionName: "checkIn",
        args: [BigInt(bookingIdInput)],
      });
      setResult({ success: true, txHash: hash });
      refetch();
    } catch (err: any) {
      setResult({ success: false, error: err.message?.slice(0, 200) || "Check-in failed" });
    }
    setIsChecking(false);
  };

  if (!isConnected) {
    return (
      <div>
        <PageHero
          eyebrow={{ id: "Staff Portal", en: "Staff Portal", ru: "Портал.staff", ko: "스태프 포털" }}
          title={{ id: "Guest Check-In", en: "Guest Check-In", ru: "Регистрация гостя", ko: "게스트 체크인" }}
          subtitle={{ id: "Scan QR atau masukkan Booking ID untuk check-in guest.", en: "Scan QR or enter Booking ID to check-in guests.", ru: "Отсканируйте QR или введите Booking ID для регистрации.", ko: "QR 스캔 또는 Booking ID 입력으로 게스트 체크인." }}
        />
        <section className="py-16 px-5 md:px-8">
          <div className="container mx-auto max-w-2xl text-center">
            <ConnectButton label={tf({ id: "Login dengan Admin Wallet", en: "Login with Admin Wallet", ru: "Войти с Admin-кошельком", ko: "관리자 지갑으로 로그인" })} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow={{ id: "Staff Portal", en: "Staff Portal", ru: "Портал.staff", ko: "스태프 포털" }}
        title={{ id: "Guest Check-In", en: "Guest Check-In", ru: "Регистрация гостя", ko: "게스트 체크인" }}
        subtitle={{ id: "Masukkan Booking ID untuk memverifikasi dan check-in guest.", en: "Enter Booking ID to verify and check-in guests.", ru: "Введите Booking ID для верификации и регистрации.", ko: "Booking ID를 입력하여 게스트를 확인하고 체크인하세요." }}
      />

      <section className="py-16 px-5 md:px-8">
        <div className="container mx-auto max-w-2xl space-y-6">
          {/* Check-In Input */}
          <Reveal>
            <Card className="glass rounded-3xl border-amber-300/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <QrCode className="h-5 w-5" />
                  {tf({ id: "Booking ID Check-In", en: "Booking ID Check-In", ru: "Регистрация по Booking ID", ko: "Booking ID 체크인" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={bookingIdInput}
                    onChange={(e) => setBookingIdInput(e.target.value)}
                    placeholder={tf({ id: "Masukkan Booking ID (contoh: 1)", en: "Enter Booking ID (e.g. 1)", ru: "Введите Booking ID (напр. 1)", ko: "Booking ID 입력 (예: 1)" })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-300/50"
                  />
                  <Button
                    variant="luxury"
                    disabled={isChecking || !bookingIdInput}
                    onClick={handleCheckIn}
                    className="px-6"
                  >
                    {isChecking ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      tf({ id: "Check-In", en: "Check-In", ru: "Регистрация", ko: "체크인" })
                    )}
                  </Button>
                </div>

                {result && (
                  <div className={`p-4 rounded-xl ${result.success ? "bg-emerald-400/10 border border-emerald-400/20" : "bg-rose-400/10 border border-rose-400/20"}`}>
                    {result.success ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                          <CheckCircle className="h-5 w-5" />
                          {tf({ id: "Check-in Berhasil!", en: "Check-in Successful!", ru: "Регистрация прошла успешно!", ko: "체크인 성공!" })}
                        </div>
                        {result.txHash && (
                          <a
                            href={`https://testnet.monadexplorer.com/tx/${result.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200"
                          >
                            Tx: {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <p className="text-xs text-slate-400">
                          {tf({ id: "Escrow funds released to venue wallet on-chain.", en: "Escrow funds released to venue wallet on-chain.", ru: "Средства эскроу переведены на кошелёк venue.", ko: "에스크로 자금이 venue 지갑에 온체인으로 전송되었습니다." })}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm">{result.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Reveal>

          {/* Quick Info */}
          <Reveal delay={100}>
            <Card className="glass rounded-2xl border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <p>
                    {tf({
                      id: "Hanya admin/owner wallet yang bisa check-in. Pastikan wallet kamu adalah contract owner.",
                      en: "Only admin/owner wallet can check-in. Make sure your wallet is the contract owner.",
                      ru: "Только кошелёк admin/owner может регистрировать. Убедитесь, что ваш кошелёк — владелец контракта.",
                      ko: "관리자/오너 지갑만 체크인할 수 있습니다. 지갑이 컨트랙트 오너인지 확인하세요.",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default StaffCheckIn;
