<template>
<div class="user">
	<header class="header"><img src="./mine_face.png" alt=""></header>
	<ul class="user_info">
		<li class="item" @click="toUserOrder()">
			<i class="bg-mine_ic_dd"></i>
			<span class="title">我的订单</span>
			<i class="icon-chevron-thin-right"></i>
		</li>
		<li v-for="item in message" class="item">
			<i :class="item.icon"></i>
			<span class="title">{{item.title}}</span>
			<i class="icon-chevron-thin-right"></i>
			<span v-if="item.tel" class="ex">{{item.tel}}</span>
		</li>
	</ul>
	<router-view></router-view>
</div>    
</template>

<script>
const Message = [
	{icon:"bg-mine_ic_wallet",title:"我的钱包"},
	{icon:"bg-mine_ic_set",title:"用户设置"},
	{icon:"bg-mine_ic_tel",title:"客服电话",tel:"10049"}
]
export default {
	data() {
		return {
			message:Message
		}
	},
	methods: {
		toUserOrder() {
			this.$router.push({
				path:'/user/order'
			})
		}
	}
}    
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.user
	position:fixed
	width:100%
	top:0
	bottom:60px
	background:$color-background-d
	.header
		height:125px
		padding-top:40px
		background:$color-theme
		img
			display:block
			margin:0 auto
			width:75px
			height:75px
			border:2px solid white
			border-radius:50%
	.user_info
		.item
			background:#fff
			line-height:55px
			height:55px
			line-height:55px
			padding:0 12px
			margin-bottom:12px
			i[class^=bg]
				display:inline-block
				vertical-align:middle
				padding-bottom:4px
				margin-right:10px
				zoom:0.5
			.title
				font-size:$font-size-medium
				font-weight:bold
				vertical-align:middle
			i[class^=icon-chevron]
				float:right
				line-height:55px
				color:$color-gray
			.ex
				font-size:$font-size-medium
				float:right
				margin-right:6px
				color:$color-gray
</style>