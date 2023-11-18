<template>
  <div>
    <h1>Bug报告和验证统计信息</h1>
    <div id="bugReportVerifyChart" style="width: 600px; height: 400px;"></div>
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
      dateList: [], // 日期列表
      reportData: [], // 上报数据列表
      verifyData: [], // 验证数据列表
    };
  },
  methods: {
    // 在方法中获取每天 bug 上报和验证统计数据，例如从接口调用
    async getBugReportVerifyStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      request.post("/data/queryBugReportVerify", requestData).then(res => {
        this.dateList = res.data[0];
        this.reportData = res.data[1];
        this.verifyData = res.data[2];
        this.generateChart();
      });
    },
    // 使用Echarts生成折线图
    generateChart() {
      const chart = echarts.init(document.getElementById('bugReportVerifyChart'));
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['已上报', '已验证'],
        },
        xAxis: {
          type: 'category',
          data: this.dateList,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: '已上报',
            data: this.reportData,
            type: 'line',
          },
          {
            name: '已验证',
            data: this.verifyData,
            type: 'line',
          },
        ],
      };
      chart.setOption(option);
    },
  },
  mounted() {
    this.getBugReportVerifyStats(); // 获取数据并生成图表
  },
};
</script>

<style>
/* 可以添加一些样式 */
</style>
