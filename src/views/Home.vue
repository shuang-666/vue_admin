<template>
  <div class="home_box">
    <el-container class="home_container">
      <el-header class="home_header">
        <el-row>
          <el-col :span="8">
            <div class="logo">公司logo</div>
          </el-col>
          <el-col :span="8">
            <div class="name">后台管理系统</div>
          </el-col>
          <el-col :span="8">
            <el-button class="off" @click="offLogin">退出</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="home_left">
        <el-aside width="200px" class="home_aside">
          <!-- 左侧 -->
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#485770"
            :unique-opened="true"
            text-color="#fff"
            :router="true"
          >
            <!-- 用户管理 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/userlist">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 权限管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-warning"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/roleList">
                  <i class="el-icon-menu"></i>
                  <span>角色列表</span>
                </el-menu-item>
                <el-menu-item index="/jurisdiction">
                  <i class="el-icon-menu"></i>
                  <span>权限列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 商品管理 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/list">
                  <i class="el-icon-menu"></i>
                  <span>商品列表</span>
                </el-menu-item>
                <el-menu-item index="/params">
                  <i class="el-icon-menu"></i>
                  <span>分类参数</span>
                </el-menu-item>
                <el-menu-item index="/categories">
                  <i class="el-icon-menu"></i>
                  <span>商品分类</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 订单管理 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/orders">
                  <i class="el-icon-menu"></i>
                  <span>订单列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 数据统计 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-s-platform"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/reports">
                  <i class="el-icon-menu"></i>
                  <span>数据报表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    offLogin() {
      //清除token
      localStorage.removeItem("token");
      //返回到登录页
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.home_box {
  width: 100%;
  height: 100%;
  .home_container {
    height: 100%;
    .home_header {
      width: 100%;
      height: 80px !important;
      background-color: #48576a;
      line-height: 80px;
      font-size: 25px;
      color: white;
      .logo {
        margin-left: 0px;
      }
      .name {
        text-align: center;
      }
      .off {
        float: right;
        margin-top: 20px;
      }
    }
    .home_left {
      height: 100%;
      overflow: hidden;
      .home_aside {
        height: 100%;
        position: fixed;
        top: 80px;
        left: 0;
        background-color: #485770;
        .el-menu-vertical-demo {
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          span {
            font-size: 15px;
          }
        }
        .el-menu-vertical-demo::-webkit-scrollbar {
          display: none;
        }
      }
      .el-main {
        margin-left: 200px;
      }
    }
  }
}
</style>
