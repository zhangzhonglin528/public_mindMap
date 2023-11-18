<template>
  <div>
    <el-dialog
        title="编辑"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form :model="formData" label-width="120px" class="centered-form">
        <!-- 在表单中添加需要编辑的字段 -->
        <el-form-item label="场景名称" class="centered-form-item">
          <el-input v-model="formData.scene_name" class="centered-input"></el-input>
        </el-form-item>
        <el-form-item label="场景说明" class="centered-form-item">
          <el-input type="textarea" v-model="formData.scene_desc" class="centered-input"></el-input>
        </el-form-item>
        <el-form-item label="所属用户" class="centered-form-item">
          <el-input v-model="formData.user" class="centered-input"></el-input>
        </el-form-item>
        <el-form-item label="弹窗类型" class="centered-form-item">
          <template>
            <el-radio v-model="formData.dialog_type" label="1">用户弹窗</el-radio>
            <el-radio v-model="formData.dialog_type" label="2">设备弹窗</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  props: {
    data: Object, // 接收数据对象
  },
  data() {
    return {
      from:{},
      dialogVisible: false, // 控制 dialog 是否可见
      formData: {}, // 使用传递的数据初始化表单
      sceneFrom:{
        page_size:10,
        current_page:1,
      },
      }
  },
  methods: {
    init(id) {
      this.from.id = id
      this.dialogVisible = true
      this.$nextTick( () => {
        this.querySceneById()
      })
    },
    querySceneById() {
      request.post("/analysis/querySceneById",this.from).then(res => {
        if (res.error_msg === "success") {
          this.formData = res.data;
          this.dialogVisible = true; // 强制打开弹窗
        } else {
          // 处理请求失败的情况，例如弹出错误提示
          this.$message.error("请求失败");
        }
      })
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    saveData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post("/analysis/updateScene", this.formData).then(res => {
        if (res.error_msg === "success") {
          loading.close()
          this.$emit("data-updated"); // 更新接口执行成功之后，主页面监听data-updated事件进行页面数据刷新
          this.closeDialog();
        }
      })
    },
  },
}

</script>

<style scoped>
.centered-form {
  text-align: center; /* 居中文本 */
}

.centered-form-item {
  text-align: left; /* 左对齐标签 */
  margin-bottom: 10px; /* 增加底部间距 */
}

.centered-input {
  width: 250px; /* 设置输入框宽度 */
}
</style>