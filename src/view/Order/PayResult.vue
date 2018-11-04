<template>
	<div class="payResult-wrap page-wrap">

		<app-header title="交易详情" v-on:clickLeft="returnBack"></app-header>
		<div class="payResult-title">
			<i class="iconfont icon-dui"></i>支付成功
		</div>

		<div class="payResult-content" v-if="orderDetail">
			<p class="price">
				¥ {{orderDetail.orderAmount}}
			</p>
			<div class="content">
				<span>商品</span> <span>{{orderDetail.productName}}</span>
			</div>
			<div class="content">
				<span>交易时间</span> <span>{{orderDetail.orderTime.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
			</div>
			<div class="content">
				<span>支付方式</span> <span>在线支付</span>
			</div>
			<div class="content">
				<span>订单编号</span> <span>{{orderDetail.orderId}}</span>
			</div>
		</div>

		<div class="payResult-content" v-if="orderAdDetail">
			<p class="price">
				¥ {{orderAdDetail.frontMoney}}
			</p>
			<div class="content">
				<span>商品</span> <span>{{orderAdDetail.productName}}</span>
			</div>
			<div class="content">
				<span>交易时间</span> <span>{{orderAdDetail.strCreateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
			</div>
			<div class="content">
				<span>支付方式</span> <span>在线支付</span>
			</div>
			<div class="content">
				<span>订单编号</span> <span>{{orderAdDetail.orderId}}</span>
			</div>
		</div>

		<div class="pay-btn">
			<span class="order" @click="toOrderDetail">查看订单</span>
			<span class="buy" @click="$router.push('/home')">返回继续购物</span>
		</div>

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';

	export default {
		data() {
			return {
				orderDetail: null,
				orderAdDetail: null
			}
		},
		components: {
			AppHeader
		},
		watch: {

		},
		mounted() {

		},
		activated() {
			if(this.$route.query.orderId) {
				this.doQueryMallOrder()
			}
			if(this.$route.query.orderIdAd) {
				console.log(this.$route.query.orderIdAd)
				this.doOrderDetail()
			}
		},
		deactivated() {
			this.orderDetail = null;
			this.orderAdDetail = null;
		},
		computed: {

		},
		methods: {
			returnBack() {
				this.$router.push('/mine')
			},
			//全款订单详情
			doQueryMallOrder() {
				api.mall.doQueryMallOrder({
					orderId: this.$route.query.orderId
				}, res => {
					this.orderDetail = res.res_content[0];
				}, error => {

				})
			},
			//预付款单详情
			doOrderDetail() {
				api.mall.doOrderDetail({
					orderId: this.$route.query.orderIdAd
				}, res => {
					this.orderAdDetail = res.res_content[0];
				}, error => {

				})
			},
			//查看订单
			toOrderDetail() {
				if(this.$route.query.orderIdAd) {
					this.$router.push({
						name: 'advanceListDetail',
						query: {
							orderId: this.$route.query.orderIdAd
						}
					})
				}
				if(this.$route.query.orderId) {
					alert('暂未开通')
					return
//					this.$router.push({
//						name: 'myOrderDetail',
//						query: {
//							orderId: this.$route.query.orderId
//						}
//					})
				}

			}
		}
	};
</script>

<style lang="scss">
	@import "./Order";
</style>