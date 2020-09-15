<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb level1="订单管理" level2="订单列表"></BreadCrumb>
    <!-- 具体的内容 -->
    <el-card style="margin-top:20px;">
      <!-- 头部的开始 -->
      <el-input
        placeholder="请输入内容"
        v-model="orderInfo.query"
        @input="orderSearch"
        class="search"
        clearable
      >
        <el-button
          icon="el-icon-search"
          slot="append"
          @click="orderSearch"
        ></el-button>
      </el-input>
      <!-- 订单数据 -->
      <el-table
        border
        :data="orderList"
        style="width: 100%;margin-top:20px;"
        stripe
      >
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="250"
        ></el-table-column>
        <el-table-column label="是否付款" width="250">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status"
              >未付款</el-tag
            >
            <el-tag type="success" size="mini" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="update_time"
          label="下单时间"
          width="250"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editOrderClick"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="seeClick"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器开始 -->
      <el-pagination
        class="fenye"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页器结束 -->
    </el-card>

    <!-- 编辑的遮罩层 -->
    <el-dialog title="修改地址" :visible.sync="editOrder">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrder = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看物流信息 -->
    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
          >{{ activity.context }}</el-timeline-item
        >
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrder, getSeeOrder } from "../../http/api";
import _ from "lodash";
import cityData from "./citydata.js";
export default {
  data() {
    return {
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 10,
      editOrder: false, // 控制编辑的遮罩层的出现
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: []
    };
  },
  created() {
    this.getOrderData();
  },
  methods: {
    //   获取所有的订单数据
    async getOrderData() {
      const res = await getOrder(this.orderInfo);
      console.log(res);
      this.orderList = res.result.goods;
      const { pagenum, total } = res.result;
      this.orderInfo.pagenum = Number(pagenum);
      this.total = total;
    },
    // 每页几条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.orderInfo.pagesize = val;
      this.getOrderData();
    },
    // 当前在第几页停留
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.orderInfo.pagenum = val;
      this.getOrderData();
    },
    // 搜索
    orderSearch: _.debounce(function() {
      this.getOrderData();
    }, 3000),
    // 编辑
    editOrderClick() {
      this.editOrder = true;
    },
    // 查看物流信息
    async seeClick() {
      this.progressDialogVisible = true;
      let id = 1106975712662;
      const res = await getSeeOrder(id);
      this.progressInfo = res.result;
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 20%;
}
.fenye {
  margin-top: 20px;
}
</style>
