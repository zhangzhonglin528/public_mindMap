<template>
  <div>
    <h1>Bug有效性统计</h1>
    <div id="bugEffectivenessChart" style="width: 400px; height: 400px;"></div>
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
      invalidCount: 0, // 无效bug数
      validCount: 0,   // 有效bug数
    };
  },
  methods: {
    // 在方法中获取无效bug数和有效bug数数据，例如从接口调用
    async getBugEffectivenessStats() {
      const requestData = {
        project: this.$props.project,
        version: this.$props.version
      }
      request.post("/data/queryBugEffectiveness", requestData).then(res => {
        this.invalidCount = res.data[0]
        this.validCount = res.data[1]
        this.generateChart()   // 图表渲染是同步的，所以在这边再调用一次，相当于拿到值以后重新渲染一遍
      })
    },
    // 使用Echarts生成环形图
    generateChart() {
      const chart = echarts.init(document.getElementById('bugEffectivenessChart'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['无效', '有效'],
        },
        series: [
          {
            name: 'Bug 有效性',
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
              { value: this.invalidCount || 0, name: '无效' },
              { value: this.validCount || 0, name: '有效' },
            ],
          },
        ],
      };
      chart.setOption(option);
    },
  },
  mounted() {
    this.getBugEffectivenessStats(); // 获取数据
    this.generateChart(); // 生成图表
  },
};
</script>

<style>
/* 可以添加一些样式 */
</style>
