import { http, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores, zircuitGarfieldTestnet } from 'viem/chains';
import { serverConfig } from '../server-config.js';

export const celoClient = createWalletClient({
  account: privateKeyToAccount(serverConfig.privateKey),
  chain: celoAlfajores,
  transport: http(),
});

export const zircuitClient = createWalletClient({
  account: privateKeyToAccount(serverConfig.privateKey),
  chain: zircuitGarfieldTestnet,
  transport: http(),
});
