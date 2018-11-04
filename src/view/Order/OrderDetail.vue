<template>
	<div class="orderDetail-wrap page-wrap">
		<app-header title="确认订单" v-on:clickLeft="returnBack"></app-header>
		<div class="orderDetail-address" v-if="addressList">
			<div class="address-block">
				<i class="iconfont icon-location"></i>
			</div>
			<div class="address-block">
				<p><span>收货人：{{addressList.receiverName}}</span> <span>{{addressList.mobileNo}}</span></p>
				<p>收货地址：{{addressList.province+addressList.city+addressList.district+addressList.address}}</p>
				<p class="dec">(收货不便时，可选择免费待收货服务)</p>
				<i class="iconfont icon-arr-right"></i>
			</div>
			
		</div>
		<div class="orderDetail-noAddress" v-else>
			<i class="iconfont icon-location"></i>暂无收货地址，点击添加
		</div>

		<div class="orderDetail-list">
			<p class="orderDetail-list-title" @click="$router.push('/home')">商城</p>
			<div class="orderDetail-list-content" v-for="(item,index) in orderDetail" v-if="orderDetail">
				<div class="orderDetail-list-block">
					<div class="img-block">
						<img :src="'/frontWeb/frontWebImages/' + item.productVo.productPic" @click="toShop(index)">
					</div>
					<div>
						<p @click="toShop(index)">{{item.productVo.productName}}</p>
						<p>{{item.productVo.shortDesc}}</p>
						<p class="price">¥ {{item.price}}</p>
					</div>
				</div>
				<div class="orderDetail-list-block-num">
					<div>小计：<span class="price">¥ {{item.price*item.buyNum | toFixed(2)}}</span></div>
					<div>商品数量：<span class="price">{{item.buyNum}}</span></div>
				</div>
			</div>
			
			<div class="orderDetail-list-content" v-for="(item,index) in orderDetailOne" v-if="orderDetailOne">
				<div class="orderDetail-list-block">
					<div class="img-block">
						<img :src="'/frontWeb/frontWebImages/' + item.productPic" @click="toShop(index)">
					</div>
					<div>
						<p @click="toShop(index)">{{item.productName}}</p>
						<p>{{item.shortDesc}}</p>
						<p class="price">¥ {{item.specs[$route.query.specs].tmallPrice}}</p>
					</div>
				</div>
				<div class="orderDetail-list-block-num">
					<div>小计：<span class="price">¥ {{item.specs[$route.query.specs].tmallPrice*$route.query.buyNum | toFixed(2)}}</span></div>
					<div>商品数量：<span class="price">{{$route.query.buyNum}}</span></div>
				</div>
			</div>
				
		</div>
		<div class="orderdetail-message">
			<van-field  type="text" label="给卖家留言" placeholder="限45个字"/>
		</div>
		<div class="orderDetail-dispatching">
			<span>配送方式</span> 
			<div class="dispatching-select">
				<span :class="{'active':dispatchingIndex == 1}" @click="dispatchingIndex = 1">快递</span>
				<span :class="{'active':dispatchingIndex == 2}" @click="dispatchingIndex = 2">自提</span>
			</div>
			<span class="dec">商家承担运费</span>
		</div>
		
		<div class="orderDetail-bg"></div>
		<div class="bill">
			<p class="title">发票内容</p>
			<div class="bill-content" v-if="inVoiceList.length">
				<p>发票类型：普通发票({{inVoiceList[0].invoiceType=='1'?'个人':'单位'}})</p>
				<p>发票抬头：{{inVoiceList[0].invoiceTitleName}}</p>
				<p>发票内容：明细</p>
			</div>
		</div>
		<div class="orderDetail-bg"></div>
		<div class="coupon">
			优惠券
		</div>

		<div class="orderDetail-bottom">
			<div>合计金额：<span class="price">¥ {{allPrice | numFilter(2)}}</span></div>
			<div><span @click="orderSubmit">提交订单</span></div>
		</div>
		
	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
	import { Toast } from 'vant';

	let clickBol = true;

	export default {
		components: {
			AppHeader,
			//			VDistpicker
		},
		data() {
			return {
				addressList: [],
				dispatchingIndex: 1, //配送方式
				orderDetail: [], //订单详情 购物车
				orderDetailOne: [], //订单详情 直接购买
				allPrice: 0, //支付总金额
				allOrderNum: 0, //总件数
				inVoiceList: [], // 发票信息列表
			}
		},
		watch: {
		},
		mounted() {

		},
		activated() {
			//购物车传过来的购物车id
			if(this.$route.query.shoppingCartId) {
				this.doQueryShoppingCart(this.$route.query.shoppingCartId.split("|"));
			}
			//直接购买
			if(this.$route.query.productId && this.$route.query.buyNum) {
				this.doMallProductInfo(this.$route.query.productId, this.$route.query.buyNum, this.$route.query.specs)
			}
			window.scrollTo(0, 0);
			this.queryAddress(); //查询收货地址列表
			this.doQueryInvoice(); //发票
		},
		deactivated() {
			this.orderDetail = [];
			this.orderDetailOne = [];
			this.allOrderNum = 0;
			this.allPrice = 0;
		},
		computed: {
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//购物车查询
			doQueryShoppingCart(id) {
				api.mall.doQueryShoppingCart(res => {
					for(let i = 0; i < res.res_content.length; i++) {
						for(let j = 0; j < id.length; j++) {
							if(res.res_content[i].shoppingCartId == id[j]) {
								this.orderDetail.push(res.res_content[i])
							}
						}
					}
					for(let i = 0; i < this.orderDetail.length; i++) {
						this.allOrderNum += Number(this.orderDetail[i].buyNum);
						this.allPrice += this.orderDetail[i].price * Number(this.orderDetail[i].buyNum);
					}
				}, error => {
				})
			},
			//商品详情查询
			doMallProductInfo(id, num, specs) {
				api.mall.doMallProductInfo({
					productId: id
				}, res => {
					this.orderDetailOne = res.res_content;
					this.allOrderNum = num;
					this.allPrice = num * this.orderDetailOne[0].specs[specs].tmallPrice
				}, error => {

				})
			},
			//发票信息列表
			doQueryInvoice() {
				api.mall.doQueryInvoice(res => {
					this.inVoiceList = res.res_content
				}, error => {

				})
			},
			//查询收货地址列表
			queryAddress() {
				api.user.queryAddress({
					pageSize: 20,
					index: 0
				}, res => {
					this.addressList = res.res_content[0]
				}, error => {
				})
			},
			//确认订单
			orderSubmit() {
				if(this.addressList.length == 0) {
					Toast('请先填写收货地址')
					return
				}
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 1000)
				//				this.loading = true

				if(this.$route.query.shoppingCartId) {
					//购物车下单
					let productList = this.orderDetail.map((item) => {
						return {
							productId: item.productId,
							buyNum: item.buyNum,
							specId: item.specId
						}
					})
					api.mall.doProductOrder({
						products: JSON.stringify(productList),
						invoiceId: this.inVoiceList === '' ? null : this.inVoiceList[0].id,
						addrId: this.addressList.serialNo,
						shoppingCartId: 1,
						currency: 0,
					}, res => {
						Toast(res.res_msg)
						setTimeout(() => {
							this.loading = false
							this.$router.push({
								name: 'orderPay',
								query: {
									orderId: res.res_content[0].orderId
								}
							})
						}, 1000);
					}, error => {
						Toast(error.msg)
					})
				} else {
					//直接购买下单
					let productList = [{
						'productId': this.orderDetailOne[0].productId,
						'buyNum': this.$route.query.buyNum,
						"specId": this.orderDetailOne[0].specs[this.$route.query.specs].id
					}]
					api.mall.doProductOrder({
						products: JSON.stringify(productList),
						invoiceId: this.inVoiceList === '' ? null : this.inVoiceList[0].id,
						addrId: this.addressList.serialNo,
						shoppingCartId: 0,
						currency: 0,
					}, res => {
						Toast(res.res_msg)
						setTimeout(() => {
							this.loading = false
							this.$router.push({
								name: 'orderPay',
								query: {
									orderId: res.res_content[0].orderId
								}
							})
						}, 100);
					}, error => {
						Toast(error.msg)
					})
				}
			},
			//跳转商品详情 购物车
			toShop(index) {
				this.$router.push({
					name: 'productDetail',
					query: {
						productId: this.orderDetail[index].productVo.productId,
						catalogPath: this.orderDetail[index].productVo.catalogPath
					}
				})
			},
			//跳转商品详情
			toShopOne(index) {
				this.$router.push({
					name: 'productDetail',
					query: {
						productId: this.orderDetailOne[index].productId,
						catalogPath: this.orderDetailOne[index].catalogPath
					}
				})
			},
		}
	};
</script>

<style lang="scss">
	@import "./Order";
</style>toShopOne