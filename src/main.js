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
import SeatSelection from 'components/seat-selection/seat-selection'
import UserOrder from 'components/user-order/user-order'
import OrderItem from 'components/order-item/order-item'
import CityCheck from 'components/city-check/city-check'

fastclick.attach(document.body)

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueLazyLoad,{
	loading:require('common/image/default.png')
})

Vue.http.options.root = '/root'
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk'

Vue.http.options.emulateJSON = true
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
			path:':orderId',
			component:TheaterDetail
		}
		]
	},
	{
		path:'/theaters/theater-detail/:id',
		component:SeatSelection
	},
	{
		path: '/discovery',
		component: Discovery
	},
	{
		path: '/user',
		component: User,
		children:[
		{
			path:'order',
			component:UserOrder
		}
		]
	},
	{
		path:'/user/order/:orderId',
		component:OrderItem
	},
	{
		path:'/city',
		component:CityCheck
	}
	]

const router = new VueRouter({
  	routes
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	render: h => h(App),
	http: {
	    root: '/root',
	    headers: {
	      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    	}
  	}
})