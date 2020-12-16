// audio.js
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    poster1:'https://i.loli.net/2020/12/16/eyBIkTsfwEomz43.jpg',
    name1:'My My My!',
    author1:'Troye Sivan',
     src1: 'https://7465-testtest-6gioujhq99e3fabc-1303731687.tcb.qcloud.la/Troye%20Sivan%2CCash%20Cash%20-%20My%20My%20My!%20(Cash%20Cash%20Remix).mp3?sign=63a882188d88a59d527035360f42d374&t=1608036524',//云函数中音乐路径
     poster2:'https://i.loli.net/2020/12/16/BeM2IpK8kALgcGZ.jpg',
     name2:'You Need To Calm Down',
     author2:'Taylor Swift',
     src2:'https://7465-testtest-6gioujhq99e3fabc-1303731687.tcb.qcloud.la/Taylor%20Swift%20-%20You%20Need%20To%20Calm%20Down%20(Live%20From%20Paris).mp3?sign=520f75ca4e10d11ca13acee8abc7945f&t=1608036497'//云函数中音乐路径
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },

})
