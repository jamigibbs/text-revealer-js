import builtins from 'rollup-plugin-node-builtins';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';
import scss from 'rollup-plugin-scss';
import banner from 'rollup-plugin-banner';
import bannerInfo from './src/utils/banner.js';
import commonjs from 'rollup-plugin-commonjs';
import handlebars from 'rollup-plugin-handlebars-plus';
import rootImport from 'rollup-plugin-root-import';
import { terser } from "rollup-plugin-terser";

var partialRoots = [`${__dirname}/src/views`];

module.exports = {
  input: 'src/main.js',
  output: [
    {file: 'text-revealer.js', format: 'iife',  name: 'TextRevealer'},
    {file: 'text-revealer.min.js', format: 'iife',  name: 'TextRevealer' }
  ],
  plugins: [
    builtins(),
    rollupNodeResolve(),
    rollupJson(),
    scss({
      output: ['_global.css', 'text-revealer.css']
    }),
    banner(bannerInfo),
    commonjs({ include: 'node_modules/**' }),
    rootImport({
      root: partialRoots
    }),
    handlebars({
      partialRoot: partialRoots
    }),
    terser({
      include: [/^.+\.min\.js$/, '*iife*'],
      keep_fnames: true
    })
  ]
};