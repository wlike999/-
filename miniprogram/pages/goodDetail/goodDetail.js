// miniprogram/pages/goodDetail/goodDetail.js
wx.cloud.init()
const db = wx.cloud.database().collection("markList")
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: {},
    number: 0,
    isMarked: null,
    markText: '',
    markList: {}
  },
  preview(e) {
    // GoodsInfo 是一个全局的对象 用于接收请求完成获取的商品对象
    const urls = this.data.good.fileIDs
    const current = e.currentTarget.dataset.url;
    // 解构赋值的方式
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  mark() {
    var that = this;
    if (this.data.isMarked) {
      console.log(that.data.markList._id)
      db.where({
        _openid:that.data.markList._openid
      }).update({
        data: {
          goodID: _.pull(that.data.good._id)
        },
        success: res => {
          that.setData({
            number : that.data.number - 1,
            markText:'加入收藏',
            isMarked:false
          })
          wx.showToast({
            title: '取消成功',
          })
        }
      })
    } else if(this.data.number == 0) {
      db.add({
        data: {
          goodID:[that.data.good._id]
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '收藏成功',
          })
          that.setData({
            number: that.data.number + 1,
            markText:"取消收藏",
            isMarked:true
          })
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '收藏失败',
          })
        }
      })
    }else{
      db.where({
        _openid:that.data.markList._openid
      }).update({
        data: {
          goodID:_.push(that.data.good._id)
        },
        success: res => {
          wx.showToast({
            title: '收藏成功',
          })
          that.setData({
            number: that.data.number + 1,
            markText:"取消收藏",
            isMarked:true
          })
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '收藏失败',
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let good = JSON.parse(options.good)
    this.setData({
      good: good
    })
    console.log(good)
    db.get({
      success: res => {
        if(res.data[0] == null || res.data[0].goodID == null){
          that.setData({
            number:0,
            isMarked:false,
            markText:'加入收藏'
          })
          console.log(that.data.isMarked)
        }else{
          that.setData({
            markList: res.data[0],
            markText:'取消收藏'
          })
          var index = res.data[0].goodID.indexOf(that.data.good._id)
          console.log(index)
          if (index >=  0) {
            that.setData({
              markText: "取消收藏",
              isMarked: true,
              number:that.data.markList.goodID.length
            })
          }else{
            that.setData({
              markText: "加入收藏",
              isMarked: false,
              number:that.data.markList.goodID.length
            }) 
          }
        }
      }
    })
    // console.log(good._id,this.data.markList.goodID)
    // var index = this.data.markList.goodID.indexOf(good._id)
    // if (index >  0) {
    //   this.setData({
    //     markText: "取消收藏",
    //     isMarked: true,
    //     number:this.data.markList.goodID.length
    //   })
    // }else{
    //   this.setData({
    //     markText: "加入收藏",
    //     isMarked: false,
    //     number:this.data.markList.goodID.length
    //   }) 
    // }
    // db.where({
    //   data:{
    //     goodID:that.data.good._id
    //   }
    // }).get(
    //   {
    //     success:res=>{
    //       if(res.data == null){
    //         that.setData({
    //           markText:"加入收藏",
    //           isMarked:false
    //         })
    //       }else{
    //         that.setData({
    //           markText:'取消收藏',
    //           isMarked:true
    //         })
    //       }
    //     },
    //     fail:err=>{
    //       console.log(err)
    //     }
    //   }
    // )

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