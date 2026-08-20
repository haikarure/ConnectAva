# PRD: ConnectAva (White Rock Bali) — Full Web3 & AI Integration Specification

> **Target Audience:** Developers, Web3 Engineers, AI Engineers, and AI Agents with **zero prior Web3 experience**.  
> **Status:** Final MVP Architecture  
> **Network:** Monad Testnet (Chain ID: 10143)  
> **Document Purpose:** Provide a 100% complete, hardcoded, copy-paste-ready blueprint containing smart contracts, deployment scripts, frontend components, and AI agent tools. No code guesswork required.

---

## 1. Executive Summary & Architecture Map

ConnectAva is the official digital experience for White Rock Beach Club (Melasti Beach, Uluwatu, Bali). This PRD upgrades the application from a static showcase into a **fully decentralized, Web3-native reservation & membership system**, powered by an **EIP-712 AI Voice Agent Concierge ("Sarah")**.

### Architecture Overview

```
 [ Guest / Browser ]
        │
        ├── 1. Connect Wallet (Wagmi v2 / Viem / RainbowKit)
        ├── 2. Mint Membership NFT (WhiteRockPass.sol on Monad)
        ├── 3. Deposit Daybed Escrow (BookingEscrow.sol on Monad)
        └── 4. Voice Agent Channel (LiveKit WebRTC + DataChannel)
                 │
                 ▼
 [ LiveKit Agent "Sarah" ] (Node.js / Python Backend)
        │
        ├── Reads On-Chain State via Viem Public Client (NFT Tier, Discounts)
        ├── Generates EIP-712 Booking Intent Payload
        └── Sends Payload via DataChannel to Frontend for User Signature
                 │
                 ▼
 [ Monad Testnet Smart Contracts ]
        ├── WhiteRockPass.sol (ERC-721 Tiered Membership)
        └── BookingEscrow.sol (Escrow, Refund 24h, EIP-712 Intent Execution)
```

---

## 2. Monad Testnet Constants & Network Parameters

All components **MUST** use these hardcoded network configuration parameters:

| Parameter | Value |
|---|---|
| **Network Name** | Monad Testnet |
| **Chain ID** | `10143` (Hex: `0x279f`) |
| **RPC URL** | `https://testnet-rpc.monad.xyz` |
| **Native Currency** | MON (18 decimals) |
| **Block Explorer** | `https://testnet.monadexplorer.com` |
| **Block Time** | ~300ms |
| **Mock ERC-20 Token (USDC.e)** | `0xf817257ebe728e44f7a68579efd238b1641040ed` (Or newly deployed mock) |

---

## 3. Complete Smart Contracts (Hardcoded Solidity ^0.8.20)

### 3.1 Contract 1: `WhiteRockPass.sol`
*NFT Membership (ERC-721 Enumerable). Defines 3 tiers (Lagoon, VIP Cabana, Party Suite) and provides on-chain discount lookup for holders.*

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WhiteRockPass
 * @notice Tiered NFT Membership Pass for White Rock Beach Club, Melasti Bali.
 */
