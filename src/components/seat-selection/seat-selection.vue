<template>
	<div class="seat-selection">
		<m-header :back='true'></m-header>
		<div class="header">
			<h1>{{show_tmp.film_title}}</h1>
			<div class="text">
				<span>{{show_tmp.show_date}}&nbsp&nbsp&nbsp</span>
				<span>{{show_tmp.language}}</span>
				<span>{{show_tmp.dimensional}}</span>
			</div>
		</div>
		<div class="content">
			<ul class="nav">
				<li v-for="item in navList" v-html="item"></li>
			</ul>
			<div class="display">
				<div class="hall_name" :class="'half'+detail.max_col"><div class="wrapper">{{show_tmp.hall_name}}银幕</div></div>
				<div class="des" :class="'half'+detail.max_col">银幕中央</div>
				<ul>
					<li
						v-for="item in navSeatPlan"
						class="single-seat" 
						:class="position(item.row,item.col)"
						@click="selectSeat(item)">
						<i :class="item.status===2?'bg-seat_orange':(item.status===1?'bg-seat_red':'bg-seat_white')"></i>
					</li>
				</ul>
			</div>
		</div>
		<div class="temp">
			<span><i class="bg-seat_white"></i>可选</span>
			<span><i class="bg-seat_orange"></i>已选</span>
			<span><i class="bg-seat_red"></i>已售</span>	
		</div>
		<ul class="selected" v-show="seatSelected">
			<li v-for="item in seatSelected">
				<i class="bg-btn_bg_seat_selected_left"></i><span class="text">{{item.row_name}}排{{item.col_name}}座</span><i class="bg-btn_bg_seat_selected_right"></i>
			</li>
		</ul>
		<transition name="remind">
			<div class="remind-wrapper" v-if="remindWords">
				<span class="remind">{{remindWords}}</span>
			</div>
		</transition>
		<div class="button" :class="{'active':seatSelected.length}" @click="submit(seatSelected,$event)">
			确认选座
		</div>
		<div class="submitPage" v-if="showFlag">
			<div class="text" @click="toUserOrder">提交成功！<br>
			查看订单：</div>
		</div>
	</div>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import {saveToLocal,loadFromLocal} from "common/js/store.js"
const MAXSEATNUM = 4
export default {
	data () {
		return {
			show_tmp :{},
			show_seq_no:'',
			detail:{
				"max_row":0
			},
			seatPlan:[],
			navSeatPlan:[],
			navList:[],
			seatSelected:[],
			seatSelectedId:[],
			remindWords:'',
			showFlag:false,
			newOrderId:''
		}
	},
	created() {
		this._getSeatInfo()
	},
	beforeRouteEnter(to,from,next) {
		next(vm => {
			vm.navSeatPlan=vm.mergeStorage()
		})
	},
	methods:{
		mergeStorage() {
			// 获取在localStorage中的座位id
			let arr=[]
			for(let i in window.localStorage) {
				let item =loadFromLocal(i,"没找到存储信息").seatIds
				for(let j in item){
					arr.push(item[j])
				}
			}
			// 将localStorage中的座位合并至seatPlan中
			let navSeatPlan=this.seatPlan
			for(let j in navSeatPlan){
				if(arr.indexOf(navSeatPlan[j].id)!==-1){
					navSeatPlan[j].status = 1
				}
			}
			return navSeatPlan
		},
		setOrderId() {
			let date = new Date()
			date = Math.floor(date.getTime()/1000)
			return date
		},
		toUserOrder() {
			this.showFlag = false
			this.newOrderId = this.setOrderId()
			this.$router.push({
				path:'/user/order/order-item',
				query:{orderId:this.newOrderId}
			})
			// 将已选座位设为选定状态
			// 获取座位id并存进localstorage
			for(let i in this.seatSelected) {
				this.seatSelected[i].status = 1
				this.seatSelectedId.push(this.seatSelected[i].id)
			}
			saveToLocal(this.newOrderId,this.show_seq_no,this.seatSelectedId)
			// 清空座位表
			this.seatSelected=[]
			this.seatSelectedId = []
		},
		submit(item,event) {
			this.showFlag = true
		},
		setRemindWords(text) {
			this.remindWords = text
			setTimeout(() => { this.remindWords = '' } ,2000)
		},
		seatRemove(item) {
			let len = this.seatSelected.length
			if(item.col_name === this.seatSelected[0].col_name) {
				this.seatSelected.splice(0,1)
				return true
			}else if(item.col_name === this.seatSelected[len-1].col_name) {
				this.seatSelected.pop()
				return true
			}
		},
		seatVetify(item) {
			let len = this.seatSelected.length
			// 四种状态,
			// 0是seatSelected不为空时，待添加座位位于不同排，不能添加
			// 1是seatSlected已满最大值，不能再添加
			// 2是seatSelected为空数组或者是待添加座位位于seatSelected末尾
			// 3是待添加座位位于seatSelected首端
			if(!len) {
				return 2
			}
			if(len === MAXSEATNUM) {
				return 1
			}
			if(item.row === this.seatSelected[0].row){
				if((this.seatSelected[0].col_name-item.col_name)===1) {
				// 比队列头部小1
					return 3
				} else if((item.col_name-this.seatSelected[len-1].col_name)===1){
				// 比队列尾部大1
					return 2
				}
			}
			return 0
		},
		selectSeat(item){
			if(!item.status) {
				let i = this.seatVetify(item)
				switch (i) {
					case 1: this.setRemindWords("最多只能选择"+MAXSEATNUM+"个")
						break
					case 2: this.seatSelected.push(item)
						item.status = 2
						break
					case 3: this.seatSelected.splice(0,0,item)
						item.status = 2
						break
					default: this.setRemindWords("请选择同排相邻的座位")
				}
			}else if(item.status === 2){
				if(this.seatRemove(item)){
					item.status = 0
				} else {
					this.setRemindWords("不能取消选择中间的座位！")
				}
			}
		},
		position(a,b) {
			let x = 'row'+a
			let y = 'col'+b
			return [x,y]
		},
		_getSeatInfo() {
			this.$http.get('/static/seatInfo.json').then((response) => {
				response = response.body
				this.show_seq_no = this.$route.query.aid
				this.show_tmp = response.show_tmp
				this.detail = response.detail
				this.seatPlan = response.seatplan
				this.navSeatPlan=this.mergeStorage()
				this._getNavList(this.detail.max_row)
			})
		},
		_getNavList(len) {
			this.navList =[]
			for(let i =0; i<len; i++) {
				this.navList.push(String.fromCharCode(65+i))
			}
			if(len === "14") {
				this.navList.splice(3,0,"&nbsp")
				this.navList.pop()
			}
		}
	},
	components: {
		MHeader
	}
}  
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable" 
@import "~common/stylus/mixin"

