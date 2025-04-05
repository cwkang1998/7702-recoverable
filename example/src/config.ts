import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [sepolia],
  pollingInterval: 1000,
  transports: {
    [sepolia.id]: http(),
  },
})

export const client = wagmiConfig.getClient()
export type Client = typeof client
