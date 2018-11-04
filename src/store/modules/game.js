import api from '../../api/require'
import * as types from '../types'


export default {
    state:{
        product:[]
    },
    mutations:{
        [types.UPDATE_GAME_PRODUCT](state,payload){
            state.product=payload
        },
        [types.UPDATE_GAME_PRODUCT_STATUS](state,payload){
            state.product.forEach(n=>{
                if(n.productId==payload.payload){
                    n.marketStatus=payload.marketStatus
                    return
                }
            })
        },
    },
    actions:{
        [types.GET_GAME_PRODUCT]({commit}){
            api.game.getGameProduct(data=>{
                commit(types.UPDATE_GAME_PRODUCT,data.res_content)
            },err=>{
                alert(err.msg)
            })
        }
    }
}
