import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},	
	{
		path: '/mypage',
		name: 'mypage',
		component: () => import('../views/MyPage.vue'),
		props: true,
	},	
	{
		path: '/subscribe',
		name: 'subscribe',
		component: () => import('../views/SubscribePage.vue'),
		props: true,
	},
	{
		path: '/admin',
		name: 'admin',
		component: () => import('../views/AdminPage.vue'),
		props: true,
	},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
