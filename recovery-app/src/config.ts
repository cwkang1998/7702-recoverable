import { QueryClient } from '@tanstack/react-query';
import { createWalletClient, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { http, createConfig } from 'wagmi';
import { sepolia } from 'viem/chains';

export const queryClient = new QueryClient();

// transaction sender (kinda like a bundler)
const privateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`;
const rpcUrl = "https://eth-sepolia.g.alchemy.com/v2/6X1BLvHgnErewqwwnN_GRkznU64d1A6m";
const account = privateKeyToAccount(privateKey);

export const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
}).extend(publicActions);

export const wagmiConfig = createConfig({
  chains: [sepolia],
  pollingInterval: 1000,
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
});
export type Client = typeof client;