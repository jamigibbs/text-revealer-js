import builtins from 'rollup-plugin-node-builtins';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';
import scss from 'rollup-plugin-scss';
import banner from 'rollup-plugin-banner';
import bannerInfo from './src/utils/banner.js';
import commonjs from 'rollup-plugin-commonjs';
import handlebars from 'rollup-plugin-handlebars-plus';

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'text-revealer.js',
    format: 'umd', 
    name: 'TextRevealer'
  },
  plugins: [
    builtins(),
    rollupNodeResolve(),
    rollupJson(),
    scss({
      output: 'text-revealer.css'
    }),
    banner(bannerInfo),
    commonjs({ include: 'node_modules/**' }),
    handlebars()
  ]
};