'use strict';

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    compress: true,
    port: Number(process.env.PORT) ?? 8080,
    allowedHosts: [process.env.HOST ?? 'localhost']
  }
};

