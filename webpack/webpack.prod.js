import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Base configuration shared between both builds
const baseConfig = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

// Minified build (pixel.min.js)
const minifiedConfig = {
  ...baseConfig,
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'pixel.min.js',
    library: {
      name: 'Pier39ConversionSDK',
      type: 'window'
    },
    clean: {
      keep: /pixel\.umd\.(js|js\.map)$/, // Keep UMD files if they exist
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: false,
            passes: 2,
          },
          mangle: {
            reserved: ['pier39', 'Pier39ConversionSDK'],
          },
        },
        extractComments: false,
      }),
    ],
  },
};

// UMD build (pixel.umd.js) - unminified for better debugging
const umdConfig = {
  ...baseConfig,
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'pixel.umd.js',
    library: {
      name: 'Pier39ConversionSDK',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true
    },
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    clean: {
      keep: /pixel\.min\.js$/, // Keep minified file if it exists
    },
  },
  optimization: {
    minimize: false, // Keep unminified for debugging
  },
  devtool: 'source-map', // Include source maps for debugging
};

export default [umdConfig, minifiedConfig]; 