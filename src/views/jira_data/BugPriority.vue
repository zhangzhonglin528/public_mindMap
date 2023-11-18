<template>
  <div>
    <h1>Bug优先级统计</h1>
    <div id="bugPriorityChart" style="width: 600px; height: 400px;"></div>
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
      priorityData: {},
    };
  },
  methods: {
    // 在方法中获取Bug优先级数据，例如从接口调用
    async getBugPriorityStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      request.post("/data/queryBugPriority", requestData).then(res => {
        this.priorityData = res.data;
        this.generateChart();
      })
    },
    // 使用Echarts生成柱状图
    generateChart() {
      if (this.priorityData) {
        const chart = echarts.init(document.getElementById('bugPriorityChart'));
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: Object.keys(this.priorityData),
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: Object.values(this.priorityData).map(item => item.count),
            type: 'bar',
          }]
        };
        chart.setOption(option);
      }
    },
  },
  mounted() {
    this.getBugPriorityStats(); // 获取数据
  },
};
</script>

<style>
/* 可以添加一些样式 */
</style>
