<template>
<div class="unfinished" v-if="info">
	<p v-if="data!==defaultData">{{info}}尚无数据<br>
	先看看{{defaultData}}吧</p>
	<p v-else>你选择了{{defaultData}}</p>
</div>    
</template>

<script>
export default {
	data() {
		return {
			info:'',
			timer:''
		}
	},
	watch: {
		data() {
			this.info = this.data
			setTimeout(() => {
				this.info=''
			},1000)
		},
		id() {
			this.info = this.data
			setTimeout(() => {
				this.info=''
			},1000)
		}
	},
	props:{
		data:{
			type:String,
			default:''
		},
		id: {
			type:String,
			default:''
		},
		defaultData:{
			type:String,
			default:"深圳"
		}
	},
	methods: {
	}
}   
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.unfinished
	position:fixed
	top:50%
	left:0
	width:100%
	height:80px
	color:#fff
	text-align:center
	transform:translateY(-50%)
	p
		display:inline-block
		padding:10px
		width:300px
		line-height:20px
		background:$color-gray
		font-size:16px
		border-radius:10px 
</style>