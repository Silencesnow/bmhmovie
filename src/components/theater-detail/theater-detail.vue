<template>
	<div class="theater-wrapper">
		<m-header :back='true' title="场次"></m-header>
		<div class="theater">
			<scroll ref="scroll" class="theater-detail" :data_o="theater">
				<div>
					<div class="theater_info">
						<div class="text border-after-1px">
							<span class="title">{{theaterInfo.title}}</span>
							<span class="score">{{theaterInfo.myscores}}分</span><br>
							<ul class="tags">
								<li class="tag" v-for="tag in theaterInfo.tags">{{tag}}</li>
							</ul>
						</div>
						<div class="address">
							<i class="bg-icon_adress2"></i>
							<p>{{theaterInfo.address}}</p>
							<i class="bg-icon_phone3"></i>
						</div>
					</div>
					<div class="movie-wrapper" ref="movieWrapper">
						<ul 
							class="movie-list" 
							ref="movieList"
							@touchstart="onTouchStart"
							@touchend.stop="onTouchEnd"
							>
							<li 
								v-for="(item,index) in movieShowing"
								class="movie-item"
								ref="movieItem"
								:class="{'current':index===currentIndex}">
								<img :src="item.litpic" class="pic">
							</li>
						</ul>
						<div class="background">
							<img src="./background.jpg">
						</div>
						<div class="triangle"></div>
					</div>
					<div class="movie-select" v-if="currentMovie">
						<div class="header">
							<div class="text">
								<span class="title">{{currentMovie.title}}</span>
								<span class="score">&nbsp&nbsp{{currentMovie.myscores}}分</span><br>
								<span class="runtime">片长：{{currentMovie.runtime}}分钟</span>
							</div>
							<i @click="selectMovie(currentMovie)" class="icon-chevron-thin-right"></i>
						</div>
						<div class="warning" >
							<i class="bg-ic_dd_sm"></i><span>温馨提示：影片开场后关闭在线售票！</span>
						</div>
						<div class="content">
							<ul>
								<li 
									v-for="(item,index) in currentMovie.showings"
									@click="setCurrentList(index)" 
									class="title" 
									:class="{'active':index === currentList}">
									{{getShowDay(index)}}
								</li>
							</ul>
							<ul class="time-list">
								<li v-for="(i,index) in currentMovie.showings[currentList]">
									<div class="info border-after-1px">
										<div class="time">
											<span class="s_time">{{i.s_time}}</span><br>
											<span class="e_time">{{i.e_time}}</span>
										</div>
										<div class="detail">
											<span class="language">{{i.language}}</span>
											<span class="di">{{i.dimensional}}</span><br>
											<span class="hall">{{i.hall_name}}</span>
										</div>
										<div class="price">
											<div v-if="i.in_activity">
												<span class="actual_price">￥{{i.activity.price}}</span>起<br>
												<span class="original_price">￥{{i.sale_price}}</span>
											</div>
											<div v-else class="actual_price">￥{{i.sale_price}}</div>
										</div>
										<div class="buy" @click="seatSelection(i)">购票</div>
										<i :class="i.status==='1'?'icon-chevron-thin-down':'icon-chevron-thin-up'" @click="foldActivity(i,$event)"></i>
									</div>
									<div class="activity border-after-1px" v-if="!i.status">
										<div v-if="i.in_activity" class="text">
											<span class="icon_text is_activity">特惠</span>
											<span class="text">{{i.activity.activity_name}}</span>
										</div>
										<div v-else  class="text">
											<span class="icon_text">活动优惠</span>
											<span>该场次没有活动哦</span>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</scroll>
		</div>
		<router-view></router-view>
		<unfinished :data="mo_data" :id="show_seq" :defaultData="defaultData"></unfinished>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import Scroll from 'base/scroll/scroll'
