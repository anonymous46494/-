const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: {},
    weather_ico: 'https://www.upcl.ltd/images/static/weather_ico/',
    weather_ico2: 'https://www.upcl.ltd/images/static/1/',
    weather_back:'https://www.upcl.ltd/images/static/weather_back/',
    weather_date: [],
    show:false,
    show_2:false,
    list:['寒潮','大风','干旱','霜冻'],
    img:['cold.png','gale.png','dry.png','frost.png'],
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

  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.getCityID(res.longitude, res.latitude)
        this.getCity(res.longitude, res.latitude)
        app.globalData.location = res.longitude + 'and' + res.latitude
      },
      fail: res => {
        this.grant()
        wx.hideLoading()
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
          this.weather(CityID, key)
          this.realTime_weather(CityID, key)
        } else {
          console.log("获取城市ID失败", res)
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  //获取天气信息成功
  realTime_weather: function (CityID, key) {
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?location=' + CityID + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取天气信息成功", res)
          this.setData({
            show_2:true,
            weatherNow: res.data.now,
          })
          wx.hideLoading()
        } else {
          console.log("获取天气信息失败", res)
        }
      },
      error: res => {
        console.log(res)
        this.setData({
          show_2:false
        })
      }
    })
  },

  //获取7天天气指数
  weather: function (CityID, key) {
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/7d?location=' + CityID + '&key=' + key + '&lang=zh',
      success: res => {
        if (res.data.code == 200) {
          console.log("获取7天天气指数成功", res)
          let date = new Date(res.data.updateTime);
          /*
          let date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.checkTime(date.getHours()) + ':' + this.checkTime(date.getMinutes()) + ':' + this.checkTime(date.getSeconds());
          */
          let date_value1 = this.checkTime(date.getHours()) + ':' + this.checkTime(date.getMinutes()) + ':' + this.checkTime(date.getSeconds());
          res.data.daily.forEach((item, idx) => {
            this.data.weather_date.push(item.fxDate.slice(6))
          })
          this.setData({
            weather: res.data.daily,
            updateTime: date_value1,
            weather_date: this.data.weather_date,
            show:true
          })
        } else {
          console.log("获取7天天气指数失败", res)
          this.setData({
            show:false
          })
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  checkTime: function (i) {
    if (i < 10) {
      i = "0" + i
    }
    return i;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '查询天气中'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
    this.setData({
      month:new Date().getMonth()+1
  })
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})