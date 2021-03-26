// pages/feedback/index.js
import { showToast, request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true
    },
    {
      id: 1,
      value: "商品、商家投诉",
      isActive: false
    }],
    //文本框
    textVal: "",
    imageSource: []
  },
  UpLoadFile: [],
  //回调处理子组件事件
  parenHandChildEve(e) {
    console.log(e);
    const { index } = e.detail;
    console.log("============" + this.data);
    let { tabs } = this.data;
    console.log(tabs);
    //改变索引
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  //处理图片
  async handChooseImg() {

    //调用API

    wx.chooseImage({
      //同时选中图片的数量
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          //拼接数组
          imageSource: [...this.data.imageSource, ...result.tempFilePaths]
        })
      }
    })

  },
  //处理图片函数
  handleRemoveImg(e) {
    //拿到索引
    const { index } = e.currentTarget.dataset;
    //拿到数组
    let { imageSource } = this.data;
    //删除数组
    imageSource.splice(index, 1);
    this.setData({ imageSource })

  },
  //处理按钮提交
  async handleAddMessage() {
    //获取文本内容

    const { textVal } = this.data;
    const { imageSource } = this.data;

    if (!textVal.trim()) {
      //是空的就返回
      await showToast({ title: "请完善反馈的内容信息！" })
      return;
    }
    wx.showLoading({
      title: '正在提交中',
      mask: true
    })

    //循环遍历
    if (imageSource.length !== 0) {
      //上传图片
      imageSource.forEach((v, i) => {
        wx.uploadFile({
          filePath: v,
          name: 'image',
          url: 'https://img.coolcr.cn/api/upload',
          success: (res) => {
            console.log(typeof res.data);
            let url = JSON.parse(res.data);
            this.UpLoadFile.push(url);
            //当到最后一个
            if (i === imageSource.length - 1) {
              console.log("上传完毕");
              this.finishUploadImg(textVal, imageSource)
            }
          }
        })
      })
    } else {
      this.finishUploadImg(textVal, imageSource)
    }

  },
  handBindInputEve(e) {
    let { value } = e.detail;
    let textVal = value;
    this.setData({ textVal })
  },
  //完成上传
  finishUploadImg(textVal, imageSource) {
    wx.hideLoading({});
    this.setData({
      textVal: "",
      imageSource: []
    })
    //回退
    wx.navigateBack({
      delta: 1
    })
  }
})