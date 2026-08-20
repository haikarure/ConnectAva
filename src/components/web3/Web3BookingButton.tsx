import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI, DAYBED_TYPES } from "@/web3/contracts";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useLang } from "@/lib/i18n";

// MockUSDT ABI (just approve)
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "account", type: "address" },
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface Web3BookingButtonProps {
  daybedType: number;
  dateString: string;
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
  const [step, setStep] = useState<"idle" | "approving" | "booking">("idle");

  // Read required deposit in USDT (6 decimals)
  const { data: depositUsdt } = useReadContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: "calculateDeposit",
    args: address ? [address, daybedType, CONTRACT_ADDRESSES.mockUSDT] : undefined,
    query: { enabled: !!address },
  });

  // Read user USDT balance
  const { data: usdtBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.mockUSDT,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleBooking = async () => {
    if (!depositUsdt || !dateString || !address) return;

    setStep("approving");
    try {
      // Step 1: Approve USDT to BookingEscrow
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.mockUSDT,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.bookingEscrow, depositUsdt],
      });

      setStep("booking");

      // Step 2: Create booking with USDT
      const visitTimestamp = BigInt(Math.floor(new Date(dateString).getTime() / 1000));
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookingEscrow,
        abi: BOOKING_ESCROW_ABI,
        functionName: "createBooking",
        args: [daybedType, visitTimestamp, CONTRACT_ADDRESSES.mockUSDT],
        value: 0n, // No native MON needed for USDT payments
      });

      if (onSuccess) {
        onSuccess(1, hash);
      }
    } catch (err) {
      console.error("Booking failed:", err);
    }
    setStep("idle");
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-3">
        <ConnectButton
          label={tf({
            id: "Hubungkan Wallet untuk Booking",
            en: "Connect Wallet to Book",
            ru: "Подключите кошелёк для бронирования",
            ko: "예약을 위해 지갑을 연결하세요",
          })}
        />
      </div>
    );
  }

  const daybedName = DAYBED_TYPES[daybedType]?.name || "Daybed";
  const depositFormatted = depositUsdt ? formatUnits(depositUsdt, 6) : "...";
  const balanceFormatted = usdtBalance ? formatUnits(usdtBalance, 6) : "0";
  const hasEnoughBalance = usdtBalance !== undefined && depositUsdt !== undefined && usdtBalance >= depositUsdt;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Deposit info */}
      <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/5 border border-white/10">
        <span className="text-slate-400">
          {tf({ id: "Deposit Escrow", en: "Escrow Deposit", ru: "Депозит", ko: "에스크로 보증금" })} ({daybedName})
        </span>
        <span className="text-amber-300 font-bold">{depositFormatted} USDT</span>
      </div>

      {/* Balance info */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-slate-500">Your USDT Balance</span>
        <span className={hasEnoughBalance ? "text-emerald-400" : "text-rose-400"}>
          {balanceFormatted} USDT
        </span>
      </div>

      {/* Insufficient balance warning */}
      {!hasEnoughBalance && depositUsdt && (
        <div className="text-xs text-rose-400 p-2 rounded-lg bg-rose-400/10 border border-rose-400/20">
          {tf({
            id: "USDT tidak cukup. Klaim gratis dari faucet di atas.",
            en: "Insufficient USDT. Claim free from faucet above.",
            ru: "Недостаточно USDT. Получите бесплатно из faucet выше.",
            ko: "USDT 부족. 위 faucet에서 무료로 받으세요.",
          })}
        </div>
      )}

      {/* Book button */}
      <Button
        variant="luxury"
        size="lg"
        disabled={isPending || !depositUsdt || !hasEnoughBalance}
        onClick={handleBooking}
        className="w-full rounded-full py-4 gold-gradient text-black font-bold text-base"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {step === "approving"
              ? tf({ id: "Approving USDT...", en: "Approving USDT...", ru: "Одобрение USDT...", ko: "USDT 승인 중..." })
              : tf({ id: "Booking di Monad...", en: "Booking on Monad...", ru: "Бронирование в Monad...", ko: "Monad에서 예약 중..." })
            }
          </span>
        ) : (
          tf({
            id: `Bayar ${depositFormatted} USDT`,
            en: `Pay ${depositFormatted} USDT`,
            ru: `Оплатить ${depositFormatted} USDT`,
            ko: `${depositFormatted} USDT 지불`,
          })
        )}
      </Button>

      {/* Success message */}
      {isSuccess && txHash && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle className="h-4 w-4" />
            {tf({
              id: "Reservasi berhasil di-escrow di Monad Testnet!",
              en: "Reservation escrowed on Monad Testnet!",
              ru: "Бронирование заэскроуировано в Monad Testnet!",
              ko: "Monad 테스트넷에서 예약이 에스크로되었습니다!",
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
