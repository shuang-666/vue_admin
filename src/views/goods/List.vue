<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb level1="商品管理" level2="商品列表"></BreadCrumb>

    <!-- 具体的内容的开始 -->
    <el-card style="margin-top:20px;">
      <!-- 头部的开始 -->
      <el-input
        v-model="listInfo.query"
        @input="inputSearch"
        placeholder="请输入内容"
        class="search"
        clearable
      >
        <el-button icon="el-icon-search" slot="append" @input="inputSearch"></el-button>
      </el-input>
      <el-button type="primary" class="tianjia" @click="addGoods">添加商品</el-button>
      <!-- 头部的结束 -->

      <!-- 表格的开始 -->
      <el-table :data="goodsListProduct" stripe border style="width: 100%;margin-top:20px;">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700%"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150%"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100%"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100%"></el-table-column>
        <el-table-column label="创建时间" width="170%">
          <template slot-scope="scope">
            <span>{{scope.row.upd_time | goodsDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="goodsDelete(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格的结束 -->
      <!-- 分页器开始 -->
      <el-pagination
        class="fenye"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="listInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页器结束 -->
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, getGoodsDelete } from "../../http/api";
import _ from "lodash";
export default {
  data() {
    return {
      listInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10 //每页显示几条
      },
      goodsListProduct: [],
      total: 10
    };
  },
  created() {
    this.getGoodsListData();
  },
  methods: {
    // 获取所有的商品列表的数据
    async getGoodsListData() {
      const res = await getGoodsList(this.listInfo);
      console.log(res.result);
      this.goodsListProduct = res.result.goods;
      const { pagenum, total } = res.result;
      this.listInfo.pagenum = Number(pagenum);
      this.total = total;
    },
    // 每页几条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.listInfo.pagesize = val;
      this.getGoodsListData();
    },
    // 当前在第几页停留
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.listInfo.pagenum = val;
      this.getGoodsListData();
    },
    // 搜索商品
    inputSearch: _.debounce(function() {
      this.getGoodsListData();
    }, 3000),
    // 删除商品
    goodsDelete(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await getGoodsDelete(Number(id));
          this.getGoodsListData();
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
    // 点击添加商品的跳转
    addGoods() {
      this.$router.push({
        path: "/goods/add"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 18%;
}
.tianjia {
  margin-left: 20px;
}
.fenye {
  margin-top: 20px;
}
</style>
