const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    clas: '',
    startTime: 0,
    real: false,
  },

  //获取数据库信息
  getData: function (database) {
    wx.request({
      url: 'https://www.upcl.ltd:9000/get/' + database + '?ch_name=' + this.data.name,
      success: res => {
        console.log(res)
        this.setData({
          data: res.data[0],
          time: Date.now() - this.data.startTime
        })
        this.record()
      },
      fail: res => {
        console.log("获取数据失败", res)
      }
    })

  },

  record: function () {
    wx.cloud.callFunction({
      name: 'history',
      data: {
        id: app.globalData.userData._id,
        ch_name: this.data.data.ch_name,
        en_name: this.data.data.en_name,
        clas: this.data.clas,
        grade: this.data.tensor,
        img: this.data.fileID,
      },
      success: res => {
        console.log("记录成功", res)
      },
      fail: res => {
        console.log("记录失败", res)
      },
    })
  },

  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.startTime = Date.now()
    this.data.fileID = options.fileID
    this.data.msg = options.msg
    console.log(options)
    if (options.msg == 1) {
      if (options.name == "非检测目标") {
        this.setData({
          name: options.name,
          real: false,
        })
      } else {
        let json = JSON.parse(options.name)
        let score = parseFloat(json.score * 100)
        this.setData({
          tensor: score.toFixed(2),
          clas: json.clas,
          name: json.name,
          real: true,
        })
        this.getData('insect')
      }
    } else if (options.msg == 2) {
      let json = JSON.parse(options.name)
      let score = json.score * 100
      this.setData({
        name: json.name,
        clas: json.clas,
        tensor: score.toFixed(2),
        real: true
      })
      this.getData('plant')
    }
  },
  collect: function () {
    wx.showModal({
      title: '提示',
      content: '点击右上角左侧按钮\n并点击“添加到我的小程序”',
      showCancel: true,
      confirmText: "我知道啦",
      confirmColor: "#52a2d8",
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  onShow: function () {


  },
  goto: function (e) {
    if (this.data.msg == 1) {
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + this.data.name + '&clas=' + 'insect'
      })
    } else if (this.data.msg == 2) {
      console.log(e)
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + this.data.name + '&clas=' + 'plant'
      })
    }
  }
})