const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: 0,
    content: "",
    dataList: [],
    count_text: '',
    num: 1,
    loadAll: false,
    input_animation: false,
    list: ['杀虫剂', '杀菌剂', '调节剂', '除草剂', '计算器'],
    url: 'https://www.upcl.ltd:9000/',
    currentPage: 1, // 当前第几页,0代表第一页 
    pageSize: 8 //每页显示多少数据
  },

  //输入值时触发
  searching: function (event) {
    this.setData({
      content: event.detail.value,
      num: 0,
      result: []
    })
    if (event.detail.value != "") {
      this.searchWiki(event.detail.value)
    } else {
      this.setData({
        result: ""
      })
    }
  },

  //输入框获得焦点
  focusing: function () {
    this.setData({
      input_animation: true
    })
  },

  //输入框失去焦点
  bluring: function () {
    this.setData({
      input_animation: false
    })
  },

    // 初始化值
  generalEv() {
    // 回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  //模糊搜索
  searchWiki: function (value) {
    wx.request({
      url: this.data.url + 'search/drug',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        key: 'ch_name',
        value: value,
        pageNum:1,
        pageSize:100
      },
      success: res => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            num: -1
          })
        } else {
          this.setData({
            num: 1,
            result: res.data.list,
          })
        }
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '请检查网络连接',
          icon: "error",
        })
      },
      complete: e => {
        wx.hideLoading({})
      }
    })
  },

  //分类筛选
  classWiki: function (value) {
    wx.request({
      url: this.data.url + 'search/drug',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        key: 'category',
        value: value,
        pageNum: this.data.currentPage,
        pageSize: this.data.pageSize
      },
      success: res => {
        console.log(res.data)
        if (res.data.list.length > 0) {
          this.data.currentPage++
          this.setData({
            dataList: this.data.dataList.concat(res.data.list)
          })
        } else {
          this.data.loadAll = true
        }
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '请检查网络连接',
          icon: "error",
        })
      },
      complete: res => {
        this.watchHeight()
        wx.hideLoading()
      }
    })
  },

  // 清除搜索内容
  clearInput: function (event) {
    this.setData({
      content: ""
    })
  },

  // 触发tab导航栏
  activeTab(e) {
    console.log(e)
    this.data.currentPage = 1
    this.setData({
      select: e.currentTarget.dataset.index,
      content: '',
    })
  },

  // 滑动swiper
  activeSw(e) {
    this.data.currentPage = 1
    this.setData({
      select: e.detail.current,
      content: '',
      dataList: [],
    })
    this.zxl()
    this.generalEv()
  },

  //滑动或点击tab过程事件
  zxl: function () {
    wx.showLoading({
      title: 'Loading'
    })
    this.data.loadAll = false
    if (this.data.select == 0) {
      this.classWiki('杀虫剂')
    } else if (this.data.select == 1) {
      this.classWiki('杀菌剂')
    } else if (this.data.select == 2) {
      this.classWiki('调节剂')
    } else if (this.data.select == 3) {
      this.classWiki('除草剂')
    } else if (this.data.select == 4) {
      wx.hideLoading()
      this.setData({
        height: 500
      })
    }
  },

  // 监听swiper高度
  watchHeight() {
    var query = wx.createSelectorQuery()
    query.select('.box').boundingClientRect((res) => {
      this.setData({
        height: parseInt(res.height)
      })
    }).exec()
  },

  //获取数据库信息
  getData: function (database) {
    wx.request({
      url: this.data.url + 'get/' + database + '/all',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        pageNum: this.data.currentPage,
        pageSize: this.data.pageSize
      },
      success: res => {
        console.log(res.data.list)
        if (res.data.list.length > 0) {
          this.data.currentPage++
          this.setData({
            dataList: this.data.dataList.concat(res.data.list)
          })
        } else {
          this.data.loadAll = true
        }
      },
      fail: res => {
        console.log("获取数据失败", res)
      },
      complete: e => {
        this.watchHeight()
      }
    })
  },


  //清除输入框内容
  formReset: function (e) {
    this.setData({
      count_text: ''
    })
  },


  //计算器
  formSubmit: function (e) {
    let count_result = (e.detail.value.input2 * 1000) / e.detail.value.input1
    this.setData({
      count_result: count_result.toFixed(2)
    })
    if (this.data.count_result > 0) {
      this.setData({
        count_text: '稀释倍数为' + e.detail.value.input1 + '倍的农药，您需要使用' + e.detail.value.input2 + '千克的水和' + this.data.count_result + '毫克的农药搅拌配制而成'
      })
    } else {
      wx.showToast({
        title: '输入参数错误，请按规定输入',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.zxl()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    if (this.data.loadAll == true) {
      wx.showToast({
        title: '别拉啦，没有结果滴',
        icon: 'none'
      })
    } else {
      this.zxl()
    }
  },


  goto: function (e) {
    wx.navigateTo({
      url: '../wiki_detail/index?id=' + e.currentTarget.dataset.id + '&clas=' + 'drug'
    })
  }

})