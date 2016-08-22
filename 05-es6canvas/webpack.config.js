'use strict';

module.exports = {
    entry: "./app/index.js",
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
          {
            test: /\.js?/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015', 'stage-0']
            }
          }
        ]
    },
    devServer: {
        contentBase: './',
        port: 3333,
        inline: true        
    }
}
