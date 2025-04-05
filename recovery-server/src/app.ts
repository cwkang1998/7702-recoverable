import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import { Hono } from 'hono';
import { serverConfig } from './server-config.js';

export const createApp = (endpoint_url: string) => {
  const app = new Hono();

  app.get('/', (c) => {
    return c.text('Hello Hono!');
  });

  app.post('/verify', async (c) => {
    try {
      const { proof, publicSignals } = await c.req.json<{
        proof: any;
        publicSignals: string[];
      }>();

      if (!proof || !publicSignals) {
        return c.json(
          {
            status: 'error',
            message: 'Missing proof or publicSignals',
          },
          400,
        );
      }

      console.log('Received proof:', proof);
      console.log('Received publicSignals:', publicSignals);

      // Extract user ID from the proof, in this case the userId should be an address.
      const userId = await getUserIdentifier(publicSignals);
      console.log('Extracted userId:', userId);

      // Initialize and configure the verifier
      const selfBackendVerifier = new SelfBackendVerifier(
        serverConfig.backendVerifier.scope,
        `${endpoint_url}/verify`,
      );

      // Verify the proof
      const result = await selfBackendVerifier.verify(proof, publicSignals);

      console.log('Verification result:', result);

      if (result.isValid) {
        // Return successful verification response
        return c.json({
          status: 'success',
          result: true,
          credentialSubject: result.credentialSubject,
          nullifier: result.nullifier,
        });
      }

      // Return failed verification response
      return c.json(
        {
          status: 'error',
          result: false,
          message: 'Verification failed',
          details: result.isValidDetails,
        },
        500,
      );
    } catch (error) {
      console.error('Error verifying proof:', error);
      return c.json(
        {
          status: 'error',
          result: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  });

  return app;
};
