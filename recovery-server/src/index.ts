import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { serverConfig } from './server-config.js';

const app = createApp('https://myapp.com');

serve(
  {
    fetch: app.fetch,
    port: serverConfig.port,
  },
  (info: { port: number }) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
