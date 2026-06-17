import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createGuidedLimiter } from '../../../../server/rateLimit.mjs';
import { createGuidedRouter } from '../../../../server/routes/guided.mjs';

let activeServer: ReturnType<express.Express['listen']> | null = null;

afterEach(async () => {
  if (!activeServer) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    activeServer?.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
  activeServer = null;
});

describe('guided rate limit', () => {
  it('returns structured 429 responses with retry-after metadata', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api', createGuidedRouter({
      guidedEngine: {
        executeQuery: () => ({ ok: true }),
        getCatalogResponse: () => ({ title: 'Guided Analysis', version: '1', categories: [], queries: [], generated_at: null }),
        getQueryOptions: () => ({ query_id: 'query', options: {} }),
      },
      guidedLimiter: createGuidedLimiter({ limit: 1, windowMs: 1_000 }),
    }));

    activeServer = app.listen(0);
    const address = activeServer.address();
    if (!address || typeof address === 'string') {
      throw new Error('Unable to resolve test server address.');
    }

    const baseUrl = `http://127.0.0.1:${address.port}`;

    const firstResponse = await fetch(`${baseUrl}/api/guided/queries/top_bioremediation_compounds/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1 }),
    });
    expect(firstResponse.status).toBe(200);

    const secondResponse = await fetch(`${baseUrl}/api/guided/queries/top_bioremediation_compounds/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1 }),
    });

    expect(secondResponse.status).toBe(429);
    expect(secondResponse.headers.get('retry-after')).toBe('1');
    await expect(secondResponse.json()).resolves.toMatchObject({
      error: 'Too many guided analysis requests.',
      retryAfterSeconds: 1,
    });
  });
});
