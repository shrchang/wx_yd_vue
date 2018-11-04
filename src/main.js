import Vue from 'vue'
import store from './store/store'
import * as types from './store/types'
import router from './router'
import App from './App.vue'

import './plugin/app'
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import { Lazyload } from 'vant';



Vue.use(Vant);
Vue.use(Lazyload);
Vue.config.devtools = true


// if ( 'addEventListener' in document ) {
//     document.addEventListener('DOMContentLoaded', function() {
//         FastClick.attach(document.body);
//     }, false);
// }

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.UPDATE_TOKEN, {token:window.localStorage.getItem('token'),updateTime:window.localStorage.getItem('tokenUpdateTime')})
}

//缩放布局计算
var docEl = document.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        if(clientWidth >= 750) {
            docEl.style.fontSize = '100px';
        } else {
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        }
    };
    recalc()
window.addEventListener(resizeEvt, recalc, false);

//Global Filter
Vue.filter('formatDate', (value, fmt) =>{
    fmt=fmt?fmt:'yyyy-MM-dd hh:mm'
    var date=new Date(value)
    if(isNaN(date.getMonth())) date=new Date(Number(value))
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
});

Vue.filter('parseInt', (value) =>{
    return parseInt(value)
});

Vue.filter('toFixed', (value,len) =>{
    let num=Number(value)
    if(isNaN(num)||typeof len =="undefined") return
    return num.toFixed(len)
});

Vue.filter('numFilter', (value,len) =>{
	let transformVal = Number(value).toFixed(len+1)
	let realVal = transformVal.substring(0, transformVal.length - 1)
	return Number(realVal)
});




new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
})