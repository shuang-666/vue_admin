<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb level1="数据统计" level2="数据报表"></BreadCrumb>
    <!-- 内容 -->
    <el-card style="margin-top:20px;">
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getReports } from "../../http/api";
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  mounted() {
    this.reports();
  },
  methods: {
    async reports() {
      var myChart = echarts.init(document.getElementById("main"));
      const res = await getReports();
      console.log(res);
      const resultJieg = _.merge(res.result, this.options);
      // 展示数据
      myChart.setOption(resultJieg);
    }
  }
};
</script>

<style></style>