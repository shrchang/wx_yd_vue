<template>
	<div class="share-wrap">
        <van-swipe :autoplay="3000">
			<van-swipe-item v-for="(item, index) in bannerImage" :key="index">
				<img :src="item">
			</van-swipe-item>
		</van-swipe>
        <div class="share-content">
            <i class="iconfont icon-fenxiang3" @click="startShare();"></i>
        </div>
        <van-popup v-model="show" position="bottom">
            <div class="share-type-btn">
                <i class="iconfont icon-weixin" @click="shareWx();"></i>
				<i class="iconfont icon-pengyouquan" @click="sharePy();"></i>
            </div>
        </van-popup>
    </div>
</template>

<script>
import api from "../../api/require";
import Tabbar from '../../components/Tabbar.vue';
import * as moment from "moment"
import utils from '../../utils/utils';
import wx from 'weixin-js-sdk';

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
            merCode:'test',//商户code
			show:false,
			curShareId:null,//当前的分享路径id
			shareId:null,//需要分享的id
		}
	},
	created(){
	},
	components: {
		Tabbar
	},
	watch: {
	},
	mounted() {
		if(this.isWx()){
			this.getConfig();
			this.getWxUser();
		}
		// let openid = localStorage.getItem("wx_openId");
		// if(openid){
		// 	let requestId = utils.getUrlKey("requestId");
		// 	if(requestId){
		// 		api.share.addShareResponse(requestId,res=>{
		// 			console.log("记录成功！");
		// 		},error=>{
		// 			console.log("记录失败！");
		// 		});
		// 	}
		// 	//说明获取了
		// 	this.shareWx();
		// }
		//还有就是获取其他的连接
		
	},
	activated() {
	},
	deactivated() {
		this.keyWord = null;
	},
	destroyed() {
	},
	methods: {
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
				}else{
					this.sharePage();
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
		sharePage(){
			let requestId = utils.getUrlKey("requestId");
			if(requestId){
				api.share.addShareResponse(requestId,res=>{
					console.log("记录成功！");
				},error=>{
					console.log("记录失败！");
				});
			}
			//说明获取了
			this.shareWx();
		},
		getWxUser(){
			var code = utils.getUrlKey("code");
			//alert(code);
			if(code){
				//这里要获取到wx的用户信息
				//var openId = localStorage.getItem("wx_openId");
				var openId = localStorage.getItem("wx_openId");
				if(!openId){
					api.config.getWxUser({systemcode:this.merCode,"code":code},res=>{
						var openid = res.data.openid;
						localStorage.setItem("wx_openId",openid);
						localStorage.setItem("wx_user",JSON.stringify(res.data));
						this.sharePage();
					},error=>{
						alert("获取失败：" + JSON.stringify(error));
					});
				}else{
					this.sharePage();
				}
			}
		},
		//微信分享
		shareWx(){
			let url = window.location.href.split('#')[0];
			let title = "测试分享";
			let desc = "我们是一个大学生专业玩转噼里啪啦轰趴馆！";
			let imgUrl = this.bannerImage[0];
			let linkUrl = window.location.href;
			//这个里面不能带有
			let needShareId;
			var baseUrl = linkUrl.split("#")[0];
			var secondUrl = linkUrl.split("#")[1];
			if(baseUrl.indexOf("?")>-1){
				baseUrl = baseUrl.substring(0,baseUrl.indexOf("?"));
			}
			linkUrl = baseUrl;
			if(secondUrl){
				if(secondUrl.indexOf("?")>-1){
					secondUrl = secondUrl.substring(0,secondUrl.indexOf("?"));
				}
				linkUrl = linkUrl +"#" + secondUrl;
			}
			api.config.queryJssdkConfig({systemcode:this.merCode,url:url,name:"分享测试"},res=>{
				needShareId = res.data.shareId;
				var configData = res.data.config;
				configData.debug = false;
				configData.jsApiList = ['updateAppMessageShareData','updateTimelineShareData','onMenuShareTimeline','onMenuShareAppMessage'];
				wx.config(configData);
				wx.ready(function(){
					 wx.updateAppMessageShareData({
						title: title, // 分享标题
						desc: desc,
						link: linkUrl+"?requestId="+needShareId, // 分享链接
						imgUrl: 'http://www.plpl.group/m2/dist/assets/banner-2.png', // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:true,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						},
						cancel: function () {
							// 用户取消分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:false,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						}
					});
					 wx.onMenuShareTimeline({
						title: title, // 分享标题
						desc: desc,
						link: linkUrl+"?requestId="+needShareId, // 分享链接
						imgUrl: 'http://www.plpl.group/m2/dist/assets/banner-2.png', // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:true,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						},
						cancel: function () {
							// 用户取消分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:false,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						}
					});
					 wx.onMenuShareAppMessage({
						title: title, // 分享标题
						desc: desc,
						link: linkUrl+"?requestId="+needShareId, // 分享链接
						imgUrl: 'http://www.plpl.group/m2/dist/assets/banner-2.png', // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:true,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						},
						cancel: function () {
							// 用户取消分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:false,source:'微信好友'},res=>{
								//alert("分享微信好友成功！");
							},err=>{
								console.log("执行失败");
							});
						}
					});
 					wx.updateTimelineShareData ({
						title: title, // 分享标题
						desc: desc,
						link: linkUrl+"?requestId="+needShareId,
						imgUrl: 'http://www.plpl.group/m2/dist/assets/banner-2.png', // 分享图标
						success: function () {
							// 用户确认分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:true,source:'朋友圈'},res=>{
								//alert("分享朋友圈成功！");
							},err=>{
								console.log("执行失败");
							});
						},
						cancel: function () {
							// 用户取消分享后执行的回调函数
							api.share.modifyShareRequest({id:needShareId,sucess:false,source:'朋友圈'},res=>{
								//alert("分享朋友圈失败！");
							},err=>{
								console.log("执行失败");
							});
						}
					});

				});
			},error=>{
				alert("无法分享！");
			});
		},
	}
};

</script>


<style lang="scss">
	@import './Share';
</style>