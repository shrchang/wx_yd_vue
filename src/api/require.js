import Vue from 'vue'
import url from './resource'
import store from '../store/store'
import http from '../http'
import * as types from '../store/types'
import router from '../router'

import Dialog from '../plugin/dialog/dialog'


Dialog.config.target='#app'
Vue.use(Dialog)
let vue=new Vue()

let successCode=[
	'02000000',
	'00000000',
	'03000013',
	'03000000',
	'15999999',
	'200'
]

let loginFailCodes=[
	'01000011',//'无token 无权限'
    // '01000008',//权限验证异常
	'02000006',//Token(令牌)过期
	'02000007',//解析异常
	// '02000008',//交易服务Token刷新异常
	'02000014',//用户未登陆
	'02000019',//客户/用户信息不全，请联系客服
	'02000077'//下线
]

var ajax = function(options) {
	//options={type, url, data, success,error}
	// store.commit('SHOW_LOADING');

	var {type,url,data,success,error,sendToken}=Object.assign({
		data:{},
		success:function(){},
		error:function(){},
		sendToken:false
	},options)

	if(sendToken)
		data.token=store.state.user.token
	let datas=type === 'get'?{params: data}:data
	//alert("参数：" + JSON.stringify(datas));
	return new Promise((resolve,reject)=>{
		 http[type](url, datas).then((res) => {
			 let code=res.data.code;
			 //判断是否登录
		// 	 if(typeof loginFailCodes.find(el=>{return el==code})!= "undefined") {
		// 		 if(router.currentRoute.name=='login') return

		// 		 store.commit(types.UPDATE_TOKEN,{token:'',updateTime:''});
		// 		 router.push({
		// 			 path: '/login',
		// 			 query: {redirect: router.currentRoute.fullPath}
		// 		 })

        //          if(code!="02000014"&&code!="02000006"){
        //              return;
        //          }	 
		// }

			if (typeof successCode.find(el=>{return el==res.data.code}) != "undefined") {
				if(typeof success =="function") success(res.data)
				if(typeof resolve =="function") resolve(res.data)
			} else {
				//调用错误回调
				let errorObj={msg:res.data.res_msg,statusCode:200,data:res.data}
				if(typeof error =="function") error(errorObj)
				else if(typeof reject =="function") reject(errorObj)
			}
             if(code=="00000000"){
                 store.dispatch(types.GET_NEW_TOKEN)
             }
		}).catch((err) => {
			debugger;
			console.log("url:" + url);
		 	let msg,statusCode
		 	if(typeof err.statusCode =="undefined"){
                msg=err
			}else{
                msg=err.msg
                statusCode=err.statusCode
			}
			// console.log(err);
			// 调用全局配置错误回调
			// store.commit('HIDE_LOADING');

			//statusCode
			//-1 请求发送失败
			//0  请求没有内容返回（一般超时）
			//200 请求成功
			//其他 http错误状态吗
			 if(typeof error =="function") error({msg,statusCode})
			 else if(typeof reject =="function") reject({msg,statusCode})
		});
	})
};


export default {
	config:{
        getConfig(data,success,error){
        	return ajax.call(this,{type:'post',url:url.queryWxConfig,data,sendToken:false,success,error});
	   },
	   getWxUser(data,success,error){
			return ajax.call(this,{type:'post',url:url.getWxUser,data,sendToken:false,success,error});
	   },
	},
	mall:{
		//查询商铺列表
		queryShops(success,error){
			var data = {systemCode:"test"};
			return ajax.call(this,{type:'post',url:url.queryShops,data,sendToken:false,success,error});
		},
		//根据商铺id查询下面的场地
		queryRoomByShopId(shopId,success,error){
			var data = {"shopId":shopId};
			return ajax.call(this,{type:'post',url:url.queryRoomsByShop,data,sendToken:false,success,error});
		},
		//查询这个场地的订场信息
		queryRoomById(roomId,success,error){
			var data = {"id":roomId};
			return ajax.call(this,{type:'post',url:url.queryRoomById,data,sendToken:false,success,error});
		}
	}
}
