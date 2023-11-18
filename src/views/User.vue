<template>
  <div>
    <!--          输入框-->
    <div style="margin: 10px 0">
        <el-input class="search-input" style=" width: 200px" placeholder="手机号" suffix-icon="el-icon-search" v-model="form.mobile_phone"></el-input>
      <el-input class="search-input" style="width: 200px" placeholder="邮箱" suffix-icon="el-icon-search" v-model="form.email"></el-input>
      <template>
        <el-select class="search-select" v-model="form.business" filterable placeholder="请选择业务">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </template>
      <el-button class="search-button" type="primary" @click="load">搜索</el-button>
      <el-button class="search-button" type="warning" @click="reset">重置</el-button>
    </div>
    <!--          按钮区域-->
    <div style="margin: 10px 0">
      <el-button class="button-container" type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
    </div>
    <!--          表单内容-->
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="user_id" label="user_id" min-width="280">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="120">
      </el-table-column>
      <el-table-column prop="username" label="账号" min-width="120">
      </el-table-column>
      <el-table-column prop="mobile_phone" label="手机号" min-width="120" :formatter="formatPhoneNumber">
      </el-table-column>
      <el-table-column prop="email" label="邮箱"  min-width="200" :formatter="formatEmail">
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="360">
      </el-table-column>
      <el-table-column prop="business" label="业务" min-width="120">
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
          <!--                删除的二次确认气泡-->
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)">
            <el-button type="danger" slot="reference">删除<i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--          分页插件-->
    <div class="pagination-container">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.current_page"
          :page-sizes="[10,20,50,80,100]"
          :page-size="form.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <!--          新增弹窗入口 dialog-->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="25%" >
      <el-form ref="addForm" label-width="80px" size="small">
        <el-form-item label="账号">
          <el-input style="width: 205px" v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input style="width: 205px" v-model="addForm.password" autocomplete="off"
                    :type="editMode ? 'password' : 'text'"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input style="width: 205px" v-model="addForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" style="width: 205px" v-model="addForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email">
          <el-input style="width: 205px" v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input style="width: 205px" v-model="addForm.mobile_phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="业务">
          <template>
            <el-select style="width: 205px" v-model="addForm.business" filterable placeholder="请选择用户类型">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "User",
  data() {
    return  {
      tableData: [],
      total: 0,
      form: {
        pageNum: 1,
        pageSize: 10,
      },
      addForm:{},
      editMode: false, // 初始化为新增模式
      dialogFormVisible: false,
      multipleSelection: [],
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      headerBg: 'headerBg',
      options: [{
        value: '彩云天气',
      }, {
        value: '彩云小译',
      }, {
        value: '彩云小梦',
      }],
      value: '',
    }
  },
  created() {
    //请求分页查询的数据
    this.load()
  },
  methods:{
    formatPhoneNumber(row) {
      const phoneNumber = row.mobile_phone;
      if (phoneNumber && phoneNumber.length === 11) {
        return phoneNumber.substring(0, 3) + '****' + phoneNumber.substring(7);
      }
      return phoneNumber; // 如果手机号格式不符合预期，原样返回
    },
    formatEmail(row) {
      const emailParts = row.email.split('@');
      if (emailParts.length === 2) {
        const username = emailParts[0];
        const domain = emailParts[1];
        const hiddenPart = '*'.repeat(username.length - 2); // 隐藏部分使用 * 替代
        const visiblePart = username[0] + hiddenPart + username[username.length - 1];
        return `${visiblePart}@${domain}`;
      }
      return row.email; // 如果邮箱格式不符合预期，原样返回
    },
    handleSizeChange(pageSize) {  //加载页码数据
      this.form.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {   //加载页码
      this.form.pageNum = pageNum
      this.load()
    },
    load() {    //请求查询接口
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post("user/getUserInfo", this.form).then(res => {
        if (res.result === 200) {
          this.tableData = res.data.user_list
          this.total = res.data.total
          loading.close()
        }
      }).catch(error => {
        console.error('请求失败，请检查网络', error.message)
      })
    },
    addUser() {
      request.post("/user/addUser", this.addForm).then(res => {
        if (res.result === 200){
          this.$message.success(res.error_msg)
          this.dialogFormVisible = false     //保存成功关闭弹窗
        }else {
          this.$message.error(res.error_msg)
        }
        this.load()
      })
    },
    del(id) {
      request.post("/user/delUser",{"id": id}).then(res => {
        if (res.result === 200) {
          this.$message.success("删除成功！")
          this.load()
        } else {
          this.$message.error(res.error_msg)
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    reset() {  // 重置按钮
      this.form.mobile_phone = null
      this.form.email = null
      this.form.business = null
      this.load()
    },
    handleAdd() {  //新增dialog方法
      /**如果新增时字段是undefined，就不调用resetFields方法(此方法也可以放在编辑方法里面或者在关闭dialog之前，好处就是不用判断是否有值**/
      if (this.$refs.addForm !== undefined) this.$refs['addForm'].resetFields()
      this.dialogFormVisible = true
      this.addForm = {}
    },
    handleEdit(row) {  //编辑dialog方法
      this.editMode = true
      this.addForm = row
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped>
.search-container {
  margin: 10px 0;
}

.search-input {
  width: 200px;
}

.search-select {
  width: 200px;
  margin-left: 5px;
}

.search-button {
  margin-left: 5px;
}

.button-container {
  margin: 10px 0;
}

.pagination-container {
  padding: 10px 0;
}
</style>