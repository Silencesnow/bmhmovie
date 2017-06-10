<template>
<div>
	<m-header :title='m_title'></m-header>
	<div class="theaters">
		<scroll class="theater-list" :data_a="c_theaters">
			<ul>
				<li v-for="item in c_theaters" class="theater_info border-after-1px">
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
		<router-view></router-view>
	</div>
</div>  
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import {ERR_OK} from 'api/config'

export default {
	data() {
		return {
			c_theaters:[],
			m_title:'影院'
		}
	},
	created() {
		this._getTheaters()
	},
	methods: {
		selectSinger(singer){
			this.$router.push({
				path:`/singer/${singer.id}`
			})
			this.setSinger(singer)
		},
		_getTheaters() {
			this.$http.get('/api/theaters').then((response) => {
				response = response.body
				if(response.errno === ERR_OK) {
					this.c_theaters = response.data
				}
			})
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
</style>