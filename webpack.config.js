const path = require('path');

module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js', // bundle[contentHash].js to create a uniquehash for eery build.
        path: path.resolve(__dirname, 'dist')
    },
}