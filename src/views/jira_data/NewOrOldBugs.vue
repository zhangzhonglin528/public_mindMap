<template>
  <div>
    <h1>新&老bug数据统计</h1>
    <div id="barChart" style="width: 60%; height: 400px;"></div>
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
      bugDetails: null,
      barChart: null, // 添加一个变量用来存储 ECharts 实例
    };
  },
  methods: {
    async getNewOldFeatureBugDetails() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      await request.post("/data/queryNewOldFeatureBugs", requestData).then(res => {
        this.bugDetails = res.data
        this.generateBarChart()
      })
    },
    generateBarChart() {
      const containerElement = document.getElementById('barChart');
      if (!this.bugDetails ||  !containerElement) {
        return; // 如果 bugDetails 为 null，直接返回，不执行后面的操作
      }
      const barChart = echarts.init(document.getElementById('barChart'));

      const xAxisData = ['新', '老'];
      const seriesData = this.bugDetails.map((bugList) => bugList.length);

      const option = {
        grid: {
          left: '5%', // 调整图表左边距
          right: '5%', // 调整图表右边距
          top: '5%', // 调整图表上边距
          bottom: '5%', // 调整图表下边距
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
            itemStyle: {
              color: '#007BFF',
            },
          },
        ],
      };

      barChart.setOption(option);
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
    this.getNewOldFeatureBugDetails();
    this.$nextTick(() => {
      this.generateBarChart();
    });
  },
};
</script>

<style>
</style>
