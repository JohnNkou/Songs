const TerserPlugin = require('terser-webpack-plugin')
const Failer = require('./Plugins/failedCompile.cjs');
const webpack = require('webpack');
const { execSync } = require('child_process');

process.env.os = execSync('uname').toString().replace('\n','');

module.exports = (env)=> ({
	mode:env.mode || 'development',
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
	],
	watch:true
})