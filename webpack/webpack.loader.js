import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export default {
  mode: 'production',
  entry: './integration/pixel-loader.ts',
  output: {
    path: path.resolve(rootDir, 'dist/loader'),
    filename: 'pixel-loader.min.js',
    clean: true,
  },
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
            reserved: ['pier39', 'Pier39PixelObject'],
          },
        },
        extractComments: false,
      }),
    ],
  },
}; 