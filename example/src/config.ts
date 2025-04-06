import { QueryClient } from '@tanstack/react-query';
import { createWalletClient, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip7702Actions } from 'viem/experimental';
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const queryClient = new QueryClient();

// transaction sender (kinda like a bundler)
const privateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`;
const rpcUrl = import.meta.env.VITE_RPC_URL;
const account = privateKeyToAccount(privateKey);
export const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
})
  .extend(publicActions)
  .extend(eip7702Actions());

export const wagmiConfig = createConfig({
  chains: [sepolia],
  pollingInterval: 1000,
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
});

export type Client = typeof client;
