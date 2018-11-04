<template>
	<div class="advanceList-wrap page-wrap">

		<app-header title="预订下单页" v-on:clickLeft="returnBack"></app-header>

		<div class="advanceList-title">
			<span v-for="(item,index) in adorderList" @click="adOrderIndex = index" :class="{'active':adOrderIndex == index}">{{item}}</span>
		</div>

		<div class="advanceList-wallet">
			<div class="block">
				<p>可用余额</p>
				<p class="price">{{money}}</p>
			</div>
			<div class="block">
				<p>总预付款</p>
				<p class="price">{{allFrontMoney?allFrontMoney:'0'}}</p>
			</div>
			<div class="block">
				<p>货值增减</p>
				<p class="price">{{profit?profit:'0'}}</p>
			</div>
		</div>

		<div class="advanceList-content" v-if="adOrderIndex==0">
			<div class="content-block" v-for="(item,index) in holdOrder">
				<div class="title">
					<span class="price">{{item.status=='0'?'持仓':item.status=='1'?'已结算':item.status=='2'?'待结算':item.status=='3'?'结算中':''}}</span>
					<router-link tag="span" :to="{name:'advanceListDetail',query:{orderId:item.orderId}}">订单号：{{item.orderId}}</router-link>
				</div>
				<div class="content">
					<div>
						<img :src="'/frontWeb/frontWebImages/' + item.productIcon" @click="toShop(index)">
					</div>
					<div>
						<p class="name">{{item.productName}}</p>
						<p class="price"><span>规格：{{item.productWeight}}g</span> <span class="u-ml-30">数量：{{item.buyNum}}</span></p>
						<p>建仓价：¥ {{item.holdPrice}} /
							<span class="price" v-if="$store.state.mall.newPrice[item.quoteProductCode]">最新价：¥ {{$store.state.mall.newPrice[item.quoteProductCode]}}</span>
							<span v-else>----</span>
						</p>
						<p v-if="item.director==1">货值增减：{{($store.state.mall.newPrice[item.quoteProductCode]-item.holdPrice)*item.buyNum | numFilter(2)}}</p>
						<p v-if="item.director==0">货值增减：{{($store.state.mall.newPrice[item.quoteProductCode]-item.holdPrice)*item.buyNum*-1 | numFilter(2)}}</p>
					</div>
				</div>
				<div class="bottom">
					<div>预付款¥ {{item.frontMoney}}(含服务费)</div>
					<div>
						<span v-if="item.director==1" @click="doPickUpPriceDifference(item)">提货</span>
						<span v-if="item.director==0" @click="doBuyBackChangeDeliverTheGoods(item)">交货</span>
						<span @click="doBBIClosePosition(item)">退订</span>
					</div>
				</div>
			</div>
			
			
			
		</div>
		
		<div class="empty" v-if="adOrderIndex==0&&holdOrder.length==0">
			<i class="iconfont icon-empty"></i>
			<p>暂无数据</p>
		</div>
		
		
		
		<div class="advanceList-content" v-if="adOrderIndex==1">
			<div class="content-block" v-for="(item,index) in holdOrderHis">
				<div class="title">
					<span class="price">{{item.status=='0'?'持仓':item.status=='1'?'平仓':''}}</span>
					<router-link tag="span" :to="{name:'advanceListDetail',query:{orderIdHis:item.hisId}}">订单号：{{item.hisId}}</router-link>
				</div>
				<div class="content">
					<div>
						<img :src="'/frontWeb/frontWebImages/' + item.productIcon" @click="toShop(index)">
					</div>
					<div>
						<p>KKG金条</p>
						<p class="price"><span>规格：{{item.productWeight}}g</span> <span class="u-ml-30">数量：{{item.buyNum}}</span></p>
						<p>建仓价：¥ {{item.holdPrice}} /
							平仓价：<span class="price">¥ {{item.closePrice}}</span>
						</p>
						<p v-if="item.director==1">平仓盈亏：{{item.closeProfit}}</p>

					</div>
				</div>
				<div class="bottom">
					<div>预付款¥ {{item.frontMoney}}(含服务费)</div>
					<div>
						{{item.strCloseTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
					</div>
				</div>
			</div>
		</div>
		
		<div class="empty" v-if="adOrderIndex==1&&holdOrderHis.length==0">
			<i class="iconfont icon-empty"></i>
			<p>暂无数据</p>
		</div>
		
		
		

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
	import { Toast, Dialog } from 'vant';
//	import RWebsocket from '../../plugin/websocket/reconnecting-websocket';

	export default {
		data() {
			return {
				adorderList: ['预定订单', '历史订单'],
				adOrderIndex: 0,
				holdOrder: [], //预付款单
				holdOrderHis: [], //平仓单
				money: 0, //人民币
				gameWS: null, //websocket
				gameProduct: [],
				newQuotes: {}, //最新价
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
			this.doOrderHold();
			this.doOrderHoldHis();
			this.queryAccountBalance();
		},
		deactivated() {
			this.gameWS.close();
			this.gameWS = null;
			this.allFrontMoney = 0;
		},
		computed: {
			//总货值增减
			profit() {
				let all = 0;
				for(let i = 0; i < this.holdOrder.length; i++) {
					all += (this.$store.state.mall.newPrice[this.holdOrder[i].quoteProductCode] - this.holdOrder[i].holdPrice) * this.holdOrder[i].buyNum * (this.holdOrder[i].director == 1 ? 1 : -1)

				}
				return this.numFilter(all)
			}
		},
		methods: {
			returnBack() {
				this.$router.push('/mine')
			},
			//预付款单列表查询
			doOrderHold() {
				//				this.profit = 0;
				this.allFrontMoney = 0;
				api.mall.doOrderHold({
					pageSize: 100,
					index: 0
				}, res => {
					this.holdOrder = res.res_content;
//					this.initWebSocket()
					for(let i = 0; i < this.holdOrder.length; i++) {
						this.allFrontMoney += Number(this.holdOrder[i].frontMoney);
					}

				}, error => {

				})
			},
			//平仓查询
			doOrderHoldHis() {
				api.mall.doOrderHoldHis({
					pageSize: 100,
					index: 0
				}, res => {
					this.holdOrderHis = res.res_content
				}, error => {

				})
			},
			//查询账户余额
			queryAccountBalance() {
				api.user.queryAccountBalance(
					response => {
						for(let i in response.res_content) {
							var obj = response.res_content[i];
							if(obj.currency == '0') {
								this.money = obj.totalAmount;
							}
						}
					},
					error => {

					});
			},
			//退订
			doBBIClosePosition(item) {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否退订'
				}).then(() => {
					api.mall.doBBIClosePosition({
						order_id: item.mallPreOrderId,
						close_type: 1,
						client_price: this.$store.state.mall.newPrice[item.quoteProductCode]
					}, res => {
						Toast(res.res_msg);
						this.doOrderHold();
						this.doOrderHoldHis();
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});
			},
			//预付款回购转交货
			doBuyBackChangeDeliverTheGoods(item) {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否交货'
				}).then(() => {
					api.mall.doBuyBackChangeDeliverTheGoods({
						mall_pre_order_id: item.mallPreOrderId
					}, res => {
						Toast(res.res_msg);
						this.doOrderHold();
						this.doOrderHoldHis();
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});

			},
			//预付款预定转提货
			doPickUpPriceDifference(item) {
				Dialog.confirm({
					title: '提示',
					message: '请确认是否提货'
				}).then(() => {
					api.mall.doPickUpPriceDifference({
						mall_pre_order_id: item.mallPreOrderId
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
						this.$set(this.newQuotes, nq.gc, nq.bnp);
					}
				}
			},
			//保留2位小数不四舍五入
			 numFilter(value) {
				let transformVal = Number(value).toFixed(3)
				let realVal = transformVal.substring(0, transformVal.length - 1)
				return Number(realVal) 
			},
		}
	};
</script>

<style lang="scss">
	.advanceList-wrap {
		.advanceList-title {
			display: flex;
			span {
				flex: 1;
				text-align: center;
				font-size: 0.26rem;
				padding: 0.3rem 0;
				border-bottom: 1px solid #fff;
			}
			span:nth-of-type(2) {
				border-left: 1px solid #F5F5F5;
			}
			.active {
				transition: all 0.5s;
				border-bottom: 1px solid #f3300a;
				color: #f3300a;
			}
		}
		.advanceList-wallet {
			display: flex;
			padding: 0.15rem 0;
			background: #F3F3F3;
			.block {
				flex: 1;
				text-align: center;
				color: #A5A5A5;
				.price {
					margin-top: 0.1rem;
				}
			}
		}
		.advanceList-content {
			background: #fff;
			.content-block {
				border-bottom: 0.22rem solid #F4F4F4;
				.title {
					display: flex;
					border-bottom: 1px solid #EFEFEF;
					padding: 0.2rem 0.35rem;
					span {
						flex: 1;
					}
					span:nth-of-type(2) {
						flex: 2;
						text-align: right;
					}
				}
				.content {
					display: flex;
					padding: 0.3rem 0.1rem 0.3rem 0.5rem;
					border-bottom: 1px solid #EFEFEF;
					img {
						width: 1.5rem;
						margin-right: 0.3rem;
					}
					p {
						margin-bottom: 0.1rem;
					}
				}
				.bottom {
					padding: 0.25rem 0.35rem;
					display: flex;
					div {
						width: 60%;
					}
					div:nth-of-type(2) {
						width: 40%;
						text-align: right;
						span {
							color: #FE956E;
							border: 1px solid #FE956E;
							padding: 0.07rem 0.3rem;
							border-radius: 10px;
							margin-left: 5px;
						}
					}
				}
			}
		}
		.price {
			color: #D96968;
		}
		.name {
			font-weight: 600;
		}
		.empty {
			text-align: center;
			margin-top: 0.5rem;
			color: #c1bbbb;
			.iconfont {
				font-size: 0.3rem;
			}
		}
	}
</style>