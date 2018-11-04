<template>
	<div class="forgotLoginPwd-wrap page-wrap">
		<app-header title="忘记密码" v-on:clickLeft="returnBack"></app-header>
		
		<div class="forgotLoginPwd-center">
			<van-cell-group>
				<van-field v-model="userAccount" type="tel" label="手机号" placeholder="请输入手机号" />
				<van-field v-model="newPassword" type="password" label="新密码" placeholder="请输入新密码" />
				<van-field v-model="newPassword1" type="password" label="确认新密码" placeholder="请确认新密码" />
				<div class="code-block">
					<van-field v-model="verifyCode" type="tel" label="验证码" placeholder="请输入验证码" />
					<button type="primary" class="get-code-btn" @click="getVerifyCode" :loading="tradeBol" v-if="getSecond <= 0">获取短信验证码</button>
					<button type="primary" class="get-code-btn" @click="getVerifyCode" disabled v-else>{{ getSecond + 's后重发' }}</button>
				</div>
			</van-cell-group>

			<van-button type="danger" :loading="isLogining" @click="forgetPwded">确认</van-button>
		</div>
		
	</div>
</template>
<script>
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog } from 'vant';
	import api from '../../api/require';
	export default {
		components: {
			AppHeader
		},
		data() {
			return {
				userAccount: '',
				newPassword: '',
				newPassword1: '',
				verifyCode: '',
				getSecond: 0,
				tradeBol: false,
				isLogining: false
			}
		},
		deactivated() {
			this.userAccount = '';
			this.tradeBol = false;
			this.newPassword = '';
			this.newPassword1 = '';
			this.verifyCode = '';
			this.isLogining = false;
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			forgetPwded() {
				if(this.isLogining) return
				if(!this.userAccount) {
					Toast('请输入手机号码');
					return;
				}
	          	if( this.checkNumber() ) {
	          		Toast('请输入正确的手机号');
	          		return;
	          	}
	          	if(!this.newPassword) {
					Toast('请输入新密码');
					return
				}
				if(!this.newPassword1) {
					Toast('请确认新密码');
					return
				}
				if(this.newPassword!=this.newPassword1) {
					Toast('密码不一致');
					return
				}
				if(!this.verifyCode) {
					Toast('请输入验证码');
					return
				}
				this.isLogining = true
					api.user.forgetPwded({
                            'mobileNo': this.userAccount,
                            'pwd': this.newPassword,
                            'verCode': this.verifyCode,
                            'ipInfo': returnCitySN ? returnCitySN.cip : '',
                        },
                        response => {
                        	Dialog.alert({
								title: '提示',
								message: '找回密码成功'
							}).then(() => {
								this.$router.replace({name: 'login'});
									this.isLogining = false
                                    this.userAccount = '';
									this.tradeBol = false;
									this.newPassword = '';
									this.newPassword1 = '';
									this.showDec = false;
									this.verifyCode = '';
							})
                        },
                        error => {
                        	setTimeout(() => {
								this.isLogining = false;
							}, 1000)
                            error.msg ? Toast(error.msg) : '';
                        })
			},
			//检测手机号是否正确
			checkNumber() {
				let errMessage = false;
				let reg = /^1[3456789]\d{9}$/;
				if(!reg.test(this.userAccount)) {
					errMessage = true;
				}
				return errMessage;
			},
			//获取验证码
			getVerifyCode() {
				this.tradeBol = true;
				if(!this.checkNumber()) {
				api.user.sendVerCode({
						'mobileNo': this.userAccount,
						'type': '1'
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
			}
		}
	}
</script>

<style lang="scss">
	@import './Password';
</style>