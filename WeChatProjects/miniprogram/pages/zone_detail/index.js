const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_cont: '',
    focus: false,
    list: []
  },

  //获取数据库信息
  getData: function (id) {
    wx.cloud.callFunction({
      name: 'getNews',
      data: {
        basename: 'zone',
        id: id
      },
      success: res => {
        this.setData({
          data: res.result.data[0],
          list: res.result.data[0].comment
        })
      },
      fail: res => {
        console.log("获取数据失败", res)
      }
    })
  },

  //输入框输入
  inputing: function (event) {
    this.setData({
      input_cont: event.detail.value
    })
  },

  //输入框获得焦点
  focusing: function () {
    this.setData({
      focus: true
    })
  },

  //输入框失去焦点
  bluring: function () {
    this.setData({
      focus: false
    })
  },

  //发表评论
  submit: function () {
    wx.showLoading({
      title: '正在发表评论..',
    })
    if (this.data.input_cont.length != 0) {
      wx.cloud.callFunction({
        name: 'comment',
        data: {
          basename: 'zone',
          id: this.data.data._id,
          content: this.data.input_cont,
          nickName: app.globalData.userData.userInfo.nickName,
          avatarUrl: app.globalData.userData.userInfo.avatarUrl,
        },
        success: res => {
          console.log('评论成功', res)
          wx.showToast({
            title: '评论成功',
          })
          this.getData(this.data.data._id)
          this.setData({
            input_cont: ''
          })
        },
        fail: res => {
          console.log("评论失败", res)
        },
        complete: res => {
          wx.hideLoading()
        }

      })
    } else {
      wx.showToast({
        title: '评论不能为空',
        icon: 'error'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
    console.log(app.globalData.userData)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})