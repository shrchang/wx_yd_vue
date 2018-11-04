import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import user from './modules/user'
import router from './modules/router'
import game from './modules/game'
import dict from './modules/dict'
import mall from './modules/mall'
import config from '../../config/product.json'

Vue.use(Vuex)

let coinTypeName=config.gameConfig.coinTypeName?config.gameConfig.coinTypeName:{}

export  default new Vuex.Store({
    state:{
        appVer:'',
        pageData:{},
        timeOffset:'',
        timeOffsetSecond:'',
        systemData:{coinTypeName}
    },
    actions,
    mutations,
    getters,
    modules:{
        user,
        router,
        game,
        dict,
        mall
    }
})
