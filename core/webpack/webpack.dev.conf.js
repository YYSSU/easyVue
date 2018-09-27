/**
 * Created by litao on 2018/8/9.
 */
//引入webpack
const webpack = require('webpack');
//引入webpack的基础配置
const webpackBaseConfig = require('./webpack.base.conf.js');
//引入webpack合并
const merge = require('webpack-merge');
//端口工具
const portfinder = require('portfinder');
//引入配置类
const config = require('./config');

//其他工具
const HtmlWebpackPlugin = require('html-webpack-plugin');
const util = require('./util');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

//地址
const HOST = process.env.HOST || config.dev.host;
//端口
const PORT = (process.env.PORT && Number(process.env.PORT)) || config.dev.port;

//合并webpack配置
const webpackConfig = merge(webpackBaseConfig, {
    module: {
        rules: util.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },

    devtool: config.dev.devtool,

    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: HOST,
        port: PORT,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true,
        watchOptions: {
            poll: config.dev.poll,
        },
        disableHostCheck: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('./config/dev.env.js')
        }),
        new webpack.HotModuleReplacementPlugin(), //模块热替换插件
        new webpack.NamedModulesPlugin(), //将输出由ID改为路径
        new webpack.NoEmitOnErrorsPlugin(), //遇到错误时，跳过输出，不终止进程
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            favicon: util.resolve('favicon.ico'),
            title: '投资风险库系统 - 北京天润新能投资有限公司',
            path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
        })
    ]
});
//导出webpack配置
module.exports = new Promise((resolve, reject) => {
    console.log(`当前环境上下文根目录为 ==> [${webpackBaseConfig.context}]`);
    //设置端口
    portfinder.basePort = process.env.PORT || config.dev.port;
    console.log(`欲启动端口 ==> [${portfinder.basePort}]`);
    //查找可以被使用的端口。 优先使用basePort
    portfinder.getPort((err, port) => {
        console.log(`现启动端口 ==> [${port}]`);
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port;
            webpackConfig.devServer.port = port;
            webpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`[easy-vue提醒您]  当前项目运行的web地址是: http://${webpackConfig.devServer.host}:${port}`],
                }
            }));
            resolve(webpackConfig);
        }
    })
});