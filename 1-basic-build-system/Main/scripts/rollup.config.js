import minify from 'rollup-plugin-babel-minify';

const plugins = [];

if (process.env.BUILD === 'production') {
  plugins.push(minify());
}

export default {
  input: './src/index.js',
  output: {
    file: './bundle.js',
    format: 'es',
  },
  plugins,
};
