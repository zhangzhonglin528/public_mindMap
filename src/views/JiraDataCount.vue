<template>
  <div class="dashboard">
    <div class="top-bar">
      <!-- 项目选择框 -->
      <el-select v-model="selectedProject" placeholder="请选择项目">
        <el-option v-for="project in projects" :key="project" :value="project">{{ project }}</el-option>
      </el-select>

      <!-- 版本输入框 -->
      <el-input v-model="selectedVersion" placeholder="请输入版本号" style="width: 180px"></el-input>

      <!-- 查询按钮 -->
      <el-button @click="queryData">查询</el-button>
    </div>
    <div class="row">
      <!-- 列表组件 -->
      <div class="component-item full-width">
        <UnresolvedBugs ref="unresolvedBugs" :project="selectedProject" :version="selectedVersion"></UnresolvedBugs>
      </div>
      <!-- 折线图组件 -->
      <div class="component-item half-width">
        <BugReportAndBugVerify ref="bugReportAndBugVerify" :project="selectedProject" :version="selectedVersion"></BugReportAndBugVerify>
      </div>
    </div>    <div class="row">
      <!-- 左侧环形组件 -->
      <div class="component-item half-width">
        <BugEffectiveness ref="bugEffectiveness" :project="selectedProject" :version="selectedVersion"></BugEffectiveness>
      </div>
      <!-- 右侧环形组件 -->
      <div class="component-item half-width">
        <BugFixing ref="bugFixing" :project="selectedProject" :version="selectedVersion"></BugFixing>
      </div>
    </div>
    <div class="row">
      <!-- 左侧饼图组件 -->
      <div class="component-item half-width">
        <BugReopen ref="bugReopen" :project="selectedProject" :version="selectedVersion"></BugReopen>
      </div>
      <!-- 右侧饼图组件 -->
      <div class="component-item half-width">
        <BugCategory ref="bugCategory" :project="selectedProject" :version="selectedVersion"></BugCategory>
      </div>
    </div>
    <div class="row">
      <!-- 左侧柱状图组件 -->
      <div class="component-item half-width">
        <BugPriority ref="bugPriority" :project="selectedProject" :version="selectedVersion"></BugPriority>
      </div>
      <!-- 右侧柱状图组件 -->
      <div class="component-item half-width">
        <NewOrOldBugs ref="newOrOldBugs" :project="selectedProject" :version="selectedVersion"></NewOrOldBugs>
      </div>
    </div>
  </div>
</template>

<script>
import UnresolvedBugs from "@/views/jira_data/UnresolvedBugs.vue";
import BugEffectiveness from "@/views/jira_data/BugEffectivenessStats.vue";
import BugFixing from "@/views/jira_data/BugFixing.vue";
import BugPriority from "@/views/jira_data/BugPriority.vue";
import BugReopen from "@/views/jira_data/BugReopen.vue";
import BugCategory from "@/views/jira_data/BugCategory.vue";
import BugReportAndBugVerify from "@/views/jira_data/BugReportAndBugVerify.vue";
import NewOrOldBugs from "@/views/jira_data/NewOrOldBugs.vue";
export default {
  name: "JiraDataCount",
  components: {
    UnresolvedBugs,
    BugEffectiveness,
    BugFixing,
    BugPriority,
    BugReopen,
    BugCategory,
    BugReportAndBugVerify,
    NewOrOldBugs,
  },
  data() {
    return {
      projects: ["WEATHER", "VSWP"], // 示例项目数组
      selectedProject: "WEATHER", // 默认项目选择
      selectedVersion: "7.2.0",  // 默认版本选择
    };
  },
  methods: {
    queryData() {
      this.$refs.unresolvedBugs.getUnresolvedBugs(this.selectedProject, this.selectedVersion);
      this.$refs.bugReportAndBugVerify.getBugReportVerifyStats(this.selectedProject, this.selectedVersion);
      this.$refs.bugEffectiveness.getBugEffectivenessStats(this.selectedProject, this.selectedVersion);
      this.$refs.bugFixing.getBugFixingStats(this.selectedProject, this.selectedVersion);
      this.$refs.bugReopen.getReopenStats(this.selectedProject, this.selectedVersion);
      this.$refs.bugCategory.getBugCategoryStats(this.selectedProject, this.selectedVersion);
      this.$refs.bugPriority.getBugPriorityStats(this.selectedProject, this.selectedVersion);
      this.$refs.newOrOldBugs.getNewOldFeatureBugDetails(this.selectedProject, this.selectedVersion);

    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.top-bar > * {
  margin-right: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* 对齐方式改为 stretch */
  margin-bottom: 20px;
  width: 100%;
}

.component-item {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.full-width {
  width: 100%;
}

.half-width {
  width: 50%;
}
</style>





