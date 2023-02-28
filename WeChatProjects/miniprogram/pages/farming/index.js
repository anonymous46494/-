// pages/farming/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{ id: 1, name: '灌水' }, { id: 2, name: '抹芽定梢' }, { id: 3, name: '嫁接' }, { id: 4, name: '修剪' }, { id: 5, name: '除草' }, { id: 6, name: '其他' }],
    msg: '',
    index: false,
    date: '2022-03-31',
    array: ['微信公众号内提醒','信息提醒'],
    img_url: [],

  },

  checkButtonTap: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        if (this.data.buttons[i].checked == true) {
          this.data.buttons[i].checked = false;

        } else {
          this.data.buttons[i].checked = true;

        }
      }
    }
    this.setData({
      buttons: this.data.buttons,
      msg: "id:" + id
    })

  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //时间选择器
  bindDateChange: function (e) {
    console.log('时间选择器', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //选择本地照片
  uploadImg() {
    wx.chooseMedia({
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        var filePath = res.tempFiles//赋值filePath临时路径
        filePath.forEach((item, idx) => {
          var fileName = Date.now() + "_" + idx;
          this.cloudFileImg(fileName, item.tempFilePath)
        })
      }
    })
  },
  //上传照片
  cloudFileImg(fileName, path) {
    wx.showLoading({
      title: '上传中...',
    })
    wx.cloud.uploadFile({
      cloudPath: fileName + ".jpg",
      filePath: path
    }).then(res => {
      console.log(res)
      this.data.img_url.push(res.fileID)
      this.setData({
        img_url: this.data.img_url
      })
      console.log(this.data.img_url)
      wx.hideLoading()
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.buttons[0].checked = true;
    this.setData({
      buttons: this.data.buttons,
    })

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

  submit:function(){
    wx.showToast({
      title: '设置提醒成功',
      icon: 'success',
      duration: 800,
      mask: true
    })
  }

})