// miniprogram/pages/mine/modifyInfo/modifyInfo.js
const app = getApp()
wx.cloud.init()
const userList = wx.cloud.database().collection("user")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: "none", //上传头像时是否显示加载动画
    telMessage: null, //手机号码格式不正确的提示文字
    disabled: false, //手机号码格式是否正确
    avatarUrl: '', //头像图片链接
    vita: null,//个人简介
    nickName: null,//昵称
    nickNameMsg: "",//默认昵称
    tel: null,//手机号码
    gender: null,//性别
    birthday: null,//生日
    userInfo: {},//用户信息
    imgs: [], //本地图片地址数组
    picPaths: [], //网络路径
    actions: [
      {
        name: '沙河校区',
      },
      {
        name: '西土城校区',
      },//校区选择名
    ],
    campus:'',
    down:''
  },
  //更换头像
  chooseImageTap() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      },
      fail: console.error
    })
  },
  onClick(){
    this.setData({
      down:"down",
      show:true
    })
  },
  onClose1() {
    this.setData({ show: false , down:''});
  },

  onSelect1(event) {
    this.setData({
      campus:event.detail.name,
      ['userInfo.campus'] : event.detail.name,
      down:""
    })
    console.log(this.data.campus)
  },

  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        that.setData({
          showLoading: "flex"
        })
        //选择图片后上传图片至云存储
        wx.cloud.uploadFile({
          cloudPath: 'avatarUrl/' + Date.parse(new Date()) + '.png', // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            that.setData({
              avatarUrl: res.fileID,
            })
            setTimeout(function () {
              that.setData({
                showLoading: "none"
              }, 300)
            })
            console.log(that.data)
          },
          fail: console.error
        })
      }
    })
  },

  onChange(e) {
    //读取电话号码
    if ([e.currentTarget.dataset.prop] == "tel") {
      const phone = e.detail;
      let message = '';
      let disable = '';
      if (phone) {
        console.log(phone)
        if (/^1(3|4|5|7|8)\d{9}$/.test(phone)) {//判断电话号码的正误
          message = '';
          disable = false;
          this.setData({
            telMessage: message,
            disabled: disable,
            tel: phone
          });
        } else {
          message = '您输入的手机号码有误';
          disable = true;
          this.setData({
            telMessage: message,
            disabled: disable,
          });
        }
      } else {
        console.log(this.data)
        message = '输入的手机号不能为空',
          disable = false
        this.setData({
          telMessage: message,
          disabled: disable,
        });
      }
      if (this.data.disabled === true) {
        return false;
      } else {
        console.log(this.data)
        return true;
      }
    }
    //读取昵称
    if ([e.currentTarget.dataset.prop] == "nickName") {
      const nickName = e.detail
      if (nickName) {
        this.setData({
          nickName: nickName
        })
        console.log(this.data)
        return true

      } else return false
    }
    if ([e.currentTarget.dataset.prop] == "vita")
      this.setData({
        vita: e.detail
      })
    console.log(this.data)
  },
  //确认提交
  onConfirm() {
    var that = this
    if (this.data.disabled) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    else {
      //更新昵称
      if (this.data.nickName) {
        this.setData({
          ['userInfo.nickName']: this.data.nickName,
        })
      }
      //更新头像
      if (this.data.avatarUrl) {
        this.setData({
          ['userInfo.avatarUrl']: this.data.avatarUrl,
        })
      }
      //更新电话号码
      if (this.data.tel)
        this.setData({
          ['userInfo.tel']: this.data.tel,
        })
      //更新个人简介
      if (this.data.vita) {
        this.setData({
          ['userInfo.vita']: this.data.vita
        })
      }
      var user1 = this.data.userInfo;
      var user2 = app.globalData.userInfo;
      if (this.diff(user1, user2)) {
        wx.showToast({
          title: '未修改个人信息',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        //打印修改后的信息
        console.log("修改后的个人信息", this.data.userInfo)
        var user3 = this.data.userInfo;
        wx.cloud.callFunction({
          name:'modifyUserInfo',
          data:{
            user3:user3
          },
          success:res=>{
            wx.showToast({
              title: '修改成功',
              icon: "success",
              success:res=>{
                console.log("修改个人信息成功",res)
              }
            });
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/mine/mine',
              })
            }, 1000);
          },
          fail:err=>{
            console.log("修改失败",err)
          }
        })
      }
    }
  },
  //取消修改个人信息
  onCancel() {
    wx.showModal({
      title: '提示',
      content: '是否取消修改个人消息',
      success: res => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/mine/mine',
          },1000)
        }
      }
    })
  },
  //判断修改后的信息是否与修改前一样
  diff(obj1, obj2) {
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (var attr in obj1) {
      var t1 = obj1[attr] instanceof Object;
      var t2 = obj2[attr] instanceof Object;
      if (t1 && t2) {
        return diff(obj1[attr], obj2[attr]);
      } else
        if (obj1[attr] != obj2[attr]) {
          return false;
        }
    }
    return true;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  copy(obj) {
    var newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      var val = obj[key];
      //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
      newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
    }
    return newObj;
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      const obj = app.globalData.userInfo;
      var userInfo = this.copy(obj)
      console.log(userInfo)
      this.setData({
        userInfo: userInfo,
        nickNameMsg: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
    console.log("修改前的个人信息", this.data.userInfo)
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