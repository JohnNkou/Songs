const TerserPlugin = require('terser-webpack-plugin'),
Failer = require('./Plugins/failedCompile.cjs'),
webpack = require('webpack'),
{ execSync } = require('child_process'),
env = process.env,
path = require('path');

env.os = execSync('uname').toString().replace('\n','');

module.exports = ()=> ({
	mode: env.NODE_ENV || 'development',
	devtool: 'source-map',
	entry:{
		filename:"./client/index.jsx"
	},
	output:{
		path:path.resolve(__dirname,'public/dist'),
		filename:"bundle.js",
		chunkFilename:'[name].js',
		environment:{
			arrowFunction:false,
			const: false,
			destructuring:false,
			forOf: false
		}
	},
	stats:{
	},
	module:{
		rules:[
			{
				test: /\.[cm]?jsx?$/,
				exclude: /node_modules/,
				use:{
					loader:"babel-loader"
				}
			}
		]
	},
	optimization:{
		usedExports:true
	},
	plugins:[
		new Failer()
	]
})