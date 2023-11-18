<template>
  <div>
    <h1>Bug重新打开统计信息</h1>
    <div id="bugReopenChart" style="width: 400px; height: 400px;"></div>
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
      reopenCount: 0,
      totalBugCount: 0,
    };
  },
  methods: {
    async getReopenStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      try {
        const response = await request.post("/data/queryReopenBugCount", requestData);
        this.reopenCount = response.data.reopen_count;
        this.totalBugCount = response.data.total_bug_count;
        this.generateChart();
      } catch (error) {
        console.error("Error fetching bug Reopen stats:", error);
      }
    },
    generateChart() {
      const chart = echarts.init(document.getElementById('bugReopenChart'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: 'Bug重新打开统计信息',
            type: 'pie',
            radius: '50%',
            label: {
              show: true,
              formatter: '{b} : {c} ({d}%)',
            },
            data: [
              { value: this.reopenCount, name: '重新打开数量' },
              { value: this.totalBugCount - this.reopenCount, name: 'Bug 总数' },
            ],
          },
        ],
      };
      chart.setOption(option);
    },
  },
  mounted() {
    this.getReopenStats();
  },
};
</script>

<style>
</style>
