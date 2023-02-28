Page({
  data: {
    img: "https://www.upcl.ltd/images/static/QR_code.jpg"
  },

  sava: function () {
    wx.showModal({
      itle: '提示',
      content: '是否保存二维码?',
      success: res => {
        if (res.confirm) {
          this.savePosterPath()
        }
      }
    })
  },

  // 点击保存图片
  savePosterPath: function (e) {
    var imgSrc = this.data.img;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: res => {
              console.log('授权成功');
              this.img(imgSrc)
            }
          })
        } else {
          this.img(imgSrc)
        }
      },
      error: res => {
        console.log(res)
      }
    })
  },

  img: function (imgSrc) {
    console.log(imgSrc)
    wx.downloadFile({
      url: imgSrc,
      success: res => {
        console.log(res); //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '保存成功，快去分享小程序吧！',
              icon: 'none',
              duration: 1000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '图片已保存',
                      icon: 'success',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: '图片未保存',
                      icon: 'error',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      },
      file: res => {
        console.log(res)
      }
    })

  },


  copy: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      }
    })
  },

  kefu: function () {
    wx.navigateTo({
      url: '../chatPage/chatPage'
    })
  }
})