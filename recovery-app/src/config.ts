import { QueryClient } from '@tanstack/react-query';
import { createWalletClient, defineChain, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { chainConfig } from 'viem/op-stack';
import { http, createConfig } from 'wagmi';

export const queryClient = new QueryClient();

const sourceId = 11_155_111;

export const zircuitGarfieldTestnet = defineChain({
  ...chainConfig,
  id: 48898,
  name: 'Zircuit Garfield Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://garfield-testnet.zircuit.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zircuit Garfield Testnet Explorer',
      url: 'https://explorer.garfield-testnet.zircuit.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
    l2OutputOracle: {
      [sourceId]: {
        address: '0xd69D3AC5CA686cCF94b258291772bc520FEAf211',
      },
    },
    portal: {
      [sourceId]: {
        address: '0x4E21A71Ac3F7607Da5c06153A17B1DD20E702c21',
      },
    },
    l1StandardBridge: {
      [sourceId]: {
        address: '0x87a7E2bCA9E35BA49282E832a28A6023904460D8',
      },
    },
  },
  testnet: true,
});

// transaction sender (kinda like a bundler)
const privateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`;
const rpcUrl =
  'https://eth-sepolia.g.alchemy.com/v2/6X1BLvHgnErewqwwnN_GRkznU64d1A6m';
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
