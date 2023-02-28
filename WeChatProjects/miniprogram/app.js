// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'cloud1-3glkvioyc298d040',
        traceUser: true,
        traceUser: true,
      });
    }

    this.globalData = {
      userInfo: {},
      openid: '',
      islogin: false,
      homePointer: null,
      location: null,
      history: 0,
      key: ['5fbb22c689da4ba3a95c35749a4f333e', '7e64014707a5431a90de20e4298b2cf5'],
    };

    this.gologin()

  },
  //获取openid
  gologin: function () {
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        console.log("获取openid成功", res)
        this.globalData.openid = res.result.OPENID,
          this.globalData.appid = res.result.APPID,
          this.checkSession()
      },
      fail: res => {
        console.log(res)
        wx.showToast({
          title: '获取用户凭证失败',
          icon: 'error'
        })
      },
    })
  },

  //判断登录是否过期
  checkSession: function () {
    wx.checkSession({
      success: res => {
        console.log('登录未过期')
        this.exist()
      },
      fail: res => {
        wx.showToast({
          title: '未登陆',
          icon: 'none'
        })
      }
    })
  },

  //判断用户是否存在
  exist: function () {
    wx.login({
      success: res => {
        wx.cloud.callFunction({
          name: 'autoLogin',
          data: {
            openid: this.globalData.openid
          },
        }).then(res => {
          console.log('查询用户成功:', res)
          if (res.result.data == '') {
            if (JSON.stringify(this.globalData.userInfo) == "{}") {
              wx.showToast({
                title: '错误!',
                icon: 'error',
              })
            } else {
              this.writeUser()
            }
          } else {
            //老用户
            this.globalData.userData = res.result.data[0]
            this.globalData.islogin = true
            this.globalData.history = res.result.data[0].history
            this.upDate()
            if (this.globalData.homePointer != null) {
              this.globalData.homePointer.autoLogin()
            }
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  //新用户注册
  writeUser: function () {
    console.log(this.globalData.openid)
    console.log(this.globalData.userInfo)
    const db = wx.cloud.database();
    const collection = db.collection("userData");
    collection.add({
      data: {
        openid: this.globalData.openid,
        userInfo: {
          nickName: this.globalData.userInfo.nickName,
          gender: this.globalData.userInfo.gender,
          language: this.globalData.userInfo.language,
          city: this.globalData.userInfo.city,
          province: this.globalData.userInfo.province,
          country: this.globalData.userInfo.country,
          avatarUrl: this.globalData.userInfo.avatarUrl,
        },
        register_Date: new Date(new Date),
        login_Date: [{
          'location': this.globalData.location,
          'time': new Date(new Date)
        }],
        appid: this.globalData.appid,
        history: []
      },
      success: res => {
        console.log('新用户写入数据库成功:', res)
        this.getUserInfo1()
      },
      fali: res => {
        console.log('新用户写入数据库失败:', res)
      }
    })
  },


  //注册后的获取用户信息
  getUserInfo1: function () {
    wx.cloud.callFunction({
      name: 'autoLogin',
      data: {
        openid: this.globalData.openid
      },
    }).then(res => {
      console.log(res)
      this.globalData.userData = res.result.data[0]
      this.globalData.islogin = true
      this.globalData.history = res.result.data[0].history
      this.globalData.homePointer.autoLogin()
    })
  },

  //更新登录时间
  upDate: function () {
    wx.cloud.callFunction({
      name: 'upUserData',
      data: {
        id: this.globalData.userData._id,
        location: this.globalData.location,
      },
      success: res => {
        console.log("更新登录时间成功", res)
      },
      fail: res => {
        console.log("更新登录时间失败", res)
      },
    })
  },

  //当前是否需要登录
  islogon: function () {
    wx.showModal({
      title: '提示',
      content: '为了个性化服务，该模块需要登陆后使用哟',
      success: res => {
        if (res.confirm) {
          this.getUserInfo()
        }
      }
    })

  },

  // 弹窗获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        console.log(res)
        this.globalData.userInfo = res.userInfo
        this.exist()
      },
      fail: () => {
        wx.showToast({
          title: '已取消登录',
          icon: 'error',
          duration: 800
        })
      }
    })
  },

  //点击增加阅读次数
  clickRow(basename, id, key) {
    wx.cloud.callFunction({
      name: "hitsUp",
      data: {
        basename: basename,
        key: key,
        id: id
      },
      success: res => {
        console.log('增加成功', res)
      },
      fail: res => {
        console.log(res)
      }
    })
  },

});