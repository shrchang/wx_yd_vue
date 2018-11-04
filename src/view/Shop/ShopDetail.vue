<template>
	<div class="shopDetail-wrap page-wrap">
        <div class="shopDetail-top">
			<div class="top-block">
				<span><i class="iconfont icon-shangyiyehoutuifanhui-xianxingyuankuang" @click="$router.go(-1)"></i></span>
                <span>噼哩啪啦</span>
			</div>
		</div>
		<van-swipe :autoplay="3000">
			<van-swipe-item v-for="(item, index) in shopImages" :key="index">
				<img :src="item">
			</van-swipe-item>
		</van-swipe>

        <div class="shopDetal-header">
            <i class="iconfont icon-anjianfengexian"></i>
            <span>大学城轰趴基地</span>
            <i class="iconfont icon-fenxiang3"></i>
        </div>

        <van-tabs>
            <van-tab>
                <div slot="title">
                    <i class="iconfont icon-details"></i>详情
                </div>
                <div class="detail-content">
                    <span class="content-header">轰趴场地</span>
                    <div class="room-list">
                        <div>
                            <div class="room-item" v-for="item in roomList">
                                <img src="../../assets/images/shop/shop.jpg"/>
                                <span>{{item.roomName}}</span>
                            </div>
                        </div>
                    </div>
                    <span class="content-header">轰趴基地概况</span>
                    <div class="content-desc">
                        &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            大学城轰趴基地是一家集现代厨房、私人KTV、棋牌麻将、流行桌游、台球、室外垂钓、Xbox体感游戏、小霸王游戏机、室内高尔夫、乒乓球、室内篮球、私人影咖、露天烧烤、豪华双人大床等等为一体的高端私人别墅聚会场所。现在合肥拥有六家门店，遍布蜀山区、高新区、庐阳区、瑶海区、包河区，一体化聚会方式，不需转场，不用折腾，大众消费，为您每一次的欢聚轰趴助力。
                            <br></br>
                            <p>地址：广州番禺区大学城外环西路5号</p>
                            <p>地铁：4号线大学城南站A出口，步行15分钟到轰趴基地</p>
                            驾车：导航目的地至番禺大学城轰趴基地
                        </span>
                    </div>
                    <span class="content-header">娱乐项目</span>
                    <div class="content-desc">
                        <p>1、自动麻将桌</p>
                        <p>2、桌球、桌上足球、桌游（狼人杀、三国杀、UNO、真心话）</p>
                        <p>3、小霸王游戏机</p>
                        <p>4、KTV、体感游戏机、VR</p>
                        <p>5、打火锅、烧烤、自助煮饭</p>
                        <p>6、轰趴大厅、免费WIFI</p>
                    </div>
                    <span class="content-header">使用时间</span>
                    <div class="content-desc">
                        &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            每天分3个档期，分别为上午10点至下午3点；下午4点至晚上9点；晚上10点至次日早上8点；（如遇法定节假日，请咨询商家）
                        </span>
                    </div>
                    <span class="content-header">适宜人数</span>
                    <div class="content-desc">
                        &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            每个场地满足5~30人活动；若场次合起租用进行活动，可满足200人的集体活动。
                        </span>
                    </div>
                    <span class="content-header">套餐详情</span>
                    <div class="content-desc">
                        <p>场地基础套餐：包含1个场地，配备项目：1、2、3、6；（默认必选套餐，订场的基础服务项）</p>
                        <p>KTV套餐：包含KTV房间，享受K歌增值服务；</p>
                        <p>体感游戏套餐：包含体感游戏机与设备，享受体感游戏乐趣；</p>
                        <p>烧烤套餐：包含烧烤用具及食品；</p>
                        <p>自助煮饭套餐：包含做饭厨具与食材，可自助煮饭；</p>
                    </div>
                </div>
            </van-tab>
            <van-tab>
                <div slot="title">
                    <i class="iconfont icon-pingjia"></i>评价
                </div>
                <div class="detail-content">
                    <div class="comment-item" v-for="item in 10">
                        <div class="item-header">
                            <img src="../../assets/images/shop/shop.jpg"></img>
                            <span>余石先</span>
                            <span class="header-time">2018-01-01 09:10:11</span>
                        </div>
                        <p>大学城轰趴基地很舒适，很好玩。点赞！大学城轰趴基地很舒适，很好玩。点赞！大学城轰趴基地很舒适，很好玩。点赞！</p>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
        <van-goods-action>
            <van-goods-action-mini-btn icon="phone" text="电话" />
            <van-goods-action-mini-btn icon="chat" text="客服" />
            <van-goods-action-mini-btn icon="goods-collect" text="收藏" />
            <van-goods-action-big-btn text="立即预定" primary @click="showYd()" />
        </van-goods-action>
        <van-popup v-model="show" position="bottom" :overlay="true">
            <div class="yd">
                <div class="yd-header">
                    <span>场地预定</span>
                    <i class="iconfont icon-quxiao" @click="show=false"></i>
                </div>
                <div class="yd-content">
                    <div class="yd-left">
                        <p v-for="(rm,index) in roomList" @click="changRoom(rm,index)" :class="{'red':currentIndex == index}">{{rm.roomName}}</p>
                    </div>
                    <div class="yd-right">
                       <table>
                            <thead>
                                <tr>
                                    <th>日期</th>
                                    <th>时间段</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(rd,i) in roomList[this.currentIndex].roomDateVOs">
                                    <th>
                                        <span>{{rd.bookingDate}}</span>
                                        <span>（{{rd.weekStr}}）</span>
                                    </th>
                                    <th>
                                        <div v-for="(tm,j) in rd.configVOs" class="time-item">
                                            <span :class="{'selected':tm.status=='SELECTED','sold':tm.status =='SOLD','disabled':tm.status == 'DISABLE'}" @click="selectTime(tm,i,j)">{{tm.timeRange}}</span>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                       </table>
                    </div>
                </div>
                <div class="yd-btn">
                    <span>立即购买</span>
                </div>
            </div>
        </van-popup>
	</div>
