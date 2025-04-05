import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import type { SelfVerificationResult } from '@selfxyz/core/dist/common/src/utils/selfAttestation.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serverConfig } from './server-config.js';

interface PendingNulliferEntry {
  nullifier: string;
  timestamp: number; // auto add in db
  publicKey: string;
}

// Should be a uuid to entry mapping.
const pendingNullifierForRecovery = new Map<string, PendingNulliferEntry>();
const verificationResults = new Map<string, SelfVerificationResult>();

export const createApp = (endpoint_url: string) => {
  const app = new Hono();
  app.use('*', cors());

  app.get('/', (c) => {
    return c.text('OK');
  });

  app.get('/verify-result/:id', async (c) => {
    const id = c.req.param('id');
    const result = verificationResults.get(id);
    if (!result) {
      return c.json({ error: 'Result not found' }, 404);
    }
    return c.json(result);
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
        verificationResults.set(userId, result);
        return c.json({
          status: 'success',
          result: true,
          credentialSubject: result.credentialSubject,
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

  app.post('submit-recovery', async (c) => {
    const { nullifier, publicKey } = await c.req.json<{
      nullifier: string;
      publicKey: string;
    }>();

    pendingNullifierForRecovery.set(nullifier, {
      nullifier,
      publicKey,
      timestamp: Date.now(),
    });

    return c.json({
      status: 'success',
      message: 'Recovery request submitted',
    });
  });

  app.post('/recover', async (c) => {
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

      // Extract user ID from the proof, in this case the userId should be an address.
      const userId = await getUserIdentifier(publicSignals);

      // Initialize and configure the verifier
      const selfBackendVerifier = new SelfBackendVerifier(
        serverConfig.recoveryVerifier.scope,
        `${endpoint_url}/recover`,
        'uuid',
        true,
      );

      // Verify the proof
      const result = await selfBackendVerifier.verify(proof, publicSignals);

      if (result.isValid) {
        // Return successful verification response
        verificationResults.set(userId, result);
        return c.json({
          status: 'success',
          result: true,
          credentialSubject: result.credentialSubject,
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