contract WhiteRockPass is ERC721Enumerable, Ownable {
    using Strings for uint256;

    enum PassTier { LAGOON, VIP_CABANA, PARTY_SUITE }

    struct TierConfig {
        uint256 price;          // Price in wei (MON)
        uint16 discountBps;     // Discount in Basis Points (500 = 5%, 1000 = 10%, 2000 = 20%)
        uint32 maxSupply;       // Supply cap for tier
        uint32 currentSupply;   // Current minted supply
        bool active;            // Tier availability
    }

    mapping(PassTier => TierConfig) public tierConfigs;
    mapping(uint256 => PassTier) public tokenTiers;
    string private _baseTokenURI;

    event PassMinted(address indexed minter, uint256 indexed tokenId, PassTier tier);
    event TierConfigUpdated(PassTier indexed tier, uint256 price, uint16 discountBps, uint32 maxSupply, bool active);

    constructor(string memory baseURI, address initialOwner)
        ERC721("White Rock VIP Pass", "WRPASS")
        Ownable(initialOwner)
    {
        _baseTokenURI = baseURI;

        // Tier 0: Lagoon Pass — 0.1 MON, 5% Discount, 500 Cap
        tierConfigs[PassTier.LAGOON] = TierConfig({
            price: 0.1 ether,
            discountBps: 500,
            maxSupply: 500,
            currentSupply: 0,
            active: true
        });

        // Tier 1: VIP Cabana Pass — 0.5 MON, 10% Discount, 150 Cap
        tierConfigs[PassTier.VIP_CABANA] = TierConfig({
            price: 0.5 ether,
            discountBps: 1000,
            maxSupply: 150,
            currentSupply: 0,
            active: true
        });

        // Tier 2: Party Suite Pass — 1.5 MON, 20% Discount, 50 Cap
        tierConfigs[PassTier.PARTY_SUITE] = TierConfig({
            price: 1.5 ether,
            discountBps: 2000,
            maxSupply: 50,
            currentSupply: 0,
            active: true
        });
    }

    /**
     * @notice Mint a membership pass for a specified tier.
     * @param tier PassTier enum (0 = LAGOON, 1 = VIP_CABANA, 2 = PARTY_SUITE)
     */
    function mintPass(PassTier tier) external payable {
        TierConfig storage config = tierConfigs[tier];
        require(config.active, "Tier is not active");
        require(config.currentSupply < config.maxSupply, "Tier sold out");
        require(msg.value >= config.price, "Insufficient MON sent");

        config.currentSupply++;
        uint256 tokenId = totalSupply() + 1;
        tokenTiers[tokenId] = tier;

        _safeMint(msg.sender, tokenId);
        emit PassMinted(msg.sender, tokenId, tier);

        // Refund excess MON
        if (msg.value > config.price) {
            payable(msg.sender).transfer(msg.value - config.price);
        }
    }

    /**
     * @notice Returns the highest discount BPS owned by a user across all their passes.
     * @param user Address of the guest wallet.
     */
    function getDiscountBpsForUser(address user) external view returns (uint16 maxDiscount) {
        uint256 balance = balanceOf(user);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            PassTier tier = tokenTiers[tokenId];
            uint16 bps = tierConfigs[tier].discountBps;
            if (bps > maxDiscount) {
                maxDiscount = bps;
            }
        }
        return maxDiscount;
    }

    function setTierConfig(
        PassTier tier,
        uint256 price,
        uint16 discountBps,
        uint32 maxSupply,
        bool active
    ) external onlyOwner {
        tierConfigs[tier] = TierConfig({
            price: price,
            discountBps: discountBps,
            maxSupply: maxSupply,
            currentSupply: tierConfigs[tier].currentSupply,
            active: active
        });
        emit TierConfigUpdated(tier, price, discountBps, maxSupply, active);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

---

### 3.2 Contract 2: `BookingEscrow.sol`
*Escrow contract for Daybed reservations. Supports direct native deposit and off-chain EIP-712 intent execution generated by AI Agent Sarah.*

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IWhiteRockPass {
    function getDiscountBpsForUser(address user) external view returns (uint16);
}

/**
 * @title BookingEscrow
 * @notice Handles daybed reservation deposits, 24-hour cancellation refunds, and AI Agent EIP-712 intent execution.
 */
contract BookingEscrow is ReentrancyGuard, Ownable, EIP712 {
    using SafeERC20 for IERC20;

    bytes32 public constant BOOKING_INTENT_TYPEHASH = keccak256(
        "BookingIntent(address guest,uint8 daybedType,uint64 visitTimestamp,uint256 depositAmount,address paymentToken,uint256 nonce,uint256 deadline)"
    );

    struct Booking {
        uint256 bookingId;
        address guest;
        uint8 daybedType;     // 0: Lagoon, 1: VIP Cabana, 2: Party Suite, 3: Single Sofa
        uint64 visitTimestamp;// Unix timestamp for visit date (00:00 UTC)
        uint256 depositAmount;// Deposited MON or Token amount in wei
        address paymentToken; // address(0) for native MON, or ERC20 address
        bool checkedIn;
        bool cancelled;
        bool settled;
    }

    IWhiteRockPass public immutable passContract;
    uint256 public nextBookingId = 1;

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookingIds;
    mapping(address => uint256) public nonces;

    // Base minimum deposit in MON for daybed types: [Lagoon, VIP Cabana, Party Suite, Single Sofa]
    uint256[4] public baseMinSpendMON = [
        0.05 ether,  // Lagoon Bed
        0.30 ether,  // VIP Cabana
        0.50 ether,  // Party Executive Suite
        0.02 ether   // Single Sofa
    ];

    event BookingCreated(
        uint256 indexed bookingId,
        address indexed guest,
        uint8 daybedType,
        uint64 visitTimestamp,
        uint256 depositAmount,
        address paymentToken
    );
    event CheckedIn(uint256 indexed bookingId, address indexed guest, uint256 timestamp);
    event BookingCancelled(uint256 indexed bookingId, address indexed guest, uint256 refundAmount);
    event BookingSettled(uint256 indexed bookingId, address venueOwner, uint256 amount);

    error InvalidDeposit();
    error DeadlineExpired();
    error InvalidSignature();
    error BookingNotFound();
    error AlreadyProcessed();
    error CancellationPeriodExpired();
    error NotGuest();

    constructor(address _passContract, address initialOwner)
        EIP712("WhiteRockBooking", "1")
        Ownable(initialOwner)
    {
        passContract = IWhiteRockPass(_passContract);
    }

    /**
     * @notice Calculates required deposit after inspecting user's NFT membership discount on-chain.
     */
    function calculateDeposit(address guest, uint8 daybedType) public view returns (uint256) {
        require(daybedType < 4, "Invalid daybed type");
        uint256 baseAmount = baseMinSpendMON[daybedType];

        if (address(passContract) != address(0)) {
            uint16 discountBps = passContract.getDiscountBpsForUser(guest);
            if (discountBps > 0) {
                uint256 discount = (baseAmount * discountBps) / 10000;
                return baseAmount - discount;
            }
        }
        return baseAmount;
    }

    /**
     * @notice Direct booking deposit in MON.
     */
    function createBooking(uint8 daybedType, uint64 visitTimestamp) external payable nonReentrant returns (uint256) {
        uint256 requiredDeposit = calculateDeposit(msg.sender, daybedType);
        if (msg.value < requiredDeposit) revert InvalidDeposit();

        uint256 bookingId = nextBookingId++;
        bookings[bookingId] = Booking({
            bookingId: bookingId,
            guest: msg.sender,
            daybedType: daybedType,
            visitTimestamp: visitTimestamp,
            depositAmount: requiredDeposit,
            paymentToken: address(0),
            checkedIn: false,
            cancelled: false,
            settled: false
        });

        userBookingIds[msg.sender].push(bookingId);
        emit BookingCreated(bookingId, msg.sender, daybedType, visitTimestamp, requiredDeposit, address(0));

        // Refund excess payment
        if (msg.value > requiredDeposit) {
            payable(msg.sender).transfer(msg.value - requiredDeposit);
        }

        return bookingId;
    }

    /**
     * @notice Execute booking via user EIP-712 signed intent (Generated by AI Sarah).
     */
    function createBookingWithSignature(
        address guest,
        uint8 daybedType,
        uint64 visitTimestamp,
        uint256 depositAmount,
        address paymentToken,
        uint256 deadline,
        bytes calldata signature
    ) external payable nonReentrant returns (uint256) {
        if (block.timestamp > deadline) revert DeadlineExpired();

        bytes32 structHash = keccak256(
            abi.encode(
                BOOKING_INTENT_TYPEHASH,
                guest,
                daybedType,
                visitTimestamp,
                depositAmount,
                paymentToken,
                nonces[guest]++,
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        if (signer != guest) revert InvalidSignature();

        if (paymentToken == address(0)) {
            if (msg.value < depositAmount) revert InvalidDeposit();
        } else {
            IERC20(paymentToken).safeTransferFrom(guest, address(this), depositAmount);
        }

        uint256 bookingId = nextBookingId++;
        bookings[bookingId] = Booking({
            bookingId: bookingId,
            guest: guest,
            daybedType: daybedType,
            visitTimestamp: visitTimestamp,
            depositAmount: depositAmount,
            paymentToken: paymentToken,
            checkedIn: false,
            cancelled: false,
            settled: false
        });

        userBookingIds[guest].push(bookingId);
        emit BookingCreated(bookingId, guest, daybedType, visitTimestamp, depositAmount, paymentToken);

        if (paymentToken == address(0) && msg.value > depositAmount) {
            payable(msg.sender).transfer(msg.value - depositAmount);
        }

        return bookingId;
    }

    /**
     * @notice Guest can cancel and get 100% refund up to 24 hours prior to visit date.
     */
    function cancelBooking(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        if (b.bookingId == 0) revert BookingNotFound();
        if (b.guest != msg.sender) revert NotGuest();
        if (b.checkedIn || b.cancelled || b.settled) revert AlreadyProcessed();

        if (block.timestamp + 24 hours > b.visitTimestamp) revert CancellationPeriodExpired();

        b.cancelled = true;

        if (b.paymentToken == address(0)) {
            payable(b.guest).transfer(b.depositAmount);
        } else {
            IERC20(b.paymentToken).safeTransfer(b.guest, b.depositAmount);
        }

        emit BookingCancelled(bookingId, b.guest, b.depositAmount);
    }

    /**
     * @notice Admin / Venue Staff triggers check-in on guest arrival, releasing escrow funds to venue.
     */
    function checkIn(uint256 bookingId) external onlyOwner {
        Booking storage b = bookings[bookingId];
        if (b.bookingId == 0) revert BookingNotFound();
        if (b.cancelled || b.settled) revert AlreadyProcessed();

        b.checkedIn = true;
        b.settled = true;

        if (b.paymentToken == address(0)) {
            payable(owner()).transfer(b.depositAmount);
        } else {
            IERC20(b.paymentToken).safeTransfer(owner(), b.depositAmount);
        }

        emit CheckedIn(bookingId, b.guest, block.timestamp);
        emit BookingSettled(bookingId, owner(), b.depositAmount);
    }

    function getUserBookings(address user) external view returns (Booking[] memory) {
        uint256[] memory ids = userBookingIds[user];
        Booking[] memory result = new Booking[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = bookings[ids[i]];
        }
        return result;
    }

    function setBaseMinSpend(uint8 daybedType, uint256 amountMON) external onlyOwner {
        require(daybedType < 4, "Invalid daybed type");
        baseMinSpendMON[daybedType] = amountMON;
    }
}
```

---

## 4. Deployment Automation (Foundry Script & CLI Commands)

### 4.1 Foundry Deployment Script: `script/Deploy.s.sol`

Save this file in the `contracts/script/Deploy.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/WhiteRockPass.sol";
import "../src/BookingEscrow.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts to Monad Testnet with deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy NFT Pass Contract
        WhiteRockPass pass = new WhiteRockPass("https://api.whiterockbali.com/metadata/", deployer);
        console.log("WhiteRockPass deployed to:", address(pass));

        // 2. Deploy Booking Escrow Contract
        BookingEscrow escrow = new BookingEscrow(address(pass), deployer);
        console.log("BookingEscrow deployed to:", address(escrow));

        vm.stopBroadcast();
    }
}
```

### 4.2 Step-by-Step CLI Setup & Deployment Commands

Execute these commands in your terminal to deploy to Monad Testnet:

```bash
# Step 1: Create contracts directory inside connectava repo
cd /home/pupulion/connectava/ConnectAva
mkdir -p contracts && cd contracts

# Step 2: Initialize Foundry
forge init --force

# Step 3: Install OpenZeppelin Contracts v5.0
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-commit

# Step 4: Create foundry.toml configuration
cat << 'EOF' > foundry.toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
monad_testnet = "https://testnet-rpc.monad.xyz"
EOF

# Step 5: Copy Solidity files into contracts/src/
# (Copy WhiteRockPass.sol and BookingEscrow.sol into contracts/src/)

# Step 6: Set Environment Variable (Your Monad Testnet Private Key)
export PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Step 7: Compile and Deploy to Monad Testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url monad_testnet \
  --broadcast \
  --legacy \
  -vvvv
```

---

## 5. Frontend Integration Manual (Vite + React + Wagmi v2 + Viem)

### 5.1 Package Installation

In `/home/pupulion/connectava/ConnectAva/package.json`, install Web3 dependencies:

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

---

### 5.2 Web3 Configuration: `src/web3/config.ts`

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'White Rock Bali Concierge',
  projectId: 'a059d997a3ff4878a8bc89ef3c242337', // Public WalletConnect ID
  chains: [monadTestnet],
  ssr: false,
});
```

---

### 5.3 Contract ABI & Addresses: `src/web3/contracts.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  whiteRockPass: '0x0000000000000000000000000000000000000000', // REPLACE AFTER FORGE DEPLOY
  bookingEscrow: '0x0000000000000000000000000000000000000000', // REPLACE AFTER FORGE DEPLOY
} as const;

