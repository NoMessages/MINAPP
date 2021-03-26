// pages/login/index.js
Page({
  handleGetUserInfo(e){

    //获取
    const {userInfo} = e.detail;
      console.log(userInfo);


      wx.setStorageSync('userInfo', userInfo)

    wx.navigateBack({
      delta: 1
    })

  }
})