<template>
	<div class="mine-wrap page-wrap">

		<div class="mine-top">
			<div class="headImg">
				<van-uploader multiple id="headImgInpt" v-show="false">
  					<van-icon name="photograph" />
				</van-uploader>
  				<img v-if="imageUrl" :src="imageUrl" class="avatar">
			</div>
		
			
			<div class="headName">
				<p>{{userName}}</p>
				<p><i class="iconfont icon-dengji"></i> {{openId}}</p>
			</div>
			<div class="set">
				<p><i class="iconfont icon-shezhi"></i> 设置</p>
			</div>
		</div>
		
		<div class="mine-bg"></div>
		
		<div class="mine-wallet">
			<div>
				<p><img src="../../assets/images/mine/wallet.png"> 余额：<span class="price">¥ {{money}}</span></p>
				<p>(可用余额：{{money}})</p>
			</div>
			<div>
				<p><img src="../../assets/images/mine/bean.png"> 趴点：<span class="price">{{bean}}</span></p>
				<p>(0趴点即将过期)</p>
			</div>
		</div>
		
		<div class="mine-bg"></div>
		
		<div class="mine-order">
			<p class="order-title">
				<span>我的订单</span>
				<span>全部订单</span>
			</p>
			<div class="order-content">
				<div class="block">
					<img src="../../assets/images/mine/order-2.png">
					<p>待付款</p>
				</div>
				<div class="block">
					<img src="../../assets/images/mine/order-5.png">
					<p>已完成</p>
				</div>
				<div class="block">
					<img src="../../assets/images/mine/order-4.png">
					<p>已取消</p>
				</div>
				<div class="block">
					<img src="../../assets/images/mine/coupon-2.png" style="height: 0.4rem;">
					<p style="margin-top: -0.07rem;">优惠券</p>
				</div>
				<div class="block">
					<img src="../../assets/images/mine/coupon-3.png">
					<p>领券</p>
				</div>
			</div>
		</div>
		
		<div class="mine-bg"></div>
		
		<div class="mine-tool">
			<p class="tool-title">
				我的工具
			</p>
			<div class="tool-content">
				<div class="block">
					<i class="iconfont icon-pinglun"></i>
					<p>我的评论</p>
				</div>
				<div class="block">
					<i class="iconfont icon-bangzhuzhongxin"></i>
					<p>帮助中心</p>
				</div>
				<div class="block">
					<i class="iconfont icon-yijianfankui"></i>
					<p>意见反馈</p>
				</div>
				<div class="block">
					<i class="iconfont icon-guanyuwomen"></i>
					<p>关于我们</p>
				</div>
			</div>
		</div>
		<tabbar></tabbar>

	</div>
</template>

<script>
	import api from "../../api/require";
	import * as types from "../../store/types";
	import Tabbar from '../../components/Tabbar.vue';
	import axios from 'axios';
	
	export default {
		components: {
			Tabbar
		},
		data() {
			return {
				customLevelName: '普通会员',
				money:0,//人民币
				bean:0,//金珠
				imageUrl: '',
				userName:'李强',
				openId:'123456'
			}
		},

		computed: {
			userInfo() {
				return this.$store.state.user.info;
			},
			cusImage() {
				return this.$store.state.user.info.cusImage
			}
		},
		watch: {

		},
		mounted() {
			this.initUserInfo();
		},
		activated() {
		},
		deactivated() {

		},

		methods: {
			initUserInfo(){
				var user = localStorage.getItem("wx_user");
				var wx_user = JSON.parse(user);
				this.userName = wx_user.nickname;
				this.openId = wx_user.openid;
				this.imageUrl = wx_user.headimgurl;
			}
		}
	};
</script>

<style lang="scss">
	@import './Mine';
</style>