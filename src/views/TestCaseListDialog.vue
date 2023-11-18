<template>
  <el-dialog
      title="用例明细"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="90%"
      center>
    <el-form :inline="true" class="demo-form-inline" :model="queryCaseForm">
      <el-form-item label="状态">
        <el-select v-model="queryCaseForm.status" placeholder="请选择状态" size="medium">
          <el-option label="所有"   :value=null></el-option>
          <el-option label="未执行" :value=0></el-option>
          <el-option label="执行成功"   :value=1></el-option>
          <el-option label="执行失败"   :value=2></el-option>
          <el-option label="执行异常"   :value=-99></el-option>
        </el-select>
      </el-form-item>
      <el-button type="success" @click="queryMethodCase()" size="medium">查询</el-button>
      <el-button type="success" @click="runCaseById()" size="medium">批量重试</el-button>
    </el-form>
    <el-table
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
        ref="casesTable"
        align="center"
        :cell-style="{'vertical-align':'center'}"
        :data="caseTableData"
        :row-style="{height:'0'}"
        style="width: 100%" stripe border max-height="800"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column min-width='140' type="selection"></el-table-column>
      <el-table-column prop="id" label="caseId" fixed width="70"></el-table-column>
      <el-table-column prop="method_docstring" label="标题" fixed></el-table-column>
      <el-table-column prop="method_steps" label="用例步骤" fixed width="300">
        <template slot-scope="scope">
          <div style="white-space: pre-line;"> {{scope.row.method_steps.split("\n").join("\n")}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="method_name" label="方法" fixed></el-table-column>
      <el-table-column prop="status" label="执行结果" width="100" fixed>
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
      <el-table-column prop="exception_info" label="异常信息" fixed></el-table-column>
      <el-table-column prop="fail_info" label="失败原因" fixed></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <!--只要不是待执行状态都给展示这些操作，后续体验上可以再优化-->
          <span v-if="scope.row.status !== 0"><el-link type="primary"
                                                       @click="runCaseById(scope.row)">重  试</el-link></span><br>
          <span v-if="scope.row.status !== 0"><el-link type="primary"
                                                       @click="remarkCase(scope.row,scope.row.id,scope.row.remark)">添加备注</el-link></span>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区域-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCaseForm.pageNum"
        :page-sizes="[10,20,50,80,100]"
        :page-size="queryCaseForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-dialog>
</template>


 <script>
 import request from "@/utils/request";

 export default {
  name: "Case",
  data() {
    return {
      queryCaseForm:{
        pageNum: 1,
        pageSize: 20,
      },
      caseTableData: [],
      isVisible: false,   //弹窗是否可见
      selectedData: [],
    }
  },
  methods: {
    init(class_id) {
      this.queryCaseForm.class_id = class_id
      this.isVisible = true
      this.$nextTick( () => {
        this.queryMethodCase()
      })
    },
    queryMethodCase() {
      request.post("pytest/getMethodCase", this.queryCaseForm).then(res => {
        res.data.forEach(cases => {
          this.caseTableData.push(cases)
        })
      })
    },
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange (selectedRows){
      this.selectedData = selectedRows
    },
    handleSizeChange(pageSize) {  //加载页码数据
      console.log(pageSize)
      this.queryCaseForm.pageSize = pageSize
      // this.queryTaskList()
    },
    handleCurrentChange(pageNum) {   //加载页码
      console.log(pageNum)
      this.queryCaseForm.pageNum = pageNum
      // this.queryTaskList()
    },
  }
}
 </script>
<style scoped>

</style>