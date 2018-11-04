import api from '../../api/require'
import * as types from '../types'


export default {
    state:{
        bank:[]
    },
    mutations:{
        [types.UPDATE_BANK](state,payload){
            state.bank=payload
        },
    },
    actions:{
        [types.GET_BANK]({commit}){
            api.common.queryDictList({'dictCode':'bank_type'},data=>{
                commit(types.UPDATE_BANK,data.res_content)
            },err=>{
                alert(err.msg)
            })
        }
    }
}
