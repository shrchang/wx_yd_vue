import url from 'url'
import config from './config'
let basePath=config.basePath

export default {

    //获取配置
    queryWxConfig:url.resolve(basePath,'config'),
    //获取微信用户
    getWxUser:url.resolve(basePath,"config/getWxUser"),
    //获取商铺列表
    queryShops:url.resolve(basePath,"shops"),
    //获取商铺下面的场地 shopId
    queryRoomsByShop:url.resolve(basePath,"shops/queryRooms"),
    //获取单个场地的详情 id
    queryRoomById:url.resolve(basePath,"rooms/detail"),
    //查询套餐 shopId
    queryMealSet:url.resolve(basePath,"rooms/queryMealSet"),
    //创建订单  这个是放到body里面的
    createOrder:url.resolve(basePath,"orders/create"),
    //查询单个订单 id
    queryOrderById:url.resolve(basePath,"orders/querOrder"),
    //查询订单明细 id
    querOrderDeatailById:url.resolve(basePath,"orders/querOrderDeatail"),
    //取消订单 id
    cancelOrderById:url.resolve(basePath,"orders/cancel"),
    //删除订单  id
    deleteOrderById:url.resolve(basePath,"orders/del"),
    //查询当前会员
    queryMember:url.resolve(basePath,"member"),
    //添加会员 只需要加给参数 phoneNo birthDay （yyyy-MM-dd）
    addMember:url.resolve(basePath,"member/add"),
    //会员充值 amount 单位元
    recharge:url.resolve(basePath,"member/recharge")



}
