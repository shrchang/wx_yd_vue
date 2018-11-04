<template>
	<div class="home-wrap">
		<van-swipe :autoplay="3000">
			<van-swipe-item v-for="(item, index) in bannerImage" :key="index">
				<img :src="item">
			</van-swipe-item>
		</van-swipe>

		<!-- <div class="search" v-if="searchShow">
			<i class="iconfont icon-sousuo"></i>
			<input type="text"  v-model="keyWord"/>
			<span class="toSearch" @click="toSearch">查询</span>
		</div> -->

		<van-notice-bar
			text="充值优惠：会员卡充500送50，充1000送120，充2000送300"
			color="#000"
			:left-icon="noticeImg"
		 />

		<div class="home-help">
			<div class="dec">
				<div class="block">
					<div class="block1">
						<i class="iconfont icon-icon-test"></i>
					</div>
				</div>
				<p>积分商城</p>
			</div>
			<div class="dec">
				<div class="block">
					<div class="block1">
						<i class="iconfont icon-dalou1"></i>
					</div>
				</div>
				<p>任务中心</p>
			</div>
			<div class="dec">
				<div class="block">
					<div class="block1">
						<i class="iconfont icon-shuye"></i>
					</div>
				</div>
				<p>限时优惠</p>
			</div>
			<div class="dec">
				<div class="block">
					<div class="block1">
						<i class="iconfont icon-pingheng"></i>
					</div>
				</div>
				<p>预定说明</p>
			</div>
		</div>

		<div class="home-shop">
			<span>火热啪店</span>
		</div>
		<div v-for="item in 2" class="shop-list">
			<img src="../../assets/images/home/banner-2.png"/>
			<div>
				<p><span class="shop-name">大学城轰趴基地【{{item}}】</span> <span class="shop-price">￥{{item}}000</span></p>	
			</div>
			<div class="shop-address">
				<i class="iconfont icon-ditudaohang-"></i><span>广州市番禺区外环西路{{item}}号</span>
			</div>
		</div>
		<tabbar></tabbar>
	</div>
</template>

<script src="./Home.js"></script>
<style lang="scss">
	@import './Home';
</style>