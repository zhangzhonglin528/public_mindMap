<template>
  <div class="wrapper">
    <div class="login-container">
      <div class="login-header">
        <h2>登录</h2>
      </div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="telephone">
          <el-input size="medium" prefix-icon="el-icon-user" v-model="user.username" placeholder="请输入用户名" autofocus></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input size="medium" prefix-icon="el-icon-lock" show-password v-model="user.password" placeholder="请输入密码" autofocus></el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button
              :disabled="disableBtn"
              class="btn-login"
              type="warning"
              size="medium"
              @click="login"
              @keyup.enter="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 11, max: 18, message: '长度在 11 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      },
      disableBtn: false,
    }
  },
  mounted () {
    const h = this.$createElement
    this.notify = this.$notify({
      title: '提示',
      message: h('div', null, [
        h('p', null, '如没有账号，请联系彩云测试团队。'),
        h('p', null, 'ps：内部系统，暂不开放注册。')
      ]),
      duration: 0
    })
  },
  methods: {
    async login() {
      this.$refs['userForm'].validate().then(valid => {
        if (!valid) {
          return false;
        }
        request.post("/user/login", this.user)
            .then(res => {
              if (res?.result === 200) {
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify(res.data));
                this.$message.success("登录成功");
                this.$router.push("/");
                this.notify?.close();
              } else {
                const errorMessage = res?.data?.error?.message || res?.error_msg;
                this.$message.error(errorMessage);
              }
            })
            .catch(err => {
              console.error("登录请求失败:", err);
              this.$message.error("登录失败，请重试。");
            });
      });
    },
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: url('../../public/12121.png'); /* 设置你的背景图片路径 */
  background-size: cover; /* 背景图片铺满整个容器 */
  background-position: center; /* 居中显示背景图片 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background-color: #fff;
  width: 350px;
  height: 300px;
  padding: 20px;
  border-radius: 10px;
}

.login-header {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.login-button {
  text-align: center;
}

.btn-login {
  background-color: #2c3e50; /* 暗黑色 */
  border: none;
  height: 38px;
  width: 100%;
  color: #fff; /* 按钮文字颜色为白色 */
}
</style>

