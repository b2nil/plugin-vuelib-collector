require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  format: "esm",
  minify: false,
  loader: {
    ".ts": "ts"
  },
  outdir: "dist",
  target: ['es6'],
  tsconfig: 'tsconfig.json'
})