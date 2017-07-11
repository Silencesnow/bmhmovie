<template>
<app-wrapper>
    <div id="app">
    	<keep-alive>
    		<router-view></router-view>
    	</keep-alive>
        <tab></tab>
    </div>
</app-wrapper>
</template>

<script>
import Tab from 'components/tab/tab.vue'
import AppWrapper from 'components/app-wrapper/app-wrapper.vue'
export default {
    data() {
        return {
            movies:{}
        }
    },
	components: {
		Tab,
        AppWrapper
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app
    width:100%
    height:100%
</style>