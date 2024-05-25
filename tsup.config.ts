import { defineConfig } from 'tsup';

export default defineConfig({
  platform: 'neutral',
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
});
