<template>
	<div class="page-wrap productList-wrap">
		<app-header title="商品列表" v-on:clickLeft="returnBack"></app-header>

		<div class="productList-menu">
			<div class="block" v-for="(item,index) in sortList" @click="menuIndex = index,selectIndex=!selectIndex" :class="{'active':menuIndex == index}">{{item}}
				<div class="sort" v-if="index!=0">
					<p><i class="iconfont icon-top" :class="{'red':menuIndex == index&&selectIndex}"></i></p>
					<p><i class="iconfont icon-low" :class="{'red':menuIndex == index&&!selectIndex}"></i></p>
				</div>
			</div>
		</div>

		<!--	<van-list v-model="loading" :finished="finished" :offset="50" @load="onLoad">-->
		<div class="productList-list">

			<div class="block" v-for="item in productList" @click="toProdcutDetail(item)">
				<div class="img">
					<img :src="'/frontWeb/frontWebImages/' + item.productPic">
				</div>
				<div class="content">
					<p>{{item.productName}}</p>
					<p class="price">￥ {{item.specs[0].tmallPrice}}</p>
					<span class="marketPrice">￥{{item.specs[0].marketPrice}}</span> <span class="sellNum">{{item.sellNum}}人付款</span>
				</div>
			</div>

		</div>
		<!--</van-list>-->

		<!--	<tabbar></tabbar>-->
	</div>
</template>

<script>
	import AppHeader from '../../components/Header.vue';
	import api from '../../api/require';
	import * as types from "../../store/types";
	import { List } from 'vant';
	export default {
		components: {
			AppHeader
		},
		data() {
			return {
				menuIndex: 0,
				selectIndex: true,
				sortList: ['默认', '销量', '评论数', '价格'],
				productList: [],
				loading: false,
				finished: false,
				productListNum: 0,
				listIndex: 1,
				change: null
			}
		},
		mounted() {
			this.loading = false;
			this.finished = false;

		},
		activated() {
			if(this.$route.query.catalogId) {
				this.doQueryMallProduct()
			}
			if(this.$route.query.keyWord) {
				this.doQueryMallProduct(null,this.$route.query.keyWord)
			}
		},
		deactivated() {
			this.menuIndex = 0;
			this.selectIndex = true;
			this.productListNum = 0;
			this.productList = [];
			this.loading = false;
			this.finished = false;
			this.listIndex = 1;
		},
		computed: {},
		watch: {
			menuIndex(val) {
				if(this.productList.length==1)return
				
				this.change = 1;
				if(val) {
					this.selectIndex = true;
				}
				if(this.selectIndex && this.menuIndex == 0) {
					this.doQueryMallProduct('comprehensive desc',this.$route.query.keyWord)
				}
				if(this.selectIndex && this.menuIndex == 1) {
					this.doQueryMallProduct('sell_num desc',this.$route.query.keyWord)
				}
				if(this.selectIndex && this.menuIndex == 2) {
					this.doQueryMallProduct('popularity desc',this.$route.query.keyWord)
				}
				if(this.selectIndex && this.menuIndex == 3) {
					this.doQueryMallProduct('tmall_price desc',this.$route.query.keyWord)
				}
			},
			selectIndex(val) {
				if(this.productList.length==1)return
				if(this.change == 1)return
			
				if(val && this.menuIndex == 0) {
					this.doQueryMallProduct('comprehensive desc',this.$route.query.keyWord)
				}
				if(!val && this.menuIndex == 0) {
					this.doQueryMallProduct('comprehensive asc',this.$route.query.keyWord)
				}
				if(val && this.menuIndex == 1) {
					this.doQueryMallProduct('sell_num desc',this.$route.query.keyWord)
				}
				if(!val && this.menuIndex == 1) {
					this.doQueryMallProduct('sell_num asc',this.$route.query.keyWord)
				}
				if(val && this.menuIndex == 2) {
					this.doQueryMallProduct('popularity desc',this.$route.query.keyWord)
				}
				if(!val && this.menuIndex == 2) {
					this.doQueryMallProduct('popularity asc',this.$route.query.keyWord)
				}
				if(val && this.menuIndex == 3) {
					this.doQueryMallProduct('tmall_price desc',this.$route.query.keyWord)
				}
				if(!val && this.menuIndex == 3) {
					this.doQueryMallProduct('tmall_price asc',this.$route.query.keyWord)
				}
			},
			'$route.query.keyWord' (val) {
				//				this.doQueryMallProduct(this.$route.query.keyWord)
			}
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//按分类查询商品
			doQueryMallProduct(orderBy, keyWord) {			
				orderBy ? orderBy : orderBy = null
				api.mall.doQueryMallProduct({
					pageSize: 1000,
					index: 0,
					catalogId: this.$route.query.catalogId,
					orderBy: orderBy
				}, res => {
					this.productList = [];
					this.change = 2;
					if(keyWord) {
						for(let i = 0; i < res.res_content.length; i++) {
							if(res.res_content[i].productName.indexOf(keyWord) != -1) {
								this.productList.push(res.res_content[i])
							}
						}
					} else {
						this.productList = res.res_content;
					}
console.log(this.productList)
					this.productListNum = Number(res.res_rowCount);
					//					this.loading = false;

				}, error => {

				})
			},
			//商城商品列表 关键字搜索
			doQueryMallProductKey(keyWord) {
				console.log(keyWord)
				this.productList = [];
				api.mall.doQueryMallProduct({
					pageSize: 1000,
					index: 0
				}, res => {
					for(let i = 0; i < res.res_content.length; i++) {
						if(res.res_content[i].productName.indexOf(keyWord) != -1) {
							this.productList.push(res.res_content[i])
						}
					}
				})
			},
			//			onLoad() {
			//				console.log(this.$route.query.catalogId)
			//				if(this.$route.query.catalogId) {
			//					setTimeout(() => {
			//				this.listIndex += 1;
			//				this.doQueryMallProduct(this.listIndex,this.$route.query.catalogId)
			////				setTimeout(()=>{
			//					if(this.productList.length >= this.productListNum) {
			//						this.finished = true;
			//						return;
			//					}
			////				},400)
			//					
			//				}, 1000)
			//				}
			//				
			//			},
			toProdcutDetail(item) {
				this.$router.push({
					name: 'productDetail',
					query: {
						productId: item.productId
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import './Product';
</style>