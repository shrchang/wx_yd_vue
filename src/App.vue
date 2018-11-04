<template>
  <div id="app" class="app">
    <transition name="router-fade" mode="out-in">
    	<router-view class="view" v-if="$route.meta.noKeepAlive"></router-view>
      <keep-alive v-else>
        <router-view class="view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import * as types from './store/types';
  import api from './api/require';
export default {
    data() {
      return {
      	gameWS: null, //websocket
				gameProduct: [],
				newQuotes: {}, //最新价
      }
    },
    mounted(){
    	
    },
    methods: {
			
    }
}
</script>

<style lang="scss">
  	@import 'assets/style/app.scss';
    @import './assets/iconfont/iconfont.css';
</style>