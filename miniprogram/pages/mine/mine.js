// pages/mine/mine.js
const app = getApp()
wx.cloud.init()
const user = wx.cloud.database().collection("user")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    userInfo:{}
  },

  modifyInfo:function(id){
    setTimeout(()=>
      {wx.redirectTo({
        url: '/pages/mine/modifyInfo/modifyInfo',
      })},150)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name:'myLogin',
      data:{},
      success:res =>{
        console.log(res)
        user.where({
          '_openid':res.result.openid
        }).get({
          success:res =>{
            console.log(res)
            that.setData({
              openId : res.data[0]._openid,
              userInfo : res.data[0].userInfo,
            })
            console.log("获取用户信息成功", that.data)
          },
          fail:err =>{
            console.log("获取失败",err)
          }
        })
      }
    })
    console.log(that.data)
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