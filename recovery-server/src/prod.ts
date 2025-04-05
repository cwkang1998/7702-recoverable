import { serve } from '@hono/node-server';
import ngrok from '@ngrok/ngrok';
import { createApp } from './app.js';
import { serverConfig } from './server-config.js';

const main = async () => {
  const listener = await ngrok.connect({
    addr: serverConfig.port,
    authtoken_from_env: true,
  });

  const proxy_url = listener.url() || '';

  const app = createApp(proxy_url);

  serve(
    {
      fetch: app.fetch,
      port: serverConfig.port,
    },
    (info: { port: number }) => {
      console.log(`Server is running locally on http://localhost:${info.port}`);
      console.log(`Server is running via proxy at ${proxy_url}`);
    },
  );
};

main().catch((err) => console.error(err));
