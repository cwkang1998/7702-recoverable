import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { createWalletClient } from 'viem'
import { sepolia } from 'wagmi/chains'
import { privateKeyToAccount } from 'viem/accounts'

export const queryClient = new QueryClient()

// transaction sender (kinda like a bundler)
const privateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`
const account = privateKeyToAccount(privateKey)
export const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
})

export const wagmiConfig = createConfig({
  chains: [sepolia],
  pollingInterval: 1000,
  transports: {
    [sepolia.id]: http(),
  },
})

export type Client = typeof client
