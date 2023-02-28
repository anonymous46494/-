<template>
  <div class="top">
    <div class="page">
      <div class="one">
        <div style="display: flex; flex-direction: row">
          <img style="width: 55px; height: 55px" src="src/assets/images/index1.png" alt="">
          <div style="display: flex; flex-direction: column; width: 70%;height: 55px;justify-content: space-around; margin-left: 20px;">
            <div>已录入农粮咨询数量</div>
            <div>10000</div>
          </div>
        </div>
      </div>
      <div class="one">
        <div style="display: flex; flex-direction: row">
          <img style="width: 55px; height: 55px" src="src/assets/images/index1.png" alt="">
          <div style="display: flex; flex-direction: column; width: 70%;height: 55px;justify-content: space-around; margin-left: 20px;">
            <div>已录入害虫数量</div>
            <div>10000</div>
          </div>
        </div>
      </div>
      <div class="one">
        <div style="display: flex; flex-direction: row">
          <img style="width: 55px; height: 55px" src="src/assets/images/index1.png" alt="">
          <div style="display: flex; flex-direction: column; width: 70%;height: 55px;justify-content: space-around; margin-left: 20px;">
            <div>已录入化肥信息数量 </div>
            <div>10000</div>
          </div>
        </div>
      </div>
      <div class="one">
        <div style="display: flex; flex-direction: row">
          <img style="width: 55px; height: 55px" src="src/assets/images/index1.png" alt="">
          <div style="display: flex; flex-direction: column; width: 70%;height: 55px;justify-content: space-around; margin-left: 20px;">
            <div>已录入病害信息数量 </div>
            <div>10000</div>
          </div>
        </div>
      </div>
      <div class="one">
        <div style="display: flex; flex-direction: row">
          <img style="width: 55px; height: 55px" src="src/assets/images/index1.png" alt="">
          <div style="display: flex; flex-direction: column; width: 70%;height: 55px;justify-content: space-around; margin-left: 20px;">
            <div>已录入农粮攻略数量</div>
            <div>10000</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Indextop'
}
</script>

<style scoped>
.page{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

}
.top{
  display: flex;
  align-items: center;
  width: 100%;
  height: 150px;
}
.one{
  width: 18%;
  height: 100px;
  border: 1px solid #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

}

</style>
