import api from '../../api/require'
import * as types from '../types'


export default {
    state:{
        cateLog: {},
        shopCart: {},
        shopCartNum: 0,
        newPrice:{}
    },
    mutations:{
        [types.UPDATE_PRODUCT_CATLOG](state,payload){
            state.cateLog=payload
        },
        [types.UPDATE_SHOP_CART](state,payload){
        	state.shopCart = payload;
        	let allNum = 0;
        	for(let i = 0;i<payload.length;i++) {
        		allNum+=Number(payload[i].buyNum)
        	}
            state.shopCartNum=allNum
        }
    },
    actions:{
        [types.GET_PRODUCT_CATLOG]({commit}){
        	return new Promise((resolve,reject)=>{
	        	const data = {
		    		pageSize: 100,
		    		index: 0
	    		}
	            // api.mall.doQueryProductCatalog(data,res=>{commit(types.UPDATE_PRODUCT_CATLOG,res.res_content)
	           	//  	resolve(res.res_content)
	            // },err=>{reject(err)})
            })
        },
        [types.GET_SHOP_CART]({commit}){
        	return new Promise((resolve,reject)=>{
	            // api.mall.doQueryShoppingCart(res=>{commit(types.UPDATE_SHOP_CART,res.res_content)
	           	//  	resolve(res.res_content)
	            // },err=>{reject(err)})
            })
        }
    }
}