export const WHITE_ROCK_PASS_ABI = [
  {
    inputs: [{ internalType: 'uint8', name: 'tier', type: 'uint8' }],
    name: 'mintPass',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getDiscountBpsForUser',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const BOOKING_ESCROW_ABI = [
  {
    inputs: [
      { internalType: 'uint8', name: 'daybedType', type: 'uint8' },
      { internalType: 'uint64', name: 'visitTimestamp', type: 'uint64' },
    ],
    name: 'createBooking',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'guest', type: 'address' },
      { internalType: 'uint8', name: 'daybedType', type: 'uint8' },
    ],
    name: 'calculateDeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserBookings',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'bookingId', type: 'uint256' },
          { internalType: 'address', name: 'guest', type: 'address' },
          { internalType: 'uint8', name: 'daybedType', type: 'uint8' },
          { internalType: 'uint64', name: 'visitTimestamp', type: 'uint64' },
          { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
          { internalType: 'address', name: 'paymentToken', type: 'address' },
          { internalType: 'bool', name: 'checkedIn', type: 'bool' },
          { internalType: 'bool', name: 'cancelled', type: 'bool' },
          { internalType: 'bool', name: 'settled', type: 'bool' },
        ],
        internalType: 'struct BookingEscrow.Booking[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
```

---

### 5.4 App Integration Wrapper: `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './web3/config';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

