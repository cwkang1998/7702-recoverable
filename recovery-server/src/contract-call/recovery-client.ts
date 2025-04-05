import { serverConfig } from '../server-config.js';
import ExperimentDelegation from './ExperimentDelegation.abi.json' assert {
  type: 'json',
};
import type { zircuitClient } from './client.js';

export const recoverAccountCall = async (client: typeof zircuitClient) => {
  const { writeContract } = client;

  const tx = await writeContract({
    abi: ExperimentDelegation.abi,
    address: serverConfig.delegationAddress,
    functionName: 'recoverAccount',
    args: [],
  });

  return tx;
};
