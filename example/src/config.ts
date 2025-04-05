import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  pollingInterval: 1000,
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

export const client = wagmiConfig.getClient()
export type Client = typeof client
