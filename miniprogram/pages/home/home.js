// pages/home/home.js
const app = getApp()
Page({

  data: {
    floorstatus: false,
    goodList: [],
    search_list: [],
    option1: [{
        text: '全部商品',
        value: 0
      },
      {
        text: '二手书籍',
        value: 1
      },
      {
        text: '电子产品',
        value: 2
      },
      {
        text: '体育器械',
        value: 3
      },
      {
        text: '生活用品',
        value: 4
      },
      {
        text: '其他类别',
        value: 5
      },
    ],
    option2: [
      {
        text: '全部校区',
        value: 'a'
      },
      {
        text: '沙河校区',
        value: 'b'
      },
      {
        text: '西土城校区',
        value: 'c'
      }
    ],
    value1: 0,
    value2: 'a',
    value11: 0,
    value22: 'a'
  },
  switchType(e) {
    switch (e) {
      case 0:{
        return "全部商品"
      }
      case 1:{
        return "二手书籍"
      }
      case 2:{
        return "电子产品"
      }
      case 3:{
        return "体育器械"
      }
      case 4:{
        return "生活用品"
      }
      case 5:{
        return "其他"
      }
      case 'a':{
        return "全部校区"
      }
      case 'b':{
        return "沙河校区"
      }
      case 'c':{
        return "西土城校区"
      }
    }
  },
  getData2(dataBaseName = "goodList", skipNumber = 0, needNumber = 9, value1 = 0, value2 = 'a') {
    let type = this.switchType(value1);
    let campus = this.switchType(value2);
    console.log(type,campus)
    wx.cloud.callFunction({
      name: "getDataFromGoodLists",
      data: {
        databaseName: dataBaseName,
        skipNumber: skipNumber,
        needNumber: needNumber,
        type: type,
        campus: campus
      },
      success: _res => {
        console.log("初次调用商品信息成功", _res)
        var oldGoodList = this.data.goodList
        var newGoodList = oldGoodList.concat(_res.result.data)
        this.setData({
          goodList: newGoodList
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getData(dataBaseName = "goodList", skipNumber = 0, needNumber = 9, value1 = 0, value2 = 'a'){
    let type = this.switchType(value1);
    let campus = this.switchType(value2);
    console.log(type,campus)
    wx.cloud.callFunction({
      name: "getDataFromGoodLists",
      data: {
        databaseName: dataBaseName,
        skipNumber: skipNumber,
        needNumber: needNumber,
        type: type,
        campus: campus
      },
      success: _res => {
        console.log("初次调用商品信息成功", _res)
        this.setData({
          goodList: _res.result.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goToDetail(e){
    const key = e.currentTarget.dataset.prop
    let good = JSON.stringify(this.data.goodList[key])
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?good='+good,
    })
  },
  onLoad: function () {
    this.getData()
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onSearch() {
    //模糊搜索
    const db = wx.cloud.database()
    var that = this
    db.collection('goodList').where({
      //使用正则查询，实现对搜索的模糊查询
      title: db.RegExp({
        regexp: that.data.value,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          search_list: res.data
        })
        let searchList = JSON.stringify(res.data)
        wx.navigateTo({
          url: '/pages/searchList/searchList?searchList=' + searchList,
        })
      }
    })
  },

  onChange(e) {
    console.log(e.detail)
    this.setData({
      value: e.detail,
    });
  },
  onSwitch1Change(e) {
    if ([e.currentTarget.dataset.prop] == "value1") {
      this.setData({
        value11: e.detail
      })
    } else {
      this.setData({
        value22: e.detail
      })
    }
    this.getData("goodList",0, 9, this.data.value11, this.data.value22)
    console.log()
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
    this.onLoad()
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
    this.getData2("goodList", this.data.goodList.length, 9, this.data.value11, this.data.value22)
    console.log(this.data.goodList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})