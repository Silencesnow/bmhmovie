<template>
	<transition name="slide">
	<div class="theater">
		<m-header></m-header>
		<scroll ref="scroll" class="theater-detail">
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
					<ul class="movie-list" ref="movieList">
						<li v-for="(item,index) in movieShowing" @click="setCurrentIndex(item,$event)" class="movie-item">
							<img :src="item.litpic" class="pic" :class="{'current':currentAid===item.aid}">
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
						<i class="icon-chevron-thin-right"></i>
					</div>
					<div class="warning" >
						<i class="bg-ic_dd_sm"></i><span>温馨提示：影片开场后关闭在线售票！</span>
					</div>
					<ul class="content">
						<li v-for="(item,index) in currentMovie.showings" @click="setCurrentList(index)">
							<span class="title" :class="{'active':index === currentList}">{{getShowDay(index)}}</span>
							<ul v-if="index === currentList" class="time-list">
								<li v-for="i in item">
									<div class="info border-after-1px">
										<div class="time">
											<span class="s_time">{{i.s_time}}</span><br>
											<span class="e_time">{{i.e_time}}</span>
										</div>
										<div class="detail">
											<span class="language">{{i.language}}</span>
											<span class="di">{{i.dimensional}}</span><br>
											<span class="hall">{{i.hall_info.hall_name}}</span>
										</div>
										<div class="price">
											<div v-if="i.in_activity">
												<span class="actual_price">￥{{i.activity.price}}</span>起<br>
												<span class="original_price">￥{{i.sale_price}}</span>
											</div>
											<div v-else class="actual_price">{{i.sale_price}}</div>
										</div>
										<div class="buy">购票</div>
										<i class="icon-chevron-thin-up" @click="foldActivity(i,$event)"></i>
									</div>
									<div class="activity border-after-1px" v-if="!i.status">
										<div v-if="i.in_activity" class="border-before-1px">
											<span class="icon_text is_activity">特惠</span>
											<span class="text">{{i.activity.activity_name}}</span>
										</div>
										<div v-else class="border-before-1px">
											<span class="icon_text">活动优惠</span>
											<span>该场次没有活动哦</span>
										</div>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</scroll>
	</div>
	</transition>
</template>

<script>
import BScroll from 'better-scroll'
import Scroll from 'base/scroll/scroll'
import MHeader from 'components/m-header/m-header'
import {ERR_OK} from 'api/config'
import {format} from 'common/js/dom'
export default {
	data() {
		return {
			theater:{},
			theaterInfo:{},
			movieShowing:[],
			currentAid:'',
			currentIndex:0,
			currentList:''
		}
	},
	computed: {
		currentMovie() {
			return this.movieShowing[this.currentAid]
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
	},
	methods:{
		foldActivity(i,event){
			if(i.status === "1"){
				event.target.className = 'icon-chevron-thin-down'
				i.status = ''
			 } else {
			 	i.status = "1"
			 	event.target.className = 'icon-chevron-thin-up'
			 }
		},
		setCurrentList(index,event) {
			this.currentList = index
		},
		getShowDay(time) {
			let i = format(time)
			if(i){
				return i
			}
		},
		setCurrentIndex(item,event) {
			this.currentAid = item.aid
			console.log(1)
			this.movieScroll.scrollToElement(event.target,1000,-152)
		},
		_getTheater() {
			this.$http.get('/api/theaterDetail').then((response) => {
				response = response.body
				if(response.errno === ERR_OK) {
					this.theater = response.data[this.$route.query.title]
					this.theaterInfo = this.theater.theaterInfo
					this.movieShowing = this.theater.movie_showing
					if(!this.currentAid){
						this.currentAid = this.movieShowing.default
						}
					}					
					for (let i in this.currentMovie.showings){
						if(!this.currentList){
						this.currentList = i
						} else break
					}
					this.$nextTick(() => {
						this._initMovies()
					})
			})
		},
		_initCurrentAid() {
			
		},
		_initMovies() {
		 	if(this.movieShowing) {
		 		let length = 0
		 		/* eslint-disable no-unused-vars */
		 		for (let i in this.movieShowing){
		 			length++
		 		}
		 		let picWidth = 64
		 		let margin = 12
		 		let width =(picWidth + margin)*(length+4) - margin+12
		 		this.$refs.movieList.style.width = width +'px'
		 		this.$nextTick(() => {
		 			if(!this.movieScroll) {
		 				this.movieScroll = new BScroll(this.$refs.movieWrapper,{
		 					scrollX:true,
		 					momentum:false,
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
		MHeader
	}
}   
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable" 
@import "~common/stylus/mixin" 
.slide-enter-active,.slide-leave-active
	transition:all 0.3s
.slide-enter,.slide-leave-to
	transform:translate3d(100%,0,0)
.theater
	position:fixed
	top:0
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
			padding:5px 10px 15px
			width:100%
			height:115px
			overflow:hidden
			white-space:nowrap
			.movie-list
				font-size:0
				.movie-item
					display:inline-block
					margin-right:12px
					vertical-align:middle
					&:first-child
						margin-left:152px
					&:last-child
						margin-right:152px
					.pic
						width:64px
						height:96px
						&.current
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
				bottom:0
				width:0
				height:0
				margin:0 -20px
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
					float:left
					width:125px
					height:50px
					text-align:center
					line-height:50px
					font-size:$font-size-medium-x
					color:$color-gray
					&.active
						color:$color-theme
						border-bottom:2px solid $color-theme
				.time-list
					position:absolute
					top:50px
					width:100%
					left:0
					.info
						display:flex
						padding:12px
						height:40px
						line-height:20px
						text-align:center
						border-after-1px($color-gray-l)
						.time
							font-size:$font-size-medium-x	
							.e_time
								font-size:$font-size-small
								color:$color-gray
						.detail
							font-size:$font-size-medium
							.hall
								font-size:$font-size-small
								color:$color-gray
						.price
							text-align:right
							font-size:$font-size-medium
							.actual_price
								font-size:$font-size-medium-x
								color:$color-theme
							.original_price
								font-size:$font-size-small
								color:$color-gray
								text-decoration:line-through
						.buy
							padding:6px 12px
							margin:auto 12px
							border:1px solid $color-theme
							border-radius:5px
							color:$color-theme
						i
							margin:auto 0
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
							box-shadow:0 -2px 10px 1px $color-gray-l
						.border-before-1px
							border-before-1px($color-gray-l)
							&:after
								box-shadow:0 2px 10px 0 $color-gray-l
							.icon_text
								padding:4px 3px
								margin:0 12px
								background:$color-theme
								color:#fff
								border-radius:3px
								&.is_activity
									background:rgb(255,0,0)
</style>