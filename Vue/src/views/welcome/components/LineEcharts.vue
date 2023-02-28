<template>
<div>
  <div class="MEcharts">
    <div id="lineecharts" style="width: 90%;height: 400px;" />
  </div>
</div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'LineEcharts',
  mounted() {
    this.myEcharts()
  },
  methods: {
    myEcharts() {
      var chartDom = document.getElementById('lineecharts')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '周访问量'
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      };

      option && myChart.setOption(option);

      myChart.setOption(option)
    }
  }

}
</script>

<style scoped>
.MEcharts{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
