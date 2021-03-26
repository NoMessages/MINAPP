//引入 Promise
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    cateList:[],
    floorList:[],
    swiperUrl:"",
    floorNewListNavi:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getSwiperList();
      this.getCateList();
      this.getFloorList();
  
},

getSwiperList(){
  request({url:"/home/swiperdata"})
  .then(result=>{

    this.setData({
               swiperList: result.data.message
  })
})},
getCateList(){
  request({url:"/home/catitems"})
  .then(result=>{
    this.setData({
               cateList: result.data.message
  })
})},
getFloorList(){
  request({url:"/home/floordata"})
  .then(result=>{

      let str = "/pages/goods_list?query=服饰";
      let new_str = str.replace();
      console.log(new_str);
        console.log(result.data.message);
        let floorList = result.data.message;
        // v1.navigator_url.replace(/goods_list/g,"/goods_list/index") 

        //原数组改变不了值
        // floorList.forEach(v=>v.product_list.forEach(v1=>console.log(v1.navigator_url.replace(/goods_list/g,"/goods_list/index"))))
   
        //定义变量接受
      let arr = floorList;
      console.log("修改前================");
      //  console.log(arr);
      console.log(floorList);
      for(var i = 0;i<3;i++){
          for (let index = 0; index < 5; index++) {
            arr[i].product_list[index].navigator_url = arr[i].product_list[index].navigator_url.replace(/goods_list/g,"goods_list/index");
          }
      }
      
         console.log("修改后================");
         console.log(floorList);

        
    this.setData({
               floorList: floorList
  })
})}

})