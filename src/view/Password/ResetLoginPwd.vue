<template>

    <div class="page-login">
        <div class="login-wrap">
            <div class="login-bg"></div>
            <div class="login-form">
                <!-- 头 -->
                <div class="login-form-top">
                    <span class="iconfont icon-edit"></span>
                </div>
                <div class="title">修改密码</div>
                <!-- 登录 -->
                <form id="login-form" @submit.prevent="foundSubmit">
                    <div class="form-input-box">
                        <div class="input-group">
                            <div class="input-group-addon">旧密码</div>
                            <input type="password" class="form-control" placeholder="请输入旧密码" v-model.trim="oldPassword">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">新密码</div>
                            <input type="password" class="form-control" placeholder="请输入新密码" v-model.trim="newPassword">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">确认密码</div>
                            <input type="password" class="form-control" placeholder="与上述密码一致" v-model.trim="newPassword1">
                        </div>
                    </div>
                    <div class="form-submit">
                        <button class="btn" @click.prevent="foundSubmit">确定</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
    import api from '../../api/require';
    import * as types from '../../store/types';
    export default {
        data() {
            return {
                oldPassword: '',
                newPassword: '',
                newPassword1: ''
            }
        },
        components: {},
        deactivated(){
            this.oldPassword = this.newPassword = this.newPassword1 = ''
        },
        methods: {
            //提交
            foundSubmit() {
                if( !this.oldPassword ) {
                    this.$dialog.alert('请输入旧密码！');
                    return;
                }
                if( !this.newPassword || !this.newPassword1 ) {
                    this.$dialog.alert('请输入新密码！');
                    return;
                }
                if( this.newPassword != this.newPassword1 ) {
                    this.$dialog.alert('两次输入密码不一致！');
                    return;
                }

                //密码
                api.user.resetPwded({
                    oldPwd: this.oldPassword,
                    pwd: this.newPassword
                }, response => {
                    this.$dialog.alert("密码修改成功，请重新登录", () => {
                        this.$router.replace({"name":"login"});
                    })
                }, error=>{
                    error.msg ? this.$dialog.alert(error.msg) : '';
                })
            }
        }
    }
</script>
<style lang="scss">
    @import '../Login/Login';
</style>