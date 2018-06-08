/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const server = require('./examples/server');

const config = Encore
    .setOutputPath('build/assets')
    .setPublicPath('/assets')
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .enableLessLoader()
    .addEntry('main', './examples/main.js')
    .addPlugin(new CopyWebpackPlugin([
        { from: './assets', to: './images', test: /.(webp|jpg|jpeg|png|gif|svg|ico)$/ }
    ]))
    .getWebpackConfig()
;

// Replace Webpack Uglify Plugin
if (Encore.isProduction()) {
    config.plugins = config.plugins.filter(
        plugin => !(plugin instanceof webpack.optimize.UglifyJsPlugin)
    );
    config.plugins.push(new UglifyJsPlugin());
}

// Config of ajax data
if (config.devServer) {
    config.devServer.inline = true;
    config.devServer.before = server;
}

module.exports = config;
