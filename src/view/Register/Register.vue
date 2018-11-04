<template>
	<div class="register-wrap page-wrap">
		<app-header title="新用户注册" v-on:clickLeft="returnBack"></app-header>

		<div class="resister-center">
			<van-cell-group>
				<van-field v-model="userAccount" type="tel" label="手机号" placeholder="请输入手机号" />
				<van-field v-model="userPassword" type="password" label="密码" placeholder="请输入密码" />
				<van-field v-model="userPassword1" type="password" label="确认密码" placeholder="请确认密码" />
				<div class="code-block">
					<van-field v-model="verifyCode" type="tel" label="验证码" placeholder="请输入验证码" />
					<button type="primary" class="get-code-btn" @click="getVerifyCode" :loading="tradeBol" v-if="getSecond <= 0">获取短信验证码</button>
					<button type="primary" class="get-code-btn" @click="getVerifyCode" disabled v-else>{{ getSecond + 's后重发' }}</button>
				</div>

				<van-field v-model="inviteCode" type="tel" label="推荐码" placeholder="请输入推荐码" />
			</van-cell-group>

			<div class="agree">
				<van-checkbox v-model="checked">我已阅读并同意</van-checkbox>
				<span class="blue" @click="dialogVisible=true">《网络服务和使用协议》</span>
			</div>
			<van-button type="danger" :loading="isLogining" @click="toRegister">注册</van-button>
		</div>

		<van-popup v-model="dialogVisible">
			<div class="title">网络服务和使用协议</div>
			<div class="content" v-html="risk"></div>
			<div class="read">
				<van-button type="danger" @click="dialogVisible=false,checked=true">我已阅读并同意</van-button>
			</div>
		</van-popup>

	</div>
</template>
<script>
	import api from '../../api/require';
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog } from 'vant';
	import risk from './Risk.js';
	export default {
		components: {
			AppHeader
		},
		data() {
			return {
				checked: true,
				dialogVisible: false,
				risk: risk,
				userAccount: '',
				userIdentifyCode: '',
				userPassword: '',
				userPassword1: '',
				verifyCode: '',
				getSecond: 0,
				inviteCode: '',
				tradeBol: false,
				isLogining: false,
			}
		},
		mounted() {
		},
		activated() {
			if(this.$route.query.inviteCode) {
				this.inviteCode = this.$route.query.inviteCode;
			}
		},
		deactivated() {
			this.dialogVisible = false;
			this.userAccount = '';
			this.userPassword = '';
			this.userPassword1 = '';
			this.tradeBol = false;
			this.isLogining = false;
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			toRegister() {
				if(this.isLogining) return
				if(!this.userAccount) {
					Toast('请输入手机号');
					return;
				}
				if(this.checkNumber()) {
					Toast('请输入正确的手机号');
					return;
				}
				if(!this.userPassword) {
					Toast('请输入密码');
					return;
				}
				if(!this.userPassword1) {
					Toast('请确认密码');
					return;
				}
				if(this.userPassword != this.userPassword1) {
					Toast('密码不一致');
					return;
				}
				if(!this.verifyCode) {
					Toast('请输入验证码');
					return;
				}
				this.isLogining = true
				//              if( !this.inviteCode ) {
				//                  Toast('请输入验证码推荐码');
				//                  return;
				//              }

				if(this.checked) {
					api.user.doRegister({
							'mobileNo': this.userAccount,
							'pwd': this.userPassword,
							'verCode': this.verifyCode,
							'inviteCode': this.inviteCode,
							'ipInfo': returnCitySN ? returnCitySN.cip : '',
							'regSrc': 1
						},
						response => {
							Dialog.alert({
								title: '提示',
								message: '注册成功'
							}).then(() => {
								this.$router.replace({
									name: 'login'
								});
								this.isLogining = false
								this.userAccount = ''
								this.verifyCode = ''
								this.inviteCode = ''
								this.userPassword = ''
								this.userPassword1 = ''
							})
						},
						error => {
							error.msg ? Toast(error.msg) : '';
							setTimeout(() => {
								this.isLogining = false;
							}, 1000)
						})
				} else {
					Toast('没有同意网络服务和使用协议');
					this.isLogining = false
				}
			},
			//获取验证码
			getVerifyCode() {
				if(!this.checkNumber()) {
					this.tradeBol = true;
					api.user.sendVerCode({
							'mobileNo': this.userAccount,
							'type': '0'
						},
						response => {
							var localTime = new Date().getTime();
							var intervalTime = 120;
							this.getSecond = intervalTime;
							var timer = setInterval(() => {
								this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
								if(this.getSecond <= 0) {
									clearInterval(timer);
								}
							}, 1000)
							Toast('发送成功')
							setTimeout(() => {
								this.tradeBol = false;
							}, 600)
						},
						error => {
							setTimeout(() => {
								this.tradeBol = false;
							}, 600)
							error.msg ? Toast(error.msg) : '';
						})
				} else {
					Toast("请输入正确的手机号码！")
				}
			},
			//检测手机号是否正确
			checkNumber() {
				let errMessage = false;
				let reg = /^1[3456789]\d{9}$/;
				if(!reg.test(this.userAccount)) {
					errMessage = true;
				}
				return errMessage;
			}
		}
	}
</script>

<style lang="scss">
	@import '../Login/Login';
</style>