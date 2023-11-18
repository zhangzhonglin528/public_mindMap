<template>
  <div>
    <h1>Bug修复统计信息</h1>
    <div id="bugFixingChart" style="width: 400px; height: 400px;"></div>
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
      fixedCount: 0,   // 本版本修复的 bug 数
      leftoverCount: 0,   // 遗留到下个版本/以后修复的 bug 数
      barChart: null, // 添加一个变量用来存储 ECharts 实例
    };
  },
  methods: {
    // 在方法中获取修复的 bug 数目和遗留 bug 数目数据
    async getBugFixingStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      request.post("/data/queryBugFixing", requestData).then(res => {
        this.fixedCount = res.data[0]
        this.leftoverCount = res.data[1]
        this.generateChart()
      })
    },
    // 使用Echarts生成环形图
    generateChart() {
      // const containerElement = document.getElementById('bugFixingChart');
      // if (!this.bugDetails ||  !containerElement) {
      //   return; // 如果 bugDetails 为 null，直接返回，不执行后面的操作
      // }
      const chart = echarts.init(document.getElementById('bugFixingChart'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['已修复', '遗留'],
        },
        series: [
          {
            name: 'Bug修复统计信息',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: this.fixedCount || 0, name: '已修复' },
              { value: this.leftoverCount || 0, name: '遗留' },
            ],
          },
        ],
      };
      chart.setOption(option);
    },
  },
  beforeDestroy() {
    if (this.barChart) {
      this.barChart.dispose(); // 在组件销毁前销毁 ECharts 实例
    }
  },
  activated() {
    this.generateBarChart(); // 在组件被激活时重新初始化 ECharts 实例
  },
  mounted() {
    this.getBugFixingStats(); // 获取数据
    this.generateChart(); // 生成图表
  },
};
</script>

<style>
</style>
