<template>
	<div class="advanceListDetail-wrap page-wrap">

		<app-header title="预订下单页-详情" v-on:clickLeft="returnBack"></app-header>

		<div v-if="$route.query.orderId">
			<div class="advanceListDetail-title">
				<span class="price">{{holdOrder.status=='0'?'持仓':holdOrder.status=='1'?'已结算':holdOrder.status=='2'?'待结算':holdOrder.status=='3'?'结算中':''}}</span>
				<span class="dec">订单号：{{holdOrder.orderId}}</span>
			</div>

			<div class="advanceListDetail-content">
				<div>
					<img :src="'/frontWeb/frontWebImages/' + holdOrder.productIcon" @click="toShop(index)">
				</div>
				<div>
					<p class="name">{{holdOrder.productName}}</p>
					<p class="price"><span>规格：{{holdOrder.productWeight}}g</span> </p>
					<p class="price">数量：{{holdOrder.buyNum}}</p>
				</div>
			</div>

			<div class="advanceListDetail-list">
				<div class="block bg">
					<span class="dec">支付方式</span> <span>余额支付</span>
				</div>
				<div class="block bg">
					<span class="dec">预订单类型</span> <span class="price">{{holdOrder.status=='0'?'持仓':holdOrder.status=='1'?'已结算':holdOrder.status=='2'?'待结算':holdOrder.status=='3'?'结算中':''}}</span>
				</div>
				<div class="block">
					<span class="dec">最新价</span>
					<span class="price" v-if="$store.state.mall.newPrice[holdOrder.quoteProductCode]">¥ {{$store.state.mall.newPrice[holdOrder.quoteProductCode]}}</span>
					<span v-else>----</span>
				</div>
				<div class="block">
					<span class="dec">货值增减</span>
					<span v-if="$store.state.mall.newPrice[holdOrder.quoteProductCode]">
					<span class="price" v-if="holdOrder.director==1">{{($store.state.mall.newPrice[holdOrder.quoteProductCode]-holdOrder.holdPrice)*holdOrder.buyNum | numFilter(2)}}</span>
					<span class="price" v-if="holdOrder.director==0">{{($store.state.mall.newPrice[holdOrder.quoteProductCode]-holdOrder.holdPrice)*holdOrder.buyNum*-1 | numFilter(2)}}</span>
					</span>
					<span v-else class="price">----</span>

				</div>
				<div class="block">
					<span class="dec">商品总额</span> <span class="price">¥ {{holdOrder.amount}}</span>
				</div>
				<div class="block">
					<span class="dec">订单金额</span> <span class="price">¥ {{holdOrder.depositAmount}}</span>
				</div>
				<div class="block">
					<span class="dec">服务费</span> <span class="price">¥ {{holdOrder.frontMoney-holdOrder.depositAmount | numFilter(2)}}</span>
				</div>
				<div class="block">
					<span class="dec">K豆</span> <span class="price">{{holdOrder.bean}}</span>
				</div>
				<div class="block">
					<span class="dec">订购价</span> <span class="price">¥ {{holdOrder.frontMoney}}</span>
				</div>
				<div class="block bg">
					<span class="dec">建仓时间</span> <span class="price">{{holdOrder.strCreateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
				</div>
			</div>

			<div class="advanceListDetail-bottom">
				<span @click="$router.push('/home')">首页</span>
				<span @click="doBBIClosePosition()">退订</span>
				<span v-if="holdOrder.director==1" @click="doPickUpPriceDifference()">提货</span>
				<span v-if="holdOrder.director==0" @click="doBuyBackChangeDeliverTheGoods()">交货</span>
			</div>

		</div>
		
		
		
		<div v-if="$route.query.orderIdHis">
			<div class="advanceListDetail-title">
				<span class="price">{{holdOrderHis.status=='0'?'持仓':holdOrderHis.status=='1'?'平仓':''}}</span>
				<span class="dec">订单号：{{holdOrderHis.hisId}}</span>
			</div>

			<div class="advanceListDetail-content">
				<div>
					<img :src="'/frontWeb/frontWebImages/' + holdOrderHis.productIcon" @click="toShop(index)">
				</div>
				<div>
					<p class="name">{{holdOrderHis.productName}}</p>
					<p class="price"><span>规格：{{holdOrderHis.productWeight}}g</span> </p>
					<p class="price">数量：{{holdOrderHis.buyNum}}</p>
				</div>
			</div>

			<div class="advanceListDetail-list">
				<div class="block bg">
					<span class="dec">支付方式</span> <span>余额支付</span>
				</div>
				<div class="block bg">
					<span class="dec">预订单类型</span> <span class="price">{{holdOrderHis.status=='0'?'持仓':holdOrderHis.status=='1'?'平仓':''}}</span>
				</div>
				<!--<div class="block">
					<span class="dec">最新价</span>
					<span class="price" v-if="$store.state.mall.newPrice[holdOrder.quoteProductCode]">¥ {{$store.state.mall.newPrice[holdOrder.quoteProductCode]}}</span>
					<span v-else>----</span>
				</div>-->
				<div class="block">
					<span class="dec">平仓盈亏</span>
					<span class="price">{{holdOrderHis.closeProfit}}</span>	
				</div>
				<div class="block">
					<span class="dec">商品总额</span> <span class="price">¥ {{holdOrderHis.amount}}</span>
				</div>
				<div class="block">
					<span class="dec">订单金额</span> <span class="price">¥ {{holdOrderHis.depositAmount}}</span>
				</div>
				<div class="block">
					<span class="dec">服务费</span> <span class="price">¥ {{holdOrderHis.frontMoney-holdOrderHis.depositAmount | numFilter(2)}}</span>
				</div>
				<div class="block">
					<span class="dec">K豆</span> <span class="price">{{holdOrderHis.bean}}</span>
				</div>
				<div class="block">
					<span class="dec">订购价</span> <span class="price">¥ {{holdOrderHis.frontMoney}}</span>
				</div>
				<div class="block bg">
					<span class="dec">平仓时间</span> <span class="price">{{holdOrderHis.closeTime.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
				</div>
			</div>


		</div>
			
		

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
	import { Toast, Dialog } from 'vant';
	import RWebsocket from '../../plugin/websocket/reconnecting-websocket';

	export default {
		data() {
			return {
				holdOrder: [], //预付款单
				holdOrderHis: [], //平仓单
				money: 0, //人民币
				gameWS: null, //websocket
				gameProduct: [],
				allFrontMoney: 0, //总预付款
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
				this.doOrderDetail();
			}
			if(this.$route.query.orderIdHis) {
				this.doOrderHisDetail();
			}

			//			this.doOrderHoldHis();
		},
		deactivated() {
			this.gameWS.close();
			this.gameWS = null;
			this.holdOrder = [];
			this.allFrontMoney = 0;
			this.$store.state.mall.newPrice = {}
			//			this.profit = 0;
		},
		computed: {
			//总货值增减
			//			profit() {
			//				let all = 0;
			//				for(let i = 0; i < this.holdOrder.length; i++) {
			//					all += (this.$store.state.mall.newPrice[this.holdOrder[i].quoteProductCode] - this.holdOrder[i].holdPrice) * this.holdOrder[i].buyNum * (this.holdOrder[i].director == 1 ? 1 : -1)
			//
			//				}
			//				return this.numFilter(all)
			//			}
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//预付款单查询
			doOrderDetail() {
				api.mall.doOrderDetail({
					orderId: this.$route.query.orderId
				}, res => {
					this.holdOrder = res.res_content[0];
//					this.initWebSocket()
					for(let i = 0; i < this.holdOrder.length; i++) {
						this.allFrontMoney += Number(this.holdOrder[i].frontMoney);
					}

				}, error => {

				})
			},
			//平仓查询
			doOrderHisDetail() {
				api.mall.doOrderHisDetail({
					hisId: this.$route.query.orderIdHis
				}, res => {
					this.holdOrderHis = res.res_content[0]
					console.log(this.holdOrderHis)
				}, error => {

				})
			},
			initWebSocket() {
				const token = this.$store.state.user.token || '';
				const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
				this.gameWS = new RWebsocket(`ws://${location.host}/frontWeb/websocket/${this.$store.state.user.token}`)
				this.gameWS.debug = process.env.NODE_ENV === 'production' ? false : true;
				this.gameWS.onopen = () => {
					this.websocketCommonSend();
				};
				this.gameWS.onmessage = message => {
					let res = JSON.parse(message.data);
					if(
						res.retCode == '02000000' ||
						res.retCode == '2000000' ||
						res.resContent == '00000000'
					) {
						if(+res.type === 1) {
							//行情信息
							this.quotesInfoHandler(res.resContent);
						}
					}
				};
			},
			websocketCommonSend() {
				setTimeout(() => {
					this.gameWS.send("{type: '1',sub:'mk.all'}");
				}, 500);
			},
			quotesInfoHandler(data) {
				let nq = data[data.length - 1];
				if(data) {
					//最新行情处理(右上角显示,持仓单)
					if(nq.dt == 0) {
//						this.$set(this.$store.state.mall.newPrice, nq.gc, nq.bnp);
					}
				}
			},
			//保留2位小数不四舍五入
			 numFilter(value) {
				let transformVal = Number(value).toFixed(3)
				let realVal = transformVal.substring(0, transformVal.length - 1)
				return Number(realVal) 
			},
			//退订
			doBBIClosePosition() {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否退订'
				}).then(() => {
					api.mall.doBBIClosePosition({
						order_id: this.holdOrder.mallPreOrderId,
						close_type: 1,
						client_price: this.$store.state.mall.newPrice[this.holdOrder.quoteProductCode]
					}, res => {
						Toast(res.res_msg);
						this.$router.push('/advanceList')
//						this.doOrderHold();
//						this.doOrderHoldHis();
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});
			},
			//预付款回购转交货
			doBuyBackChangeDeliverTheGoods() {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否交货'
				}).then(() => {
					api.mall.doBuyBackChangeDeliverTheGoods({
						mall_pre_order_id: this.holdOrder.mallPreOrderId
					}, res => {
						Toast(res.res_msg);
						this.$router.push('/advanceList')
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});

			},
			//预付款预定转提货
			doPickUpPriceDifference() {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否提货'
				}).then(() => {
					api.mall.doPickUpPriceDifference({
						mall_pre_order_id: this.holdOrder.mallPreOrderId
					}, res => {
						Toast(res.res_msg);
						this.$router.push({name:'orderPay',query:{orderId:res.res_content.orderId,compensation:1}})
//						this.doOrderHold();
//						this.doOrderHoldHis();
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});

			},
		}
	};
</script>

<style lang="scss">
	.advanceListDetail-wrap {
		.advanceListDetail-title {
			padding: 0.23rem 0.3rem;
			display: flex;
			border-bottom: 1px solid #F4F4F4;
			span {
				flex: 1;
			}
			span:nth-of-type(2) {
				flex: 2;
				text-align: right;
			}
		}
		.advanceListDetail-content {
			display: flex;
			padding: 0.3rem 0.1rem 0.3rem 0.5rem;
			border-bottom: 0.18rem solid #F4F4F4;
			img {
				width: 1.5rem;
				margin-right: 0.3rem;
			}
			p {
				margin-bottom: 0.1rem;
			}
		}
		.advanceListDetail-list {
			.block {
				display: flex;
				padding: 0.25rem 0.3rem;
				span {
					flex: 1;
				}
				span:nth-of-type(2) {
					text-align: right;
				}
			}
			.bg {
				border-bottom: 0.18rem solid #F4F4F4;
			}
		}
		.advanceListDetail-bottom {
			margin: 0.5rem 0;
			display: flex;
			padding: 0 0.5rem;
			span {
				flex: 1;
				text-align: center;
				margin: 0 0.1rem;
				padding: 0.2rem;
				background: #F15350;
				color: #fff;
				border-radius: 2px;
			}
		}
		.price {
			color: #D96968;
		}
		.dec {
			color: #9D9D9D;
		}
		.name {
			font-weight: 600;
		}
	}
</style>