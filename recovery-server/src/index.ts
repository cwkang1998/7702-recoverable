import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import { Hono } from 'hono';
import { z } from 'zod';
import { serverConfig } from './server-config.js';

const app = new Hono();

const verifySchema = z.object({
  proof: z.string(),
  publicSignals: z.string(),
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post(
  '/verify',
  zValidator('json', verifySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: 'Invalid request body', errors: result.error },
        400,
      );
    }
  }),
  async (c) => {
    try {
      const { proof, publicSignals } = c.req.valid('json');

      // Extract user ID from the proof, in this case the userId should be an address.
      const userId = await getUserIdentifier(publicSignals);
      console.log('Extracted userId:', userId);

      // Initialize and configure the verifier
      const selfBackendVerifier = new SelfBackendVerifier(
        serverConfig.backendVerifier.scope,
        serverConfig.backendVerifier.endpoint,
      );

      // Verify the proof
      const result = await selfBackendVerifier.verify(proof, publicSignals);

      if (result.isValid) {
        // Return successful verification response
        return c.json({
          status: 'success',
          credentialSubject: result.credentialSubject,
        });
      }

      // Return failed verification response
      return c.json(
        {
          status: 'error',
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
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  },
);

serve(
  {
    fetch: app.fetch,
    port: serverConfig.port,
  },
  (info: { port: number }) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export default app;
