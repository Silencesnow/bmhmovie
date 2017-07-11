<template>
	<div class="city-check">
		<m-header :title="title" :back="true"></m-header>
		<div class="search"><i class="ic_search"></i>
			<input type="text" v-model="search" placeholder="输入城市的中文名称">
			<i v-if="search" class="cancel" @click="clearInput"></i>
		</div>
		<div class="city">
		<scroll
			class="citylist" 
			ref="citylist" 
			:data_a="computedList" 
			@scroll="scroll" 
			:listen-scroll="listenScroll"
			:probeType="probeType">
			<div>
				<div class="current-city border-after-1px" ref="currentCity" v-show="!search">
					<span class="current-title">当前定位城市</span>
					<span class="current">{{city}}</span>
				</div>
				<div class="hot-city" ref="hotCity" v-show="!search">
					<p class="title">热门城市</p>
					<ul class="hot border-after-1px">
						<li v-for="item in cities.hot_city" class="hot-city" @click="unfinished(item.name)">{{item.name}}</li>
					</ul>
				</div>
				<p class="title" ref="allCity" v-show="!search">全部城市</p>
				<ul class="all" v-if="computedList.length">
					<li v-for="(group,index) in computedList" ref="listgroup">
						<p class="cha">{{group[0].character}}</p>
						<ul>
							<li v-for="item in group" class="common-city" @click="unfinished(item.name)">{{item.name}}</li>
						</ul>
					</li>
				</ul>
				<div class="remind" v-else>暂时没有找到相关的城市</div>
			</div>
		</scroll>
		</div>
		<ul 
			class="list-shortcut" 
			@touchstart="onShortcutTouchStart" 
			@touchmove.stop.prevent="onShortcutTouchMove" 
			ref="listshortcut"
			v-show="!search">
			<li v-for="(item,index) in shortcutList" class="item" :data-index="index" :class="{'current':currentIndex===index}">{{item}}</li>
		</ul>
		<div class="list-fixed" v-show="fixedTitle&&!search" ref="fixed">
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<div class="show-current-index" v-if="currentIndexOnshow">
			<span>{{currentIndexOnshow}}</span>
		</div>
		<unfinished :data="unData"></unfinished>
	</div> 
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MHeader from 'components/m-header/m-header'
import Unfinished from 'components/unfinished/unfinished'
import {getData} from 'common/js/dom.js'
const LISTHEAD = ["定位","热门","全部"]
const DEFAULTCITY = '深圳'
export default {
	data() {
		return {
			title:'选择目的城市',
			search:'',
			cities:{},
			listHeight:[],
			scrollY:-1,
			currentIndex:0,
			diff:0,
			listenScroll:true,
			probeType:3,
			currentIndexOnshow:'',
			moveIndex:'',
			timer:'',
			unData:''
		}
	},
	props: {
		city:{
			type:String,
			default:'深圳'
		}
	},
	created() {
		this.touch={}
		this._getCityList()
	},
	computed: {
		computedList() {
			let arr = []
			let vm = this
			for(let group in this.cities.city_character){
				let i = this.cities.city_character[group].filter(function(item) {
					return item.name.indexOf(vm.search)!==-1
				})
				if(i.length) {
					arr.push(i)
				}
			}
			return arr
		},
		shortcutList() {
			let arr=LISTHEAD
			for(let item in this.cities.city_character){
				arr.push(item)
			}
			return arr
		},
		fixedTitle() {
			if(this.scrollY>0||this.currentIndex<3) {
				return ''
			}
			return this.shortcutList[this.currentIndex]
		}
	},
	methods: {
		unfinished(item) {
			if(item!==DEFAULTCITY){
				this.unData=item
				setTimeout(() => {
					this.$router.back()
				},1500)
			}else {
				this.$router.back()
			}
		},
		showCurrentIndex(index) {
			this.currentIndexOnshow=this.shortcutList[index]
			if(this.timer) {
				clearTimeout(this.timer)
			}
			this.timer=setTimeout(() => { this.currentIndexOnshow = '' },500)
		},
		onShortcutTouchStart(e) {
			let anchorIndex = getData(e.target,'index')
			this.showCurrentIndex(anchorIndex)
			let firstTouch = e.touches[0]
			this.touch.y1 = firstTouch.pageY
			this.touch.anchorIndex = anchorIndex
			this._scrollTo(anchorIndex)
		},
		onShortcutTouchMove(e) {
			let anchorHeight=this.$refs.listshortcut.firstChild.clientHeight
			let firstTouch = e.touches[0]
			this.touch.y2 = firstTouch.pageY
			let delta = (this.touch.y2-this.touch.y1)/anchorHeight|0
			this.moveIndex = parseInt(this.touch.anchorIndex)+delta
		},
		scroll(pos){
			this.scrollY = pos.y
		},
		clearInput() {
			this.search=""
		},
		_scrollTo(index) {
			if(!index&&index!==0) {
				return
			}
			if(index <0) {
				index = 0
			}else if(index>this.listHeight.length-2) {
				index = this.listHeight.length-2
			}
			this.scrollY = -this.listHeight[index]
			if(index<3) {
				this.$refs.citylist.scrollTo(0,this.scrollY)
			} else {
				this.$refs.citylist.scrollToElement(this.$refs.listgroup[index-3],0)
			}
		},
		_calculateHeight() {
			this.listHeight = []
			let height = 0
			this.listHeight.push(height)
			height +=this.$refs.currentCity.clientHeight
			this.listHeight.push(height)
			height +=this.$refs.hotCity.clientHeight
			this.listHeight.push(height)
			height +=this.$refs.allCity.clientHeight
			this.listHeight.push(height)
			if(this.$refs.listgroup){
				let list =this.$refs.listgroup
				for(let i=0; i<list.length; i++){
					let item =list[i]
					height+=item.clientHeight
					this.listHeight.push(height)
				}
			}
		},
		_getCityList() {
			this.$http.get('/static/city.json').then((response) => {
				this.cities = response.body
			})
		}
	},
	watch: {
		moveIndex() {
			this.showCurrentIndex(this.moveIndex)
			this._scrollTo(this.moveIndex)
		},
		cities() {
			setTimeout(() => {
				this._calculateHeight()
			},20)
		},
		scrollY(newY) {
			const listHeight=this.listHeight
			if(newY >0) {
				this.currentIndex = 0
				return
			}
			for(let i=0; i<listHeight.length-1; i++) {
				let height1=listHeight[i]
				let height2=listHeight[i+1]
				if(-newY>=height1&&-newY<height2) {
					this.currentIndex =i
					this.diff = height2+newY
					return
				}
			}
			this.currentIndex = listHeight.length-2
		},
		diff(newVal) {
			let fixedTop = (newVal>0&&newVal<38)?newVal-38:0
			if(this.fixedTop===fixedTop){
				return
			}
			this.fixedTop=fixedTop
			this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
		}
	},
	components: {
		Scroll,
		MHeader,
		Unfinished
	}
}   
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"   
@import "~common/stylus/mixin"
.city-check
	background:$color-background-d
	font-size:$font-size-medium
	.search
		position:relative
		display:flex
		margin:12px
		padding:6px
		line-height:24px
		border:1px solid $color-gray-l
		border-radius:6px
		background:#fff
		z-index:90
		i
			display:inline-block
			&.ic_search
				flex:0 0 48px
				width:48px
				height:48px
				background-image:url("./ic_search.png")
				vertical-align:bottom
				zoom:0.5
			&.cancel
				flex:0 0 58px
				width:58px
				height:58px
				background-image:url("./mine_ic_sex_cancel.png")
				vertical-align:bottom
				zoom:0.33
		input
			flex:1
			margin:0 6px
			outline:none
	.city
		position:fixed
		top:90px
		bottom:60px
		width:100%
		background:$color-background-d
		.citylist
			height:100%
			overflow:hidden
			.current-city
				margin-left:12px
				width:80%
				height:54px
				line-height:36px
				padding-top:12px
				border-after-1px($color-gray-l)
				.current-title
					display:inline-block
					font-weight:bold
				.current
					float:right
					display:inline-block
					padding:0 20px
					font-size:$font-size-medium
					background:$color-theme
					color:#fff
					border-radius:5px
			.title
				margin:0 12px
				padding:12px 0
				line-height:36px
				font-size:$font-size-medium
				font-weight:bold
			.hot
				margin:0 12px
				width:80%
				border-after-1px($color-gray-l)
				.hot-city
					display:inline-block
					background:#fff
					padding:16px 30px
					margin:0 12px 12px 0
			.all
				width:100%
				background:#fff
				font-size:$font-size-medium
				.cha
					padding:12px
					font-weight:bold
					background:$color-background-d
				.common-city
					padding:12px
					background:#fff
	.list-shortcut
		position:absolute
		display:flex
		flex-direction:column
		top:90px
		bottom:60px
		right:0
		width:40px
		padding:20px 0
		text-align:center
		z-index:30
		.item
			flex:1
			color:$color-theme
			&.current
				color:#111
				font-weight:bold
	.list-fixed
		position:absolute
		top:90px
		left:0
		width:100%
		.fixed-title
			height:14px
			padding:12px
			font-weight:bold
			background:$color-background-d
	.show-current-index
		position:fixed
		top:50%
		width:100%
		height:80px
		text-align:center
		color:#fff
		transform:translateY(-50%)
		span
			display:inline-block
			width:80px
			height:80px
			line-height:80px
			background:$color-gray-l
			font-size:36px
	.remind
		padding:12px
</style>