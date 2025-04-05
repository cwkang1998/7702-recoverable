const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

if (!privateKey) {
  throw new Error('PRIVATE_KEY environment variable is not set');
}

export const serverConfig = {
  privateKey,
  port: 3000,
  backendVerifier: {
    scope: '7702-recoverable-17135',
  },
};
