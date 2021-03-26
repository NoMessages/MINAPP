import { request, showToast  } from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goodsObj:[],
      isCollect:false
  },
  ImageList:[],
  //商品数据
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      let pages = getCurrentPages();
      let currentPge = pages[pages.length - 1];
      let options = currentPge.options;
      const {goods_id} = options;
      this.GoodsInfo.goods_id = goods_id;
      this.getGoodsInfo(goods_id);


      //获取收藏的缓存

  },
async getGoodsInfo(goods_id){
    const goodsObjs = await request({url:'/goods/detail',data:{goods_id}})
    let goodsObj = goodsObjs.data.message;
    //获得GoodsINFO
    this.GoodsInfo = goodsObj;
    //请求操作
    let collect = wx.getStorageSync('collect')||[];
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

    this.ImageList = goodsObj;
    this.setData({
      goodsObj:{
      goods_name:goodsObj.goods_name,
      goods_price:goodsObj.goods_price,
      goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
      pics:goodsObj.pics
      },isCollect
   
    })
},
handPreviewImage(e){
    // console.log("点击成功");
  console.log(this.ImageList);
  const urls = this.ImageList.pics.map(v=>v.pics_mid)
  const curren = e.currentTarget.dataset.url;
  console.log(urls);
  wx.previewImage({
    urls: urls,
    current: curren
  })
},
handCartAdd(){
  //缓存中查找数据
  console.log(this.GoodsInfo.goods_id);
  let carts = wx.getStorageSync('carts')||[];
  //是否是第一次添加
  let index = carts.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
  
    if(index===-1){
      //第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.isCheck=true;
      carts.push(this.GoodsInfo)
    }else{
        //不是第一次添加
        carts[index].num++;
    }
    //重新把购物车添加至缓存中
    wx.setStorageSync('carts', carts);
    //提示
    wx.showToast({
      title: '加入购入车成功',
      icon:'success',
      mask: true
    })

},
//处理收藏绑定逻辑
 async handCollect(){
    let isCollect = false;
  //获取缓存中的数据
  let collect = wx.getStorageSync('collect')||[];
  let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)

  if(index!==-1){
    //删除操作
    collect.splice(index,1);
    isCollect = false;
    await showToast({title:"取消收藏成功"})
  }else{
    //没收藏
    collect.push(this.GoodsInfo);
    isCollect = true;
    await showToast({title:"收藏成功"})
  }
  //存回数组
    wx.setStorageSync('collect', collect);
  //修改
  this.setData({
    isCollect
  })



}
})