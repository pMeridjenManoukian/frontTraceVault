'use client';

import { useState } from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
  hardhat,
  localhost
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'TraceVault',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia, localhost, hardhat, mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // Désactiver SSR pour éviter les erreurs localStorage
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Créer le QueryClient dans le composant pour éviter les problèmes SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
