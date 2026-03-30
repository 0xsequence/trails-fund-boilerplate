import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { http } from 'wagmi'

import { createConfig, WagmiProvider } from '@privy-io/wagmi'
import {type PrivyClientConfig, PrivyProvider} from '@privy-io/react-auth';

const config = createConfig({
  chains: [mainnet, arbitrum, polygon], 
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  appearance: {
      theme: "dark",
      accentColor: "#676FFF",
      walletChainType: "ethereum-only",
  },
  defaultChain: mainnet,
  supportedChains: [mainnet, arbitrum, polygon],
  mfa: {
      noPromptOnMfaRequired: false,
  },
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID!}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
            <App />
        </WagmiProvider>
      </QueryClientProvider>
  </PrivyProvider>
</StrictMode>
)
