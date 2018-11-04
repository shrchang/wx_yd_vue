import * as types from '../types'

export default {
    state:{
        list:[]
    },
    mutations:{
        [types.SET_SYSNOTICE](state,list){
            state.list=list
        },
        [types.UPDATE_READ_SYSNOTICE](state,id){
            state.list.forEach(item=>{
                if(item.noticeSerialNo==id){
                    item.readFlag=1
                }
            })
        }
    },
    actions:{

    }
}
