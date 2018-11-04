<template>
	<div class="page-wrap productDetail-wrap">

		<div class="productDetail-top">
			<div class="top-block">
				<span><i class="iconfont icon-xiangyou" @click="$router.go(-1)"></i></span>
				<span @click="$router.push('/shopCart')"><i class="iconfont icon-gouwuche"></i><span class="cartNum">{{shopCartNum}}</span></span>
			</div>
		</div>

		<div class="product-content" v-if="productDetail">
			<div class="content-img">
				<van-swipe :autoplay="3000">
					<van-swipe-item><img :src="'/frontWeb/frontWebImages/' + productDetail.productPic"></van-swipe-item>
				</van-swipe>
			</div>

			<div class="product-dec">
				<div class="dec">
					<div class="block">
						<div>实时{{productDetail.tqProductCode=='XAUUSD'?'金':'银'}}价：</div>
						<div>市场价：<span class="market-price">¥ {{productDetail.specs[formatIndex].marketPrice}}</span></div>
					</div>
					<div class="block">
						<div class="gold-price" v-if="$store.state.mall.newPrice[productDetail.tqProductCode]">¥ 
							{{$store.state.mall.newPrice[productDetail.tqProductCode]}}
				<!--			{{newQuotes[productDetail.tqProductCode]}}-->
						</div>
						<div class="gold-price" v-else>暂停预定</div>
						<div>商城价：<span class="price">¥ {{productDetail.specs[formatIndex].tmallPrice}}</span></div>
					</div>
					<div class="block">
						<div>最高：<span v-if="r24HPrice[productDetail.tqProductCode]">¥ {{r24HPrice[productDetail.tqProductCode]}}</span><span v-else>----</span> &nbsp;&nbsp;&nbsp;最低：<span v-if="r24LPrice[productDetail.tqProductCode]">¥ {{r24LPrice[productDetail.tqProductCode]}}</span><span v-else>----</span></div>
						<div>预付款：<span class="price">{{productDetail.specs[formatIndex].frontMoney?'￥'+productDetail.specs[formatIndex].frontMoney:'----'}}</span></div>
					</div>

					<div class="product-title">
						{{productDetail.productName}}
					</div>
					<div class="explain">
						<div>克重：</div>
						<div>
							<span @click="formatIndex = index" v-for="(item,index) in productDetail.specs" :class="{'formatSelect':formatIndex == index}">{{item.specName}}</span>
						</div>
					</div>

					<div class="batch">
						<div>批量购买：</div>
						<div>
							<span @click="batchIndex = index" v-for="(item,index) in batchList" :class="{'batchSelect':batchIndex == index}">{{item}}件</span>
						</div>
					</div>

					<div class="buyNum">
						<div class="buyNum-block">数量：</div>
						<div class="buyNum-block">
							<van-stepper v-model="orderNum" integer :min="1" :max="Number(productDetail.specs[formatIndex].stockNum)" :step="1" />
							<span class="buyNum-block-span">库存：{{productDetail.specs[formatIndex].stockNum}}</span>
						</div>
					</div>

				</div>

				<div class="product-temp">
					<van-tabs v-model="selectIndex">
						<van-tab :title="item" v-for="item in selectList"></van-tab>
					</van-tabs>
					<div v-if="selectIndex==0" class="bigImage">
						<img :src="'/frontWeb/frontWebImages/' + productDetail.productImgDesc">
					</div>

					<div v-if="selectIndex == 1" class="param">
						<div v-for="item in productParamList">
							<span>{{item.paramName}}</span>
							<span>{{item.paramDesc}}</span>
						</div>
					</div>
				</div>

			</div>

			<div class="productDetail-operate">
				<div class="collect"><i class="iconfont icon-shoucang" @click="collectProduct"></i>
					<p @click="collectProduct">收藏</p>
				</div>
				<div class="operate-block">
					<span @click="addCar" class="addShopCart">加入购物车</span>
					<span @click="toOrder" class="orderBuy">立即购买</span>
					<span @click="toAdvance" class="advance" v-if="showAdvance">预付款</span>
				</div>
				<!--<div class="orderBuy"></div>
				<div class="advance"></div>-->
			</div>

		</div>

	</div>
</template>

