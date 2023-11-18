<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1; display: flex; align-items: center">

      <span :class="collapseBtnClass" style="cursor: pointer; font-size: 18px" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-alert
          style="height: 30px; width: 600px; margin: 0 auto;"
          title="欢迎使用本平台，遇到的所有问题, 可飞书联系：18851700864；用例数据需要手动刷新！"
          type="warning"
          show-icon
          :closable="false">
      </el-alert>

    </div>
    <i class="el-icon-tickets" style="margin-right: 30px; margin-top: 20px">
      <el-link href="https://element.eleme.io" target="_blank">使用指南</el-link>
    </i>
    <el-dropdown style="width: 70px; cursor: pointer">
      <Avatar
          :username="user.nickname"
          :src="user.nickname"
          background-color="#409EFF"
          color="#fff" style="vertical-align: middle"
          :inline="true">
      </Avatar>
      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">个人信息</el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <span style="text-decoration: none" @click="logout"><i class="el-icon-switch-button"></i>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>

import Avatar from 'vue-avatar'
export default {
  name: "Header",
  components:{
    Avatar
  },
  props: {
    collapseBtnClass: String,
    collapse: '',
  },
  data() {
    return {
      avatarSize: 38, // 调整头像的高度
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  methods: {
    logout() {
      this.$store.commit("logout")
      this.$message.success("退出成功")
    },
    /**头像背景颜色方法
     * 借鉴链接：https://blog.csdn.net/Huaasshu/article/details/122039016
     * @param name
     * @returns {string}
     */
    extractColorByName(name) {
      const temp = []
      temp.push("#")
      for (const element of name) {
        temp.push(parseInt(element.charCodeAt(0), 10).toString(16))
      }
      return temp.slice(0, 5).join('').slice(0, 4)
    },
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName;     //需要监听的数据
    }
  },
  watch: {
    currentPathName (newVal, oldVal) {
      console.log(newVal)
    }
  },
}
</script>

<style scoped>

</style>