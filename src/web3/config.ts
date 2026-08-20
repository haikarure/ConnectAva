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