<script>
	import api from '../../api/require';
	import * as types from "../../store/types";
	import { Toast } from 'vant';
	import RWebsocket from '../../plugin/websocket/reconnecting-websocket';

	export default {
		components: {},
		data() {
			return {
				productDetail: null,
				formatIndex: 0, //规格
				batchList: [3, 5, 10],
				batchIndex: null,
				orderNum: 1, //下单数量
				shopStar: 5, //店铺评分
				selectList: ['图文详情', '参数', '评价'],
				selectIndex: 0,
				assessName: 'first', //商品评价选项
				consultName: 'first', //咨询选项
				consultRadio: '1', //我要咨询选项
				consultWrap: '', //咨询内容
				loveList: [], //猜你喜欢
				catalogNameOne: null,
				catalogNameTwo: null,
				catalogNameThree: null,
				selectProduct: {
					isEmpty: true
				}, //当前产品
				gameWS: null, //websocket
				gameProduct: [],
				activeProductNewQuotes: '',
				productValue: '',
				oldProductValue: '',
				productIndex: 0,
				newQuotes: {}, //最新价
				r24HPrice: {},
				r24LPrice: {},
				searchList: [],
				productParamList: [], //商品的参数列表
				assessContent: '', //评价内容
				assessValue: null, //评价等级
				assessList: ['好评', '中评', '差评'],
				assessIndex: 0,
				showAssess: false, //展示评价框
				allAssessList: [], //全部评价
				oldAllAssessList: [],
				assessLevel: 0, //全部评价数量
				assessLevelOne: 0, //好评数量
				assessLevelTwo: 0, //中评数量
				assessLevelThree: 0, //差评数量
				assessCurrentPage: 1,
				assessNum: 0,
				showAdvance: false, //预付款展示

			}
		},
		computed: {
			cateLog() {
				return this.$store.state.mall.cateLog
			},
			isLogin() {
				return this.$store.state.user.loginStatus;
			},
			shopCartNum() {
				return this.$store.state.mall.shopCartNum
			}
		},
		mounted() {
			if(this.$route.query.orderId) {
				this.selectIndex = 2;
				this.doQueryWaitForFeedback(this.$route.query.orderId) //查询已评价
				this.doQueryAllFeedbackByProductId(this.$route.query.productId) //查询商品全部评价
				setTimeout(() => {
					const timer = setInterval(function() {
						let osTop = document.documentElement.scrollTop || document.body.scrollTop
						//					let ispeed = Math.floor(osTop / 8)
						document.documentElement.scrollTop = document.body.scrollTop = osTop + 100
						if(osTop >= 900) {
							clearInterval(timer)
						}
					}, 50)
				}, 500)
			}
		},
		activated() {
			
			if(this.$route.query.ad) {
				this.showAdvance = true;
			}
			if(!localStorage.getItem('token')) {} else {
				this.$store.dispatch(types.GET_SHOP_CART)
			}
			this.searchList = JSON.parse(window.localStorage.getItem('productDetail'))
			this.selectProduct = {
				isEmpty: true
			}
			//			this.getProductData();
			window.scrollTo(0, 0);
			if(this.$route.query.productId) {
				this.doMallProductInfo(this.$route.query.productId)
				//分类title
				this.changeCatologTitle(this.$route.query.catalogPath);
				//商品详情
				//				this.doMallProductInfo();
				//查询商品参数列表
				this.doQueryProductParam(this.$route.query.productId);
				//查询商品咨询列表
				this.doQueryAdviceRecord(this.$route.query.productId);
				//查询商品全部评价
				this.doQueryAllFeedbackByProductId(this.$route.query.productId)

			};

			this.doQueryRecommendProduct();
		},
		watch: {
			batchIndex(val) {
				this.orderNum = this.batchList[val]
			},
			assessName(val) {
				this.allAssessList = [];
				for(let i = 0; i < this.oldAllAssessList.length; i++) {
					if(val == 'first') {
						this.allAssessList = this.oldAllAssessList
					}
					if(val == 'second') {
						if(this.oldAllAssessList[i].feedbackLevel == '1') {
							this.allAssessList.push(this.oldAllAssessList[i])
						}
					}
					if(val == 'third') {
						if(this.oldAllAssessList[i].feedbackLevel == '2') {
							this.allAssessList.push(this.oldAllAssessList[i])
						}
					}
					if(val == 'fourth') {
						if(this.oldAllAssessList[i].feedbackLevel == '3') {
							this.allAssessList.push(this.oldAllAssessList[i])
						}
					}
				}
			},
			'$route.query.productId' (val) {
				//				this.doMallProductInfo();
				//				this.doQueryProductParam();
				//				this.doQueryAdviceRecord();
			},
			'$route.query.catalogPath' (val) {
				//				this.changeCatologTitle();
			}
		},
		deactivated() {
			this.productDetail = null;
			this.formatIndex = 0;
			this.batchIndex = null;
			this.orderNum = 1;
			this.assessName = 'first';
			this.consultName = 'first';
			this.catalogNameOne = null;
			this.catalogNameTwo = null;
			this.catalogNameThree = null;
			this.gameWS.close();
			this.gameWS = null;
			this.adviceType = "";
			this.showAssess = false;
			this.allAssessList = [];
			this.oldAllAssessList = [];
			this.assessLevel = 0;
			this.assessLevelOne = 0;
			this.assessLevelTwo = 0;
			this.assessLevelThree = 0;
			this.showAdvance = false;
		},
		methods: {
			//修改分类title
			changeCatologTitle(catalogPath) {
				let f = catalogPath.split('|')[0]
				let s = catalogPath.split('|')[1]
				let t = catalogPath.split('|')[2]
				for(let i = 0; i < this.cateLog.length; i++) {
					if(f == this.cateLog[i].catalogId) {
						this.catalogNameOne = this.cateLog[i].catalogName
					}
					if(s == this.cateLog[i].catalogId) {
						this.catalogNameTwo = this.cateLog[i].catalogName
					}
					if(t == this.cateLog[i].catalogId) {
						this.catalogNameThree = this.cateLog[i].catalogName
					}
				}
			},
			//查询商品详情
			doMallProductInfo(productId) {
				api.mall.doMallProductInfo({
					productId: productId
				}, res => {
					this.productDetail = res.res_content[0]
//					this.initWebSocket(this.productDetail.tqProductCode);
					//浏览历史
					let b = [];
					if(window.localStorage.getItem('productDetail')) {
						let a = JSON.parse(window.localStorage.getItem('productDetail'))
						if(a.length > 1) {
							b = a;
							if(b.length >= 10) {
								b.pop()
							}
						} else {
							b.push(a)
						}
						for(let i = 0; i < b.length; i++) {
							if(b[i].productId == this.productDetail.productId) return
						}
						let product1 = {};
						product1.productId = this.productDetail.productId;
						product1.tmallPrice = this.productDetail.specs[0].tmallPrice;
						product1.img = this.productDetail.productPic;
						product1.productName = this.productDetail.productName;
						product1.catalogPath = this.productDetail.catalogPath;
						b.unshift(product1);
						window.localStorage.setItem('productDetail', JSON.stringify(b))
					} else {
						let product = {};
						product.productId = this.productDetail.productId;
						product.tmallPrice = this.productDetail.specs[0].tmallPrice;
						product.img = this.productDetail.productPic;
						product.productName = this.productDetail.productName;
						product.catalogPath = this.productDetail.catalogPath;
						window.localStorage.setItem('productDetail', JSON.stringify(product))
					}
				}, error => {

				})
			},
			//立刻购买
			toOrder() {
				if(this.productDetail.specs[this.formatIndex].stockNum == 0) {
					Toast('此商品库存不足，请选择其它商品')
					return
				}
				this.$router.push({
					name: 'orderDetail',
					query: {
						productId: this.productDetail.productId,
						buyNum: this.orderNum,
						specs: this.formatIndex
					}
				})
			},
			//加入购物车
			addCar() {
				if(this.productDetail.specs[this.formatIndex].stockNum == 0) {
					Toast('此商品库存不足，请选择其它商品')
					return
				}
				api.mall.doAddCart({
					productId: this.productDetail.productId,
					buyNum: this.orderNum,
					currency: 0,
					specId: this.productDetail.specs[this.formatIndex].id,
					price: this.productDetail.specs[this.formatIndex].tmallPrice
				}, res => {
					this.$store.dispatch(types.GET_SHOP_CART)
					Toast.success('已加入购物车');
				}, error => {
					Toast('添加失败')
				})

			},
			//评价
			assessHandleClick(tab, event) {
				//				console.log(tab)
			},
			//收藏商品
			collectProduct() {
				api.mall.doAddFavorites({
						productId: this.productDetail.productId,
						specId: this.productDetail.specs[this.formatIndex].id
					},
					res => {
						Toast('收藏商品成功')
					}, error => {
						error.msg ? Toast(error.msg) : '';
					});
			},
			getProductData(callback) {
				api.mall.doQueryProduct({
						pageSize: 10,
						index: 0
					},
					res => {
						if(!res.res_content.length) {
							this.$message.error('查询产品为空');
						}
						this.gameProduct = res.res_content;
						if(this.gameProduct.length) {
							var pid, p;
							if(this.selectProduct.isEmpty) {
								this.gameProduct.forEach((n, i) => {
									if(+n.marketStatus === 1 && !p) {
										pid = n.quoteProductId;
										p = n;
										// this.tab = i;
										return;
									}
								});
								if(pid) {
									this.selectProduct = p;
								} else {
									this.selectProduct = res.res_content[0];
								}
								this.productValue = this.selectProduct.quoteProductCode

							}
						} else {
							this.selectProduct = {
								isEmpty: true
							};
						}

						if(typeof callback == 'function') callback();
					},
					err => {
						//						this.$message.error(err.msg);
					}
				);
			},
			initWebSocket(productCode) {
				const token = this.$store.state.user.token || null;
				const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
				this.gameWS = new RWebsocket(`ws://${location.host}/frontWeb/websocket/${token}`)
				this.gameWS.debug = process.env.NODE_ENV === 'production' ? false : true;
				this.gameWS.onopen = () => {
					this.websocketCommonSend(productCode);
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
			websocketCommonSend(productCode) {
				if(this.productDetail.tqProductCode) {
					//请求行情信息
					if(!productCode) {
						productCode = this.selectProduct.productCode
					}
					setTimeout(() => {
						this.gameWS.send("{type: '1',sub:'mk.all'}");
					}, 500);
				}
			},
			quotesInfoHandler(data) {
				let nq = data[data.length - 1];
				if(data) {
					//最新行情处理(右上角显示,持仓单)
					if(nq.dt == 0) {
						this.$set(this.newQuotes, nq.gc, nq.bnp);
						this.$set(this.r24HPrice, nq.gc, nq.hp);
						this.$set(this.r24LPrice, nq.gc, nq.lp);
					}
				}
			},
			//查询猜你喜欢的商品列表
			doQueryRecommendProduct() {
				api.mall.doQueryRecommendProduct({
						pageSize: 6,
						index: 0
					},
					res => {
						this.loveList = res.res_content;
					}, error => {
						error.msg ? this.$message.error(error.msg) : '';
					});
			},
			//查询商品参数列表
			doQueryProductParam(productId) {
				api.mall.doQueryProductParam({
						pageSize: 1000,
						index: 0,
						productId: productId
					},
					res => {
						this.productParamList = res.res_content;
					}, error => {
						error.msg ? this.$message.error(error.msg) : '';
					});
			},
			//跳转商品详情页面
			goProductDetail(obj) {
				this.doMallProductInfo(obj.productId)
				this.changeCatologTitle(obj.catalogPath)
				this.doQueryProductParam(obj.productId);
				this.doQueryAdviceRecord(obj.productId)
				//				this.$router.push({ name: 'productDetail', query:{productId:obj.productId,catalogPath:obj.catalogPath} });
				window.scrollTo(0, 0);
			},
			//待评价商品列表
			doQueryWaitForFeedback(orderId) {
				api.mall.doQueryWaitForFeedback({
					pageSize: 1000,
					index: 0
				}, res => {
					for(let i = 0; i < res.res_content.length; i++) {
						if(orderId == res.res_content[i].orderId) {
							this.showAssess = true;
							return
						} else {
							//							this.showAssess = false;
						}
					}
				})
			},
			//查询商品全部评价
			doQueryAllFeedbackByProductId(productId) {
				//				index? index:index = 1
				api.mall.doQueryAllFeedbackByProductId({
					pageSize: 1000,
					index: 0,
					productId: productId
				}, res => {
					if(!res.res_rowCount) {
						this.assessLevel = 0
					} else {
						this.assessLevel = res.res_rowCount;
						this.assessNum = res.res_rowCount;
					}

					let a = 0,
						b = 0,
						c = 0;
					for(let i = 0; i < res.res_content.length; i++) {
						res.res_content[i].customerId = res.res_content[i].customerId.slice(0, 6) + '****' + res.res_content[i].customerId.slice(7)
						if(res.res_content[i].feedbackLevel == '1') {
							a += 1;
						}
						if(res.res_content[i].feedbackLevel == '2') {
							b += 1;
						}
						if(res.res_content[i].feedbackLevel == '3') {
							c += 1;
						}

					}
					this.assessLevelOne = a;
					this.assessLevelTwo = b;
					this.assessLevelThree = c;
					this.allAssessList = res.res_content;
					this.oldAllAssessList = res.res_content;

				})
			},
			allListChange(val) {
				this.doQueryAllFeedbackByProductId(this.$route.query.productId, val)
			},
			//新增商品评价
			doAddFeedback() {
				if(!this.assessContent) {
					this.$message.error('请填写评价内容')
					return
				}
				api.mall.doAddFeedback({
					productId: this.$route.query.productId,
					orderId: this.$route.query.orderId,
					feedbackContent: encodeURI(encodeURI(this.assessContent)),
					feedbackStar: this.assessValue || 5,
					feedbackLevel: this.assessIndex || 1
				}, res => {
					this.$message.success(res.res_msg)
					this.doQueryWaitForFeedback(this.$route.query.orderId)
					this.doQueryAllFeedbackByProductId(this.$route.query.productId); //全部评价
				}, error => {

				})
			},
			//保留2位小数不四舍五入
			 numFilter(value) {
				let transformVal = Number(value).toFixed(3)
				let realVal = transformVal.substring(0, transformVal.length - 1)
				return Number(realVal) 
			},
			//跳转预付款
			toAdvance() {
				this.$router.push({
					name: 'advanceDetail',
					query: {
						productId: this.productDetail.productId,
						buyNum: this.orderNum,
						specs: this.formatIndex
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './Product';
</style>