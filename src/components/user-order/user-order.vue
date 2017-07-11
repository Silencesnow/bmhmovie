<template>
<transition name="slide">
	<div class="user-order">
	<scroll ref="scroll" class="user-order-scroll">
		<div>
		<m-header :title='title' :back="true" backPath="/user"></m-header>
		<div class="clear" @click="clear">清空本地存储</div>
		<ul class="order-list" v-if="judge(orderList)">
			<li 
				v-for="(item,index) in orderList" 
				@click="selectOrder(item,index)" 
				class="order">
				<div class="title border-after-1px">
					<span class="order-id">XAN{{index}}</span><br>
					<span class="time">{{getTime(index)}}</span>
				</div>
				<div class="content border-after-1px">
					<img :src="show_tmp.litpic" class="avatar">
					<div class="detail">
						<h1>{{show_tmp.film_title}}&nbsp{{item.seatIds.length}}张</h1>
						<p class="text">{{show_tmp.cinema_title}}<br>{{show_tmp.show_date}}<br>{{show_tmp.hall_name}}
						<span v-for="child in item.seatIds">
							{{fromIdtoSeat(child)}}
						</span>
						</p>
						<p class="price">总价：{{totalPrice(item.seatIds.length)}}元</p>
					</div>
				</div>
			</li>
		</ul>
		<div v-else class="remind">
			<img src="./no_order.png" alt="暂无订单" width="175" height="175">
			<div class="remind-text">您暂时没有订单哦~</div>
		</div>
		</div>
	</scroll>
	</div> 
</transition>   
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {loadFromLocal,clearLocalStorage} from "common/js/store.js"
import MHeader from 'components/m-header/m-header.vue'
export default {
	data() {
		return {
			title:"电影订单",
			orderList:{},
			show_tmp:'',
			seatPlan:[]
		}
	},
	created() {
		this._getSeatInfo()
		this._getLocalStorage()
	},
	beforeRouteEnter(to,from,next) {
		next(vm => {
				vm._getLocalStorage()
		})
	},
	watch: {
		orderList() {
			this.$nextTick(() => {
				this.$refs.scroll.refresh()
			})
		}
	},
	methods: {
		judge(obj){
			for(let i in obj){
				return true
			}
			return false
		},
		totalPrice(num) {
			let i = this.show_tmp.sale_price
			return i*num
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
		selectOrder(item,index) {
			this.$router.push({
				 path:'/user/order/order-item',
				 query:{orderId:index}
			})
		},
		clear() {
			clearLocalStorage()
			this.orderList={}
		},
		_getSeatInfo() {
			this.$http.get('/static/seatInfo.json').then((response) => {
				response = response.body
				this.show_tmp = response.show_tmp
				this.seatPlan = response.seatplan
			})
		},
		_getLocalStorage() {
			for(let i in window.localStorage) {
				this.$set(this.orderList,i,loadFromLocal(i,"没找到存储信息"))
			}
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
.slide-enter-active
	transition:all 0.3s
.slide-enter
	transform:translate3d(100%,0,0)
.user-order
	position:fixed
	top:0px
	width:100%
	bottom:60px
	background:$color-background-d
	.user-order-scroll
		height:100%
		overflow:hidden
		.clear
			font-size:$font-size-medium
			padding:12px
			color:$color-theme
			font-weight:bold
		.order-list
			padding:12px
			.order
				margin-bottom:12px
				background:#fff
				box-shadow:0 0 3px $color-gray-l
				.title
					padding:9px
					line-height:16px
					font-size:$font-size-small-s
					border-after-1px($color-gray-l)
					.order-id
						color:#111
					.time
						color:$color-gray-l
				.content
					display:flex
					padding:9px
					.avatar
						flex:0 0 72px
						width:72px
						height:100px
					.detail
						flex:1
						padding-left:9px
						h1
							margin-bottom:9px
							font-size:$font-size-medium
							font-weight:bold
						.text
							line-height:20px
							font-size:$font-size-medium
							color:$color-gray-l
						.price
							font-size:$font-size-medium
		.remind
			text-align:center
			img
				margin:60px 0 30px
			.remind-text
				font-size:$font-size-large
</style>