import api from "../../api/require";
import Tabbar from '../../components/Tabbar.vue';
import * as moment from "moment"
import utils from '../../utils/utils';
export default {
	data() {
		return {
			bannerImage: [
				require('../../assets/images/home/banner-1.png'),
				require('../../assets/images/home/banner-2.png'),
				require('../../assets/images/home/banner-3.jpg'),
				require('../../assets/images/home/banner-4.jpg'),
				require('../../assets/images/home/banner-5.jpg')
			],
			searchShow: true,
			noticeImg:[require('../../assets/images/Home/notice.png')],
			scrollTop: 0,
			keyWord: null,
			merCode:'test'//商户code
		}
	},
	created(){
		//初始化的时候获取微信的配置 这里应该是最好的地方了
		// if(this.isWx()){
		// 	this.getConfig();
		// 	this.getWxUser();
		// }
	},
	components: {
		Tabbar
	},
	watch: {
	},
	mounted() {
		// this.getConfig();
		//this.getWxCode();
		if(this.isWx()){
			this.getConfig();
			this.getWxUser();
		}
	},
	activated() {
	},
	deactivated() {
		this.keyWord = null;
	},
	destroyed() {
	},
	methods: {
		getWxCode(){
			var code = utils.getUrlKey("code");
			if(code){
				//alert("微信code:" + code);
			}
		},
		getConfig(){
			var code = utils.getUrlKey("code");
			if(!code){
				let openid = localStorage.getItem("wx_openId");
				if(!openid){
					let newPath = window.location.href;
					//获取当前的这个页面
					//先判断是不是微信的浏览器
					api.config.getConfig({systemcode:this.merCode},response => {
						var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+response.data.appId+"&redirect_uri="+this.urlencode(newPath)+"&response_type=code&scope=snsapi_userinfo";
						window.location.href=wxUrl;
					},error=>{
						console.log(JSON.stringify(error));
					});
				}
			}
		},
		urlencode (str) {  
			str = (str + '').toString();   
			return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
			replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
		},
		isWx(){
			let ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		},
		getWxUser(){
			var code = utils.getUrlKey("code");
			if(code){
				//这里要获取到wx的用户信息
				var openId = localStorage.getItem("wx_openId");
				//alert("openId:" + openId);
				if(!openId){
					api.config.getWxUser({systemcode:this.merCode,"code":code},res=>{
						var openid = res.data.openid;
						localStorage.setItem("wx_openId",openid);
						localStorage.setItem("wx_user",JSON.stringify(res.data));
					},error=>{
						alert("获取失败：" + JSON.stringify(error));
					});
				}
			}
		}
	}
};