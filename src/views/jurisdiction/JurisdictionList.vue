<template>
  <div>
    <!-- 面包屑开始 -->
    <BreadCrumb level1="权限管理" level2="权限列表"></BreadCrumb>
    <!-- 面包屑结束 -->

    <!-- 角色列表的开始 -->
    <el-card style="margin-top:20px;">
      <!-- 表格的开始 -->
      <div class="table">
        <el-table border stripe :data="rightsList">
          <el-table-column
            label="#"
            type="index"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag :type="tagType[scope.row.level]">{{
                scope.row.level | levelRank
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 表格的结束 -->
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "../../http/api";
export default {
  data() {
    return {
      rightsList: [],
      tagType: ["default", "success", "danger"]
    };
  },
  created() {
    this.getRightsListItem();
  },
  methods: {
    //   获取所有的数据
    async getRightsListItem() {
      const res = await getRightsList();
      console.log(res.result);
      this.rightsList = res.result;
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 20px;
}
</style>
