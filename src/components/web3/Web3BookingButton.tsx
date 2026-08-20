import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI, DAYBED_TYPES } from '@/web3/contracts';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/i18n';

interface Web3BookingButtonProps {
  daybedType: number;
  dateString: string; // "YYYY-MM-DD"
  onSuccess?: (bookingId: number, txHash: string) => void;
}

export const Web3BookingButton: React.FC<Web3BookingButtonProps> = ({
  daybedType,
  dateString,
  onSuccess,
}) => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending, isSuccess, data: txHash, error } = useWriteContract();
  const { tf } = useLang();
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Read required deposit from contract
  const { data: depositWei } = useReadContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: 'calculateDeposit',
    args: address ? [address, daybedType, '0x0000000000000000000000000000000000000000'] : undefined,
    query: { enabled: !!address },
  });

  const handleBooking = async () => {
    if (!depositWei || !dateString) return;

    const visitTimestamp = BigInt(Math.floor(new Date(dateString).getTime() / 1000));

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookingEscrow,
        abi: BOOKING_ESCROW_ABI,
        functionName: 'createBooking',
        args: [daybedType, visitTimestamp, '0x0000000000000000000000000000000000000000'],
        value: depositWei,
      });

      // On success, notify parent
      if (onSuccess) {
        onSuccess(1, hash); // bookingId will be read from tx receipt in production
      }
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-3">
        <ConnectButton
          label={tf({
            id: 'Hubungkan Wallet untuk Booking',
            en: 'Connect Wallet to Book',
            ru: 'Подключите кошелёк для бронирования',
            ko: '예약을 위해 지갑을 연결하세요',
          })}
        />
      </div>
    );
  }

  const daybedName = DAYBED_TYPES[daybedType]?.name || 'Daybed';
  const depositFormatted = depositWei ? formatEther(depositWei) : '...';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Deposit info */}
      <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/5 border border-white/10">
        <span className="text-slate-400">
          {tf({ id: 'Deposit Escrow', en: 'Escrow Deposit', ru: 'Депозит', ko: '에스크로 보증금' })} ({daybedName})
        </span>
        <span className="text-amber-300 font-bold">{depositFormatted} MON</span>
      </div>

      {/* Book button */}
      <Button
        variant="luxury"
        size="lg"
        disabled={isPending || !depositWei}
        onClick={handleBooking}
        className="w-full rounded-full py-4 gold-gradient text-black font-bold text-base"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {tf({ id: 'Konfirmasi di Monad...', en: 'Confirming on Monad...', ru: 'Подтверждение в Monad...', ko: 'Monad에서 확인 중...' })}
          </span>
        ) : (
          tf({
            id: `Bayar ${depositFormatted} MON`,
            en: `Pay ${depositFormatted} MON`,
            ru: `Оплатить ${depositFormatted} MON`,
            ko: `${depositFormatted} MON 지불`,
          })
        )}
      </Button>

      {/* Success message */}
      {isSuccess && txHash && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle className="h-4 w-4" />
            {tf({
              id: 'Reservasi berhasil di-escrow di Monad Testnet!',
              en: 'Reservation escrowed on Monad Testnet!',
              ru: 'Бронирование заэскроуировано в Monad Testnet!',
              ko: 'Monad 테스트넷에서 예약이 에스크로되었습니다!',
            })}
          </div>
          <a
            href={`https://testnet.monadexplorer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-rose-400 text-xs p-3 rounded-xl bg-rose-400/10 border border-rose-400/20">
          Error: {error.message?.slice(0, 120)}
        </div>
      )}
    </div>
  );
};
