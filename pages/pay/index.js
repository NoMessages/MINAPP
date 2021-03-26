// pages/cart/index.js
import { request, showModel, showToast, requestPayment } from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    carts: {},
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取地址
    let addressInfo = wx.getStorageSync('address')
    if (addressInfo.userName) {
      addressInfo.all = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo;
    }
    this.setData({
      addressInfo
    })
    //获取购物车
    let carts = wx.getStorageSync('carts') || [];
    //如果遍历的是空数组的话 返回的就是true

    //筛选购物车
    carts = carts.filter(v => v.isCheck)

    //重新计算价格
    let totalPrice = 0;
    let totalNum = 0;
    //遍历购物车
    carts.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })

    this.setData({
      carts, totalNum, totalPrice
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //处理购物车函数
  setCartsFun(carts) {

  },
  //付钱
  async handlerPayMoney() {
      try {
            //判断是否有token 没有就去授权页面
    const token = wx.getStorageSync('token')

    //判断是否有token

    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }

    //创建订单
    // const header = { Authorization: token };
    //准备实体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.addressInfo.all;
    const carts = this.data.carts;

    let goods = [];
    carts.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))

    const orderParams = { order_price, consignee_addr, goods };
    const res = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
    let { order_number } = res.data.message;
    console.log(order_number);

    //发起预支付接口
    const res1 = await request({ url: '/my/orders/req_unifiedorder', method: "POST", data: { order_number } })
    //发起微信付款
    console.log(res1.data.message.pay);
    const res2 = await requestPayment(res1.data.message.pay);
    //查看订单支付结果
    const res3 = await request({ url: '/my/orders/chkOrder', method: "POST", data: { order_number } })
    console.log(res3);

    await showToast({title:"支付成功"})
      } catch (error) {
        await showToast({title:"支付失败"})
          //删除缓存中已经勾选的物品
          let newCarts = wx.getStorageSync('carts')

          newCarts = newCarts.filter(v=>!v.isCheck)
          wx.setStorageSync('carts', newCarts);
        wx.navigateTo({
          url: '/pages/order/index?type=1',
        })
      }
  }

})