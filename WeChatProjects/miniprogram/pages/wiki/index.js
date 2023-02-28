Page({
  data: {
    list: ['全部', '病害', '虫害', '常见', '其他'],
    list1: ['全部', '水稻', '玉米', '小麦', '其他'],
    select: 0,
    content: "",
    dataList: [],
    input_animation: false,
    varieties: ['害虫', '农作物'],
    clas: 'insect',
    loadAll: false,
    index: 0,
    num: 1,
    url: 'https://www.upcl.ltd:9000/',
    result: [],
    currentPage: 0, // 当前第几页,0代表第一页 
    pageSize: 10 //每页显示多少数据

  },
  //选择器选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      dataList: [],
      select: 0,
      content: '',
      currentPage: 0
    })
    if (e.detail.value == 0) {
      this.data.clas = 'insect'
      this.zxl(this.data.clas)
    } else if (e.detail.value == 1) {
      this.data.clas = 'plant'
      this.zxl(this.data.clas)
    }
  },

  // 触发tab导航栏
  activeTab(e) {
    this.data.currentPage = 0
    this.setData({
      select: e.currentTarget.dataset.index,
      dataList: [],
      content: ''
    })
    //this.zxl()
  },

  // 滑动swiper
  activeSw(e) {
    this.data.currentPage = 0
    this.setData({
      select: e.detail.current,
      dataList: [],
      content: ''
    })
    this.zxl()
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
        console.log(this.data.currentPage)
        console.log(res)
        if (res.data.list.length > 0) {
          this.data.currentPage++
          this.setData({
            dataList: this.data.dataList.concat(res.data.list)
          })
          this.watchHeight()
        } else {
          this.data.loadAll = true
        }
      },
      fail: res => {
        console.log("获取数据失败", res)
      },
      complete: e => {
        wx.hideLoading()
      }
    })
  },


  //模糊搜索
  searchWiki: function (value) {
    wx.request({
      url: this.data.url + 'search/' + this.data.clas,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        key: 'ch_name',
        value: value
      },
      success: res => {
        if (res.data.length == 0) {
          this.setData({
            num: -1
          })
        } else {
          this.setData({
            num: 1,
            result: res.data,
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
    })
  },

  //分类筛选
  classWiki: function (value) {
    wx.request({
      url: this.data.url + 'search/' + this.data.clas,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        key: 'role',
        value: value
      },
      success: res => {
        this.data.loadAll=true
        console.log(res)
        let list = res.data
        this.setData({
          dataList: list,
        })
        this.watchHeight()
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '请检查网络连接',
          icon: "error",
        })
      },
      complete: res => {
        wx.hideLoading()
        this.generalEv()
        this.watchHeight()
      }
    })
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

  // 清除搜索内容
  clearInput: function (event) {
    this.setData({
      content: ""
    })
  },

  //滑动或点击tab过程事件
  zxl: function () {
    wx.showLoading({
      title: 'Loading'
    })
    this.data.loadAll = false
    if (this.data.clas == 'insect') {
      if (this.data.select == 0) {
        this.getData('insect')
      } else if (this.data.select == 1) {
        this.classWiki('水稻')
      } else if (this.data.select == 2) {
        this.classWiki('玉米')
      } else if (this.data.select == 3) {
        this.classWiki('小麦')
      } else if (this.data.select == 4) {
        this.classWiki('其他')
      }
    } else if (this.data.clas == 'plant') {
      if (this.data.select == 0) {
        this.getData('plant')
      } else if (this.data.select == 1) {
        this.classWiki('病害')
      } else if (this.data.select == 2) {
        this.classWiki('虫害')
      } else if (this.data.select == 3) {
        this.classWiki('常见')
      } else if (this.data.select == 4) {
        this.classWiki('其他')
      }
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


  // 初始化值
  generalEv() {
    // 回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  //触底事件
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading'
    })
    this.zxl()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(res => {
      this.setData({
        select: 0
      })
    }, 600)

  },

  goto: function (e) {
    if (this.data.index == 0) {
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + e.currentTarget.dataset.id + '&clas=' + this.data.clas
      })
    } else {
      wx.navigateTo({
        url: '../wiki_detail/index?id=' + e.currentTarget.dataset.id + '&clas=' + this.data.clas
      })
    }
  }
})