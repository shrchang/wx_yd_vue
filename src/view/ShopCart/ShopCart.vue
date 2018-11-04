<template>
	<div class="shopCart-wrap page-wrap">

		<div class="shopCart-top">
			<p>购物车</p>
			<p>共{{shopCartNum}}件宝贝</p>
		</div>

		<div class="shopCart-content"  v-if="shopCart.length">
			<div class="content-title">
				<van-checkbox v-model="allSelected" @change="allSelect"></van-checkbox> <span class="shop" @click="$router.push('/home')">商城</span> 
				<!--<i class="iconfont icon-arr-right"></i>-->
			</div>

			<div class="content" v-for="(item,index) in shopCart" @click="currentIndex = index">

				<div class="content-wrap">
					<div class="content-block">
						<van-checkbox v-model="item.selectBol" @change="shopSelect(index)"></van-checkbox>
					</div>
					<div class="content-block imgBlock">
						<div>
							<img :src="'/frontWeb/frontWebImages/' + item.productVo.productPic" @click="toShop(index)">
						</div>
						<div>
							<p @click="toShop(index)">{{item.productVo.productName}}</p>
							<p>{{item.productVo.shortDesc}}</p>
							<p class="price">¥ {{item.price}}</p>
						</div>
					</div>
					<div class="delete">
						<span @click="deleteShop(index)">删除</span>
					</div>
				</div>
				<div class="content-num">
					<div class="num-block">小计：<span class="price">¥ {{item.buyNum*item.price | toFixed(2)}}</span></div>
					<div class="num-block buyNum">
						<van-stepper v-model="item.buyNum" integer :min="1" @change="handleChange(index)" :step="1" />
					</div>
				</div>
			</div>

		</div>
		
		<div class="shopCart-empty" v-else>
			<i class="iconfont icon-empty"></i>
			<p>购物车空空如也~</p>
			<div><span  @click="$router.push('/home')">马上购物</span></div>
		</div>
		
		
		<div class="shopCart-bottom">
			 <div class="bottom-blcok">
			 	<van-checkbox v-model="allSelected" @change="allSelect">全选 </van-checkbox>
			 	<div class="u-ml-20">合计：<b class="price"> ¥ {{allPrice | numFilter(2)}}</b></div>
			 </div>
	
			  <div class="bottom-blcok">
			  	
			 	<div> <span class="order" @click="toOrder">去结算</span></div>
			  </div>
		</div>
		
		<tabbar></tabbar>
	</div>
</template>

<script>
	import api from "../../api/require";
	import * as types from "../../store/types";
	import Tabbar from '../../components/Tabbar.vue';
	import { Dialog,Toast } from 'vant';

	let clickBol = true;

	export default {
		components: {
			Tabbar
		},
		data() {
			return {
				allSelected: false, //全选
				cartNum: 1, //购物车数量
				shopCart: {}
			}
		},
		watch: {
			shopCart(val) {
				if(val.length == 0) {
					this.allSelected = false;
				}
			}
		},
		mounted() {
		},
		activated() {
			if(!localStorage.getItem('token')) {} else {
				this.$store.dispatch(types.GET_SHOP_CART)
			}
			this.allSelected = false;
			this.doQueryShoppingCart()
		},
		deavtivated() {
			this.allSelected = false;
		},
		computed: {
			shopCartNum() {
				return this.$store.state.mall.shopCartNum
			},
			//总数量
			allNum() {
				var num = 0;
				for(let i = 0; i < this.shopCart.length; i++) {
					if(this.shopCart[i].selectBol == true) {
						num += this.shopCart[i].buyNum

					}
				}
				return num
			},
			//总额
			allPrice() {
				var price = 0;
				for(let i = 0; i < this.shopCart.length; i++) {
					if(this.shopCart[i].selectBol == true) {
						price += this.shopCart[i].buyNum * this.shopCart[i].price

					}
				}
				return price
			}
		},
		methods: {
			//购物车
			doQueryShoppingCart() {
				api.mall.doQueryShoppingCart(res => {
					for(let i = 0; i < res.res_content.length; i++) {
						res.res_content[i].selectBol = false;
						//						res.res_content[i].clickBol = true;
					}
					this.shopCart = res.res_content;
				}, error => {

				})
			},
			//选择商品
			shopSelect(index) {
				var selectedNum = 0
				for(let i = 0; i < this.shopCart.length; i++) {
					if(this.shopCart[i].selectBol == true) {
						selectedNum += 1
					}
				}
				if(selectedNum == this.shopCart.length) {
					this.allSelected = true
				} else {
					this.allSelected = false
				}
			},
			//全选
			allSelect(value) {
				if(value) {
					for(let i = 0; i < this.shopCart.length; i++) {
						this.shopCart[i].selectBol = true
					}
				} else {
					for(let i = 0; i < this.shopCart.length; i++) {
						this.shopCart[i].selectBol = false
					}
				}
			},
			//修改商品数量
			handleChange(index) {
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 100)
				api.mall.doEditCart({
					shoppingCartId: this.shopCart[index].shoppingCartId,
					buyNum: this.shopCart[index].buyNum
				}, res => {
					this.shopCart[index].clickBol = true;
				}, error => {
					Toast(error.msg)
				})
			},
			//删除物品
			deleteShop(index) {
				Dialog.confirm({
					title: '提示',
					message: '删除后不可恢复, 确定要删除吗？'
				}).then(() => {
					api.mall.doDelCart({
						shoppingCartId: this.shopCart[index].shoppingCartId
					}, res => {
						this.$store.dispatch(types.GET_SHOP_CART)
						this.doQueryShoppingCart();
						Toast('删除成功');
					}, error => {
						Toast(error.msg)
					})
				}).catch(() => {
					// on cancel
				});
			},
			toOrder() {
				if(!this.shopCart) {
					Toast('购物车没有商品')
					return
				}
				let list = [];
				for(let i = 0; i < this.shopCart.length; i++) {
					if(this.shopCart[i].selectBol == true) {
						list.push(this.shopCart[i].shoppingCartId)
					}
				}
				if(list.length) {
					list = list.join("|");
					this.$router.push({
						name: 'orderDetail',
						query: {
							shoppingCartId: list
						}
					})
					return
				} else {
					Toast('请先选择要购买的商品')
				}
			},
			//跳转商品详情
			toShop(index) {
				this.$router.push({
					name: 'productDetail',
					query: {
						productId: this.shopCart[index].productVo.productId,
						catalogPath: this.shopCart[index].productVo.catalogPath
					}
				})
			}
		}
	};
</script>

<style lang="scss">
	@import "./ShopCart";
</style>