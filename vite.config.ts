import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveEnvValues } from './shared/envFiles.mjs';
import { normalizeBasePath } from './shared/basePath.mjs';
import { createDevBasePathRedirectMiddleware } from './shared/viteDevBasePathRedirect.mjs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const fallbackEnv = resolveEnvValues({ cwd: process.cwd() }).values;
  const env = {
    ...fallbackEnv,
    ...loadEnv(mode, process.cwd(), ''),
    ...process.env,
  };
  const devApiOrigin = env.VITE_DEV_API_ORIGIN || 'http://127.0.0.1:3101';
  const rawBasePath = env.VITE_BIOREMPP_URL_BASE_PATH || env.BIOREMPP_URL_BASE_PATH || '/';
  const basePath = normalizeBasePath(rawBasePath);
  const apiProxyPrefix = basePath === '/' ? '/api' : `${basePath}api`;

  return {
    base: basePath,
    plugins: [
      {
        name: 'biorempp-dev-base-path-redirect',
        apply: 'serve',
        configureServer(server) {
          if (basePath === '/') {
            return;
          }

          server.middlewares.use(createDevBasePathRedirectMiddleware(basePath));
        },
      },
      react(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
        '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        [apiProxyPrefix]: {
          target: devApiOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