---

### 5.5 React Daybed Reservation Component with Monad Escrow Deposit

Create `src/components/web3/Web3BookingButton.tsx`:

```tsx
import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI } from '@/web3/contracts';
import { Button } from '@/components/ui/button';

interface Web3BookingButtonProps {
  daybedType: number; // 0: Lagoon, 1: VIP Cabana, 2: Party Suite, 3: Single Sofa
  dateString: string; // "YYYY-MM-DD"
}

export const Web3BookingButton: React.FC<Web3BookingButtonProps> = ({ daybedType, dateString }) => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Read required deposit from contract
  const { data: depositWei } = useReadContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: 'calculateDeposit',
    args: address ? [address, daybedType] : undefined,
  });

  const handleBooking = () => {
    if (!depositWei) return;

    const visitTimestamp = BigInt(Math.floor(new Date(dateString).getTime() / 1000));

    writeContract({
      address: CONTRACT_ADDRESSES.bookingEscrow,
      abi: BOOKING_ESCROW_ABI,
      functionName: 'createBooking',
      args: [daybedType, visitTimestamp],
      value: depositWei,
    });
  };

  if (!isConnected) {
    return <ConnectButton label="Connect Wallet to Book" />;
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <Button
        variant="luxury"
        size="lg"
        disabled={isPending || !depositWei}
        onClick={handleBooking}
        className="w-full rounded-full py-4 gold-gradient text-black font-bold"
      >
        {isPending
          ? 'Confirming on Monad...'
          : `Deposit ${depositWei ? formatEther(depositWei) : '...'} MON`}
      </Button>

      {isSuccess && (
        <p className="text-emerald-400 text-xs font-semibold">
          ✓ Reservation Escrowed on Monad Testnet!
        </p>
      )}
      {error && <p className="text-rose-400 text-xs">Error: {error.message}</p>}
    </div>
  );
};
```

