/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Encore = require('@symfony/webpack-encore');
const server = require('./examples/server');

const config = Encore
    .setOutputPath('build/assets')
    .setPublicPath('/assets')
    .disableSingleRuntimeChunk()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .autoProvidejQuery()
    .enableLessLoader()
    .addEntry('main', './examples/main.js')
    .copyFiles({
        from: './assets',
        to: './images/[path][name].[ext]',
        pattern: /.(webp|jpg|jpeg|png|gif|svg|ico)$/
    })
    .getWebpackConfig()
;

// Config of ajax data
if (config.devServer) {
    config.devServer.inline = true;
    config.devServer.before = server;
}

module.exports = config;
