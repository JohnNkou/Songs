const TerserPlugin = require('terser-webpack-plugin'),
Failer = require('./Plugins/failedCompile.cjs'),
webpack = require('webpack'),
{ execSync } = require('child_process'),
env = process.env;

env.os = execSync('uname').toString().replace('\n','');

module.exports = ()=> ({
	mode: env.NODE_ENV || 'development',
	devtool: 'source-map',
	entry:{
		filename:"./client/index.jsx"
	},
	output:{
		filename:"bundle.js",
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
	plugins:[
		 new Failer()
	]
})