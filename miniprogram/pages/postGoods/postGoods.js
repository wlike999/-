// miniprogram/pages/postGoods/postGoods.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    fileIDs: [],
    value:'',
    price:'',
    vita:'',
    title:'',
    campus:'',
    type:["全部商品"],
    textareaSize:{
      maxHeight: 150, minHeight: 80
    },
    show1:false,
    show2:false,
    show3:false,
    show4:false,
    show5:false,
    show: false,
    down:"",
    actions: [
      {
        name: '沙河校区',
      },
      {
        name: '西土城校区',
      },
    ]
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
      down:""
    })
    console.log(this.data.campus)
  },
  onChange(e){
    if([e.currentTarget.dataset.prop] == "goodTitle"){
      console.log(e.detail)
      this.setData({
        title:e.detail
      })
    }
    if([e.currentTarget.dataset.prop] == "goodPrice"){
      console.log(e.detail)
      this.setData({
        price:e.detail
      })
    }
    if([e.currentTarget.dataset.prop] == "goodVita"){
      console.log(e.detail)
      this.setData({
        vita:e.detail
      })
    }
  },
  onSelect(e){
    let typeList = this.data.type
    let num = e.currentTarget.dataset.num
    if(num == 1){
      this.setData({
        show1: this.data.show1 ? false : true
      })
      if(this.data.show1){
        typeList.push("电子产品")
      }else{
        for (let i = 0; i < typeList.length; i++) {
          if(typeList[i] == "电子产品")
          {
            typeList.splice(i,1)
            break;
          }
      }
    }
    console.log(typeList)
  }
    if(num == 2){
      this.setData({
        show2: this.data.show2 ? false : true
      })
      if(this.data.show2){
        typeList.push("二手书籍")
      }else{
        for (let i = 0; i < typeList.length; i++) {
          if(typeList[i] == "二手书籍")
          {
            typeList.splice(i,1)
            break
          }
      }
    }
    console.log(typeList)
  }
    if(num == 3){
      this.setData({
        show3: this.data.show3 ? false : true
      })
      if(this.data.show3){
        typeList.push("生活用品")
      }else{
        for (let i = 0; i < typeList.length; i++) {
          if(typeList[i] == "生活用品")
          {
            typeList.splice(i,1)
            break
          }
      }
    }
    console.log(typeList)
  }
    if(num == 4){
      this.setData({
        show4: this.data.show4 ? false : true
      })
      if(this.data.show4){
        typeList.push("体育器械")
      }else{
        for (let i = 0; i < typeList.length; i++) {
          if(typeList[i] == "体育器械")
          {
            typeList.splice(i,1)
            break
          }
      }
    }
    console.log(typeList)
  }
    if(num == 5){
      this.setData({
        show5: this.data.show5 ? false : true
      })
      if(this.data.show5){
        typeList.push("其他")
      }else{
        for (let i = 0; i < typeList.length; i++) {
          if(typeList[i] == "其他")
          {
            typeList.splice(i,1)
            break
          }
      }
    }
    console.log(typeList)
  }
  this.setData({
    type:typeList
  })
},
  chooseImageTap() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.ChooseImage('album')
          } else if (res.tapIndex == 1) {
            that.ChooseImage('camera')
          }
        }
      },
      fail: console.error
    })
  },
  //选择图片
  ChooseImage(type) {
  console.log("选择照片前",this.data.imgList)
    wx.chooseImage({
      count: 8 - this.data.imgList.length, //默认9,我们这里最多选择8张
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: [type], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log("选择照片后",this.data.imgList)
        setTimeout(() => {
          this.onLoad()
        },300)
      }
    });
  },
  //删除图片
  DeleteImg(e) {
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
          console.log("删除照片后",this.data.imgList)
          setTimeout(() => {
            this.onLoad()
          },300)
        }
      }
    })
  },

  //上传数据
  publish() {
    let price = this.data.price
    let imgList = this.data.imgList
    let title = this.data.title
    let typeLsit = this.data.type;
    wx.showLoading({
      title: '发布中',
    })
    if(!title){
      wx.showToast({
        icon: "none",
        title: '请输入标题'
      })
      return
    }
    if (!price || price.length < 0) {
      wx.showToast({
        icon: "none",
        title: '请输入价格'
      })
      return
    }
    if(price > 9999){
      wx.showToast({
        icon: "none",
        title: '太贵了'
      })
      return
    }
    if (!imgList || imgList.length < 1) {
      wx.showToast({
        icon: "none",
        title: '请选择图片'
      })
      return
    }
    if(typeLsit.length <= 1){
      wx.showToast({
        icon: "none",
        title: '请选择类别'
      })
      return
    }

    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    Promise.all(promiseArr).then(res => {
      wx.cloud.database().collection('goodList').add({
        data: {
          fileIDs: this.data.fileIDs,
          date: Date.parse(new Date()),
          createTime: wx.cloud.database().serverDate(),
          title: this.data.title,
          campus:this.data.campus,
          images: this.data.imgList,
          price:this.data.price,
          type:this.data.type,
          vita:this.data.vita,
          state:0,
          sellerAvatarUrl:app.globalData.userInfo.avatarUrl
        },
        success: res => {
          setTimeout(function () {
            wx.hideLoading()
            wx.switchTab({
              url: '/pages/home/postGoods/postGoods',
            })
          }, 300)
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },
  onCancel(){
    wx.showModal({
      title:"未发布商品",
      content:"是否继续发布商品",
      cancelText:'继续',
      confirmText:'退出',
      confirmColor:'red',
      cancelColor: '#448af5',
      success:res=>{
        if(res.confirm){
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/postGoods/postGoods',
            })
          },150)
        }
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(this.data)
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