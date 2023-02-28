// pages/zone_class/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: ['全部', '化肥', '种子', '农药', '农产品'],
        select: 0,
        height: 0,
        follow: false,
    },

    follow: function () {
        this.setData({
            follow: !this.data.follow
        })
    },

    //滑动或点击tab事件
    zxl: function () {
        if (this.data.select == 0) {
            this.getData('zone')
        } else if (this.data.select == 1) {
            this.classZone('huafei')
        } else if (this.data.select == 2) {
            this.classZone('zonzi')
        } else if (this.data.select == 3) {
            this.classZone('nongyao')
        } else if (this.data.select == 4) {
            this.classZone('nongzuowu')
        }
    },
    // 触发tab导航栏
    activeTab(e) {
        this.setData({
            select: e.currentTarget.dataset.index,
            data: []
        })
        this.zxl()
    },

    // 滑动swiper
    activeSw(e) {
        this.setData({
            select: e.detail.current,
            data: []
        })
        this.zxl()
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
        this.watchHeight()
    },

    //获取数据库信息
    getData: function (database) {
        wx.cloud.callFunction({
            name: 'getData',
            data: {
                basename: database,
                pageSize: 8,
                pageSkip: 0
            },
            success: res => {
                this.setData({
                    data: res.result.data
                })
                console.log(res)
            },
            fail: res => {
                console.log("获取数据失败", res)
            },
            complete: res => {
                this.generalEv()
                this.watchHeight()
            }
        })
    },

    //筛选说说
    classZone: function (value) {
        console.log(value)
        wx.cloud.callFunction({
            name: 'searchZone',
            data: {
                basename: 'zone',
                class: value
            },
            success: res => {
                console.log(res)
                this.setData({
                    data: res.result.data,
                })
            },
            fail: res => {
                console.log(res)
                wx.showToast({
                    title: '请检查网络连接',
                    icon: "error",
                })
            },
            complete: res => {
                this.generalEv()
                this.watchHeight()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData('zone')
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

    },
    goto: function (e) {
        wx.navigateTo({
            url: '../zone_detail/index?id=' + e.currentTarget.dataset.id
        })
    }
})