---

## 6. AI Agent "Sarah" EIP-712 Intent Tooling (Node.js / Viem)

When the user asks Sarah via voice: *"Sarah, book me a VIP Cabana for tomorrow"*, Sarah generates an EIP-712 typed signature payload and pushes it to the browser via LiveKit DataChannel.

### 6.1 Agent Server Tool Implementation: `agent/tools/web3BookingTool.ts`

```typescript
import { createPublicClient, http, parseEther } from 'viem';
import { monadTestnet } from '../../src/web3/config';
import { CONTRACT_ADDRESSES, WHITE_ROCK_PASS_ABI, BOOKING_ESCROW_ABI } from '../../src/web3/contracts';

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

export async function prepareAgentBookingIntent(params: {
  guestAddress: `0x${string}`;
  daybedType: number; // 0..3
  dateString: string;
}) {
  const { guestAddress, daybedType, dateString } = params;

  // 1. Read on-chain discount for user from WhiteRockPass contract
  const discountBps = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.whiteRockPass,
    abi: WHITE_ROCK_PASS_ABI,
    functionName: 'getDiscountBpsForUser',
    args: [guestAddress],
  });

  // 2. Read required deposit from BookingEscrow contract
  const depositAmountWei = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: 'calculateDeposit',
    args: [guestAddress, daybedType],
  });

  const visitTimestamp = BigInt(Math.floor(new Date(dateString).getTime() / 1000));
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour validity

  // 3. Construct EIP-712 Typed Data Payload
  const domain = {
    name: 'WhiteRockBooking',
    version: '1',
    chainId: 10143,
    verifyingContract: CONTRACT_ADDRESSES.bookingEscrow,
  } as const;

  const types = {
    BookingIntent: [
      { name: 'guest', type: 'address' },
      { name: 'daybedType', type: 'uint8' },
      { name: 'visitTimestamp', type: 'uint64' },
      { name: 'depositAmount', type: 'uint256' },
      { name: 'paymentToken', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  } as const;

  const message = {
    guest: guestAddress,
    daybedType,
    visitTimestamp,
    depositAmount: depositAmountWei,
    paymentToken: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    nonce: 0n, // Fetch nonces[guestAddress] from contract in production
    deadline,
  };

  return {
    action: 'sign_booking_intent',
    discountAppliedPercent: Number(discountBps) / 100,
    domain,
    types,
    message,
  };
}
```

