import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy-assets';
import typescript from '@rollup/plugin-typescript';
// import json from '@rollup/plugin-json';
// import css from "rollup-plugin-css-only";

export default {
  input: 'src/app/app.ts',
  output: [
    {
      // name: "test",
      file: 'build/bundle.js',
      format: 'cjs'
    },
    {
      file: 'build/bundle.min.js',
      format: 'cjs',
      plugins: [terser()]
    }
  ],
  plugins: [
    nodeResolve({ moduleDirectories: ['node_modules'] }),
    typescript(),
    // babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }), // only transpile our source code
    commonjs(),
    image(),
    copy({
      assets: ['src/assets', 'src/builder.js']
    })
    // json(),
    // css(),
  ]
};
