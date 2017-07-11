<template>
<div>
	<m-header :title="d_title"></m-header>
	<ul class="discovery">
		<li v-for="item in discovery" class="item">
			<img :src="item.litpic">
		</li>
	</ul>
</div> 
</template>

<script>
import MHeader from 'components/m-header/m-header'

export default {
	data() {
		return {
			d_title:'发现',
			discovery:[]
		}
	},
	components:{
		MHeader
	},
	created() {
		this._getDiscovery()
	},
	methods: {
		_getDiscovery() {
			this.$http.get('/static/discovery.json').then((response) => {
				this.discovery = response.body
			})
		}
	}
}   
</script>

<style lang="stylus" rel="stylesheet/stylus">
.discovery
	font-size:0
	.item
		padding:12px 12px 0 12px
		img
			width:100%   
</style>