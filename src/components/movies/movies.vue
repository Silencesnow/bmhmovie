<template>
<div>
	<m-header></m-header>
	<div class="movies">
		<scroll ref="scroll"  :data_o="movies" class="movies-content">
			<div>
				<div class="slider-wrapper">
					<slider>
						<div v-for="item in banner_list">
							<a :href="item">
								<img class="needsclick" @load="loadImg" :src="item">
							</a>
						</div>
					</slider>	
				</div>
				<div class="movie-list">
					<div class="list-title">
						<a class="list-title-item border-after-1px" :class="flag?'active':'' "@click="onShow">正在热映</a>
						<a class="list-title-item border-after-1px" :class="flag?'':'active'" @click="upComing">即将上映</a>
					</div>
					<ul>
						<li v-for="item in flag?listOnShow:listUpComing" class="item border-after-1px" @click="selectMovie(item)">
							<div class="icon">
								<img width="75" height="100" v-lazy="item.litpic">
							</div>
							<div class="info">
								<h2 class="name" v-html="item.title"></h2>
								<div class="text">
									<span class="desc">{{item.description}}</span><span class="buy" v-if="flag&&!item.pre_sale">购票</span><span class="pre_buy" v-if="(!flag&&item.pre_sale)||(flag&&item.pre_sale)">预售</span>
								</div>
								<div class="score"><star :score="item.myscores"></star><span class="number">{{item.myscores}}</span></div>
							</div>
						</li>	
					</ul>
				</div>
			</div>
			<div class="loading-container" v-show="!listOnShow.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
	<router-view></router-view>
</div> 
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Star from 'base/star/star'
import MHeader from 'components/m-header/m-header.vue'
import {ERR_OK} from 'api/config'

export default {
	data() {
		return {
			movies: {},
			banner_list:[],
			listOnShow:[],
			listUpComing:[],
			flag:true
		}
	},
	methods: {
		onShow() {
			this.flag = true
		},
		upComing() {
			this.flag = false
		},
		selectMovie(movie) {
			this.$router.push({
				 path:'/movies/movie-detail',
				 query:{aid:movie.aid}
			})
		},
		_getMovies() {
			this.$http.get('/api/movies').then((response) => {
				response = response.body
				if(response.errno === ERR_OK) {
					this.movies = response.data
					this.banner_list = this.movies.banner_list
					this.listOnShow = this.movies.c_movies.listOnShow
					this.listUpComing = this.movies.c_movies.listUpComing
				}
			})
		},
		loadImg(){
			if(!this.checkLoaded){
				this.$refs.scroll.refresh()
				this.checkLoaded = true
			}
		}
	},
	components: {
		Slider,
		Scroll,
		Loading,
		MHeader,
		Star
	},
	created() {
		this._getMovies()
	}
}  
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
.movies
	position:fixed
	width:100%
	top:40px
	bottom:60px
	.movies-content
		height:100%
		overflow:hidden
		.slider-wrapper
			position:relative
			width:100%
			overflow:hidden
		.movie-list
			.list-title
				display:flex
				height:40px
				.list-title-item
					display:inline-block
					flex:1
					line-height:40px
					font-size:$font-size-medium
					text-align:center
					color:$color-gray
					border-after-1px($color-gray-l)
					&.active
						color:$color-theme
						border-none()
						border-bottom:3px solid $color-theme
			.item
				display:flex
				width:100%
				padding:12px
				box-sizing:border-box
				border-after-1px($color-gray-l)
				&:last-child
					border-none()
				.icon
					flex:0 0 75px
				.info
					display:flex
					flex-direction:column
					justify-content:center
					padding-left:12px
					flex:1
					line-height:20px
					overflow:hidden
					font-size:$font-size-medium
					.name
						margin-bottom:10px
						font-weight:bold
						color:$color-text
					.text
						display:flex
						flex:1
						.desc
							display:inline-block
							flex:1
							height:16px
							line-height:16px
							white-space: nowrap
							text-overflow: ellipsis
							vertical-align:top
							overflow:hidden
							color:$color-gray
						.buy,.pre_buy
							display:inline-block
							flex:0 0 35px
							width:35px
							padding:5px
							vertical-align:top
							height:16px
							line-height:16px
							border-radius:6px
							text-align:center
							&.buy
								color:$color-theme
								border:2px solid $color-theme
							&.pre_buy
								color:$color-theme-o
								border:2px solid $color-theme-o
					.score
						flex:1
						.star
							display:inline-block
						.number
							display:inline-block
							padding-left:5px
							color:$color-theme
							font-size:$font-size-small-s
		.loading-container
			position:absolute
			width:100%
			top:50%
			transform:translateY(-50%)
</style>