.seat-selection
	position:fixed
	top:0
	bottom:0
	width:100%
	background:$color-background
	z-index:10
	.header
		padding:12px 18px
		h1
			font-size:$font-size-medium-x
			font-weight:bold
			padding-bottom:18px
		.text
			font-size:$font-size-medium
			color:$color-gray
	.content
		position:relative
		height:375px
		width:100%
		overflow-x:scroll
		background:$color-background-d
		.nav
			position:fixed
			padding:4px
			top:165px
			text-align:center
			border-radius:12px
			color:#fff
			background:#7a7a7a
			z-index:5
			li
				line-height:20px
				height:20px
		.display
			position:relative
			.hall_name
				position:absolute
				margin-left:-20px
				top:0
				border-top:20px solid $color-gray-l
				border-left:6px solid transparent
				border-right:6px solid transparent
				width:110px
				.wrapper
					position:absolute
					top:-16px
					width:110px
					text-align:center
			.des
				position:absolute
				top:30px
				width:40px
				margin-left:15px
				font-size:$font-size-small-s
				background:$color-gray-l
				padding:5px
				border-radius:5px
			.single-seat
				position:absolute
				display:inline-block
				width:20px
				height:20px
				getRow(1..14)
				getCol(1..34)
				&:last-child
					padding-right:40px
				[class^=bg-seat]
					display:inline-block
					zoom:0.5
	.temp
		display:flex
		font-size:$font-size-small
		span
			display:inline-block
			flex:1
			margin-top:12px
			text-align:center
			[class^=bg-seat]
				display:inline-block
				margin-right:12px
				vertical-align:middle
				zoom:0.65
	.selected
		position:fixed
		bottom:100px
		font-size:0
		padding:12px 
		li
			display:inline-block
			padding-right:3px
			&:last-child
				padding-right:0
			i
				display:inline-block
				zoom:0.5
			.text
				display:inline-block
				vertical-align:top
				padding:3px 12px
				font-size:$font-size-small-s
				border-top:1px solid #c7c7c7
				border-bottom:1px solid #c7c7c7
	.remind-enter-active,.remind-leave-active
		transition:all 1s
	.remind-enter,.remind-leave-to
		opacity:0
	.remind-wrapper
		width:100%
		position:fixed
		bottom:75px
		text-align:center
		.remind
			display:inline-block
			padding:6px 20px
			background:$color-gray-l
			color:#fff
			font-size:$font-size-medium
			border-radius:20px
	.button
		position:fixed
		bottom:0
		width:100%
		height:74px
		box-sizing:border-box
		line-height:50px
		text-align:center
		border:12px solid $color-background
		color:#fff
		background:$color-gray-l
		font-size:$font-size-medium-x
		font-weight:bold
		&.active
			background:$color-theme
	.submitPage
		position:fixed
		height:100%
		top:0
		width:100%
		left:0
		background:$color-gray
		text-align:center
		z-index:99
		.text
			display:inline-block
			padding:12px 60px
			margin-top:300px
			line-height:20px
			background:#fff
			border-radius:5px
			font-weight:bold
			z-index:100
</style>