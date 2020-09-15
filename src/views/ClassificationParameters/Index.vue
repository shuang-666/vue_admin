<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb level1="商品管理" level2="参数列表"></BreadCrumb>
    <!-- 内容 -->
    <el-card style="margin-top: 20px;">
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 具体的内容 -->
          <el-table
            :data="manyTableData"
            border
            stripe
            style="margin-top:20px;"
          >
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible == scope.row.attr_id"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="addEditClick(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="addDeleteClick(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 具体的内容 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
            style="margin-top:20px;"
          >
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible == scope.row.attr_id"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="addEditClick(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="addDeleteClick(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClassify,
  getGoodsCate,
  getAddGoodsCate,
  getClassifyLook,
  getClassifyConfrim,
  getClassifyDelete
} from "../../http/api";
export default {
  data() {
    return {
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      // 商品分类列表
      cateList: [],
      inputVisible: false,
      inputValue: "",
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //   激活页签名称
      activeTabsName: "many",
      // 动态的数据
      manyTableData: [],
      // 静态数据
      onlyTableData: [],
      //   控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      //   添加表单的数据对象
      addFrom: {
        attr_name: ""
      },
      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //   编辑对话框
      editDialogVisible: false,
      //   修改表单数据对象
      editFrom: {},
      //   修改表单验证规则
      editFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    //   按钮需要被禁用返回true, 否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类Id
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 参数
    getTitleText() {
      if (this.activeTabsName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  created() {
    this.getClassify();
  },
  methods: {
    // 获取所有的分类的数据
    async getClassify() {
      const res = await getClassify();
      this.cateList = res.result;
    },
    //改变选中的数据// 级联选择框 选中变化 触发
    handleChange() {
      this.getParamsData();
    },
    // Tab页签点击事件的处理函数
    handleTabsClick() {
      this.getParamsData();
    },
    // 获取数据
    async getParamsData() {
      // 只允许选择三级分类：
      // 通过数组的长度判断
      if (this.selectedCateKeys.length !== 3) {
        this.$message.error("请选择内容！！！");
        this.selectedCateKeys = [];
        // 清空表格数据
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      if (this.activeTabsName == "many") {
        //   根据所选分类的Id,和当前面板的参数, 获取对应的参数
        const res = await getGoodsCate(this.getCateId);
        this.manyTableData = res.result;
        this.manyTableData.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(/\s+/g);
        });
        console.log(this.manyTableData);
      }
      if (this.activeTabsName == "only") {
        //   根据所选分类的Id,和当前面板的参数, 获取对应的参数
        const res = await getGoodsCate(this.getCateId, "only");
        console.log("asdfghjkl;", res);
        this.onlyTableData = res.result;
        this.onlyTableData.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(/\s+/g);
        });
        console.log(this.onlyTableData);
      }
    },
    // 删除对应的参数
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    showInput(row) {
      console.log(row);
      this.inputVisible = true;
      this.inputVisible = row.attr_id;
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点，或者按下Enter触发
    handleInputConfirm(row) {
      console.log(row);
      // 输入的内容为空时，清空
      if (this.inputValue.trim().length === 0) {
        this.inputValue = "";
        this.inputVisible = false;
        return;
      }
      row.attr_vals.push(this.inputValue.trim());
      this.inputValue = "";
      this.inputVisible = false;
      // 提交数据库，保存修改
      this.saveAttrVals(row);
    },
    // 添加参数的数据的确定的按钮
    addParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return;
        const res = getAddGoodsCate(this.getCateId, {
          attr_name: this.addFrom.attr_name,
          attr_sel: this.activeTabsName
        });
        console.log("添加参数成功", res);
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 控制编辑框的出现
    async addEditClick(attrId) {
      const res = await getClassifyLook(this.getCateId, attrId, {
        attr_sel: this.activeTabsName
      });
      console.log(res);
      this.editFrom = res.result;
      this.editDialogVisible = true;
    },
    // 确定编辑框的数据
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return;
        await getClassifyConfrim(this.getCateId, this.editFrom.attr_id, {
          attr_name: this.editFrom.attr_name,
          attr_sel: this.activeTabsName
        });
        this.$message.success("修改参数成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 删除编辑框的数据
    async addDeleteClick(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await getClassifyDelete(this.getCateId, id);
          this.getParamsData();
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
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      await getClassifyConfrim(this.getCateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" ")
      });
      this.$message.success("修改参数项成功！");
    }
  }
};
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
