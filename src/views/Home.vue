<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 60px">
      <el-col :span="6">
        <el-card style="color: #409EFF">
          <div><i class="el-icon-success" /> 本周成功用例总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{ successCaseCount }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C">
          <div><i class="el-icon-error" /> 本周失败用例总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{ failCaseCount }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A">
          <div><i class="el-icon-star-on" /> 本周执行用例总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{ caseCount }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #E6A23C">
          <div><i class="el-icon-warning" /> 本周异常用例总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{ exceptionCaseCount }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px; height: 450px"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 500px; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from "@/utils/request";
export default {
  components : {
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {
      tableData:[],
      caseCount: 0,
      failCaseCount: 0,
      successCaseCount: 0,
      exceptionCaseCount: 0,
      /**柱状图+折线图*/
      option : {
        title: {
          text: '近7天用例执行总数',
          subtext: '单人数据对比图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {   // 展示左侧上方的数据子项，例如series下面的name
          orient: 'vertical',
          left: 'left'
        },
        xAxis: {  // 横轴
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '折线图',
            data: [],
            type: 'line'    // 折线图=line
          },
          {
            name: '柱状图',
            data: [],
            type: 'bar'   // 柱状图=bar
          }
        ]
      },
      /**饼图*/
      pieOption : {
        title: {
          text: '近7天的执行任务数据统计',
          subtext: '任务执行比例图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '任务执行比例',
            type: 'pie',
            radius: '70%',  // 调整饼图大小比例
            center: ['50%', '60%'],  //调整上下位置，第一个参数是左右，第二个参数是上下
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'inner', //标签的位置
                textStyle : {
                  fontWeight : 300 ,
                  fontSize : 14,    //文字的字体大小
                  color: "#fff"
                },
                formatter:'{c}({d}%)'
              }
            },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  // created() {
  //   this.queryCaseCount()
  // },
  // mounted() {  //页面元素渲染之后再触发
  //   this.queryCaseCount()
  // },
  methods : {
    // queryCaseCount() { // 查询执行用例总数
    //   let _this = this;   // _this 保存外围的 vue this全局指向
    //   request.post("/data/count").then( res => {
    //     /** 获取case明细数量 */
    //     _this.caseCount = res.data.caseCount
    //     _this.failCaseCount = res.data.failCaseCount
    //     _this.successCaseCount = res.data.successCaseCount
    //     _this.exceptionCaseCount = res.data.exceptionCaseCount
    //     /** 获取折线图数据*/
    //     let charDom = document.getElementById('main');
    //     let myCharts = echarts.init(charDom);
    //     let ownerTemp = []
    //     let caseTemp = []
    //     let taskOptionTemp = []
    //     res.data.multidimensionalData.forEach((item)=>{
    //       ownerTemp.push(item.owner)
    //       caseTemp.push(item.privateDataNum)
    //       let temp = {
    //         name : item.owner,
    //         value: item.taskNum
    //       }
    //       taskOptionTemp.push(temp)
    //     })
    //     _this.option.xAxis.data = ownerTemp   // 横轴
    //     _this.option.series[0].data = caseTemp  //折线图  纵轴
    //     _this.option.series[1].data = caseTemp  //柱状图  纵轴
    //     myCharts.setOption(_this.option);
    //     /**获取饼图数据*/
    //     let pieDom = document.getElementById('pie');
    //     let pieMyCharts = echarts.init(pieDom);
    //     _this.pieOption.series[0].data = taskOptionTemp
    //     console.log(_this.pieOption.series[0].data)
    //     pieMyCharts.setOption(_this.pieOption)
    //
    //   })
    // }
  }
}
</script>

<style scoped>
</style>
Footer
