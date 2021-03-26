// pages/cart/index.js
import { showModel ,showToast} from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    carts: {},
    allCheck: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取地址
    let addressInfo = wx.getStorageSync('address')
    console.log(addressInfo);
    if (addressInfo.userName) {
      addressInfo.all = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo;
    }
    this.setData({
      addressInfo
    })
    //获取购物车
    let carts = wx.getStorageSync('carts') || [];
    //如果遍历的是空数组的话 返回的就是true
    //优化性能
    //  const allCheck = carts.length?carts.every(v=>v.isCheck):false;
    this.setCartsFun(carts)
    //console.log(carts);

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handChooseAddres() {
    //获取收货地址
    wx.chooseAddress({
      success: (res) => {
        wx.setStorageSync('address', res);
      }
    })
  },
  //处理多选框
  handleItemChange(e) {
    //商品信息
    const goods_id = e.currentTarget.dataset.id;
    //查找商品索引
    let { carts } = this.data;
    //查询索引
    let index = carts.findIndex(v => v.goods_id === goods_id);
    //选中取反状态
    carts[index].isCheck = !carts[index].isCheck;
    //重新计算
    this.setCartsFun(carts);

  },
  //处理购物车函数
  setCartsFun(carts) {

    //重新计算价格
    let allCheck = true; //一开始被选中
    let totalPrice = 0;
    let totalNum = 0;
    //遍历购物车
    carts.forEach(v => {
      if (v.isCheck) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allCheck = false;
      }
    })
    //如果是空数组
    allCheck = carts.length != 0 ? allCheck : false;

    this.setData({
      carts, totalNum, totalPrice, allCheck
    })
    wx.setStorageSync('carts', carts);
  },
  //处理全选
  handleChkItemEve(e) {
    //获取购物车的数据
    let { carts, allCheck } = this.data;
    //取反
    allCheck = !allCheck;
    //遍历改变
    carts.forEach(v => v.isCheck = allCheck);
    //修改
    this.setCartsFun(carts)

  },
  //处理加号和减号
  async handleGoodsItemNum(e) {
    let { opration, id } = e.currentTarget.dataset;
    console.log(opration, id);
    //获取购物车
    let { carts } = this.data;
    //查找
    const index = carts.findIndex(v => v.goods_id === id);
    //操作购物车之前，进行判断时候需删除商品
    if (carts[index].num === 1 && opration === -1) {
      const res = await showModel({ content: "确定要删除商品吗？" })
      if (res.confirm) {
        carts.splice(index, 1);
        this.setCartsFun(carts);
      }
    } else {
      carts[index].num += opration;
      //设置回购物车
      this.setCartsFun(carts)
    }
  },
  //结算按钮
  async handleMoneyBuy(e) {
    console.log("被点击了");
    //选中按钮
      let {totalNum,addressInfo} = this.data;
      //判断是否有商品
      if(totalNum===0){
        await showToast({title:"您还没有选择商品！"})
        return;
      }

      //判断是否有收货地址
      if(!addressInfo.userName){
        await showToast({title:"您还没有选择收货地址"})
        return;
      }

      wx.navigateTo({
        url: '/pages/pay/index',
      })

  }
})