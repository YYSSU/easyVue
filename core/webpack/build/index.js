/**
 * Created by litao on 2018/8/26.
 */
'use strict';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('../webpack.prod.conf');
const server = require('pushstate-server');

const spinner = ora(`开始进行项目打包，打包环境为 ===> ${process.env.env_config}，是否默启动预览：${process.env.env_show} \n`);
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err;
    webpack(webpackConfig, (err, stats) => {
        //停止输出
        spinner.stop();
        if (err)
            //存在异常则终止
            throw err;
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(chalk.red('  项目打包过程中出现异常，停止打包。\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('  项目打包完成\n'));
        console.log(chalk.yellow('  打包后的文件存放于dist文件目录下，将文件部署到服务器即可。\n'));
        if(process.env.env_show + '' === 'true'){
            server.start({
                port: 9526,
                directory: config.build.assetsRoot,
                file: './index.html'
            });
            console.log(`> 打包后预览地址为 http://localhost:9526 \n`);
        }
    })
});