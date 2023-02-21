import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'

const useTodoListPage = async () => await import('./pages/TodoListPage.vue')

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: HomePage
		},

		{
			path: '/list',
			component: useTodoListPage
		}
	]
})

export default router
