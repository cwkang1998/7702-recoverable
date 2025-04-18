export const ExperimentDelegation = {
  abi: [
    { type: 'fallback', stateMutability: 'payable' },
    { type: 'receive', stateMutability: 'payable' },
    {
      type: 'function',
      name: 'authorize',
      inputs: [
        {
          name: 'publicKey',
          type: 'tuple',
          internalType: 'struct ECDSA.PublicKey',
          components: [
            { name: 'x', type: 'uint256', internalType: 'uint256' },
            { name: 'y', type: 'uint256', internalType: 'uint256' },
          ],
        },
        {
          name: 'keyType',
          type: 'uint8',
          internalType: 'enum ExperimentDelegation.KeyType',
        },
        { name: 'expiry', type: 'uint256', internalType: 'uint256' },
        {
          name: 'signature',
          type: 'tuple',
          internalType: 'struct ECDSA.RecoveredSignature',
          components: [
            { name: 'r', type: 'uint256', internalType: 'uint256' },
            { name: 's', type: 'uint256', internalType: 'uint256' },
            { name: 'yParity', type: 'uint8', internalType: 'uint8' },
          ],
        },
      ],
      outputs: [
        { name: 'publicKeyIndex', type: 'uint32', internalType: 'uint32' },
      ],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'execute',
      inputs: [
        { name: 'calls', type: 'bytes', internalType: 'bytes' },
        {
          name: 'signature',
          type: 'tuple',
          internalType: 'struct ECDSA.Signature',
          components: [
            { name: 'r', type: 'uint256', internalType: 'uint256' },
            { name: 's', type: 'uint256', internalType: 'uint256' },
          ],
        },
        {
          name: 'metadata',
          type: 'tuple',
          internalType: 'struct WebAuthnP256.Metadata',
          components: [
            {
              name: 'authenticatorData',
              type: 'bytes',
              internalType: 'bytes',
            },
            {
              name: 'clientDataJSON',
              type: 'string',
              internalType: 'string',
            },
            {
              name: 'challengeIndex',
              type: 'uint16',
              internalType: 'uint16',
            },
            { name: 'typeIndex', type: 'uint16', internalType: 'uint16' },
            {
              name: 'userVerificationRequired',
              type: 'bool',
              internalType: 'bool',
            },
          ],
        },
        {
          name: 'publicKeyIndex',
          type: 'uint32',
          internalType: 'uint32',
        },
        { name: 'prehash', type: 'bool', internalType: 'bool' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'getLatestKeyIndex',
      inputs: [],
      outputs: [{ name: 'keyIndex', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'keys',
      inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        { name: 'authorized', type: 'bool', internalType: 'bool' },
        { name: 'expiry', type: 'uint256', internalType: 'uint256' },
        {
          name: 'keyType',
          type: 'uint8',
          internalType: 'enum ExperimentDelegation.KeyType',
        },
        {
          name: 'publicKey',
          type: 'tuple',
          internalType: 'struct ECDSA.PublicKey',
          components: [
            { name: 'x', type: 'uint256', internalType: 'uint256' },
            { name: 'y', type: 'uint256', internalType: 'uint256' },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'multiSend',
      inputs: [{ name: 'transactions', type: 'bytes', internalType: 'bytes' }],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'nonce',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'recoverAccount',
      inputs: [
        {
          name: 'publicKey',
          type: 'tuple',
          internalType: 'struct ECDSA.PublicKey',
          components: [
            { name: 'x', type: 'uint256', internalType: 'uint256' },
            { name: 'y', type: 'uint256', internalType: 'uint256' },
          ],
        },
        {
          name: 'keyType',
          type: 'uint8',
          internalType: 'enum ExperimentDelegation.KeyType',
        },
        { name: 'expiry', type: 'uint256', internalType: 'uint256' },
        { name: 'keyIndex', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'revoke',
      inputs: [
        {
          name: 'publicKeyIndex',
          type: 'uint32',
          internalType: 'uint32',
        },
        {
          name: 'signature',
          type: 'tuple',
          internalType: 'struct ECDSA.RecoveredSignature',
          components: [
            { name: 'r', type: 'uint256', internalType: 'uint256' },
            { name: 's', type: 'uint256', internalType: 'uint256' },
            { name: 'yParity', type: 'uint8', internalType: 'uint8' },
          ],
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    { type: 'error', name: 'AccountNotFound', inputs: [] },
    { type: 'error', name: 'InvalidAuthority', inputs: [] },
    { type: 'error', name: 'InvalidSignature', inputs: [] },
    { type: 'error', name: 'KeyExpired', inputs: [] },
    { type: 'error', name: 'KeyNotAuthorized', inputs: [] },
  ],
  address: '0xa4E19a805347E4b72252aF883C0E4C3Fc8601e1F',
} as const;

export const ExperimentERC20 = {
  abi: [
    { type: 'fallback', stateMutability: 'payable' },
    { type: 'receive', stateMutability: 'payable' },
    {
      type: 'function',
      name: 'DOMAIN_SEPARATOR',
      inputs: [],
      outputs: [{ name: 'result', type: 'bytes32', internalType: 'bytes32' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allowance',
      inputs: [
        { name: 'owner', type: 'address', internalType: 'address' },
        { name: 'spender', type: 'address', internalType: 'address' },
      ],
      outputs: [{ name: 'result', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'approve',
      inputs: [
        { name: 'spender', type: 'address', internalType: 'address' },
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
      outputs: [{ name: 'result', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'burnForEther',
      inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'decimals',
      inputs: [],
      outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'mint',
      inputs: [
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'value', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'mintForEther',
      inputs: [],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'name',
      inputs: [],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'nonces',
      inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
      outputs: [{ name: 'result', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'permit',
      inputs: [
        { name: 'owner', type: 'address', internalType: 'address' },
        { name: 'spender', type: 'address', internalType: 'address' },
        { name: 'value', type: 'uint256', internalType: 'uint256' },
        { name: 'deadline', type: 'uint256', internalType: 'uint256' },
        { name: 'v', type: 'uint8', internalType: 'uint8' },
        { name: 'r', type: 'bytes32', internalType: 'bytes32' },
        { name: 's', type: 'bytes32', internalType: 'bytes32' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'symbol',
      inputs: [],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'totalSupply',
      inputs: [],
      outputs: [{ name: 'result', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'transferFrom',
      inputs: [
        { name: 'from', type: 'address', internalType: 'address' },
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'event',
      name: 'Approval',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'spender',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        {
          name: 'from',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        { name: 'to', type: 'address', indexed: true, internalType: 'address' },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    { type: 'error', name: 'AllowanceOverflow', inputs: [] },
    { type: 'error', name: 'AllowanceUnderflow', inputs: [] },
    { type: 'error', name: 'InsufficientAllowance', inputs: [] },
    { type: 'error', name: 'InsufficientBalance', inputs: [] },
    { type: 'error', name: 'InvalidPermit', inputs: [] },
    { type: 'error', name: 'Permit2AllowanceIsFixedAtInfinity', inputs: [] },
    { type: 'error', name: 'PermitExpired', inputs: [] },
    { type: 'error', name: 'TotalSupplyOverflow', inputs: [] },
  ],
  address: '0x0A8071a6E269E0CAF4900bf6a712160876cda052',
} as const;
