/**
 * Created by litao on 2018/8/9.
 */
'use strict';
//引入工具类
const path = require('path');

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            "/sysAttachment/*": {
                target: 'http://127.0.0.1:8044'
            },
            "/tianrun/download": {
                target: 'http://127.0.0.1:8044',
                pathRewrite: {
                    '^/tianrun/download': '/'
                }
            }
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
        index: path.resolve(__dirname, '../../../dist/easyVue/index.html'),

        assetsRoot: path.resolve(__dirname, '../../../dist/easyVue'),
        assetsSubDirectory: 'static',

        assetsPublicPath: './',

        productionSourceMap: false,
        devtool: '#source-map',

        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],

        bundleAnalyzerReport: process.env.npm_config_report
    }
};