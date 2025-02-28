// config/index.tsx

// Get projectId from the environment variable
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Continue with your setup
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, baseSepolia } from '@reown/appkit/networks';

// Make sure baseSepolia is in the networks array
export const networks = [mainnet, arbitrum, baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;