import MHeader from 'components/m-header/m-header'
import Unfinished from 'components/unfinished/unfinished'
import {format} from 'common/js/dom'
const EXAMPLEMOVIE = 	"0000023670"
const LISTWIDTH = '76'
export default {
	data() {
		return {
			theater:{},
			theaterInfo:{},
			movieShowing:[],
			currentIndex:'',
			currentList:'',
			mo_data:'',
			defaultData:'',
			moveIndex:0,
			show_seq:''
		}
	},
	props: {
		aid: {
			type:String,
			default:''
		}
	},
	computed: {
		currentMovie() {
			return this.movieShowing[this.currentIndex]
		},
		movieShowingIndex() {
			let arr = []
			for(let i in this.movieShowing) {
				arr.push(i)
			}
			return arr
		},
		showDay() {
			let k = []
			for(let i in this.currentMovie.showings){
				k.push(i+'')
			}
			return k
		}
	},
	created() {
		this._getTheater()
		this.touch={}
	},
	methods:{
		selectMovie(item) {
			this.$router.push({
				 path:'/movies/movie-detail',
				 query:{aid:item.aid}
			})
		},
		seatSelection(i) {
			if(i.show_seq_no!==EXAMPLEMOVIE){
				this.show_seq=i.show_seq_no
				this.mo_data="其他场次"
				this.defaultData="神奇女侠6月8日10点40场"
				setTimeout(() => {
					this.$router.push({
						path: '/theaters/theater-detail/seat-selection',
						query:{aid:EXAMPLEMOVIE}
					})
				},1500)
			}else {
				this.$router.push({
					path: '/theaters/theater-detail/seat-selection',
					query:{aid:EXAMPLEMOVIE}
				})
			}
		},
		onTouchStart(e) {
			let firstTouch = e.touches[0]
			this.touch.x1 = firstTouch.pageX
		},
		onTouchEnd(e) {
			let firstTouch = e.changedTouches[0]
			this.touch.x2 = firstTouch.pageX
			this.moveIndex =(this.touch.x2 -this.touch.x1)/LISTWIDTH|0
			this._scrollTo(this.movieShowingIndex.indexOf(this.currentIndex)-this.moveIndex)
		},
		_scrollTo(index) {
			let length = this.movieShowingIndex.length
			if(index>-1&&index<length){
				this.currentIndex=this.movieShowingIndex[index]
				this.movieScroll.scrollTo(-76*index,0)
				this.currentList=this._initItem(this.currentMovie.showings)
				this.$nextTick(() => {
					this.$refs.scroll.refresh()
				})
			}
		},
		foldActivity(i,event){
			if(i.status === "1"){
				i.status = ''
			} else {
			 	i.status = "1"
			}
			this.$nextTick(() => {
				this.$refs.scroll.refresh()
			})
		},
		setCurrentList(index,event) {
			this.currentList = index
			this.$nextTick(() => {
				this.$refs.scroll.refresh()
			})
		},
		getShowDay(time) {
			let i = format(time)
			if(i){
				return i
			}
		},
		_getTheater() {
			this.$http.get('/static/theaterDetail.json').then((response) => {
				response = response.body
				this.theater = response[this.$route.query.aid]
				this.theaterInfo = this.theater.theaterInfo
				this.movieShowing = this.theater.movie_showing
				if(this.aid){
					this.currentIndex = this.aid
				}else {
					this.currentIndex = this._initItem(this.movieShowing)
				}
				this.currentList = this._initItem(this.currentMovie.showings)
				this.$nextTick(() => {
					this._initMovies()
				})
			})
		},
		_initItem(list) {
			for(let i in list){
				return i
			}
		},
		_initMovies() {
		 	if(this.movieShowing) {
		 		let length = this.$refs.movieItem.length
		 		let liWidth = 76
		 		let width =liWidth*(length+4)
		 		this.$refs.movieList.style.width = width +'px'
		 		let cl=document.body.clientWidth
		 		let margin =(cl-liWidth)/2
		 		this.$refs.movieList.style.paddingLeft=margin+'px'
		 		this.$refs.movieList.style.paddingRight=margin+'px'
		 		this.$nextTick(() => {
		 			if(!this.movieScroll) {
		 				this.movieScroll = new BScroll(this.$refs.movieWrapper,{
		 					scrollX:true,
		 					scrollY:false,
		 					momentum:false,
		 					momentumLimitDistance:1,
		 					bounce:false,
		 					eventPassthrough:'vertical'
		 				})
		 			} else {
		 				this.movieScroll.refresh()
		 			}
		 		})
		 	}
		 }
	},
	components:{
		Scroll,
		MHeader,
		Unfinished
	}
}   
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable" 
@import "~common/stylus/mixin"
.theater-wrapper
	position:fixed
	top:0
	bottom:60px
	width:100%
	.theater
		position:fixed
		top:40px
		width:100%
		bottom:60px
		background:#fff
		.theater-detail
			height:100%
			overflow:hidden
			.theater_info
				.text
					padding:12px
					border-after-1px($color-gray-l)
					.title
						font-weight:bold
						padding-right:12px
					.score
						font-size:$font-size-small
						color:$color-theme
					.tags
						.tag
							display:inline-block
							margin:6px 3px 0 0
							padding:3px
							border:1px solid $color-theme
							border-radius:3px
							font-size:$font-size-small
							color:$color-theme
							&:first-child
								background:$color-theme
								color:#fff
				.address
					display:flex
					padding:12px
					.bg-icon_adress2
						display:inline-block
						margin-right:6px
						zoom:0.5
					p
						flex:1
						font-size:$font-size-small
						color:$color-gray
						border-right:1px solid $color-gray-l
					.bg-icon_phone3
						display:inline-block
						margin-left:12px
						zoom:0.5
			.movie-wrapper
				position:relative
				padding:5px 0 15px
				width:100%
				height:115px
				overflow:hidden
				white-space:nowrap
				.movie-list
					font-size:0
					.movie-item
						display:inline-block
						vertical-align:middle
						.pic
							margin:0 6px
							width:64px
							height:96px
						&.current
							.pic
								margin:0
								width:76px
								height:114px
				.background
					position:absolute
					left:0
					top:0
					width:100%
					height:100%
					z-index:-2
					filter:blur(20px)
					img
						width:100%
						height:100%
				.triangle
					position:absolute
					left:50%
					transform:translateX(-50%)
					bottom:0
					width:0
					height:0
					z-index:-1
					border-width:0 10px 10px
					border-style:solid
					border-color:transparent transparent #fff
			.movie-select
				.header
					padding:12px
					.text
						display:inline-block
						.title
							font-size:$font-size-medium-m
							font-weight:bold
						.score
							color:$color-theme
							font-size:$font-size-small
						.runtime
							display:inline-block
							padding:6px 0
							color:$color-gray
							font-size:$font-size-medium
					i
						display:inline-block
						float:right
						padding:12px 0
				.warning
					padding:6px 12px
					background:$color-background-d
					font-size:$font-size-small
					color:$color-gray
					i
						display:inline-block
						margin-right:12px
						vertical-align:bottom
						zoom:0.375
				.content
					position:relative
					.title
						display:inline-block
						width:33%
						height:40px
						text-align:center
						line-height:40px
						font-size:$font-size-medium
						font-weight:bold
						color:$color-gray
						&.active
							color:$color-theme
							border-bottom:2px solid $color-theme
					.time-list
						position:relative
						width:100%
						.info
							display:flex
							padding:12px
							margin-top:6px
							height:40px
							line-height:20px
							text-align:center
							border-after-1px($color-gray-l)
							.time
								flex:1
								text-align:left
								font-size:$font-size-medium-x	
								.e_time
									font-size:$font-size-small
									color:$color-gray
							.detail
								flex:1
								text-align:left
								font-size:$font-size-medium
								.hall
									font-size:$font-size-small
									color:$color-gray
							.price
								text-align:right
								font-size:$font-size-small
								width:70px
								.actual_price
									font-size:$font-size-medium-x
									color:$color-theme
								.original_price
									font-size:$font-size-small
									color:$color-gray
									text-decoration:line-through
							.buy
								padding:6px 12px
								margin:auto 6px auto 12px
								border:1px solid $color-theme
								border-radius:5px
								color:$color-theme
							i
								margin:auto 0
								padding:5px 0
								&.icon-chevron-thin-up
									color:$color-gray
								&.icon-chevron-thin-down
									color:$color-theme
						.activity
							background:$color-background-d
							font-size:$font-size-small
							line-height:30px
							border-after-1px($color-gray-l)
							&.show
								display:none
							&:after
								box-shadow:0 -2px 5px 1px $color-gray-l
							.text
								&:after
									box-shadow:0 2px 5px 0 $color-gray-l
								.icon_text
									padding:4px 3px
									margin:0 12px
									background:$color-theme
									color:#fff
									border-radius:3px
									&.is_activity
										background:rgb(255,0,0)
</style>