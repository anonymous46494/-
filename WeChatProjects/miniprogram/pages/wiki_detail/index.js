Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //获取数据库信息
  getData: function (id, clas) {
    wx.request({
      url: 'https://www.upcl.ltd:9000/get/'+clas+'?ch_name='+id,
      success: res => {
        this.setData({
          res: res.data[0],
        })

      },
      error: res => {
        console.log("sss", res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getData(options.id, options.clas)
    if (options.clas == 'insect') {
      this.setData({
        title: this.data.title1
      })
    } else if (options.clas == 'plant') {
      this.setData({
        title: this.data.title2
      })
    } else if (options.clas == 'drug') {
      this.setData({
        title: this.data.title3
      })

    }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})