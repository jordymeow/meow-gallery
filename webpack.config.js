var webpack = require('webpack');

module.exports = {
	context: __dirname,
	mode: 'production',
	entry: './blocks/src/index.js',
	devtool: 'source-map',
	output: {
		path: __dirname + '/blocks/dist/',
		filename: 'index.js'
	},
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{ loader: 'babel-loader' }]
			}
		]
	}
};