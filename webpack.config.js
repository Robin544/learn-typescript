const path = require('path');

module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js', // bundle[contentHash].js to create a unique hash for every build.
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}