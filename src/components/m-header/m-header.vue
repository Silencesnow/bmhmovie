<template>
  <header class="m-header">
  	<div class="city"><span>深圳</span><i class="icon-chevron-thin-down"></i></div>
  	<span class="title">{{title}}</span>
  </header>  
</template>

<script>
export default {
	props:{
		title:{
			type:String,
			default:'电影'
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
	text-align:center
	background-color:$color-theme
	color:#fff
	font-size:0
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