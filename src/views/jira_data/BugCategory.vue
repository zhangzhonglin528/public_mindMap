<template>
  <div>
    <h1>Bug分类数据统计</h1>
    <div id="bugCategoryChart" style="width: 400px; height: 400px;"></div>
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
      categoryData: {},
      barChart: null, // 添加一个变量用来存储 ECharts 实例
    };
  },
  methods: {
    // 在方法中获取不同分类下的 bug 数据，例如从接口调用
    async getBugCategoryStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      request.post("/data/queryBugCategory", requestData).then(res => {
        this.categoryData = res.data;
        console.log("Category Data:", this.categoryData);
        this.generateChart();
      });
    },
    // 使用Echarts生成饼图
    generateChart() {
      // const containerElement = document.getElementById('bugCategoryChart');
      // if (!this.bugDetails ||  !containerElement) {
      //   return; // 如果 bugDetails 为 null，直接返回，不执行后面的操作
      // }
      const chart = echarts.init(document.getElementById('bugCategoryChart'));
      const categories = Object.keys(this.categoryData);
      const data = categories.map(category => ({
        name: category,
        value: this.categoryData[category].count,
      }));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: categories,
        },
        series: [
          {
            name: 'Bug 分类',
            type: 'pie',
            radius: '50%',
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
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
    this.getBugCategoryStats(); // 获取数据并生成图表
    this.generateChart()
  },
};
</script>

<style>
/* 可以添加一些样式 */
</style>
