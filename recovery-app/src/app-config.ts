const baseUrl = 'https://4c16-150-116-251-61.ngrok-free.app';

export const appConfig = {
  baseUrl,
  appName: '7702 Recoverable',
  scope: '7702-recoverable-17135',
  endpoint: `${baseUrl}/verify`,

  recoveryAppName: '7702 Recovery Flow',
  recoveryScope: '7702-recoverable-verify-17135',
  recoveryEndpoint: `${baseUrl}/recover`,
};
