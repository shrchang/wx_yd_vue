<template>
	<div class="orderPay-wrap page-wrap">
		<app-header title="选择支付方式" v-on:clickLeft="returnBack"></app-header>

		<div class="orderpay-top">
			<p>需支付：<span class="price">¥ {{orderDetail.orderAmount | orderDetail(2)}}</span></p>
			<p>订单号：{{orderDetail.orderId}}</p>
		</div>

		<div class="orderPay-select">
			<van-radio-group v-model="typeIndex">
				<van-cell-group>
					<van-cell>
						<template slot="title">
							<span class="van-cell-text">余额支付 <span class="dec">(可用余额：{{money}})</span></span>
						</template>
						<van-radio :name="0" />
					</van-cell>
					<van-cell title="快捷支付" clickable @click="typeIndex = 1">
						<van-radio :name="1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</div>

		<div class="orderDetail-bg"></div>

		<div class="kBean-block">
			<p><span class="bold">我的金珠</span>：{{bean}}</p>
			<van-field v-model="kBean" @input="checkFormat(kBean)" :disabled="typeIndex==1?true:false" placeholder="请输入要抵扣的金珠" :error-message="beanError" />
		</div>

		<div class="maxKbean-block">
			(该订单最多抵扣{{maxKbean>bean?bean:maxKbean | numFilter(2)}}金珠)
		</div>

		<div class="orderPay-submit" @click="orderPay">
			确认支付 {{typeIndex==0?realOrderAmount:orderDetail.orderAmount}}
		</div>

		<van-dialog v-model="showPwd" show-cancel-button @confirm="orderSubmit">
			<p class="title">输入支付密码</p>
			<van-field type="password" v-model="payPwd" label="支付密码"   placeholder="请输入支付密码" />
			<p class="forgot"><span @click="$router.push('/modifyPayPwd')">忘记密码</span></p>
		</van-dialog>

		<div style="display:none;" id="hftx">
		</div>

	</div>
</template>

