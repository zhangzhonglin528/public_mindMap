<template>
  <div>
    <div class="card-container">
      <el-card class="custom-box-card" :style="{ backgroundColor: '#007BFF' }">
        <div @click="queryScene('')" class="text item custom-text">全部</div>
      </el-card>
      <el-card class="custom-box-card" :style="{ backgroundColor: '#FF6C11' }">
        <div @click="queryScene('weather')" class="text item custom-text">彩云天气</div>
      </el-card>
      <el-card class="custom-box-card" :style="{ backgroundColor: '#27AE60' }">
        <div @click="queryScene('vswp')" class="text item custom-text">彩云小译</div>
      </el-card>
          <!--尝试新的写法：使用.native 修饰符用于监听组件根元素的原生事件-->
      <el-card class="custom-box-card" @click.native="queryScene('dreamily')" :style="{ backgroundColor: '#E91E63' }">
        <div class="text item custom-text">彩云小梦</div>
      </el-card>
    </div>
    <!-- 搜索栏部分 -->
    <div class="search-container">
      <el-input v-model="sceneFrom.scene_name" placeholder="根据场景名称查询..." class="custom-input"></el-input>
      <el-button type="primary" @click="queryScene()">搜索</el-button>
      <el-button type="primary" @click="getInitSceneData()" plain icon="el-icon-circle-plus-outline">新增场景</el-button>
    </div>
    <el-tabs  v-model="activeTab" default-active="tab1">
      <el-tab-pane label="全部场景" name="tab1">
        <!-- 表格1内容 -->
        <el-table :data="tableData1" style="width: 100%" class="custom-table">
          <el-table-column
              prop="scene_name"
              label="场景名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="scene_desc"
              label="场景说明"
              width="420">
          </el-table-column>
          <el-table-column prop="running_result" label="运行结果" width="180">
            <template slot-scope="scope">
          <span v-if="scope.row.running_result === 1">
            <el-tag key="passed" type="success" effect="dark">passed</el-tag></span>
              <span v-if="scope.row.running_result === 2">
            <el-tag key="failed" type="danger" effect="dark">failed</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
              prop="update_time"
              label="最后触发时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="business"
              label="所属业务"
              width="180">
          </el-table-column>
          <el-table-column
              prop="user"
              label="所属用户">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="openEditDialog(scope.row.id)" class="el-button"><i class="el-icon-edit"></i></el-button>
              <el-button type="success" @click="openTestSceneDialog(scope.row.id)" class="el-button"><i class="el-icon-position"></i></el-button>
              <edit-data-center-dialog @data-updated="queryScene()" v-if="editDialogVisible" ref="editDialog"></edit-data-center-dialog>

            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="tab2">
        <!-- 表格2内容 -->
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column
              prop="scene_name"
              label="场景名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="scene_desc"
              label="场景说明"
              width="180">
          </el-table-column>
          <el-table-column
              prop="running_result"
              label="运行结果"
              width="180">
          </el-table-column>
          <el-table-column
              prop="running_number"
              label="运行次数"
              width="180">
          </el-table-column>
          <el-table-column
              prop="running_rate"
              label="成功率"
              width="180">
          </el-table-column>
          <el-table-column
              prop="update_time"
              label="最后触发时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="business"
              label="所属业务"
              width="180">
          </el-table-column>
          <el-table-column
              prop="user"
              label="所属用户">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
              <el-button type="success" @click="handleEdit(scope.row)">报告<i class="el-icon-view"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div>
      <data-scene-result v-if="dialogVisible" ref="testSceneParams"></data-scene-result>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import DataSceneResult from "@/views/DataSceneResultDialog.vue";
import EditDataCenterDialog from "@/views/EditDataCenterDialog.vue";

export default {
  components: {EditDataCenterDialog, DataSceneResult},
  data() {
    return {
      testSceneForm:{
         phone_num: 12880000104
      },
      sceneFrom:{
        page_size:10,
        current_page:1,
        business_type: '',
        scene_name: '',
      },
      form: {},
      searchQuery: '',
      tableData1: [],
      tableData2: [],
      activeTab: 'tab1', // 设置默认选中标签
      dialogVisible: false,
      rowData: {}, // 存储编辑数据
      editDialogVisible: false, // 用于控制 dialog 是否可见
    };
  },
  created() {
    this.queryScene()
  },
  methods: {
    queryScene(businessType) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.sceneFrom.business_type = businessType
      request.post("/analysis/queryScene", this.sceneFrom).then(res => {
        if (res.data && res.data.scene_list) {
          this.tableData1 = res.data.scene_list;
        } else {
          // 处理未定义或 null 的场景
          console.error('响应中的scene_list无效或缺失:', res);
        }
        if (res.error_msg === "success") {
          loading.close()
        }
      })
    },
    getInitSceneData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post("/analysis/analysisScene", this.from).then(res => {
        if (res.error_msg === "success") {
          loading.close()
          this.$message.success('数据加载完成！');
          this.queryScene()
        }
      })
    },
    openTestSceneDialog(row) {
      this.dialogVisible = true
      this.$nextTick(()=> {
        this.$refs.testSceneParams.init(row)
      })
    },
    openEditDialog(row) {
      this.editDialogVisible = true
      this.$nextTick(()=> {
        this.$refs.editDialog.init(row)
      })
    },
  },
};
</script>
<style scoped>
.text {
  font-size: 20px;
}

.custom-text {
  color: #fff; /* 设置字体颜色 */
}

.card-container {
  display: inline-flex; /* 设置为水平排列 */
  flex-wrap: wrap; /* 当空间不够时换行 */
  gap: 10px; /* 控制卡片之间的间距 */
}

.custom-box-card {
  width: 150px; /* 控制卡片宽度 */
  cursor: pointer; /* 鼠标样式，表示可点击 */
  transition: background-color 0.3s; /* 添加点击效果的过渡动画 */
}

.custom-box-card:hover {
  background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}

/* 搜索栏样式 */
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 将内容靠右对齐 */
  gap: 10px;
  margin-top: 10px; /* 控制搜索栏距离卡片的间距 */
}

/* 自定义输入框宽度 */
.custom-input {
  width: 150px; /* 调整输入框的宽度 */
}

/* 自定义表格样式 */
.custom-table {
  background: #f5f5f5; /* 设置表格背景色 */
}


/* 添加按钮悬浮效果 */
.el-button:hover {
  background: #409EFF; /* 鼠标悬停时的背景颜色 */
  color: #fff; /* 鼠标悬停时的文本颜色 */
  transition: background 0.3s, color 0.3s; /* 添加按钮悬浮效果的过渡动画 */
}

/* 添加图标到标签页 */
.el-tab-pane i::before {
  font-size: 15px;
  margin-right: 10px;
}
</style>
