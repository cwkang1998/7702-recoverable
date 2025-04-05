import { http, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores, zircuitGarfieldTestnet } from 'viem/chains';
import { serverConfig } from '../server-config.js';

const celoClient = createWalletClient({
  account: privateKeyToAccount(serverConfig.privateKey),
  chain: celoAlfajores,
  transport: http(),
});

const zircuitClient = createWalletClient({
  account: privateKeyToAccount(serverConfig.privateKey),
  chain: zircuitGarfieldTestnet,
  transport: http(),
});

export default { celoClient, zircuitClient };
