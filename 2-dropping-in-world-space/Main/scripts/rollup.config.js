import minify from 'rollup-plugin-babel-minify';

const plugins = [];

if (process.env.BUILD === 'production') {
  plugins.push(minify());
}

export default {
  input: './src/index.js',
  output: {
    file: './bundle.js',
    format: 'cjs',
  },
  external: [
    'Animation',
    'Audio',
    'CameraInfo',
    'CameraShare',
    'DeviceMotion',
    'Diagnostics',
    'FaceGestures',
    'FaceTracking',
    'Fonts',
    'LiveStreaming',
    'Locale',
    'Materials',
    'Networking',
    'Reactive',
    'Scene',
    'Textures',
    'Time',
    'TouchGestures',
    'Units',
  ],
  plugins,
};
