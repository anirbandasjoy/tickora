import http from 'http';
import mongoose from 'mongoose';
import { createApp } from './app';
import { getMongoClient } from '@repo/database';
import { initAuth } from './lib/auth';
import { config } from './config/env';

const main = async () => {
  const auth = await initAuth();
  const app = createApp(auth);
  const server = http.createServer(app);

  server.listen(config.PORT, () => {
    console.log(`Server is running at ${config.SERVER_URI}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close(() => {
      void (async () => {
        try {
          await mongoose.disconnect();
          const client = await getMongoClient(config.MONGO_URI);
          await client.close();
        } finally {
          process.exit(0);
        }
      })();
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

main().catch((error) => {
  console.error('Failed to start the server', error);
  process.exit(1);
});
