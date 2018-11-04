<template>
	<div class="login-wrap page-wrap">
		<app-header title="商城登录" v-on:clickLeft="returnBack"></app-header>
		<form @submit.prevent="loginSubmit">
			<div class="login-center">
				<van-cell-group>
					<van-field v-model="userAccount" type="tel" label="手机号" placeholder="请输入手机号"/>
					<van-field v-model="userPassword" type="password" label="密码" placeholder="请输入密码" />
				</van-cell-group>
				
				<van-button  type="danger" :loading="isLogining" @click="loginSubmit">登录</van-button>
				<button @click.prevent="loginSubmit" style="display: none;"></button>
			</div>
		</form>
		
		<div class="login-link">
			<span @click="$router.push('register')">新用户注册</span>
			<span @click="$router.push('forgotLoginPwd')">忘记密码</span>
		</div>
	</div>
</template>
<script>
	import api from '../../api/require';
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast } from 'vant';
	export default {
		data() {
			return {
				userAccount: localStorage.getItem('bchAccount') ? localStorage.getItem('bchAccount') : '',
				userPassword: '',
				isLogining: false
			}
		},
		components: {
			AppHeader
		},
		activated() {},
		deactivated() {
			this.userPassword = '';
			this.isLogining = false;
		},
		methods: {
			returnBack() {
				this.$router.push('/')
			},
			loginSubmit() {
				if(this.isLogining) return
				if(!this.userAccount) {
					Toast('请输入手机号');
					return;
				}
				if(!this.userPassword) {
					Toast('请输入密码');
					return;
				}
				this.isLogining = true
				api.user.doLogin({
						'account': this.userAccount,
						'password': this.userPassword,
						'ip': typeof returnCitySN != "undefined" ? returnCitySN.cip : ''
					},
					response => {
						this.$store.commit(types.UPDATE_TOKEN, {
							token: response.res_content.token,
							updateTime: +new Date()
						});
						let toPath = this.$route.query.redirect;
						localStorage.setItem('bchAccount', this.userAccount);
						this.$store.dispatch(types.GET_USER_INFO);
						this.$store.dispatch(types.GET_ACCOUNT);
						this.isLogining = false;
						if (toPath) {
                            this.$router.replace({path: toPath})
                        } else {
                            this.$router.replace({path: '/home'});
                        }
					},
					error => {
						setTimeout(()=>{
							this.isLogining = false;
						},1000)
						
						if(!error) return
						if(error.statusCode == 504) {
							Toast("登录服务出错！")
						} else if(error.statusCode == 0) {
							Toast("登录超时,请重试")
						} else {
							Toast(error.msg)
						}
					})
			},
		}
	}
</script>

<style lang="scss">
	@import './Login';
</style>