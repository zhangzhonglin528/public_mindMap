<template>
  <el-dialog
    class="nodeDialog"
    :title="$t('nodeNote.title')"
    :visible.sync="dialogVisible"
    width="500"
    append-to-body
  >
    <!-- <el-input
      type="textarea"
      :autosize="{ minRows: 3, maxRows: 5 }"
      placeholder="请输入内容"
      v-model="note"
    >
    </el-input> -->
    <div class="noteEditor" ref="noteEditor" @keyup.stop></div>
    <!-- <div class="tip">换行请使用：Enter+Shift</div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{
        $t('dialog.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Editor from '@toast-ui/editor'
import "@toast-ui/editor/dist/i18n/zh-cn";
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:53:54
 * @Desc: 节点备注内容设置
 */
export default {
  name: 'NodeNote',
  data() {
    return {
      dialogVisible: false,
      note: '',
      activeNodes: [],
      editor: null
    }
  },
  created() {

  },
  mounted() {
    this.$bus.$on('node_active', (...args) => {
      this.activeNodes = args[1]
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.note = firstNode.getData('note')
      } else {
        this.note = ''
      }
    })
    this.$bus.$on('showNodeNote', () => {
      this.$bus.$emit('startTextEdit')
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    })
  },
  methods: {
    /**
     * @Author: 王林25
     * @Date: 2022-05-09 11:37:05
     * @Desc: 初始化编辑器
     */
    initEditor() {
      if (!this.editor) {
        this.editor = new Editor({
          el: this.$refs.noteEditor,
          height: '500px',
          initialEditType: 'markdown',
          previewStyle: 'vertical',
          language: 'zh-CN',
        })
      }
      this.editor.setMarkdown(this.note)
    },

    /**
     * @Author: 王林
     * @Date: 2021-06-22 22:08:11
     * @Desc: 取消
     */
    cancel() {
      this.dialogVisible = false
      this.$bus.$emit('endTextEdit')
    },

    /**
     * @Author: 王林
     * @Date: 2021-06-06 22:28:20
     * @Desc:  确定
     */
    confirm() {
      this.note = this.editor.getMarkdown()
      this.activeNodes.forEach(node => {
        node.setNote(this.note)
      })
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
.nodeDialog {
  .tip {
    margin-top: 5px;
    color: #dcdfe6;
  }
}
</style>
