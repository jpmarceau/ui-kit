import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replacePlugin from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';

const isCI = process.env.CI === 'true';
const isProduction = process.env.BUILD === 'production';

function replace() {
  const env = isProduction ? 'production' : 'development';
  return replacePlugin({'process.env.NODE_ENV': JSON.stringify(env)});
}

function onWarn(warning, warn) {
  const isCircularDependency = warning.code === 'CIRCULAR_DEPENDENCY';

  if (isCI && isCircularDependency) {
    throw new Error(warning.message);
  }

  warn(warning);
}

const nodeConfig = {
  input: 'src/index.ts',
  output: [
    {file: 'dist/bueno.js', format: 'cjs'},
    {file: 'dist/bueno.esm.js', format: 'es'},
  ],
  plugins: [
    resolve({preferBuiltins: true}),
    commonjs(),
    typescript(),
    replace(),
  ],
  onwarn: onWarn,
};

const browserConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/browser/bueno.js',
      format: 'umd',
      name: 'Bueno',
      sourcemap: true,
    },
    {
      file: 'dist/browser/bueno.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({browser: true}),
    commonjs(),
    typescript(),
    replace(),
    sizeSnapshot(),
    terser(),
  ],
};

const config = isProduction ? [nodeConfig, browserConfig] : [nodeConfig];

export default config;
