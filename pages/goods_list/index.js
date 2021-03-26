import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
      tabs:[{
          id: 0,
          value: "综合",
          isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
    },
    {
      id: 2,
      value: "价格",
      isActive: false
    }],
    queryInfoItemList:[]
  },
  QueryInfoList:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10
  },
  //全局总页数,
  totalPage:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // https://api-hmugo-web.itheima.net/api/public/v1/goods/search
      console.log(options);
    this.QueryInfoList.cid = options.cid||"";
    this.QueryInfoList.query = options.query||"";
    this.getSearchInfo();

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
  //商品搜索信息
async getSearchInfo(){
  const res = await request({url:"/goods/search",data:this.QueryInfoList})
  const totals = res.data.message.total;
  //得到所有的页数
  this.totalPage = Math.ceil(totals/this.QueryInfoList.pagesize);
  //设置值
  this.setData({
    //拼接数组
    queryInfoItemList:[...this.data.queryInfoItemList,...res.data.message.goods]
  })
  //关闭下拉刷新事件
  wx.stopPullDownRefresh();
},
//页面上滑加载
onReachBottom(){
  // 判断是否是最后一页数据
    if(this.QueryInfoList.pagenum>=this.totalPage){
      //最后一页了
      console.log("已经滑到最后一页啦~");
      wx-wx.showToast({
        title: '没有下一页数据了'})
    }else{
      //如果不是最后一页
      //当前页码++
      //拼接数组
      console.log("加载数据~");
        this.QueryInfoList.pagenum++;
        this.getSearchInfo();
    }
},
//下拉刷新
onPullDownRefresh(){
  console.log("下拉刷新触发");
  //1.清空数组
        this.setData({
          queryInfoItemList:[]
        })
  //2.还原页码
  this.QueryInfoList.pagenum=1;
  //3.重新请求
  this.getSearchInfo();
  //出现数据返回并且还在等待的效果
}

})