import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[{
      id: 0,
      value: "综合",
      isActive: true
  },
  {
    id: 1,
    value: "待付款",
    isActive: false
},
{
  id: 2,
  value: "待发货",
  isActive: false
},
{
  id: 3,
  value: "退款/退货",
  isActive: false
}
],
orderss:[{
    id: "HMDD202020000001244",
    money: "13618",
    day: '2020/10/25 下午8:29:32',
    type: "1"
},{
  id: "HMDD202020000001245",
  money: "13618",
  day: '2020/10/25 下午2:39:56',
  type: "1"
},{
  id: "HMDD202020000001254",
  money: "13618",
  day: '2020/10/25 下午4:35:22',
  type: "1"
}]
  }, 

  onShow(){
      let token = wx.getStorageSync('token')
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }

      //获取当前页面栈
      let pages = getCurrentPages();
      let currentPages = pages[pages.length - 1];
      //改变标题选中的item
      const {type} = currentPages.options;
      console.log(type);
      this.handChangeItemTitleByIndex(type-1);
      //调用
      this.getOrders(type)
  },
  //获取订单，
  async getOrders(type){
      //获取
      const res = await request({url:"/my/orders/all",data:{type}})
      this.setData({
        //修改时间优化 
        //  很重要啊
        //  很重要啊
        //  很重要啊
        //  很重要啊
        orders:res.orders.map(v=>({...v,time_cn:(new Date(v.old_time*1000).toLocaleString())}))
      })
  },
   //回调处理子组件事件
  parenHandChildEve(e){
    const {index} = e.detail;
    this.handChangeItemTitleByIndex(index);
  },
  //改变索引
  handChangeItemTitleByIndex(index){
  //改变tabs索引
  let {tabs} = this.data;
  //改变索引
  tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
  this.setData({
    tabs
  })
  }

})