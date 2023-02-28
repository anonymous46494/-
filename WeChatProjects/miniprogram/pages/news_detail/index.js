const app = getApp()
const innerAudioContext = wx.createInnerAudioContext() //创建实例
innerAudioContext.autoplay = true //是否自动
Page({

    /**
     * 页面的初始数据
     */
    data: {
        play: false,
        num: 0
    },
    paly: function () {
        innerAudioContext.src = 'https://tts.youdao.com/fanyivoice?le=auto&word=' + this.data.data.show
        if (this.data.play == false) {
            this.setData({
                play: true
            })
            innerAudioContext.play()
        } else {
            this.setData({
                play: false
            })
            innerAudioContext.stop()
        }
        innerAudioContext.onEnded((res) => {
            this.setData({
                play: false
            })
            this.palyUrl()
        })
    },

    //获取数据库信息
    getData: function (id,flag) {
        wx.cloud.callFunction({
            name: 'getNews',
            data: {
                basename: flag,
                id: id
            },
            success: res => {
                console.log(res)
                this.setData({
                    data: res.result.data[0]
                })
            },
            fail: res => {
                console.log("获取数据失败", res)
            }
        })
    },

    //拼接音频链接
    palyUrl: function () {
        if(this.data.num<this.data.data.cont.length)
        innerAudioContext.src = 'https://tts.youdao.com/fanyivoice?le=auto&word=' + this.data.data.cont[this.data.num]
        this.data.num+=1
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData(options.id,options.flag)
        app.clickRow('news',options.id,'reading')   //增加阅读量
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



    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        innerAudioContext.stop()
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})