<template>
  <div>
    <!-- 面包屑开始 -->
    <BreadCrumb level1="权限管理" level2="角色列表"></BreadCrumb>
    <!-- 面包屑结束 -->

    <!-- 角色列表的开始 -->
    <el-card style="margin-top:20px;">
      <!-- 头部 -->
      <div class="addRole">
        <el-button type="primary" @click="addSole">添加角色</el-button>
      </div>
      <!-- 表格的开始 -->
      <div class="table">
        <el-table border :data="roleList" stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div v-if="scope.row.children.length">
                <el-row
                  :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item, i1) in scope.row.children"
                  :key="i1"
                >
                  <el-col :span="5">
                    <el-tag
                      @close="deleteRights(scope.row.id, item.id)"
                      closable
                    >{{ item.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row
                      :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                      v-for="(item1, i2) in item.children"
                      :key="i2"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          @close="deleteRights(scope.row.id, item1.id)"
                          closable
                        >{{ item1.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          v-for="(item2, index) in item1.children"
                          :key="index"
                          closable
                          @close="deleteRights(scope.row.id, item2.id)"
                        >{{ item2.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
              <!-- 当权限没有数据的时候 -->
              <el-row v-if="!scope.row.children.length">
                <el-tag>该角色没有权限</el-tag>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updataData(scope.row)"
              >编辑</el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="roleDelete(scope.row.id)"
              >删除</el-button>
              <el-button
                icon="el-icon-share"
                type="warning"
                size="mini"
                @click="assignPermissionsConfirm(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格的结束 -->
    </el-card>

    <!-- 添加角色的遮罩层的出现 -->
    <el-dialog title="添加角色" :visible.sync="addSoleData">
      <el-form ref="addRoleForm" :model="roleInfo" :rules="rules">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="roleInfo.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSoleData = false">取 消</el-button>
        <el-button type="primary" @click="roleConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色的遮罩层的出现的结束 -->

    <!-- 编辑角色的遮罩层的出现的开始 -->
    <el-dialog title="编辑角色" :visible.sync="updataSoleData">
      <el-form ref="updataRoleForm" :model="roleInfo" :rules="rules">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="roleInfo.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataSoleData = false">取 消</el-button>
        <el-button type="primary" @click="updataRoleConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色的遮罩层的出现的结束 -->

    <!-- 分配权限的遮罩层的出现的开始 -->
    <el-dialog title="分配权限" :visible.sync="assignPermissions">
      <el-tree
        ref="treeListData"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkArr"
        default-expand-all
        :props="treeProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignPermissions = false">取 消</el-button>
        <el-button type="primary" @click="treeConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserRoleList,
  getRoleData,
  roleDeleteData,
  getUpdataData,
  roleDeleteRights,
  getRightsListTree,
  updataRights
} from "../../http/api";
import { getTreeIds } from "../../utils/index.js";
export default {
  data() {
    return {
      rightsList: [], //权限列表的树形结构
      treeProps: {
        children: "children",
        label: "authName"
      }, //默认值
      roleList: [], //所有的角色的数据
      addSoleData: false, //控制添加角色出现
      updataSoleData: false, //控制修改角色
      assignPermissions: false, //控制分配权限
      roleInfo: {
        roleName: "",
        roleDescribe: ""
      },
      checkArr: [], //要保存的id
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      },
      roleId: ""
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //   获取所有的数据
    async getRoleList() {
      const res = await getUserRoleList();
      console.log("所有的数据", res.result);
      this.roleList = res.result;
    },
    // 点击添加角色的遮罩层的出现
    addSole() {
      this.roleInfo = {};
      this.addSoleData = true;
    },
    // 当点击添加角色的遮罩层的时候的确定的时候
    roleConfirm() {
      this.$refs.addRoleForm.validate(async valid => {
        if (valid) {
          const res = await getRoleData(this.roleInfo);
          console.log(res);
          this.getRoleList();
          this.addSoleData = false;
          this.roleInfo = {
            roleName: "",
            roleDescribe: ""
          };
          this.addSoleData = false;
        } else {
          return false;
        }
      });
    },
    // 点击删除的时候
    roleDelete(userId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await roleDeleteData(userId);
          this.getRoleList();
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
    // 控制编辑的出现
    updataData(role) {
      this.roleInfo = JSON.parse(JSON.stringify(role));
      this.updataSoleData = true;
    },
    // 点击编辑的遮罩层的确定的按钮
    updataRoleConfirm() {
      this.$refs.updataRoleForm.validate(async valid => {
        if (valid) {
          // 拿到角色的id
          const roleId = this.roleInfo.id;
          console.log(roleId);
          await getUpdataData(roleId, this.roleInfo);
          // 更新视图
          this.getRoleList();
          this.updataSoleData = false;
        } else {
          return false;
        }
      });
    },
    // 点击删除每个权限的数据
    async deleteRights(roleId, rightId) {
      await roleDeleteRights(roleId, rightId);
      this.getRoleList();
    },
    // 控制分配权限的显示和隐藏
    assignPermissionsConfirm(row) {
      this.assignPermissions = true;
      this.getRightsListTreeData(row);
    },
    // 获取树形的权限列表
    async getRightsListTreeData(row) {
      console.log(row);
      const res = await getRightsListTree();
      this.rightsList = res.result;
      // 获取当前角色拥有的权限列表，并提取当前用户权限的id，组成一个数组[104,888,433,22]
      this.checkArr = getTreeIds(row);
      this.roleId = row.id;
    },
    // 确定分配权限，向后台发请求
    async treeConfirm() {
      // 获取全部选中的tree的节点
      const arr1 = this.$refs.treeListData.getCheckedKeys();
      //获取部分选中的tree节点
      const arr2 = this.$refs.treeListData.getHalfCheckedKeys();
      // 合并全部选中和部分选中的节点
      const keys = [...arr1, ...arr2];
      const idStr = keys.join(",");
      await updataRights(this.roleId, { rids: idStr });
      this.getRoleList();
      this.assignPermissions = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
