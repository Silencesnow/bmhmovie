<template>
  <div class="m-header">
  	<div v-if="back" class="back" @click="returnback"><i class="icon-chevron-thin-left"></i></div>
  	<div v-else class="city" @click="selectCity(city)">	
  		<span>{{city}}</span>
  		<i class="icon-chevron-thin-down"></i>
  	</div>
  	<span class="title">{{title}}</span>
  </div>
</template>

<script>
export default {
	data() {
		return {
			city:"深圳",
			_backPath:''
		}
	},
	props:{
		title:{
			type:String,
			default:'电影'
		},
		back:{
			type:Boolean,
			default:false
		},
		backPath:{
			type:String,
			default:''
		}
	},
	methods: {
		returnback() {
			if(this.backPath){
				this._backPath=this.backPath
				this.$router.push({
					path:this._backPath
				})
			}else {
				this.$router.back()
			}
		},
		selectCity(city) {
			this.$router.push({
				path:'/city',
				query:{city:this.city}
			})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"   
@import "~common/stylus/mixin"
.m-header
	position:relative
	display:flex
	height:40px
	line-height:40px
	width:100%
	text-align:center
	background-color:$color-theme
	color:#fff
	font-size:0
	.back
		display:inline-block
		flex:0 0 120px
		height:50px
		text-align:left
		i
			padding-left:12px
			vertical-align:middle
			font-size:$font-size-large
	.city
		display:inline-block
		flex:0 0 120px
		height:50px
		text-align:left
		span
			margin:0 6px 0 9px
			font-size:$font-size-medium-x
		i
			font-size:$font-size-medium
	.title
		flex:1
		font-size:$font-size-medium-x
		margin-right:120px
</style>