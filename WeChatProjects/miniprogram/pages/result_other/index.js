const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AppID: 'D2HcGGK61BmxpKOvdTUeXOFV',
    Key: 'SzL0s5xkkQFXEHlayxML58D6Uu71autt',
    ovre: false,
    select: 0,
    flag: 1,
    score: []

  },
  // 选择图片并自动转成base64编码
  chooseImageToBase64(count) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: res => {
        this.setData({
          next: true,
          img_url: res.tempFilePaths
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success: res => {
            this.getAccess_token(res.data)
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: res => {
        wx.navigateBack({
          delta: 1
        })
      }
    })

  },

  //保存原图片到云存储
  cloudFile(filePath) {
    console.log(filePath)
    this.setData({
      img_name: new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
    })
    if (this.data.online) {
      wx.showLoading({
        icon: "loading",
        title: "正在上传图片..."
      })
    }
    wx.cloud.uploadFile({
      cloudPath: "result/" + this.data.img_name + '.jpg', //云储存的路径及文件名
      filePath: filePath[0],
      success: res => {
        console.log("保存图片至云存储成功", res)
        this.data.fileID = res.fileID
        this.record()
      },
      fail: res => {
        console.log("保存图片至云存储失败", res)
      }
    })
  },

  getAccess_token: function (image) {
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: "POST",
      data: {
        grant_type: 'client_credentials',
        client_id: this.data.AppID,
        client_secret: this.data.Key
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.statusCode == 200) {
          console.log(res)
          if (this.data.flag == 1) {
            this.plant(res.data.access_token, image)
          } else if (this.data.flag == 2) {
            this.fruit_veg(res.data.access_token, image)
          } else {
            wx.showToast({
              title: '参数错误',
              icon: 'error'
            })

          }

        } else {
          wx.showToast({
            title: '识别失败',
          })
        }

      }
    })
  },

  //识别植物
  plant: function (access_token, image) {
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant' + '?access_token=' + access_token,
      method: "POST",
      data: {
        image: image,
        baike_num: 3
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.statusCode == 200) {
          console.log('植物识别成功', res)
          res.data.result.forEach((item, idx) => {
            let score = item.score * 100
            this.data.score[idx] = score.toFixed(2)
          })
          this.setData({
            ovre: true,
            score: this.data.score,
            result: res.data.result
          })
          this.watchHeight()
          this.cloudFile(this.data.img_url)
        } else {
          wx.showToast({
            title: '失败',
          })
        }

      }
    })
  },

  //识别蔬果
  fruit_veg: function (access_token, image) {
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient' + '?access_token=' + access_token,
      method: "POST",
      data: {
        image: image
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.statusCode == 200) {
          console.log('蔬果识别成功', res)
          res.data.result.forEach((item, idx) => {
            let score = item.score * 100
            this.data.score[idx] = score.toFixed(2)
          })
          this.setData({
            ovre: true,
            score: this.data.score,
            result: res.data.result
          })
          this.cloudFile(this.data.img_url)
        } else {
          wx.showToast({
            title: '失败',
          })
        }

      }
    })
  },

  // 滑动swiper
  activeSw(e) {
    console.log(e)
    this.setData({
      select: e.detail.current,
    })
    if (this.data.flag == 1) {
      this.watchHeight()
    }

  },

  // 监听swiper高度
  watchHeight() {
    var query = wx.createSelectorQuery()
    query.select('.text').boundingClientRect((res) => {
      this.setData({
        height: parseInt(res.height)
      })
    }).exec()
  },

  //记录
  record: function () {
    wx.cloud.callFunction({
      name: 'history',
      data: {
        id: app.globalData.userData._id,
        ch_name: this.data.result[0].name,
        en_name: '',
        clas: this.data.clas,
        grade: this.data.score[0],
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.flag == 1) {
      this.data.clas = '植物'
      wx.setNavigationBarTitle({
        title: '植物识别'
      })
    } else if (options.flag == 2) {
      this.data.clas = '蔬果'
      wx.setNavigationBarTitle({
        title: '蔬果识别'
      })
    }
    this.setData({
      flag: options.flag
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.chooseImageToBase64()
  },
})