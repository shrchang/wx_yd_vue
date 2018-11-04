<template>
	<div class="self-wrap page-wrap">
		<div class="self-top">
			<div class="headImg">
  				<img v-if="imageUrl" :src="imageUrl" class="avatar">
			</div>
            <div class="header-name">
                <span>{{userName}}</span>
            </div>
		
			<div class="set">
				<p><i class="iconfont icon-shezhi"></i></p>
			</div>

            <div class="hy">
                <div>
                    <i class="iconfont icon-huiyuan"></i><span class="hy-title">会员特权</span>
                    <van-button type="danger">成为会员</van-button>
                </div>
                <span class="hy-desc">消费返现，各种特权享不停</span>
            </div>
		</div>
		
		<div class="self-wallet">
			<div>
				<p><img src="../../assets/images/mine/wallet.png"> 余额：<span class="price">¥ {{money}}</span></p>
			</div>
			<div>
				<p><img src="../../assets/images/mine/bean.png"> 轰趴豆：<span class="price">{{bean}}</span></p>
			</div>
		</div>

        <div class="self-opt">
            <div class="opt-btn">
                <i class="iconfont icon-wodedingdan"></i>
                <span class="opt-title">我的订单</span>
                <div class="fr">
                    <span>20条</span>
                    <i class="iconfont icon-qianjinxiayige"></i>
                </div>
            </div>
            <div class="opt-btn">
                <i class="iconfont icon-wodeyouhuijuan"></i>
                <span class="opt-title">我的优惠卷</span>
                <div class="fr">
                    <span>1000元</span>
                    <i class="iconfont icon-qianjinxiayige"></i>
                </div>
            </div>
            <div class="opt-btn">
                <i class="iconfont icon-wodeshoucang"></i>
                <span class="opt-title">我的收藏</span>
                <div class="fr">
                    <span>20条</span>
                    <i class="iconfont icon-qianjinxiayige"></i>
                </div>
            </div>
            <div class="opt-btn">
                <i class="iconfont icon-wodepingjia"></i>
                <span class="opt-title">我的评价</span>
                <div class="fr">
                    <span>20条</span>
                    <i class="iconfont icon-qianjinxiayige"></i>
                </div>
            </div>
            <div class="opt-btn">
                <i class="iconfont icon-bangzhuzhongxin"></i>
                <span class="opt-title">帮助中心</span>
                <div class="fr">
                    <i class="iconfont icon-qianjinxiayige"></i>
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
	
	export default {
		components: {
			Tabbar
		},
		data() {
			return {
                userName:'刘畅',
                openId:'aaaa',
                imageUrl:require('../../assets/images/shop/shop.jpg'),
                money:500,
                bean:1000,
			}
		},

		computed: {
			
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
	@import './Self';
</style>