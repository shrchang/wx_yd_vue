import api from '../../api/require'
import * as types from '../types'
import config from '../../../config/product.json'


let account={}
let coinTypeName=config.gameConfig.coinTypeName
if(coinTypeName){
    Object.keys(coinTypeName).forEach(n=>{
        account[n]=0
    })
}

export default {
    state:{
        token:'',
        tokenUpdateTime:'',
        tokenRequireTime:'',
        loginStatus:'',
        hasUserInfo:false,
        account:account, //0：人民币 1：金币 2：宝石 3：铜币
        info:{}
    },
    mutations:{
        [types.UPDATE_USER_INFO](state,payload){
            state.hasUserInfo=true
            state.info=payload
        },
        [types.UPDATE_ACCOUNT](state,payload){
            var oAccount={}
            for(var i=0;payload.length>i;i++){
                oAccount[payload[i].currency]=payload[i].amount
            }
            state.account=oAccount
        },
        [types.UPDATE_LOGIN_STATUS](state,status){
            state.loginStatus=status
        },
        [types.UPDATE_TOKEN](state,payload){
            if(payload) {
                if(localStorage.getItem('token')!=payload.token)
                    state.loginStatus=true
                localStorage.setItem('token', payload.token)
                localStorage.setItem('tokenUpdateTime', payload.updateTime)
                state.token = payload.token
                state.tokenUpdateTime=payload.updateTime
            }else{
                localStorage.removeItem('token')
                localStorage.removeItem('tokenUpdateTime')
                state.token=''
                state.loginStatus=false
            }
        },
        [types.UPDATE_TOKEN_REQUIRE_TIME](state,payload){
            state.tokenRequireTime=payload
        }
    },
    actions:{
        [types.LOGIN] ({commit},loginInfo){

        },
        [types.LOGOUT] ({commit}){
            return new Promise(resolve=>{
                commit(types.UPDATE_TOKEN,'')
                resolve()
            })
        },
        [types.GET_USER_INFO]({commit}){
            return new Promise((resolve,reject)=>{
                api.user.getUserInfo(data=>{
//                  console.log("登录信息：" + JSON.stringify(data.res_content));
                    commit(types.UPDATE_USER_INFO,data.res_content)
                    resolve(data.res_content)
                },err=>{reject(err)})
            })
        },
        
        [types.GET_NEW_TOKEN](context){
            if(context.state.tokenRequireTime&&(+new Date()-context.state.tokenRequireTime<5*100)) return //5s内 不再更新token
            context.commit(types.UPDATE_TOKEN_REQUIRE_TIME,+new Date())
            api.user.getNewToken(data=>{context.commit(types.UPDATE_TOKEN,{token:data.res_content.token,updateTime:+new Date()})})
        },
        [types.GET_LOGIN_STATUS]({commit}){
            return new Promise((resolve,reject)=>{
                api.user.getLoginStatus(data=>{
                    commit(types.UPDATE_LOGIN_STATUS,data.res_content.status)
                    resolve(data.res_content.status);
                },err=>{reject(err)})
            })
        },
        [types.GET_ACCOUNT]({commit}){
            api.user.getAccount(data=>{commit(types.UPDATE_ACCOUNT,data.res_content)},err=>{
                //if(err.statusCode==0) return
                //vue.prototype.$dialog.alert("获取资金信息失败")
            })
        }
    }
}
