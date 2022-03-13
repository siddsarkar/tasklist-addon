/* eslint-disable camelcase */

const {join} = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('./node_modules/terser-webpack-plugin/dist');

const config = {
	devtool: false,
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2,
					},
				},
			}),
		],
	},
	module: {},
};

const firefoxConfig = {...config,
	name: 'firefox',
	entry: {
		background: __dirname + '/src/background.js',
	},
	output: {
		path: join(__dirname, 'firefox'),
		filename: '[name].js',
		clean: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: './src',
					globOptions: {
						ignore: ['**/input.css'],
					},
				},
				{
					from: './manifests/manifest.firefox.json',
					to: 'manifest.json',
				},
			],
		}),
	],
};

const chromeConfig = {...config,
	name: 'chrome',
	entry: {
		background: __dirname + '/src/background.js',
	},
	output: {
		path: join(__dirname, 'chrome'),
		filename: '[name].js',
		clean: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: './src',
					globOptions: {
						ignore: ['**/input.css'],
					},
				},
				{
					from: './manifests/manifest.chrome.json',
					to: 'manifest.json',
				},
			],
		}),
	],
};

module.exports = [
	chromeConfig, firefoxConfig,
];
