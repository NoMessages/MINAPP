// pages/auth/index.js
import { request,login } from "../../request/index.js";
Page({
//获取不到用户信息 可能是bindgetUserInfo方法绑定写错了

 async handleGetUserInfo(e){
    console.log(e);
    //获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail;


    //获取小程序登录成功后的code
    const {code} = await login();
    //获取code
     console.log(code);
     const loginParams = {encryptedData,rawData,iv,signature,code}
     const res = await request({url:'/users/wxlogin',data:loginParams,method:"post"})
     console.log(res);
      //存放token
      wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
      wx.navigateBack({
        complete: (res) => {
          delta:1
        },
      })
  }
})