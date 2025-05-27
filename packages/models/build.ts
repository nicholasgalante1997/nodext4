export {};

await Bun.build({
  entrypoints: ['lib/index.ts'],
  outdir: './out',
  target: 'bun',
  format: 'esm',
  splitting: false,
  sourcemap: 'linked',
  minify: true,
  root: '.',
  external: []
});
