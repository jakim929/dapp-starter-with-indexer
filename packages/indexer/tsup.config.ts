import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@dapp-starter-with-indexer/indexer',
  entry: ['zeus/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
