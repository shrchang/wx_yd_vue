import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'
import api from './api/require'
import utils from './utils/utils'
import { Store } from 'vuex';

const Home = () => System.import('./view/Home/Home.vue') //首页

const Register = () => System.import('./view/Register/Register.vue') //注册
const Login = () => System.import('./view/Login/Login.vue') //登录
const ForgotLoginPwd = () => System.import('./view/Password/ForgotLoginPwd.vue') //忘记密码

const Classify = () => System.import('./view/Classify/Classify.vue') //分类
const ProductList = () => System.import('./view/Classify/ProductList.vue') //商品列表
const ProductDetail = () => System.import('./view/Classify/ProductDetail.vue') //商品详情



const ShopCart = () => System.import('./view/ShopCart/ShopCart.vue') //商品详情

const OrderDetail = () => System.import('./view/Order/OrderDetail.vue') //订单详情
const AdvanceDetail = () => System.import('./view/Order/AdvanceDetail.vue') //预付款商品详情
const OrderPay = () => System.import('./view/Order/OrderPay.vue') //订单详情
const PayResult = () => System.import('./view/Order/PayResult.vue') //支付结果

const AdvanceList = () => System.import('./view/AdvanceList/AdvanceList.vue') //预付款订单列表
const AdvanceListDetail = () => System.import('./view/AdvanceList/AdvanceListDetail.vue') //预付款订单列表详情

const Mine = () => System.import('./view/Mine/Mine.vue') //个人中心

const ShopDetail = () => System.import("./view/Shop/ShopDetail.vue")//场地详情

const Self = () =>System.import("./view/Self/Self.vue")

Vue.use(VueRouter)

const routes = [
	//地址为空时跳转home页面
	{
		path: '/',
		name: 'index',
		redirect: '/home'
	},
	//首页
	{
		path: '/home',
		name: 'home',
		component: Home,
		meta: {
			title: '商品首页'
		}
	},
	//注册
	{
		path: '/register',
		name: 'register',
		component: Register,
		meta: {
			title: '注册'
		}
	},
	//登录
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: {
			title: '登录'
		}
	},
	//忘记密码
	{
		path: '/forgotLoginPwd',
		name: 'forgotLoginPwd',
		component: ForgotLoginPwd,
		meta: {
			title: '忘记密码'
		}
	},
	//场地
	{
		path: '/classify',
		name: 'classify',
		component: Classify,
		meta: {
			title: '场馆'
		}
	},
	//场地详情
	{
		path: '/shopDetail',
		name: 'shopDetail',
		component: ShopDetail,
		meta: {
			title: '场馆详情'
		}
	},
	//商品列表
	{
		path: '/productList',
		name: 'productList',
		component: ProductList,
		meta: {
			title: '商品列表'
		}
	},
	//商品详情
	{
		path: '/ProductDetail',
		name: 'productDetail',
		component: ProductDetail,
		meta: {
			title: '商品详情'
		}
	},
	//预付款商品详情
	{
		path: '/advanceDetail',
		name: 'advanceDetail',
		component: AdvanceDetail,
		meta: {
			title: '预付款'
		}
	},
	//购物车
	{
		path: '/shopCart',
		name: 'shopCart',
		component: ShopCart,
		meta: {
			title: '购物车'
		}
	},
	//订单详情
	{
		path: '/orderDetail',
		name: 'orderDetail',
		component: OrderDetail,
		meta: {
			title: '订单详情'
		}
	},
	//订单支付
	{
		path: '/orderPay',
		name: 'orderPay',
		component: OrderPay,
		meta: {
			title: '订单支付'
		}
	},
	//支付结果
	{
		path: '/payResult',
		name: 'payResult',
		component: PayResult,
		meta: {
			title: '支付结果'
		}
	},
	//个人中心
	{
		path: '/mine',
		name: 'mine',
		component: Mine,
		meta: {
			title: '个人中心'
		}
	},
	//我的
	{
		path: '/self',
		name: 'self',
		component: Self,
		meta: {
			title: '我的信息'
		}
	},
	//预付款订单列表
	{
		path: '/advanceList',
		name: 'advanceList',
		component: AdvanceList,
		meta: {
			title: '预付款订单列表'
		}
	},
	//预付款订单列表详情
	{
		path: '/advanceListDetail',
		name: 'advanceListDetail',
		component: AdvanceListDetail,
		meta: {
			title: '预付款订单列表详情'
		}
	},
]

const router = new VueRouter({
	mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
	base: __dirname,
	routes: routes
})

router.beforeEach((to, from, next) => {
			store.commit(types.PUSH_HISTORY_STATE, to.name);
			if(store.state.user.token && store.state.user.loginStatus == '') { //不需要登录的页面，如果已登录，获取用户信息
				store.dispatch(types.GET_LOGIN_STATUS).then(status => {
					if(status) {
						initUserInfo()
					}
				})
				next()
			} else {
				next()
			}

			function redirectLogin() {
				next({
					path: '/login',
					query: {
						redirect: to.fullPath
					}
				})
			}

			function initUserInfo(callback) {
				if(!store.state.user.hasUserInfo) {
					store.dispatch(types.GET_USER_INFO).then(() => {
						if(typeof callback == "function")
							callback()
					})
				} else {
					if(typeof callback == "function") {
						callback()
					}
				}
			}

			// function isWx(){
			// 	let ua = window.navigator.userAgent.toLowerCase();
			// 	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			// 		return true;
            //     } else {
			// 		return false;
			// 	}
			// }

			function urlencode (str) {  
				str = (str + '').toString();   
				return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
				replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
			} 

			router.beforeEach((to, from, next) => {
				/* 路由发生变化修改页面title */
				if(to.meta.title) {
					document.title = to.meta.title + '-噼里啪啦预定'
				}
				// if(!wx_code){
				// 	console.log("当前页面：" + window.location.href);
				// 	let path = to.name;
				// 	//计算下一个要跳转的界面
				// 	let nowPath = window.location.href;
				// 	var exp = new RegExp(from.name);
				// 	let newPath = nowPath.replace(exp,path);
				// 	console.log("xxx:" + newPath);
				// 	if(isWx()){
				// 		//获取当前的这个页面
				// 		//先判断是不是微信的浏览器
				// 		api.config.getConfig({systemcode:'test'},response => {
				// 			console.log("执行结果:" + JSON.stringify(response));
				// 			var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+response.data.appId+"&redirect_uri="+urlencode(newPath)+"&response_type=code&scope=snsapi_userinfo";
				// 			window.location.href=wxUrl;
				// 		},error=>{
				// 			console.log(JSON.stringify(error))
				// 		 });
				// 	}else{
				// 		next();
				// 	}
				// }else{
				// 	next();
				// }
				next();
			})

			let allowBack = true //    给个默认值true
			if(to.meta.allowBack !== undefined) {
				allowBack = to.meta.allowBack
			}
			if(!allowBack) {
				history.pushState(null, null, location.href)
			}
			sessionStorage.setItem('allowBack',allowBack)
			})

			export default router