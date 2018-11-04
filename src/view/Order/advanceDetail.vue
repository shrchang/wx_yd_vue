<template>
	<div class="advanceDetail-wrap page-wrap">
		<app-header :title="orderDetail.productName"></app-header>

		<div class="advanceDetail-goods">
			<div>
				<img :src="'/frontWeb/frontWebImages/' + orderDetail.productPic" @click="toShop">
			</div>
			<div>
				<p @click="toShop">{{orderDetail.productName}} {{orderDetail.specs[$route.query.specs].specName}}</p>
		<!--		<p>{{orderDetail.shortDesc}}</p>-->
			<!--	<p>规格：</p>-->
				<p class="price">¥{{orderDetail.specs[$route.query.specs].tmallPrice}}</p>
			</div>
		</div>

		<div class="orderDetail-bg"></div>

		<div class="advanceDetail-list">
			<div class="advanceDetail-block">
				<span class="block">
					小计：<span class="price">¥ {{orderDetail.specs[$route.query.specs].tmallPrice*$route.query.buyNum | toFixed(2)}}</span>
				</span>
				<span class="block">
					商品数量：<span class="price">{{$route.query.buyNum}}</span>
				</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					给卖家留言：<input placeholder="(限45个字)" maxlength="45">
				</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					配送方式
				</span>
				<span class="block dec">
					商家承担运费
				</span>
			</div>
			
			<div class="orderDetail-bg"></div>
			
			<div class="advanceDetail-block">
				<span class="block" style="flex: 2;">
					货物总额：  <span class="price">*(提示:该价格仅供参考)</span>
				</span>
				<span class="block price">
					¥ {{orderDetail.specs[$route.query.specs].tmallPrice*$route.query.buyNum | toFixed(2)}}
				</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					订单金额：
				</span>
				<span class="block price">
					¥ {{(orderDetail.specs[$route.query.specs].frontMoney-openFeeAmount)*$route.query.buyNum | numFilter(2)}}
				</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					服务费：
				</span>
				<span class="block price">
					¥ {{openFeeAmount*$route.query.buyNum | numFilter(2)}}
				</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					订购价：
				</span>
				<span class="block price" v-if="$store.state.mall.newPrice[orderDetail.tqProductCode]">
					¥ {{$store.state.mall.newPrice[orderDetail.tqProductCode]}}
				</span>
				<span class="block price" v-else>----</span>
			</div>
			
			<div class="advanceDetail-block">
				<span class="block">
					商品优惠：
				</span>
				<span class="block price">
					¥ -0.0
				</span>
			</div>
			
			
			
			<div class="advanceDetail-real">
				实付预付款：<span class="price">¥ {{Number(orderDetail.specs[$route.query.specs].frontMoney)*$route.query.buyNum | numFilter(2) }}</span><span class="dec">（运费¥0.00,已节省-¥0.00）</span>
			</div>
		</div>
		
		
		<div class="advance-order">
			<span @click="doBBIOpenPosition(0)">回购</span>
			<span @click="doBBIOpenPosition(1)">预订</span>
		</div>
		

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
	import { Toast } from 'vant';
	import RWebsocket from '../../plugin/websocket/reconnecting-websocket';
	
	let clickBol = true;

	export default {
		components: {
			AppHeader,

		},
		data() {
			return {
				orderDetail: [], //订单详情
				openFeeAmount: 0, //服务费
				gameWS: null, //websocket
				gameProduct: [],
				newQuotes: {}, //最新价
			}
		},
		watch: {},
		mounted() {

		},
		activated() {
			if(this.$route.query.productId && this.$route.query.buyNum) {
				this.doMallProductInfo(this.$route.query.productId, this.$route.query.buyNum, this.$route.query.specs)
			}
			window.scrollTo(0, 0);
		},
		deactivated() {
			this.orderDetail = [];
			this.openFeeAmount = 0;
		},
		computed: {},
		methods: {
			//商品详情查询
			doMallProductInfo(id, num, specs) {
				api.mall.doMallProductInfo({
					productId: id
				}, res => {
					this.orderDetail = res.res_content[0];
					this.doQueryProductSpec(id,this.orderDetail.specs[specs].id,num)
//					this.initWebSocket()
				}, error => {
				})
			},
			//查询交易规格信息
			doQueryProductSpec(productId,specId,num) {
				api.mall.doQueryProductSpec({
					productId: productId,
					specId: specId
				},res => {
					this.openFeeAmount = (Number(res.res_content.openFeeAmount)+Number(res.res_content.beanNum))*num
//					for(let i = 0;i<res.res_content.length;i++) {
//						if(res.res_content[i].quoteProductCode == this.orderDetail.tqProductCode) {
//							this.openFeeAmount = Number(res.res_content[i].openFeeAmount)
//						}
//					}
				},error => {
					
				})
			},
			//确认订单
			doBBIOpenPosition(director) {
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 1000)
					api.mall.doBBIOpenPosition({
						productId: this.orderDetail.productId,
						specId: this.orderDetail.specs[this.$route.query.specs].id,
						director: director,
						openPrice: this.$store.state.mall.newPrice[this.orderDetail.tqProductCode],
						buyNum: this.$route.query.buyNum,
						specValue: this.orderDetail.specs[this.$route.query.specs].specValue
					}, res => {
						Toast.success(res.res_msg)
						setTimeout(() => {
							this.$router.push({
								name: 'payResult',
								query: {
									orderIdAd: res.res_content[0].order_id,
									ad: 1
								}
							})
						}, 100);
					}, error => {
						Toast(error.msg)
					})
			},
			//跳转商品详情
			toShop() {
				this.$router.push({
					name: 'productDetail',
					query: {
						productId: this.orderDetail.productId,
						catalogPath: this.orderDetail.catalogPath
					}
				})
			},
			//保留2位小数不四舍五入
			 numFilter(value) {
				let transformVal = Number(value).toFixed(3)
				let realVal = transformVal.substring(0, transformVal.length - 1)
				return Number(realVal) 
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
		}
	};
</script>

<style lang="scss">
	@import "./Order";
</style>toShopOne