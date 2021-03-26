// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[{
      id: 0,
      value: "商品收藏",
      isActive: true
  },
  {
    id: 1,
    value: "品牌收藏",
    isActive: false
},
{
  id: 2,
  value: "店铺收藏",
  isActive: false
},
{
  id: 3,
  value: "浏览足迹",
  isActive: false
}],
collect:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    //获取缓存
      let collect = wx.getStorageSync('collect')||[];
      this.setData({collect})
  },
    //回调处理子组件事件
    parenHandChildEve(e){
      console.log(e);
      const {index} = e.detail;
      console.log("============"+this.data);
      let {tabs} = this.data;
      console.log(tabs);
      //改变索引
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      this.setData({
        tabs
      })
    },

})