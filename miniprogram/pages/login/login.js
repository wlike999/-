// pages/login/login.js

const app = getApp()
const User = wx.cloud.database().collection("user")
Page({

  /**
   * 页面的初始数据
   */
  data:{
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onGetUserInfo: function(e){
    wx.getSetting({
      success: res =>{
        if(res.authSetting["scope.userInfo"]){
          wx.switchTab({
            url: '/pages/home/home',
          })
          wx.cloud.callFunction({
            name:'myLogin',
            data:{},
            success:res =>{
              app.globalData.userInfo = e.detail.userInfo
              app.globalData.userInfo.openId = res.result.openid
              app.onLaunch()
              console.log("调用myLog云函数成功",e.detail.userInfo)
              User.add({
                data:{
                  userInfo:e.detail.userInfo
                },
                success:res =>{
                  console.log("添加成功")
                },
                fail:err =>{
                  console.log("添加失败",err)
                }
              })

            },
            fail: err =>{
              console.log("调用云函数失败")
            }
          })
          wx.switchTab({
            url: '/pages/home/home',
          })
        }
      }
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