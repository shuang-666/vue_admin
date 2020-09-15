<template>
  <div class="login_box">
    <div class="login_content">
      <h1>用户登录</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="65px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="resetForm" class="test">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入接口
import { login } from "../../http/api";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async submitForm() {
      /**
       * 调用登录接口
       * 成功：
       *     保存token
       *     跳转到首页，并给出成功的提示
       * 失败：给出错误提示，让用户重新登录
       */
      const res = await login(this.ruleForm);
      console.log(res);
      const { token } = res.result;
      localStorage.setItem("token", token);
      //  记住上次没有token要访问的页面地址，如果登录成功，再返回到上次要访问到页面
      const { redirect } = this.$route.query;

      //如果直接登录，没有redirect,成功后直接跳转到home
      if (!redirect) {
        this.$router.push({ name: "home" });
      } else {
        this.$router.push({ path: redirect });
      }
    },
    resetForm() {
      console.log("重置");
      this.ruleForm.username = "";
      this.ruleForm.password = "";
    }
  }
};
</script>

<style lang="scss" scoped>
// html {
//   font-size: calc(100vw / 7.5);
// }
.login_box {
  width: 100%;
  height: 100%;
  background-color: #324057;
  position: relative;
  .login_content {
    width: 35%;
    height: 350px;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    top: 25%;
    left: 30%;
    h1 {
      text-align: center;
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
    .demo-ruleForm {
      padding: 30px;
      .test {
        background-color: #999;
        color: white;
      }
    }
  }
}
</style>
