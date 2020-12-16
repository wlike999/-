//app.js
wx.cloud.init()
const userList = wx.cloud.database().collection("user")
App({
  onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'testtest-6gioujhq99e3fabc',
      })
    }
    wx.getSetting({
      success: res =>{
        if(!res.authSetting['scope.userInfo'])
        {
          wx.redirectTo({
            url: '/pages/login/login',
          })
          console.log("用户未授权")
        }else{
          console.log("用户已授权")
          wx.cloud.callFunction({
            name:'myLogin',
            data:{},
            success:res =>{
              userList.where({
                _openid:res.result.openid
              }).get({
                success:res =>{
                  that.globalData.openId = res.data[0]._openid
                  that.globalData.userInfo = res.data[0].userInfo
                  that.globalData.userInfo.openId = that.globalData.openId
                  console.log("获取用户信息成功", that.globalData)
                },
                fail:err =>{
                  console.log("获取失败",err)
                }
              })
              console.log("调用myLog云函数成功",res.result)
            },
            fail: err =>{
              console.log("调用云函数失败")
            }
          })
        }
      }
    })
  },
  globalData:{
    openId:'',
    userInfo:{}
  }
})
