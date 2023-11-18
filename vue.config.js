const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    allowedHosts: [
      'test-admin.ccops.net', // 前端域名
      'test-platfrom.ccops.net' // 后端域名
    ],
  },
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave: false,    //报错：Component name "Aside" should always be multi-word  vue/multi-word-component-names ；加上即可
})
