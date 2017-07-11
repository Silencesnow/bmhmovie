<template>
<div>
	<div>
	<m-header :title='m_title'></m-header>
	<div class="theaters">
		<scroll class="theater-list" :data_a="f_theaters" v-if="f_theaters.length">
			<ul>
				<li 
					v-for="item in f_theaters" 
					@click="toTheaterDetail(item)" 
					class="theater_info border-after-1px">
					<div class="title">
						<span class="name">{{item.title}}</span>
						<span class="score" v-html="item.myscores"></span>
					</div>
					<div class="location">
						<i class="bg-icon_adress2"></i>
						<span class="address">{{item.address}}</span>
						<span class="distance">{{item.distance}}</span>
					</div>
					<div class="recent_events">
						<i class="bg-icon_time2"></i>
						<span class="text">近期场次</span>
						<ul>
							<li v-for="e_item in item.showing" class="e_item">{{e_item}}</li>
						</ul>
					</div>
				</li>
			</ul>
		</scroll>
		<div v-else class="remind">
			<img src="./empty_recommend.png" alt="暂无影院" width="175" height="175">
			<div class="remind-text">暂无影院播放</div>
		</div>
	</div>
	</div>
	<unfinished :data="thData" :defaultData="defaultData"></unfinished>
	<router-view></router-view>
</div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import Unfinished from 'components/unfinished/unfinished'
// 京基店的id
const EXAMPLEID = "109288"
const EXAMPLETITLE = "深圳京基IMAX店"
export default {
	data() {
		return {
			c_theaters:[],
			f_theaters:[],
			filter:'',
			thData:'',
			defaultData:''
		}
	},
	beforeRouteEnter(to,from,next) {
		next(vm => {
			if(vm.$route.query.id){
				let filter=vm.$route.query.id
				vm.f_theaters=vm.c_theaters.filter((item) => {
					return item.movielist.indexOf(filter)>-1
				})
			}else {
				vm.f_theaters=vm.c_theaters
			}
		})
	},
	created() {
		this._getTheaters()
	},
	computed: {
		m_title() {
			return this.$route.query.id?'选择影院':'影院'
		}
	},
	methods: {
		toTheaterDetail(theater) {
			if(theater.aid!==EXAMPLEID){
				this.thData=theater.title.split('-')[1]
				this.defaultData=EXAMPLETITLE
				setTimeout(() => {
					this.$router.push({
						path:'/theaters/theater-detail',
						query:{aid:EXAMPLEID}
					})
				},1500)
			}else {
				this.$router.push({
					path:'/theaters/theater-detail',
					query:{aid:EXAMPLEID}
				})
			}
		},
		_getTheaters() {
			this.$http.get('/static/theaters.json').then((response) => {
				this.c_theaters = response.body
				this.f_theaters = this.c_theaters
			})
		}
	},
	components: {
		MHeader,
		Scroll,
		Unfinished
	}
}    
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.theaters
	position:fixed
	top:40px
	bottom:60px
	width:100%
	.theater-list
		height:100%
		overflow:hidden
		.theater_info
			padding:12px
			font-size:$font-size-small
			border-after-1px($color-gray-l)
			&:last-child
				border-none()
			.title
				margin-bottom:6px
				font-size:$font-size-medium-x
				.name
					font-weight:700
				.score
					color:$color-theme
					float:right
			.location
				display:flex
				margin-bottom:6px
				.bg-icon_adress2
					display:inline-block
					margin-right:16px
					zoom:0.5
				.address,.distance
					display:inline-block
					line-height:16px
					color:$color-gray
					&.address
						flex:1
						white-space:nowrap
						overflow:hidden
						text-overflow:ellipsis
					&.distance
						padding-left:6px
			.recent_events
				.bg-icon_time2
					display:inline-block
					margin-right:16px
					zoom:0.5
					vertical-align:top
				.text,ul
					display:inline-block
					vertical-align:top
					color:$color-gray
					line-height:16px
					.e_item
						display:inline-block
	.remind
		text-align:center
		img
			margin:60px 0 30px
		.remind-text
			font-size:$font-size-large
</style>