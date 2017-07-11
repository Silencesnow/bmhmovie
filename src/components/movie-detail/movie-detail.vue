<template>
	<transition name="slide">
	<div class="movie">
		<scroll ref="scroll" class="movie-detail" :data_o='movie'>
			<div>
				<div class="content-wrapper">
					<i class="icon-chevron-thin-left" @click="backToPre"></i>
					<i class="bg-film_share"></i>
					<br>
					<div class="content">
						<img :src="movie.litpic" class="avatar">
						<div class="content-detail">
							<h1 class="title">{{movie.title}}</h1>
							<div class="star-wrapper">
								<star :score="movie.myscores"></star>
								<span v-html="movie.myscores" class="text"></span>
							</div>
							<ul>
								<li v-for="item in movie_info" class="item_info">
									<span>{{item.title}}: {{item.content}}</span>
									<span v-if="item.ex">{{item.ex}}</span>
								</li>
							</ul>
						</div>
					</div>
					<div class="background">
	      				<img :src="movie.litpic" width="100%" height="100%">
	    			</div>
				</div>
				<div class="buy" @click="toTheaters"><span :class="onShow?'enable':'disable'">选座购票</span></div>
				<div class="detail border-after-1px" ref="detail">
					<span class="title">导演：</span><span class="director">{{movie.director}}</span><br>
					<span class="title">主演：</span><span class="actors">{{movie.actors}}</span><br>
					<span class="title">剧情：</span>
					<p class="description  ellipsis" ref="des">{{movie.description}}</p>
					<div class="icon" @click="fold_spread">
						<i :class="fold?'icon-chevron-thin-down':'icon-chevron-thin-up'"></i>
					</div>
				</div>
				<div class="covers">
					<h1 class="title">预告片/剧照</h1>
					<div class="pic-wrapper" ref="picWrapper">
						<ul class="pic-list" ref="picList">
							<li v-for="item in movie.covers" class="pic-item">
								<img :src="item" class="pic">
							</li>
						</ul>
					</div>
				</div>
			</div>
		</scroll>
	</div>
	</transition>
</template>

<script>
import BScroll from 'better-scroll'
import Scroll from 'base/scroll/scroll'
import Star from 'base/star/star'
export default {
	data() {
		return {
			movie:{},
			movie_info:[],
			fold:'true',
			detail_height:0
		}
	},
	props:{
		onShow:{
			type:Boolean,
			default:true
		}
	},
	beforeRouteEnter(to,from,next) {
		next(vm => {
				vm._getMovie()
		})
	},
	created() {
		this._getMovie()
	},
	methods:{
		toTheaters(event) {
			if(this.onShow){
				let i=this.$route.query.aid
				this.$router.push({
					path: '/theaters',
					query:{id:i}
				})
			}
		},
		fold_spread() {
			if(this.fold) {
				this.$refs.des.classList.remove('ellipsis')
			} else {
				this.$refs.des.classList.add('ellipsis')
			}
			this.$refs.scroll.refresh()
			this.fold =!this.fold
		},
		backToPre() {
			this.$router.back()
		},
		_getMovie() {
			this.$http.get('/static/movieDetail.json').then((response) => {
					this.movie = response.body[this.$route.query.aid]
					this.$nextTick(() => {
						this._movie_info_init()
						this._initPics()
					})
			})
		},
		_movie_info_init() {
			this.movie_info = [
				{"title":"类型","content":this.movie.sort},
				{"title":"片长","content":this.movie.runtime,"ex":"分钟"},
				{"title":"上映","content":this.movie.show_date_h5}
			]
			return this.movie_info
		},
		_initPics() {
			if(this.movie.covers) {
				let picWidth = 100
				let margin = 12
				let width =(picWidth + margin)*this.movie.covers.length - margin
				this.$refs.picList.style.width = width +'px'
				this.$nextTick(() => {
					if(!this.picScroll) {
						this.picScroll = new BScroll(this.$refs.picWrapper,{
							scrollX:true,
							eventPassthrough:'vertical'
						})
					} else {
						this.picScroll.refresh()
					}
				})
			}
		}
	},
	components:{
		Star,
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
.movie
	position:fixed
	top:0
	width:100%
	bottom:60px
	background:#fff
	.movie-detail
		height:100%
		overflow:hidden
		.content-wrapper
			position:relative
			height:240px
			padding:12px
			box-sizing:border-box
			background: rgba(7, 17, 27, 0.1)
			[class^=icon-chevron]
				color:#fff
				zoom:1.5
			[class^=bg]
				float:right
				zoom:0.5
			.content
				display:flex
				margin-top:20px
				color:#fff
				.avatar
					width:100px
					height:170px
				.content-detail
					margin-left:18px
					.title
						margin:16px 0 40px 0
						font-size:$font-size-medium-x
						font-weight:bold
					.star-wrapper
						display:flex
						margin-bottom:18px
						.text
							margin-left:12px
							font-size:$font-size-small
							color:$color-theme-l
					.item_info
						font-size:$font-size-small
						margin-bottom:12px
			.background
				position:absolute
				top:0
				left:0
				width:100%
				height:100%
				z-index:-1
				filter: blur(20px)
		.buy
			background:#fff
			border-top:12px solid #fff
			span
				display:block
				height:48px
				margin:0 12px
				border-radius:5px
				text-align:center
				line-height:48px
				font-size:$font-size-medium-x
				color:#fff
				&.enable
					background:$color-theme-l
				&.disable
					background:$color-gray-l
		.detail
			padding:12px 12px 6px
			font-size:$font-size-medium
			line-height:20px
			color:$color-gray
			border-after-1px($color-gray-l)
			.title
				font-weight:bold
				color:#111
			.description
				width:100%
				margin-bottom:12px
				transition:all 3s
			.ellipsis
				overflow:hidden
				text-overflow: ellipsis
				display:-webkit-box
				-webkit-line-clamp:2
				-webkit-box-orient:vertical	
			.icon
				text-align:center
				i
					font-weight:bold
					zoom:1.5
					color:$color-gray
		.covers
			padding:12px
			.title
				padding-bottom:12px
				font-size:$font-size-medium
				font-weight:bold
			.pic-wrapper
				width:100%
				overflow:hidden
				white-space:nowrap
				.pic-list
					font-size:0
					.pic-item
						display:inline-block
						margin-right:12px
						.pic
							width:100px
							height:100px
</style>