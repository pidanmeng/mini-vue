import typescript from "@rollup/plugin-typescript";

const entry = process.env.TARGET;

export default {
  input: `packages/${entry}/index.ts`,
  output: [
    {
      format: 'cjs',
      file: `dist/${entry}.cjs.js`
    },
    {
      format: 'es',
      file: `dist/${entry}.esm.js`
    }
  ],
  plugins: [typescript(
    {
      module: 'ESNext'
    }
  )]
}