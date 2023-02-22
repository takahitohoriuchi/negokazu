import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
		props: true,
	},
	{
		path: '/twe/mypage',
		name: 'mypage',
		component: () => import('../views/MyPage.vue'),
		props: true,
	},
	{
		path: '/twe/go_along_with',
		name: 'go_along_with',
		component: () => import('../views/ApplicationView.vue'),
		props: true,
	},
	{
		path: '/twe/admin',
		name: 'admin',
		component: () => import('../views/AdminPage.vue'),
		props: true,
	},
	{
		path: '/twe/event_holding',
		name: 'event_holding',
		component: () => import('../views/InformView.vue'),
		props: true,
	},
	{
		path: '/twe/event_info',
		name: 'event_info',
		component: () => import('../views/HoldPlaceView.vue'),
		props: true,
	},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