<script>
	import api from "../../api/require";
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast } from 'vant';

	let clickBol = true;
	export default {
		components: {
			AppHeader
		},
		data() {
			return {
				payType: ['余额支付', '快捷支付'],
				typeIndex: 0, //支付方式选择
				kBean: null, //抵扣的金珠
				payPwd: null, //支付密码
				beanError: null,
				loading: false,
				orderDetail: [],
				money: 0,
				point: 0,
				bean: 0,
				failCode: null,
				oldAmount: 0,
				realOrderAmount: 0, //实付金额
				maxKbean: 0, //金珠最多抵扣
				showPwd: false
				// payUrl:'',
				// cmd_id:'',
				// version:'',
				// mer_cust_id:'',
				// check_value:'',
			}
		},
		watch: {
			//			$route(to, from) {
			//				if(from.name == 'payResult'){
			//					if(this.orderDetail.length == 0) {
			//						this.$message.error('请勿重复提交！')
			//                         setTimeout(()=>{
			//								this.$router.push('/home')
			//						   },1000)
			//						}
			//					}
			//				}
		},
		mounted() {

		},
		activated() {
			window.scrollTo(0, 0);
			this.queryAccountBalance();
			console.log(this.$route.query.orderId)
			if(this.$route.query.orderId) {
				this.doQueryMallOrder()
			}
		},
		deactivated() {
			this.typeIndex = 0;
			this.kBean = null;
			this.payPwd = null;
			this.loading = false;
			this.orderDetail = [];
			this.failCode = null;
			this.oldAmount = 0;
			this.realOrderAmount = 0;
			this.maxKbean = 0;
			this.showPwd = false;
		},
		computed: {},
		watch: {
			kBean(value) {
				if(Number(value) > this.numFilter(this.maxKbean) || Number(value) > this.bean) {
					const temp = this.maxKbean > this.bean ? this.bean : this.numFilter(this.maxKbean)
					this.beanError = '最多抵扣' + temp + '金珠'
					this.failCode = 1;
				}
				let reg = /^\d+(\.\d+)?$/;
				if(value) {
					if(!reg.test(value)) {
						this.beanError = '请输入正确的数字';
						this.failCode = 2;
						return
					}
				}
				if(this.failCode == 1 || this.failCode == 2) return
				this.realOrderAmount = this.numFilter(this.oldAmount - Number(this.kBean))
			},
			typeIndex(val) {
				if(val == 1) {
					this.kBean = null
				}
			}
		},
		methods: {
			returnBack() {
				this.$router.go(1)
			},
			//订单详情
			doQueryMallOrder() {
				api.mall.doQueryMallOrder({
					orderId: this.$route.query.orderId
				}, res => {
					this.orderDetail = res.res_content[0];
					this.oldAmount = this.orderDetail.orderAmount;
					this.realOrderAmount = this.orderDetail.orderAmount;
					for(let i = 0; i < this.orderDetail.orderDetails.length; i++) {
						this.maxKbean += this.orderDetail.orderDetails[i].totalAmount * this.orderDetail.orderDetails[i].beanMaxRatio
					}
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
							} else if(obj.currency == '1') {
								this.point = obj.totalAmount;
							} else {
								this.bean = obj.totalAmount;
							}
						}
					},
					error => {
						error.msg ? Toast(error.msg) : '';
					});
			},
			//跳转订单详情
			toOrderDetail() {
				this.$router.push({
					name: 'myOrderDetail',
					query: {
						orderId: this.orderDetail.orderId
					}
				})
			},
			//保留2位小数不四舍五入
			 numFilter(value) {
				let transformVal = Number(value).toFixed(3)
				let realVal = transformVal.substring(0, transformVal.length - 1)
				return Number(realVal) 
			},
			//支付
			orderPay() {
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 1000)
				if(this.typeIndex == 0) {
					//余额支付
					if(this.failCode == 1) {
						const num = this.maxKbean > this.bean ? this.bean : this.numFilter(this.maxKbean)
						Toast('最多抵扣' + num + '金珠');
						return;
					}
					if(this.failCode == 3) {
						Toast('只能保留2位小数');
						return;
					}
					this.showPwd = true;
				} else if(this.typeIndex == 1) {
					//快捷支付
					api.mall.getPayInfo({
						orderId: this.orderDetail.orderId,
						amount: this.orderDetail.orderAmount,
						cmdId: 208,
						is_compensation_price: this.$route.query.compensation || null
					}, res => {
						var div = window.document.getElementById("hftx");
						div.innerHTML = "";
						var form = window.document.createElement("form");
						div.appendChild(form);
						var input1 = window.document.createElement("input");
						input1.setAttribute("name", "cmd_id");
						input1.setAttribute("value", res.res_content.cmd_id);
						form.appendChild(input1);
						var input2 = window.document.createElement("input");
						input2.setAttribute("name", "version");
						input2.setAttribute("value", res.res_content.version);
						form.appendChild(input2);
						var input3 = window.document.createElement("input");
						input3.setAttribute("name", "mer_cust_id");
						input3.setAttribute("value", res.res_content.mer_cust_id);
						form.appendChild(input3);
						var input4 = window.document.createElement("input");
						input4.setAttribute("name", "check_value");
						input4.setAttribute("value", res.res_content.check_value);
						form.appendChild(input4);
						form.setAttribute("method", "post");
						form.setAttribute("action", res.res_content.url + "");
						form.submit();
					}, error => {
						Toast(error.msg)
					})
				}
			},
			orderSubmit() {
				if(!this.payPwd) {
					Toast('请输入支付密码');
					return;
				}
				api.mall.doSystemAmountPay({
					orderId: this.orderDetail.orderId,
					amount: this.realOrderAmount,
					payPwd: this.payPwd,
					bean: this.kBean,
					beanOffsetAmount: this.kBean,
					is_compensation_price: this.$route.query.compensation || null
				}, res => {
					Toast.success('支付成功')
					this.loading = true;
					setTimeout(() => {
						this.loading = false
						this.$router.push({
							name: 'payResult',
							query: {
								orderId: this.orderDetail.orderId
							}
						})
					}, 500);
				}, error => {
					Toast(error.msg)
				})
			},
			checkFormat(num) {
				let str = num.toString();
				this.failCode = null;
				this.beanError = null;
				if(str.includes('.')) {
					if(str.split('.')[0].length > 9 || str.split('.')[1].length > 2) {
						this.beanError = '只能保留2位小数'
						this.failCode = 3;
						return false
					}
				}
				return true
			},

		}
	};
</script>

<style lang="scss">
	@import "./Order";
</style>