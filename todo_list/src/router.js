import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'

const useTodoListPage = () => import('./pages/TodoListPage.vue')
const useTodoFormComponent = () => import('./components/TodoForm.vue')

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: HomePage
		},

		{
			path: '/list',
			name: 'List',
			component: useTodoListPage,
			children: [
				{
					path: 'add',
					component: useTodoFormComponent
				}
			]
		},

		{
			path: '/list/:id/edit',
			name: 'ListWithRedactMode',
			component: useTodoListPage,
		},

		{
			path: '/list/deleted',
			name: 'DeletedList',
			component: useTodoListPage,
			props: {
				showDeleted: true
			}
		}
	]
})

export default router
