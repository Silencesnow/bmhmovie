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
import {ERR_OK} from 'api/config'

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
			this.$http.get('/api/discovery').then((response) => {
				response = response.body
				if(response.errno === ERR_OK) {
					this.discovery = response.data
				}
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