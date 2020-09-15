<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb level1="商品管理" level2="添加商品"></BreadCrumb>
    <!-- 内容 -->
    <el-card style="margin-top:20px;">
      <!-- 提示 -->
      <el-alert title="添加商品的信息" :closable="false" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex-1" align-center class="stepsClass" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <!-- 渲染表单的Item项 -->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <!-- action: 图片上传的API接口地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品 -->
            <el-button type="primary" class="btnAdd" @click="addClick">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="picPreviewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import _ from "lodash";
import { getClassify, getGoodsCate, getAddClick } from "../../http/api";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      activeIndex: "1", //步骤条的绑定
      tabPosition: "left", //tab栏的方向
      // 添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateList: [], //商品分类数据
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数的设置
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      currentCateID: "", //分类的id
      // 图片上传组件的请求对象
      headerObj: {
        Authorization: window.localStorage.getItem("token")
      },
      previewDialogVisible: false,
      picPreviewPath: ""
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的分类的数据
    async getCateList() {
      const res = await getClassify();
      this.cateList = res.result;
    },
    // 当选中的时候，要跳到别的地方的一个阻止
    async beforeTabLeave(activeName, oldActiveName) {
      // 未选中商品分类阻止Tab标签跳转
      if (oldActiveName === "1" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      } else {
        this.currentCateID = this.addForm.goods_cat[2];
        const res = await getGoodsCate(this.currentCateID);
        this.manyTableData = res.result;
        this.manyTableData.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(/\s+/g);
        });
      }
      if (oldActiveName === "2" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      } else {
        this.currentCateID = this.addForm.goods_cat[2];
        const res = await getGoodsCate(this.currentCateID, "only");
        this.onlyTableData = res.result;
      }
    },
    handlePreview(file) {
      this.picPreviewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(".....", file);
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      console.log("11111111111", i);
      // 3.调用splice方法，移除图片信息
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
    },
    // 添加数据
    addClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        } else {
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          // 处理动态参数
          this.manyTableData = this.manyTableData.map(item => {
            return {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
          });

          // 处理静态参数
          this.onlyTableData = this.onlyTableData.map(item => {
            return {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
          });

          const attrs = [...this.manyTableData, ...this.onlyTableData];
          console.log(attrs);
          // 把合并的值给到form里面
          form.attrs = attrs;
          await getAddClick(form);
          this.$router.push({
            path: "/list"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.stepsClass {
  width: 60%;
  margin: 20px 0 30px 70px;
}
.quill-editor /deep/ .ql-container {
  height: 40vh;
}
.btnAdd {
  margin-top: 20px;
}
</style>
