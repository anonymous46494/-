const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:[]
  },


  getData: function () {
    if(app.globalData.userData.history){
      this.setData({
        history:app.globalData.userData.history.reverse()
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
      wx.showToast({
        title: '错误，退出重新登陆',
        icon:'error'
      })

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
  goto: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.clas == '害虫') {
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + e.currentTarget.dataset.id + '&clas=' + 'insect'
      })
    } else if (e.currentTarget.dataset.clas == '农作物') {
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + e.currentTarget.dataset.id + '&clas=' + 'plant'
      })
    }
  }
})