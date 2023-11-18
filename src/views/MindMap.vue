<template>
  <div class="mindMapDemo">
    <div id="mindMapContainer"></div>
    <div class="toolbar">
      <button @click="setBgColor">设置背景颜色</button>
      <button @click="setBgImage">设置背景图片</button>
      <button @click="setLineStyle">设置连线样式</button>
      <button @click="switchLineStyle">切换连线风格</button>
      <button @click="switchGaLineStyle">设置概要的连线样式</button>
      <button @click="switchAsLineStyle">设置关联线的样式</button>
      <button @click="useNodeLineStyle">使用底边风格</button>
      <button @click="setNodePadding">设置节点内边距</button>
      <button @click="setNodeImageSize">设置节点图片宽高</button>
      <button @click="setNodeIconSize">设置节点图标宽高</button>
      <button @click="setNodeMargin">设置节点外边距</button>
      <button @click="showWatermark">显示水印</button>
      <button @click="hideWatermark">隐藏水印</button>
      <button @click="updateWatermark">更新水印</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, shallowRef } from 'vue';
import MindMap from "simple-mind-map";

export default {
  data() {
    return {
      mindMap: null,
      activeNodes: shallowRef([]),
      watermarkConfig: {
        text: '', // Initially hide the watermark
        lineSpacing: 100,
        textSpacing: 100,
        angle: 30,
        textStyle: {
          color: '#999',
          opacity: 0.5,
          fontSize: 14,
        },
      },
    };
  },
  methods: {
    showWatermark() {
      this.watermarkConfig.text = '街角小林';
      this.updateWatermark();
    },
    hideWatermark() {
      this.watermarkConfig.text = ''; // Hide the watermark
      this.updateWatermark();
    },
    updateWatermark() {
      // 销毁现有实例
      if (this.mindMap) {
        this.mindMap.destroy();
      }

      // 设置为 null，确保在下一轮事件循环中再次实例化
      this.mindMap = null;

      // 创建新的实例
      this.$nextTick(() => {
        this.mindMap = new MindMap({
          el: document.getElementById('mindMapContainer'),
          data: {
            // Your existing data
            // ...
          },
          initRootNodePosition: ['left', 'center'],
          watermarkConfig: this.watermarkConfig,
        });
        // 监听节点激活事件
        this.mindMap.on('node_active', this.onNodeActive);
      });
    },

  },
    setBgColor() {
      this.mindMap.setThemeConfig({
        backgroundColor: '#A4DD00'
      });
    },
    setBgImage() {
      this.mindMap.setThemeConfig({
        backgroundImage: 'https://lxqnsys.oss-cn-beijing.aliyuncs.com/assets/2eY858A1mo.jpeg',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      });
    },
    setLineStyle() {
      this.mindMap.setThemeConfig({
        lineColor: '#009CE0',
        lineWidth: 3,
        lineDasharray: '15, 10, 5, 10, 15',
      });
    },
    switchLineStyle() {
      this.mindMap.setThemeConfig({
        lineStyle: lineStyleList[(curLineStyleIndex++) % 3]
      });
    },
    switchGaLineStyle() {
      this.mindMap.setThemeConfig({
        generalizationLineColor: '#FA28FF',
        generalizationLineWidth: 4
      });
    },
    switchAsLineStyle() {
      this.mindMap.setThemeConfig({
        associativeLineColor: '#FA28FF',
        associativeLineWidth: 4,
        associativeLineActiveColor: '#9F0500',
        associativeLineActiveWidth: 6
      });
    },
    useNodeLineStyle() {
      this.mindMap.setThemeConfig({
        nodeUseLineStyle: true
      });
    },
    setNodePadding() {
      this.mindMap.setThemeConfig({
        paddingX: 30,
        paddingY: 20
      });
    },
    setNodeImageSize() {
      this.mindMap.setThemeConfig({
        imgMaxWidth: 50,
        imgMaxHeight: 50
      });
    },
    setNodeIconSize() {
      this.mindMap.setThemeConfig({
        iconSize: 30,
      });
    },
    setNodeMargin() {
      this.mindMap.setThemeConfig({
        second: {
          marginX: 30,
          marginY: 20
        },
        node: {
          marginX: 40,
          marginY: 30
        }
      });
    },
    onNodeActive(node, nodeList) {
      this.activeNodes.value = nodeList;
    },

  mounted() {
    this.mindMap = new MindMap({
      el: document.getElementById('mindMapContainer'),
      data: {
        "data":{
          "text":"根节点",
        },
        "children":[
          {
            "data":{
              "text":"二级节点",
              "generalization":{
                "text":"概要",
              },
            },
            "children":[
              {
                "data":{
                  "text":"分支主题",
                  "icon": ['priority_1'],
                },
                "children":[]
              },
              {
                "data":{
                  "text":"分支主题",
                  "associativeLineTargets":["66cb3fae-713e-4201-b2a3-86401d63fb58"],
                  "associativeLineTargetControlOffsets":[[{"x":-25,"y":0},{"x":25,"y":0}]]
                },
                "children":[]
              }
            ]
          },
          {
            "data":{
              "text":"二级节点",
              "id":"66cb3fae-713e-4201-b2a3-86401d63fb58",
              "image": "https://lxqnsys.oss-cn-beijing.aliyuncs.com/qlx/xh2AXkBxYm5jGe5fD7DWYrC5b.png",
              "imageSize": {
                "width": 100,
                "height": 100
              },
            },
            "children":[]
          }
        ]
      },
      initRootNodePosition: ['left', 'center']
    });

    // 监听节点激活事件
    this.mindMap.on('node_active', this.onNodeActive);
  },
  watch: {
    watermarkConfig: {
      handler() {
        // Update watermark when the configuration changes
        this.updateWatermark();
      },
      deep: true,
    },
  },
};
</script>

<style>
@import "~simple-mind-map/dist/simpleMindMap.esm.css";

.mindMapDemo {
  width: 100%;
  position: relative;
}

#mindMapContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 400px;
}

#mindMapContainer * {
  margin: 0;
  padding: 0;
}

.toolbar {
  position: absolute;
  left: 10px;
  top: 10px;
}
</style>
