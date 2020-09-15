/* eslint-disable no-undef */
<template>
  <div class="userlist_box">
    <!-- 面包屑开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑结束 -->

    <!-- 内容开始 -->
    <el-card class="box-card">
      <!-- 头部的开始 -->
      <el-input
        v-model="pafeInfo.query"
        placeholder="请输入内容"
        class="search"
        clearable
        @input="inputSearch"
      >
        <el-button icon="el-icon-search" slot="append" @click="inputSearch"></el-button>
      </el-input>
      <el-button type="primary" class="tianjia" @click="addUserDialog">添加用户</el-button>
      <!-- 头部的结束 -->
      <!-- 具体的数据的开始 -->
      <el-table :data="tableData" stripe border style="width: 100%;margin-top:20px;">
        <el-table-column type="index" label="#" width="50%" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" width="200%" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200%" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200%" align="center"></el-table-column>
        <el-table-column label="创建时间" width="200%" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="200%" align="center"></el-table-column>
        <el-table-column label="状态" width="200%" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setUserState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="socpe">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="openEditData(socpe.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteData(socpe.row.id)"
            ></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                circle
                @click="openUserRole(socpe.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器开始 -->
      <el-pagination
        class="fenye"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pafeInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pafeInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页器结束 -->
    </el-card>
    <!-- 内容的结束 -->
    <!-- 添加用户的遮罩层的开始 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="addUserForm" :model="userinfo" :rules="rules">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="userinfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="userinfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="userinfo.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="userinfo.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.prevent="addUserConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 结束 -->

    <!-- 编辑用户的开始 -->
    <el-dialog title="编辑用户" :visible.sync="openEdit">
      <el-form ref="updataUserForm" :model="userinfo" :rules="rules">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="userinfo.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="userinfo.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="userinfo.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openEdit = false">取 消</el-button>
        <el-button type="primary" @click.prevent="updataData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 结束 -->

    <!-- 角色的开始 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form :model="roleFrom">
        <div class="role_box">
          <p>当前用户 : {{ currentUser.username }}</p>
          <p>当前角色 : {{ currentUser.role_name }}</p>
        </div>
        <el-form-item label="分配角色" label-width="200">
          <el-select v-model="roleFrom.id" placeholder="请选择文章标签">
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="updataRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  add,
  deleteData,
  updataData,
  statusData,
  getUserRoleList,
  getUserRoleLEdit,
  getUserRoleLData
} from "../../http/api";
import _ from "lodash";
export default {
  data() {
    const isEmail = (rule, value, callback) => {
      //邮箱正则
      // eslint-disable-next-line no-useless-escape
      let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      let isTrue = reg.test(value);
      if (isTrue) {
        return callback();
      }
      callback(new Error("不符合邮箱的规则，请重新输入"));
    };
    //验证手机号的函数
    const isMobile = (rule, value, callback) => {
      let reg = /^[1][3,4,5,7,6,9,8][0-9]{9}$/;
      let isTrue = reg.test(value);
      if (isTrue) {
        return callback();
      }
      callback(new Error("不符合手机的规则，请重新输入"));
    };

    return {
      pafeInfo: {
        query: "", // 输入框绑定的值
        pagenum: 1, // 当前的页数
        pagesize: 5 //每页显示几条
      },
      total: 10,
      tableData: [],
      dialogFormVisible: false, // 添加用户的遮罩层
      userinfo: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }, // 添加用户绑定的信息
      openEdit: false, //编辑用户的信息
      roleDialog: false, // 分配角色
      roleFrom: {
        id: ""
      }, //角色分配
      currentId: "", //角色选中的id
      currentUser: {}, //当前的用户的信息
      roles: [], //角色的列表
      //添加用户表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: isEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: isMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 获取用户的数据
    this.getUserList();
  },
  methods: {
    // 更新角色
    async updataRoleConfirm() {
      this.currentId = this.roleFrom.id;
      await getUserRoleLData(this.currentId); // 查找用户的角色的分配
      // 修改用户的角色
      await getUserRoleLEdit(this.currentUser.id, {
        rid: this.currentId
      });
      this.getUserList();
      this.roleDialog = false;
    },
    // 打开分配用户角色列表
    async openUserRole(user) {
      this.currentUser = JSON.parse(JSON.stringify(user));
      this.roleDialog = true;
      const res = await getUserRoleList();
      console.log(res.result);
      this.roles = res.result;
    },
    // 更改用户的状态
    setUserState(user) {
      const { id, mg_state } = user;
      statusData(id, mg_state);
      this.getUserList();
    },
    // 编辑的确定
    updataData() {
      this.$refs.updataUserForm.validate(async valid => {
        if (valid) {
          const userId = this.userinfo.id;
          await updataData(userId, this.userinfo);
          // 更新视图
          this.getUserList();
          this.openEdit = false;
        } else {
          return false;
        }
      });
    },
    // 点击编辑的图标的时候，让遮罩层显示
    openEditData(user) {
      // 实现深拷贝
      this.userinfo = JSON.parse(JSON.stringify(user));
      this.openEdit = true;
    },
    // 删除的弹出层
    deleteData(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteData(userId);
          this.getUserList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击确定添加信息
    addUserConfirm() {
      this.$refs.addUserForm.validate(async valid => {
        if (valid) {
          await add(this.userinfo);
          this.getUserList();
          this.userinfo = {
            username: "",
            password: "",
            email: "",
            mobile: ""
          };
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    // 添加用户
    addUserDialog() {
      this.userinfo = {};
      this.dialogFormVisible = true;
    },
    // 获取用户的数据
    async getUserList() {
      const res = await getUserList(this.pafeInfo);
      const { pagenum, total, users } = res.result;
      this.pafeInfo.pagenum = pagenum;
      this.tableData = users;
      this.total = total;
    },
    // 每页几条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pafeInfo.pagesize = val;
      this.getUserList();
    },
    // 当前在第几页停留
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pafeInfo.pagenum = val;
      this.getUserList();
    },
    // 搜索用户
    inputSearch: _.debounce(function() {
      this.getUserList();
    }, 3000)
  }
};
</script>

<style lang="scss" scoped>
.userlist_box {
  width: 100%;
  height: 100%;
  .box-card {
    width: 100%;
    margin-top: 20px;
    .search {
      width: 25%;
    }
    .tianjia {
      margin-left: 10px;
    }
    .fenye {
      margin-top: 20px;
    }
  }
}
.role_box {
  p {
    margin-top: 10px;
    font-size: 16px;
  }
}
</style>
