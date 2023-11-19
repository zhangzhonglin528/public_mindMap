const { defineConfig } = require('@vue/cli-service');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  devServer: {
    allowedHosts: [
      'test-admin.ccops.net', // 前端域名
      'test-platfrom.ccops.net' // 后端域名
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 解决popmotion的 Can't import the named export '__rest' from non EcmaScript module (only default export is available) 报错
    module: {
      rules: [{
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }]
    },
  },
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint校验
});
