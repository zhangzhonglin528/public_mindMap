<template>
  <div>
    <h1>未解决的Bug列表</h1>
    <ul class="bug-list">
      <li v-for="bug in unresolvedBugs" :key="bug.key" class="bug-list-item">
        <span class="bullet">·</span> {{ bug.summary }}
      </li>
    </ul>
    <div id="bugChart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import request from "@/utils/request";

export default {
  props: {
    project: String,
    version: String,
  },
  data() {
    return {
      unresolvedBugs: [], // 待修复的bug列表数据
    };
  },
  methods: {
    // 在方法中获取待修复的bug数据，例如从接口调用
    async getUnresolvedBugs() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      // 调用后端接口获取待修复的bug数据
      request.post("/data/queryUnresolvedBugs", requestData).then(res => {
        this.unresolvedBugs = res.data
      })
    },
    // 使用Echarts生成图表
    generateChart() {
      const chart = echarts.init(document.getElementById('bugChart'));
      // 构造图表配置项和数据
      const option = {
        // 配置图表的样式和数据
      };
      chart.setOption(option);
    },
  },
  mounted() {
    this.generateChart(); // 生成图表
    this.getUnresolvedBugs()
  },
};
</script>

<style>
.bug-list {
  padding-left: 0; /* 清除默认的左边距 */
  list-style: none; /* 移除列表样式 */
}

.bug-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* 调整列表项之间的间距 */
}

.bullet {
  font-size: 16px;
  margin-right: 8px; /* 调整·标签与文本之间的间距 */
}
</style>
