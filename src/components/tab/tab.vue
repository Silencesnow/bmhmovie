<template>
<div class="tab">
	<router-link tag="div" class="tab-item border-before-1px" to="/movies">
		<div class="icon bg-tab_movie"></div>
		<div class="tab-link">电影</div>
	</router-link>
	<router-link tag="div" class="tab-item border-before-1px" to="/theaters">
		<div class="icon bg-tab_theater"></div>
		<span class="tab-link">影院</span>
	</router-link>
	<router-link tag="div" class="tab-item border-before-1px" to="/discovery">
		<div class="icon bg-tab_discovery"></div>
		<span class="tab-link">发现</span>
	</router-link>
	<router-link tag="div" class="tab-item border-before-1px" to="/user">
		<div class="icon bg-tab_user"></div>
		<span class="tab-link">我的</span>
	</router-link>
</div>   
</template>

<script>
export default {}    
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"    
@import "~common/stylus/mixin"    
.tab
	position:fixed
	display:flex
	height:60px
	bottom:0
	width:100%
	font-size:0
	background:$color-background
	.tab-item
		flex:1
		text-align:center
		border-before-1px($color-gray-l)
		.icon
			margin:5px auto
			zoom:0.6
		.tab-link
			padding-bottom:5px
			font-size:$font-size-small-s
			color:$color-text-l
		&.router-link-active
			.tab-link
				color:$color-theme
			.icon
				width: 64px
				height: 64px
				sprite-bg-image()
				&.bg-tab_movie
					background-position:-214px -2px
				&.bg-tab_theater
					background-position:-70px -136px
				&.bg-tab_discovery
					background-position:-70px -68px
				&.bg-tab_user
					background-position:-2px -136px
</style>