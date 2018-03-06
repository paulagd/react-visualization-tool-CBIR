const path = require('path');

module.exports = {
    context: __dirname,
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                  presets: ['es2015', 'react']
                }
            },
            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'url-loader',
              query: {
                name: '[name].[ext]?[hash]'
              }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
      extensions: [ '.js', '.jsx', '.json' ]
    },
    // node: {
    //   fs: 'empty',
    //   child_process: 'empty',
    // },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        port: 3000
    }
};
