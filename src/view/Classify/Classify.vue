<template>
	<div class="page-wrap classify-wrap">
		<div class="shpo-list">
			<div v-for="item in shopList" class="shop-item" @click="showShop(item);">
				<img src="../../assets/images/shop/shop.jpg"/>
				<div class="item-content">
					<div class="shop-decs">
						<span>{{item.shopName}}</span>
						<span class="shop-price">￥1500</span>
					</div>
					<div class="shop-address">
						<i class="iconfont icon-ditudaohang-"></i>
						<span>{{item.shopAddress}}</span>
					</div>
				</div>
			</div>
		</div>
		<tabbar></tabbar>
	</div>
</template>

<script>
	import api from '../../api/require';
	import * as types from "../../store/types";
	import Tabbar from '../../components/Tabbar.vue';

	export default {
		components: {
			Tabbar
		},
		data() {
			return {
				currentIndex: 0,
				shopList:[],
			}
		},
		computed: {
		},
		activated() {
			this.init();
		},
		deactivated() {
		},
		methods: {
			init(){
				api.mall.queryShops(res=>{
						console.log("数据：" + JSON.stringify(res));
						this.shopList = res.data;
					},error=>{
						alert("获取失败：" + JSON.stringify(error));
					});
			},
			showShop(item){
				this.$router.push({
					name: 'shopDetail',
					params: {
						shopId: item.id
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import './Classify';
</style>