const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 弹窗获取用户信息
  getUserInfo() {
    app.getUserInfo()
  },

  // 实时获取用户信息
  getData: function () {
    wx.cloud.callFunction({
      name: 'autoLogin',
      data: {
        openid: app.globalData.openid
      },
    }).then(res => {
      console.log(res)
      app.globalData.history = res.result.data[0].history
      app.globalData.userData = res.result.data[0]
      this.setData({
        history: app.globalData.history
      })
    })
  },

  // 同步登陆数据
  autoLogin: function () {
    if (app.globalData.islogin) {
      //用户曾经登陆过
      this.setData({
        userInfo: app.globalData.userData.userInfo,
        islogin: app.globalData.islogin,
        history: app.globalData.history
      })
    } else {
      this.setData({
        islogin: false
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.homePointer = this
    if (app.globalData.islogin) {
      console.log(app.globalData)
      this.getData()
      this.autoLogin()
    } else {
      console.log('未登录')
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  exit: function () {
    wx.showLoading({
      title: '正在退出',
      mask: true
    })
    setTimeout(res => {
      app.globalData.islogin = false
      this.setData({
        islogin: false
      })
      wx.hideLoading()
      wx.showToast({
        title: '已退出',
        icon: 'success',
        duration: 300,
        mask: true
      })
    }, 800)
  },
  goHistory: function () {
    if (app.globalData.islogin) {
      wx.navigateTo({
        url: '../history/index'
      })
    } else {
      app.islogon()
    }
  },


  goTo3: function () {
    wx.navigateTo({
      url: '../team/index'
  })
  }
})