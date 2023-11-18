<template>
  <div>
    <el-dialog
        title="造数场景"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        center
        width="25%"
        @close="resetData()">
      <el-form :model="from" label-position="right">
        <el-form-item label="手机号码" v-if="dialogType === 1">
          <el-input v-model="from.phone_num" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="设备ID" v-if="dialogType === 2">
          <el-input v-model="from.device_id" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="执行结果" v-if="resData">
          <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ resData }}</pre>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="runScene(apiPrefix)">执 行</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      from:{},
      dialogType: 0,
      testSceneForm: {},
      updateResultForm:{},
      dialogFormVisible: false,   //弹窗是否可见
      formLabelWidth: '120px',
      apiPrefix: "",
      resData: null,
    }
  },
  methods: {
    init(row) {
      this.from.id = row
      this.dialogFormVisible = true
      this.$nextTick( () => {
        this.querySceneById()
      })
    },
    querySceneById() {
      request.post("/analysis/querySceneById",this.from).then(res => {
        this.apiPrefix = res.data.api_prefix
        this.dialogType = res.data.dialog_type
      })
    },
    runScene(apiPrefix) {
      this.testSceneForm.phone_num = this.from.phone_num;
      request.post(`/user_data${apiPrefix}`,this.testSceneForm).then(res => {
        this.resData = JSON.stringify(res.data, null, 2)
        const running_result = res.error_msg === "success" ? 1 : 2;
        const obj = {
          running_result,
          id: this.from.id,
        };
        this.updateSceneResult(obj)
      })
    },
    updateSceneResult(obj) {
      this.updateResultForm = obj
      request.post("/analysis/updateSceneResult",this.updateResultForm).then(res => {
        if (res.error_msg !== "success") {
          this.$message.error('结果更新失败，接口可能出现了异常');
        }
      })
    },
    resetData() {
      this.from = {};
      this.dialogType = 0;
      this.testSceneForm = {};
      this.updateResultForm = {};
      this.resData = null;
    },
  },
}

</script>

<style scoped>

</style>