---

### 6.2 Frontend DataChannel Listener & EIP-712 Auto-Signer

Add this hook inside `src/components/ai_avatar/AvatarVoiceAgent.jsx` to receive Sarah's intent payload and prompt the user's wallet:

```javascript
import { useSignTypedData, useWriteContract } from 'wagmi';
import { BOOKING_ESCROW_ABI, CONTRACT_ADDRESSES } from '@/web3/contracts';

// Inside AvatarVoiceAgent component:
const { signTypedDataAsync } = useSignTypedData();
const { writeContract } = useWriteContract();

useDataChannel("navigation", async (data) => {
  try {
    const decoded = new TextDecoder().decode(data.payload);
    const payload = JSON.parse(decoded);

    if (payload.action === "sign_booking_intent") {
      console.log("[Sarah AI] EIP-712 Booking intent received:", payload);

      // Prompt user's MetaMask/Wallet to sign EIP-712 intent
      const signature = await signTypedDataAsync({
        domain: payload.domain,
        types: payload.types,
        primaryType: 'BookingIntent',
        message: payload.message,
      });

      console.log("[Sarah AI] User signed intent:", signature);

      // Submit on-chain via createBookingWithSignature
      writeContract({
        address: CONTRACT_ADDRESSES.bookingEscrow,
        abi: BOOKING_ESCROW_ABI,
        functionName: 'createBookingWithSignature',
        args: [
          payload.message.guest,
          payload.message.daybedType,
          payload.message.visitTimestamp,
          payload.message.depositAmount,
          payload.message.paymentToken,
          payload.message.deadline,
          signature,
        ],
        value: BigInt(payload.message.depositAmount),
      });
    }
  } catch (err) {
    console.error("Failed to execute EIP-712 booking intent:", err);
  }
});
```

