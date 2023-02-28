const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    City: [],
    url: 'https://www.upcl.ltd/images/static/',
    str: '',
    scroll: 0,
    weather: [],
    location_grant: true,
    news: [],
    teach: [],
    item_title: ['病虫害百科', '农药百科', '气象预报', '病虫害识别', '农事提醒', '粮农市场', '农业资讯', '其他识别', ],
  },

  grant: function () {
    wx.getSetting({
      success: res => {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法使用天气功能！',
          success: res => {
            if (res.cancel) {
              wx.showToast({
                title: '已取消定位授权,天气服务将无法使用',
                icon: 'none'
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userLocation'] === true) {
                    wx.showToast({
                      title: '定位授权成功',
                      icon: 'success'
                    })
                    this.getLocation()
                  } else {
                    wx.showToast({
                      title: '已取消定位授权,天气服务将无法使用',
                      icon: 'none'
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  //获取农业资讯数据库信息
  getData: function () {
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        basename: 'news',
        pageSize: 8,
        pageSkip: 0
      },
      success: res => {
        console.log(res)
        this.setData({
          news: res.result.data
        })
      },
      fail: res => {
        console.log("获取数据失败", res)
      }
    })
  },

  //获取种植攻略数据库信息
  getData1: function () {
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        basename: 'teach',
        pageSize: 8,
        pageSkip: 0
      },
      success: res => {
        console.log(res)
        this.setData({
          teach: res.result.data
        })
      },
      fail: res => {
        console.log("获取数据失败", res)
      }
    })
  },

  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.setData({
          location_grant: true
        })
        this.getCityID(res.longitude, res.latitude)
        this.getCity(res.longitude, res.latitude)
        app.globalData.location = res.longitude + 'and' + res.latitude
      },
      fail: res => {
        this.setData({
          location_grant: false
        })
      }
    })
  },

  //获取城市信息
  getCity: function (longitude, latitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=Y4QBZ-LTT35-MDWI5-QWUYJ-AZDCT-XGFGN',
      success: res => {
        if (res.statusCode == 200) {
          console.log("获取城市信息成功", res)
          this.setData({
            City: res.data.result
          })
        } else {
          console.log("获取城市信息失败", res)
        }

      },
      error: res => {
        console.log(res)
      }
    })
  },

  //获取城市ID
  getCityID: function (longitude, latitude) {
    let key = app.globalData.key[1]
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup?location=' + longitude + ',' + latitude + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取城市ID成功", res)
          var CityID = res.data.location[0].id
          this.realTime_weather(CityID, key)
          this.weather_life(CityID, key)
          this.weather_warning(CityID, key)
        } else {
          console.log("获取城市ID失败", res)
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  //获取天气信息
  realTime_weather: function (CityID, key) {
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?location=' + CityID + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取天气信息成功", res)
          this.setData({
            weather: res.data.now
          })
        } else {
          console.log("获取天气信息失败", res)
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  //获取生活天气指数
  weather_life: function (CityID, key) {
    wx.request({
      url: 'https://devapi.qweather.com/v7/indices/1d?type=2&location=' + CityID + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取生活天气指数成功", res)
          this.data.weather_life = res.data.daily[0]
          this.a()
        } else {
          console.log("获取生活天气指数失败", res)
        }

      },
      error: res => {
        console.log(res)
      }
    })
  },

  //获取天气灾害预警
  weather_warning: function (CityID, key) {
    wx.request({
      url: 'https://devapi.qweather.com/v7/warning/now?location=' + CityID + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取天气灾害预警成功", res)
          this.setData({
            weather_warning: res.data.warning
          })
        } else {
          console.log("获取天气灾害预警失败", res)
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  //字符串分割
  a: function () {
    var a = this.data.weather_life.text
    a = a.substring(a.indexOf('，') + 1)
    this.setData({
      remind: a.substring(0, a.indexOf('，'))
    })
  },

  onPageScroll(e) {
    if (e.scrollTop < 200) {
      this.setData({
        scroll: e.scrollTop,
        //str: 'filter:blur(' +  e.scrollTop/ 5 + 'rpx)',
        //radius: 90 - e.scrollTop/3
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData()
    this.getData1()
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  gotoWeather() {
    wx.navigateTo({
      url: '../weather/index'
    })
  },

  gotoNews: function (e) {
    if (e.currentTarget.dataset.id == null) {
      wx.navigateTo({
        url: '../news/index'
      })
    } else
      wx.navigateTo({
        url: '../news_detail/index?id=' + e.currentTarget.dataset.id+'&flag='+e.currentTarget.dataset.flag
      })
  },

  goNext: function (e) {
    if (e.currentTarget.dataset.id == 0) {
      wx.navigateTo({
        url: '../wiki/index'
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: '../drug/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: '../weather/index'
      })

    } else if (e.currentTarget.dataset.id == 3) {
      wx.switchTab({
        url: '../scan/index'
      })
    } else if (e.currentTarget.dataset.id == 4) {
      if (!app.globalData.islogin) {
        app.islogon()
      } else {
        wx.navigateTo({
          url: '../farming/index'
        })
      }

    } else if (e.currentTarget.dataset.id == 5) {
      wx.navigateTo({
        url: '../zone_class/index'
      })


    } else if (e.currentTarget.dataset.id == 6) {
      wx.navigateTo({
        url: '../news/index'
      })
    } else if (e.currentTarget.dataset.id == 7) {
      if (app.globalData.islogin) {
        wx.navigateTo({
          url: '../scan_other/index'
        })
      } else {
        app.islogon()
      }
    }
  }
})