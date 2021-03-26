import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
      leftListMenu:[],
      rightListMenu:[],
      //当前索引
      currentIndex:0,
      scrollTop:0
  },
  //接口返回的值 变量
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //本地储存数据
    const Cates =  wx.getStorageSync('cates')
    //判断是否存在

      if(!Cates){
        this.getCates();//调用
      }else{
        //是否过期
        if(Date.now()-Cates.time > 1000*300){
          this.getCates();//调用
        }else{
          console.log("调用的缓存数据")
          this.Cates = Cates.data;
          let leftListMenu = this.Cates.map(v=>v.cat_name)
          // 遍历所有的数组
          // let rightListMenu = this.Cates.map(v=>v.children.map(v=>v.cat_name)) 
          let rightListMenu = this.Cates[0].children;
          this.setData({
            leftListMenu,
            rightListMenu
          })
        }
      }
  }
  ,leftMenuItemChoice(e){
    // console.log(e)

// 获取索引，改变索引
    const {index} = e.currentTarget.dataset;
    let rightListMenu = this.Cates[index].children; 
    //改变索引
    this.setData({
      currentIndex:index,
      rightListMenu,
      //初始化滚动条
       scrollTop:0
    })

  },
  // es7 中，不需要导入facebook中的文件，勾选增强编译即可
  async getCates(){
    const res = await request({url:'/categories'})
    console.log(res)
          this.Cates=res.data.message;
          wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
          //遍历的语法 
          let leftListMenu = this.Cates.map(v=>v.cat_name)
          // 遍历所有的数组
          // let rightListMenu = this.Cates.map(v=>v.children.map(v=>v.cat_name)) 
          let rightListMenu = this.Cates[0].children;
          this.setData({
            leftListMenu,
            rightListMenu
          })
  }
})