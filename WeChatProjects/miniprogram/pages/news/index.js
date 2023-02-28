
Page({

    /**
     * 页面的初始数据
     */
    data: {
      select: 0,
      list: ['全部', '最新资讯', '种植攻略'],
    },

      // 触发tab导航栏
  activeTab(e) {
    console.log(e)
    if(e.currentTarget.dataset.index==0){
      this.getData('teach')
    }else if(e.currentTarget.dataset.index==1){
      this.getData('news')
    }else if(e.currentTarget.dataset.index==2){
      this.getData('teach')
    }
    this.data.currentPage = 0
    this.setData({
      select: e.currentTarget.dataset.index,
      dataList: [],
      content: ''
    })
  },

    //获取数据库信息
    getData: function (database) {
        wx.cloud.callFunction({
            name: 'getData',
            data: {
                basename: database,
                pageSize: 8,
                pageSkip: 0
            },
            success: res => {
                console.log(res)
                this.setData({
                    data: res.result.data
                })
            },
            fail: res => {
                console.log("获取数据失败", res)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData('teach')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    goto: function (e) {
      console.log(e)
        wx.navigateTo({
            url: '../news_detail/index?id=' + e.currentTarget.dataset.id+'&flag='+e.currentTarget.dataset.flag
        })
    }
})