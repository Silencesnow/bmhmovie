<template>
    <div id="app">
    	<keep-alive>
    		<router-view></router-view>
    	</keep-alive>
        <tab></tab>
    </div>
</template>

<script>
import Tab from 'components/tab/tab.vue'
export default {
    data() {
        return {
            movies:{}
        }
    },
	components: {
		Tab
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>