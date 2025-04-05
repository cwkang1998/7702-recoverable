import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions';
import { serverConfig } from '../server-config.js';
import ExperimentDelegation from './ExperimentDelegation.abi.json' assert {
  type: 'json',
};
import { zircuitClient } from './client.js';

export const generate30DaysTimestamp = () => {
  return Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
};

export const recoverAccountCall = async (
  publicKey: { x: bigint; y: bigint },
  keyType: string,
  expiry: number,
  keyIndex: bigint,
) => {
  const tx = await writeContract(zircuitClient, {
    abi: ExperimentDelegation.abi,
    address: serverConfig.delegationAddress,
    functionName: 'recoverAccount',
    args: [{ x: publicKey.x, y: publicKey.y }, keyType, expiry, keyIndex],
  });

  // watch and wait for tx
  await waitForTransactionReceipt(zircuitClient, {
    hash: tx,
  });

  // Get the last key using the array length - 1 as index
  const latestKeyIndex = await readContract(zircuitClient, {
    abi: ExperimentDelegation.abi,
    address: serverConfig.delegationAddress,
    functionName: 'getLatestKeyIndex',
  });

  return latestKeyIndex as bigint;
};
