import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import type { SelfVerificationResult } from '@selfxyz/core/dist/common/src/utils/selfAttestation.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  generate30DaysTimestamp,
  recoverAccountCall,
} from './contract-call/recovery-client.js';
import { serverConfig } from './server-config.js';

interface PendingNulliferEntry {
  nullifier: string;
  timestamp: number; // auto add in db
  publicKey: { x: bigint; y: bigint };
  keyType: string;
}

const nullifierToKeyIndexMapping = new Map<string, bigint>();

// Should be a uuid to entry mapping.
const pendingNullifierForRecovery = new Map<string, PendingNulliferEntry>();
const verificationResults = new Map<string, SelfVerificationResult>();

export const createApp = (endpoint_url: string) => {
  const app = new Hono();
  app.use('*', cors());

  app.get('/', (c) => {
    return c.text('OK');
  });

  app.post('/register-recovery', async (c) => {
    const { nullifier, keyIndex } = await c.req.json<{
      nullifier: string;
      keyIndex: bigint;
    }>();

    if (!nullifier || !keyIndex) {
      return c.json(
        {
          status: 'error',
          message: 'Missing nullifier or keyIndex',
        },
        400,
      );
    }

    if (nullifierToKeyIndexMapping.has(nullifier)) {
      return c.json(
        {
          status: 'error',
          message: 'Nullifier already registered',
        },
        400,
      );
    }

    nullifierToKeyIndexMapping.set(nullifier, keyIndex);

    return c.json({
      status: 'success',
      message: 'Recovery registration successful',
    });
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

      // Extract user ID from the proof, in this case the userId should be an address.
      const userId = await getUserIdentifier(publicSignals);

      // Initialize and configure the verifier
      const selfBackendVerifier = new SelfBackendVerifier(
        serverConfig.backendVerifier.scope,
        `${endpoint_url}/verify`,
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

  app.post('/submit-recovery', async (c) => {
    const { nullifier, publicKey, userId, keyType } = await c.req.json<{
      userId: string;
      nullifier: string;
      publicKey: { x: bigint; y: bigint };
      keyType: string;
    }>();

    if (!nullifier || !publicKey || !keyType || !userId) {
      return c.json(
        {
          status: 'error',
          message: 'Missing nullifier or publicKey or keyType or userId',
        },
        400,
      );
    }

    pendingNullifierForRecovery.set(userId, {
      nullifier,
      publicKey,
      timestamp: Date.now(),
      keyType,
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
        const currentKeyIndex = nullifierToKeyIndexMapping.get(userId);
        const newKey = pendingNullifierForRecovery.get(userId);
        const expiry = generate30DaysTimestamp();

        if (!newKey) {
          return c.json(
            {
              status: 'error',
              message: 'New key not found',
            },
            400,
          );
        }

        if (!currentKeyIndex) {
          return c.json(
            {
              status: 'error',
              message: 'Current key index not found',
            },
            400,
          );
        }

        // Call the contract to recover the account
        const keyIndex = await recoverAccountCall(
          newKey.publicKey,
          newKey.keyType,
          expiry,
          currentKeyIndex,
        );

        nullifierToKeyIndexMapping.set(newKey.nullifier, keyIndex);

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
