<template>
  <el-menu :default-openeds="['1', '3']" style="min-height: 100%; overflow-x: hidden;"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
            router>     <!--加了router才能有点击跳转事件 -->
    <div style="height: 60px;line-height: 60px; text-align: center">
      <img src="../assets/caiyun.png" alt="" style="width: 20px; position: relative; top: 5px;margin-right: 5px">
      <b style="color: white" v-show="logoTextShow">彩云测试平台</b>
    </div>
    <el-menu-item index="/home">
      <template slot="title">
        <i class="el-icon-house"></i>
        <span slot="title">主页</span>
      </template>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户中心</span>
      </template>
      <el-menu-item index="/user">
        <i class="el-icon-s-operation"></i>
        <span slot="title">用户列表</span>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-caret-right"></i>
        <span slot="title">接口测试</span>
      </template>
      <el-menu-item index="/autotest">
        <i class="el-icon-menu"></i>
        <span slot="title">用例列表</span>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-monitor"></i>
        <span slot="title">造数中心</span>
      </template>
      <el-menu-item index="/test">
        <i class="el-icon-s-platform"></i>
        <span slot="title">造数列表</span>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-s-data"></i>
        <span slot="title">数据统计</span>
      </template>
      <el-menu-item index="/jiradata">
        <i class="el-icon-files"></i>
        <span slot="title">jira数据统计</span>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="6">
      <template slot="title">
        <i class="el-icon-s-platform"></i>
        <span slot="title">测试管理</span>
      </template>
      <el-menu-item index="/mindmap">
        <i class="el-icon-notebook-2"></i>
        <span slot="title">测试用例</span>
      </el-menu-item>
      <el-menu-item index="/jiradata">
        <i class="el-icon-pie-chart"></i>
        <span slot="title">测试结果</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  }
}
</script>

<style scoped>

</style>