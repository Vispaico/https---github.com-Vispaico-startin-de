import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.'), 'server-only': path.resolve(__dirname, 'tests/server-only.ts') } },
  test: { environment: 'node', setupFiles: ['./tests/setup.ts'], testTimeout: 20_000 },
});
