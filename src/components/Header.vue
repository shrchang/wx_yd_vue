<template>
    <header class="header">
        <div class="inner"  @click="scrollTop">
            <div class="header-left"  @click="$emit('clickLeft')">
                <slot name="goBack">
                    <span><i class="iconfont icon-xiangzuo"></i></span>
                </slot>
            </div>
            <div class="header-title" :style="`color:${tColor}`">
                <slot name="title">
                    <span>{{ title }}</span>
                </slot>
            </div>
            <div class="header-right" v-if="right" @click="$emit('clickRight')">
                <slot name="right">
                    <span><i class="iconfont" :class="`${icon}`"></i></span>
                </slot>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
        	scrollTop() {
        		window.scrollTo(0,0);
        	}
        },
        props: {
            left: {
                type: String
            },
            title: {
                type: String,
                default: '快乐投'
            },
            right: {
                type: Boolean,
                default: true
            },
            icon: {
            	type: String,
            },
            tColor: {
            	type: String,
                default: '#464646'
            },
        }
    }
</script>

<style lang="scss">
    @import '../assets/style/mixins';
    .header {
    	z-index:99999999;
        position: relative;
        color:#fff;
        @include size(100%, 1rem);
        
        .inner{position: fixed; left: 0; top: 0;width:100%; height:1rem;z-index:9999999;background: url(../assets/images/header.png);
        background-size: 104%;background-position: -14px -26px;background-attachment: fixed;background-repeat: no-repeat;
     /*   opacity: 0.6;*/

        }
        .header-left { 
            @include ct; 
            left: 10px;
            color: #fff; 
            font-size: 0.28rem;
            padding-left: 5px;
            .iconfont {
            	font-size: 0.4rem;
            	color: #fff;
            }
            /*&:after {
                position:absolute; 
                content:""; 
                left:0; 
                top:50%; 
                margin:-7px 0 0 -7px; 
                width:.23rem; height:.23rem; 
                border-width:2px 0 0 2px; 
                border-style:solid; 
                border-color:#464646; 
                -webkit-transform:rotate(-45deg); 
                transform:rotate(-45deg); 
            }*/
            &:active {
                opacity: .6;
            }
        }
        .header-title {
            position: absolute;
		    left: 40%;
            height: 100%; 
            line-height: 1rem;
            color: #fff!important; 
            font-size: 0.34rem;
            text-align: center;
            overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
        }
        .header-right {
            @include ct; 
            right: 10px;
            color: #000; 
            font-size: 16px; 
            padding-left: 5px;
            .iconfont {
            	margin-right: .17rem;
            	font-size: .4rem;
            	color: #fff;      	
            }
        }
    }
</style>