<template>
<div>
	<m-header :title="title" :back="true" backPath="/user/order"></m-header>
	<div class="order-item">
		<scroll class="order" ref="scroll">
		<div>
			<div class="state"><i class="bg-mine_ic_sex_sel"></i>已完成</div>
			<div class="theater">
				<p class="title">{{show_tmp.cinema_title}}</p>
				<p class="address">{{show_tmp.address}}</p>
			</div>
			<div class="order-detail">
				<p class="num border-after-1px">订单号：XAN{{order_id}}</p>
				<span class="des">放映时间</span>
				<span class="con">{{show_tmp.show_date}}</span><br>
				<span class="des">位置</span>
				<span class="con">{{show_tmp.hall_name}}
				<span v-for="item in order_item.seatIds"> {{fromIdtoSeat(item)}}</span></span>
				<br>
				<span class="des">序列号</span>
				<span class="con">{{getSerialNum(order_id)}}</span>
				<br>
				<span class="des">取票码</span>
				<span class="con">{{getTicketCode()}}</span>
			</div>
			<div class="movie-info">
				<img :src="show_tmp.litpic" class="avatar">
				<div class="text">
					<h1>{{show_tmp.film_title}}</h1>
					<span class="count">数量：{{seatCount}}张</span>
				</div>
				<span class="price">￥{{show_tmp.sale_price-show_tmp.sale_fee}}</span>
			</div>
			<div class="pay">
				<span class="des">支付方式</span>
				<span class="con">在线支付</span>
			</div>
			<div class="order-info">
				<div class="total-price">
					<span class="des">影票总额</span>
					<span class="con">￥{{show_tmp.sale_price*seatCount}}</span>
				</div>
				<div class="fav-price">
					<span class="des">优惠金额</span>
					<span class="con">-￥{{show_tmp.sale_fee*seatCount}}</span>
				</div>
				<div class="total">
					<span class="des">订单总额</span>
					<span class="con">￥{{(show_tmp.sale_price-show_tmp.sale_fee)*seatCount}}</span>
				</div>
				<p class="order-time">下单时间：{{getTime(order_id)}}</p><br>
			</div>
			<div class="service">
				星美票务客服电话：<span class="tel">10049</span><br>
				<p class="time">工作时间：9:30-22:00</p>
			</div>
			<p class="remind">
				观影提示：<br>
				1、请尽量在影片开始前10分钟到达影院；<br>
				2、请到影院取票机区域或售票柜台输入取票码或扫描二维码取票观影；<br>
				3、如需退票，请在取票前拨打客服电话10049咨询。
			</p>
		</div>
		</scroll>
	</div>
</div>    
</template>

<script>
import {loadFromLocal} from "common/js/store.js"
import Scroll from 'base/scroll/scroll'
import MHeader from 'components/m-header/m-header.vue'
export default {
	data() {
		return {
			title:"订单详情",
			order_item:'',
			order_id:0,
			show_tmp:'',
			seatPlan:[],
			seatCount:''
		}
	},
	beforeRouteEnter(to,from,next) {
		next(vm => {
				vm.order_id=vm.$route.query.orderId
				vm._getLocalStorage()
				vm.$refs.scroll.scrollTo(0,0)
		})
	},
	created() {
		this._getSeatInfo()
	},
	methods: {
		getSerialNum(num) {
			if(num){
				num=num+''
				let i = num.slice(3)
				return '85'+i	
			}
		},
		getTicketCode() {
			let an = []
			for(let i = 0; i<6; i++){
				let j=Math.floor(Math.random()*10)
				an.push(j)
			}
			return an.join('')
		},
		fromIdtoSeat(id) {
			for(let i in this.seatPlan) {
				if(this.seatPlan[i].id===id) {
					let seat = this.seatPlan[i]
					let str=seat.row_name+'排'+seat.col_name+'座'
					return str
				}
			}
		},
		getTime(num) {
			// 把表示秒的字符串转为表示毫秒的数值
			let msInt = Number.parseInt(num*1000)
			return new Date(msInt).toLocaleString()
		},
		_getSeatInfo() {
			this.$http.get('/static/seatInfo.json').then((response) => {
				    response = response.body
					this.show_tmp = response.show_tmp
					this.seatPlan = response.seatplan
					this.order_id=this.$route.query.orderId
					this.$nextTick(() => {
						this._getLocalStorage()
					})
			})
		},
		_getLocalStorage() {
			this.order_item = loadFromLocal(this.order_id,"没找到存储信息")
			this.seatCount=this.order_item.seatIds.length
		}
	},
	components: {
		MHeader,
		Scroll
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.order-item
	position:fixed
	top:40px
	bottom:60px
	width:100%
	.order
		height:100%
		overflow:hidden
		background:$color-background-d
		.state
			padding:0 12px
			height:64px
			line-height:64px
			font-size:$font-size-medium-x
			color:$color-gray
			i
				display:inline-block
				margin:0 6px 6px 0
				vertical-align:middle
				zoom:0.5
		.theater
			padding:12px
			margin-bottom:12px
			background:#fff
			font-size:$font-size-medium
			.title
				margin-bottom:12px
			.address
				color:$color-gray-l
		.order-detail
			padding:12px
			margin-bottom:12px
			background:#fff
			line-height:32px
			font-size:$font-size-medium
			.num
				height:40px
				color:#111
				border-after-1px($color-gray-l)
			.des
				text-align:left
				color:$color-gray-l
			.con
				text-align:right
				float:right
				color:$color-gray-l
		.movie-info
			display:flex
			background:#fff
			padding:12px
			margin-bottom:12px
			font-size:$font-size-medium
			.avatar
				flex:0 0 43px
				width:43px
				height:65px
			.text
				margin-left:12px
				flex:1
				color:$color-gray-l
				h1
					color:#111
					font-weight:bold
					margin-bottom:36px
			.price
				float:right
				font-size:$font-size-small
				color:rgb(255,0,0)
		.pay
			padding:12px
			margin-bottom:12px
			font-size:$font-size-medium
			background:#fff
			.des
				font-weight:bold
			.con
				float:right
		.order-info
			padding:12px
			margin-bottom:12px
			background:#fff
			line-height:32px
			color:$color-gray-l
			font-size:$font-size-medium
			.con
				float:right
				color:rgb(255,0,0)
			.total
				color:#111
				line-height:60px
				font-weight:bold
			.order-time
				float:right
				font-size:$font-size-small
		.service
			padding:12px
			line-height:32px
			background:#fff
			font-size:$font-size-medium
			font-weight:bold
			span
				color:$color-theme
			.time
				color:$color-gray-l
		.remind
			padding:12px
			font-size:$font-size-small
			line-height:24px
</style>