</template>

<script>
	import api from "../../api/require";
    import * as types from "../../store/types";
    import { Popup } from 'vant';

	export default {
		components: {
		},
		data() {
            return {
                shopImages: [
                    require('../../assets/images/home/banner-1.png'),
                    require('../../assets/images/home/banner-2.png'),
                    require('../../assets/images/home/banner-3.jpg'),
                    require('../../assets/images/home/banner-4.jpg'),
                    require('../../assets/images/home/banner-5.jpg')
                ],
                show:false,
                roomList:[],
                dateList:[
                    {name:"10-31",week:'周三',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"11-1",week:'周四',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"11-2",week:'周五',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"11-2",week:'周五',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"11-2",week:'周五',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"11-2",week:'周五',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]},
                    {name:"10-31",week:'周六',timeList:[{id:"1",name:"10:00~15:00"},{id:"1",name:"16:00~21:00"},{id:"1",name:"22:00~08:00"}]}
                ],
                roomDateRangeList:[],
                currentIndex:0,
            }
		},
		watch: {
			
		},
		mounted() {
		},
		activated() {
			this.init();
		},
		deavtivated() {
			
		},
		computed: {
			
		},
		methods: {
            //查询商铺的内容 获取了商铺下面的场地
            init(){
                api.mall.queryRoomByShopId(this.$route.params.shopId,res=>{
                        this.roomList = res.data;
					},error=>{
						alert("获取失败：" + JSON.stringify(error));
					});
            },
			showYd(){
                this.show =true;
                //这里应该默认加载第一个数据
                this.changRoom(this.roomList[0],this.currentIndex);
            },
            selectTime(tm,i,j){
                //OK DISABLE SOLD
                console.log("i:"+i+",j:" + j);
                if(tm.status == 'OK'){//只有这个可以选择 其余的都不行的
                    this.roomList[this.currentIndex].roomDateVOs[i].configVOs[j].status='SELECTED';//将状态改了
                }else if(tm.status == 'SELECTED'){
                    this.roomList[this.currentIndex].roomDateVOs[i].configVOs[j].status='OK';
                }
            },
            //改变的时候
            changRoom(item,index){
                this.currentIndex = index;
                var roomId = item.id;
                if(item.roomDateVOs.length<1){
                    api.mall.queryRoomById(roomId,res=>{
                        this.roomList[index].roomDateVOs = res.data.roomDateVOs;
                    },error=>{
                            alert("获取失败：" + JSON.stringify(error));
                    });
                }
            }
		}
	};
</script>

<style lang="scss">
	@import "./ShopDetail";
</style>