import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  clean: true,
  bundle: true,
  splitting: false,
  dts: false,
  sourcemap: false,
  minify: false,
  external: ['express', 'cors', 'dotenv', 'morgan', 'zod', 'http-status-codes', 'better-auth', 'mongoose', 'mongodb'],
  // tsup externalizes package.json deps by default — bundle the workspace
  // source-only package instead (it has no dist to load at runtime).
  noExternal: ['@repo/database'],
});
