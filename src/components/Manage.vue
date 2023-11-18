<template>
    <el-container style="height: 100vh">
<!--      设置表单内容的高度为10 dd0%-->
<!--      侧边栏-->
      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
        <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow"/>
      </el-aside>
<!--头部内容-->
      <el-container>
        <el-header style="border-bottom: 1px solid #ccc;">
          <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse"/>
        </el-header>
<!--面包屑-->
        <el-main>
<!--          表示当前页面的子路由都会在<router-view/>中展示-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
// @ is an alias to /src

// eslint-disable-next-line no-unused-vars
import request from "@/utils/request";
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Manage',
  components: {Header, Aside},
  data() {
    return  {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      headerBg: 'headerBg'
    }
  },
  methods: {
    collapse(){  // 点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {  //收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {  //展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },

  }
}
</script>
<style>
.headerBg {
  background: #eee!important;
}
</style>