---

## 7. Venue VIP Gate Verification (Staff QR Check-In)

### 7.1 QR Code Generation Format

When a booking succeeds, the frontend displays a QR code containing an HMAC-signed JSON payload:

```json
{
  "bookingId": 42,
  "guest": "0x1234...5678",
  "visitTimestamp": 1787184000,
  "sig": "0xabc..."
}
```

### 7.2 Venue Staff Gate Terminal Function

Staff scan the QR code with their mobile device logged in as contract owner/admin:

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { monadTestnet } from '@/web3/config';
import { CONTRACT_ADDRESSES, BOOKING_ESCROW_ABI } from '@/web3/contracts';

const staffAccount = privateKeyToAccount(process.env.STAFF_PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account: staffAccount,
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

export async function processGuestCheckIn(bookingId: number) {
  console.log(`Verifying and settling Booking ID #${bookingId} on Monad...`);

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESSES.bookingEscrow,
    abi: BOOKING_ESCROW_ABI,
    functionName: 'checkIn',
    args: [BigInt(bookingId)],
  });

  console.log(`Check-in complete! Escrow released to venue wallet. Tx: ${hash}`);
  return hash;
}
```

---

## 8. Non-Web3 Developer / AI Agent Step-by-Step Execution Guide

Follow this sequential checklist to execute this PRD from zero to full deployment:

1. **Deploy Smart Contracts:**
   - Go to `/home/pupulion/connectava/ConnectAva/contracts`.
   - Run `forge script script/Deploy.s.sol:DeployScript --rpc-url https://testnet-rpc.monad.xyz --broadcast --legacy`.
   - Copy the deployed contract addresses from terminal output.

2. **Update Frontend Addresses:**
   - Open `/home/pupulion/connectava/ConnectAva/src/web3/contracts.ts`.
   - Paste the contract addresses into `CONTRACT_ADDRESSES.whiteRockPass` and `CONTRACT_ADDRESSES.bookingEscrow`.

3. **Wrap Frontend Provider:**
   - Update `src/main.tsx` with RainbowKit and Wagmi providers as shown in Section 5.4.

4. **Add Web3 Booking Button:**
   - Import `Web3BookingButton` into `src/pages/BookingConfirmation.tsx` or `src/pages/DaybedsSuites.tsx`.

5. **Connect Sarah Agent Tool:**
   - Add EIP-712 DataChannel listener to `AvatarVoiceAgent.jsx` as shown in Section 6.2.

6. **Verify Monad Testnet Transactions:**
   - Test minting a pass and placing a reservation. Verify tx hashes on `https://testnet.monadexplorer.com`.
