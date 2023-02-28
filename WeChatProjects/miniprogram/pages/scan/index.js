const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    next: false,
    fileID: '', //云存储的图片路径
    select: [{
      id: 1,
      name: '害虫识别',
      img: '/images/insect.png'
    }, {
      id: 2,
      name: '病害识别',
      img: '/images/plant.png'
    }],
  },

  //识别入口
  checkButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      this.data.url = "https://www.upcl.ltd:8098"
    } else if (id == 2) {
      this.data.url = "https://www.upcl.ltd:8099"
    }
    for (let i = 0; i < this.data.select.length; i++) {
      if (this.data.select[i].id == id) {
        //当前点击的位置为true即选中
        this.data.select[i].checked = true;
      } else {
        //其他的位置为false
        this.data.select[i].checked = false;
      }
    }
    this.setData({
      select: this.data.select,
      msg: id
    })
  },

  distinguish: function () {
    if (this.data.url == null) {
      wx.showModal({
        title: '提示',
        content: '请先选择要识别的种类',
        showCancel: false
      })
    } else {
      this.upload()
    }
  },

  //选择照片
  chooseimage() {
    if (!app.globalData.islogin) {
      app.islogon()
    } else {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setData({
            img_url: res.tempFilePaths[0],
            next: true
          })
          this.cloudFile(res.tempFilePaths)
        },
      })
    }

  },

  //保存原图片到云存储
  cloudFile(filePath) {
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
      },
      fail: res => {
        console.log("保存图片至云存储失败", res)
      }
    })
  },

  //2.2点击识别
  upload: function () {
    wx.showLoading({
      title: '正在识别...',
      mask: true
    })
    wx.hideTabBar({
      animation: true,
    })
    wx.uploadFile({
      url: this.data.url,
      filePath: this.data.img_url,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: res => {
        wx.showTabBar({
          animation: true,
        })
        console.log("连接服务器成功", res)
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../result/index?name=' + res.data + '&msg=' + this.data.msg + '&fileID=' + this.data.fileID
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '连接服务器失败，请联系管理员' + res.data,
            showCancel: false
          })
        }
      },
      fail: e => {
        wx.showTabBar({
          animation: true,
        })
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传图片失败，请联系管理员开启服务--------' + "错误信息:" + e.errMsg,
          showCancel: true,
          confirmText: "再次尝试",
          confirmColor: "#52a2d8",
          success: res => {
            if (res.confirm) {} else if (res.cancel) {
              console.log("cancel");
            }
          },
        })
      },
      complete: e => {
        wx.hideLoading({})
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  
  zxl: function () {
    wx.navigateTo({
      url: '../zxl/index'
    })
  }
})