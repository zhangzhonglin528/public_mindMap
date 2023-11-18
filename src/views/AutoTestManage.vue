<template>
  <div>
    <el-button type="primary" @click="initCase()" style="margin-bottom: 20px">刷新用例<i class="el-icon-refresh"></i></el-button>
    <el-button type="success" @click="runCase()" style="margin-bottom: 20px">全部执行<i class="el-icon-caret-right"></i></el-button>

    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        border
        default-expand-all
       >
      <el-table-column prop="id" label="用例ID" sortable width="180"></el-table-column>
      <el-table-column prop="business" label="业务" width="180"></el-table-column>
      <el-table-column prop="class_name" label="用例名称" width="240"></el-table-column>
      <el-table-column prop="class_docstring" label="用例描述" width="180"></el-table-column>
      <el-table-column prop="class_author" label="责任人" width="180"></el-table-column>
      <el-table-column prop="caseInfo" label="用例信息" width="120">
        <template slot-scope="scope">
          <span class="el-icon-star-off" style="color: black">total用例: {{scope.row.total}}</span><br/>
          <span class="el-icon-check" style="color: green">成功用例: {{scope.row.passed_total}}</span><br/>
          <span class="el-icon-close" style="color: red">失败用例: {{scope.row.fail_total}}</span><br/>
          <span class="el-icon-close" style="color: red">异常用例: {{scope.row.exception_total}}</span><br/>
          <span class="el-icon-apple" style="color: rgb(128,128,128)">未跑用例: {{scope.row.no_execute}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="passing_rate" label="通过率" sortable width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.passing_rate !== '100%'">
            <el-tag key="未执行" type="danger">{{ scope.row.passing_rate }}</el-tag>
          </span>
          <span v-else>
            <el-tag key="执行成功" type="success">{{ scope.row.passing_rate }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="执行结果" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">
            <el-tag key="未执行" type="info" effect="dark">未执行</el-tag></span>
          <span v-if="scope.row.status === 1">
            <el-tag key="执行成功" type="success" effect="dark">执行成功</el-tag></span>
          <span v-if="scope.row.status === 2">
            <el-tag key="执行失败" type="danger" effect="dark">执行失败</el-tag></span>
          <span v-if="scope.row.status === -99">
            <el-tag key="执行异常" type="danger" effect="dark">执行异常</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">测试<i class="el-icon-success"></i></el-button>
          <el-button type="success" @click="handleEdit(scope.row)">报告<i class="el-icon-view"></i></el-button>
          <el-button type="info" @click="openCaseListDialog(scope.row.id)">明细<i class="el-icon-view"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <TestCaseList v-if="showCaseListDialog" ref="caseCurrentClass"></TestCaseList>
    </div>
  </div>
</template>
<script>

import request from "@/utils/request";
import TestCaseList from "@/views/TestCaseListDialog.vue";
export default {
  components: {TestCaseList},
  data() {
    return {
      from: {},
      runFrom: {},
      tableData: [],
      showCaseListDialog: false
    }
  },
  created() {
    this.queryCaseList()
  },
  methods: {
    queryCaseList() {
      request.post("pytest/getClassCase", this.from).then(res => {
        res.data.forEach(cases => {
          this.tableData.push(cases)
        })
      });
    },
    initCase() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post("pytest/getCase", this.from).then(res => {
        if (res.errorCode === 0) {
          loading.close()
          this.$message.success('数据加载完成！');
        }
      })
    },
    async runCase() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await request.post("pytest/runPytest", this.runFrom).then( res => {
        if (res.errorCode === 0) {
          loading.close()
          this.$message.success('用例执行完成！');
        }}
      )
    },
    openCaseListDialog(class_id) {
      this.showCaseListDialog = true
      this.$nextTick(()=> {
        this.$refs.caseCurrentClass.init(class_id)
      })
    }
  },
}
</script>