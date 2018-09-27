/**
 * Created by litao on 2018/8/9.
 */
//引入工具类
const path = require('path');
const packageJson = require('../../../package.json');

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {

        },
        host: 'localhost',
        port: 9527,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: false,
        poll: false,

        devtool: '#cheap-source-map',
        cacheBusting: true,

        cssSourceMap: false,
    },

    build: {
        index: path.resolve(__dirname, '../../../dist/' + packageJson.name + '/index.html'),

        assetsRoot: path.resolve(__dirname, '../../../dist/' + packageJson.name),
        assetsSubDirectory: 'static',

        assetsPublicPath: '/',

        productionSourceMap: false,
        devtool: '#source-map',

        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],

        bundleAnalyzerReport: process.env.npm_config_report
    }
};