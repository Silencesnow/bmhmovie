import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

import Movies from 'components/movies/movies'
import Theaters from 'components/theaters/theaters'
import Discovery from 'components/discovery/discovery'
import User from 'components/user/user'
import MovieDetail from 'components/movie-detail/movie-detail'
import TheaterDetail from 'components/theater-detail/theater-detail'

fastclick.attach(document.body)

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueLazyLoad,{
	loading:require('common/image/default.png')
})

const routes = [
	{
		path: '/',
		redirect: '/movies'
	},
	{
		path: '/movies',
		component: Movies,
		children: [
		{
			path: ':aid',
			component:MovieDetail
		}
		]
	},
	{
		path: '/theaters',
		component: Theaters,
		children:[
		{
			path:':aid',
			component:TheaterDetail
		}
		]	
	},
	{
		path: '/discovery',
		component: Discovery
	},
	{
		path: '/user',
		component: User
	}
	]

const router = new VueRouter({
  routes
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	render: h => h(App)
})