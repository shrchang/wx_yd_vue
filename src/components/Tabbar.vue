<template>
    <div class="footer">
        <div class="inner">
            <router-link  to="/home" tag="div" class="route">
                <i class="iconfont icon-shouye"></i>
                <p>首页</p>
            </router-link>
         
            <!-- <router-link  :to="{path:'/classify'}" tag="div" class="route">
                <i class="iconfont icon-classify"></i>
                <p>分类</p>
            </router-link> -->
            <router-link to="/classify" tag="div" class="route">
                <i class="iconfont icon-yingyongchengxu"></i>
                <p>场馆</p>
            </router-link>
            <router-link to="/self" tag="div" class="route">
                <i class="iconfont icon-yonghu"></i>
                <p>我的</p>
            </router-link>
        </div>
    </div>
</template>

<script>

    export default {
    	props: ['selecteIndex'],
        data() {
            return{

            }
        },
        activated() {
        }
    }
</script>

<style lang="scss">
    .footer {
        height:1rem;
        .inner{
            position:fixed;bottom: 0;left: 0;display: flex;
            flex-flow: row nowrap;justify-content: center;align-items: center;
            background-color:#42b197;width: 100%;height: 1.15rem;z-index: 999;border-top: 1px solid #c4c2c2;padding: 0.15rem;
            /*box-shadow: 3px 2px 20px #d2cece;*/
        }
        .icon{display: inline-block;width:0.37rem;height:0.32rem;background-size: 0.37rem auto;background-position: top center;}
        /*.i-home{background-image: url(../assets/images/bottom-home.png);}
        .i-strategy{background-image: url(../assets/images/bottom-strategy.png);}*/
        .i-gift{
          /*  position:relative;background-image: url(../assets/images/bottom-gift.png);*/
            &.hasTicket:after{
                content:'';display:block;position:absolute;right:-0.14rem;top:-0.06rem;width:.1rem;height:.1rem;background:#ff0000;border:.02rem solid #fff;border-radius:50%;
            }
        }
       /* .i-my{background-image: url(../assets/images/bottom-my.png);}*/
        .route {
            width: 100%;text-align: center;
            img{display:inline-block;width:.38rem;margin-bottom:.12rem;}
            .iconfont {color:#000;font-size: .43rem;}
            p{font-size:.247rem;color:#000;;line-height:.3rem;margin-top: 0.05rem;}
            &.router-link-active p,&.router-link-active .iconfont {
                color: #E80101;
            }
            &.router-link-active .icon {
                background-position: bottom center;
            }
        }
    }
</style>

