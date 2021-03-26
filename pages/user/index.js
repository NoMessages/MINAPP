// pages/user/index.js
Page({
  data:{
    userInfo:{},
    collectionNum:0

  }
  ,onShow(){
    const userInfo = wx.getStorageSync('userInfo')
      //获取收藏的缓存
      let collect = wx.getStorageSync('collect')||[];
      let collectionNum = collect.length;

    this.setData({
      userInfo,collectionNum
    })
  }
})