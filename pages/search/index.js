// pages/search/index.js

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据  
   * 防手抖技术  搜索
   * 节流技术  下拉 上拉操作 
   */
  data: {
    goodsInfos: [],
    isFocus: false,
    inputValue:""
  },
  //定时器
  TimeId: -1,
  //键盘输入
  handInputItem(e) {
    const { value } = e.detail;
    console.log(value);
    if(!value.trim()){
      //空字符串不发送请求
    clearTimeout(this.TimeId);
      this.setData({
        isFocus:false,
        goodsInfos:[]
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    //清除定时器
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 停止输入之后才发送请求
      this.queryInfo(value);
    }, 1000)

  },
  //发送请求
  async queryInfo(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } })
    console.log(res);
    this.setData({
      goodsInfos: res.data.message
    })
  },
  handCancle(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goodsInfos:[]
    })
  }

})