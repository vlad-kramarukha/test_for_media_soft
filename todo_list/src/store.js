import { createStore } from 'vuex'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'
import pick from 'lodash/pick'

const state = {
	list: [],
	deletedList: [],
	statusList: [
		{ label: 'Выполнить', value: 'isTodo' },
		{ label: 'Выполняется', value: 'isWork' },
		{ label: 'Выполнено', value: 'isDone' }
	],
	defaultTodoStatus: {
		isTodo: false,
		isWork: false,
		isDone: false,
		isDeleted: false,
		isRedact: false
	}
}

const mutations = {
	createTodo({ list }, todo) {
		list.push(todo)
	},

	deleteTodo(state, todo) {
		const { list, deletedList } = state
		state.list = reject(list, todo)
		todo.isDeleted = true
		deletedList.push(todo)
	},

	restoreTodo(state, todo) {
		const { list, deletedList } = state
		state.deletedList = reject(deletedList, todo)
		todo.isDeleted = false
		list.push(todo)
	},

	redactTodo({ list }, todo) {
		todo.isRedact = true
	},

	cancelRedactTodo({ list }, todo) {
		todo.isRedact = false
	},

	saveTodoAfterRedact({ list }, data) {
		const { todo, index } = data

		list[index] = todo
	},

	changeStatus({ list, defaultTodoStatus }, data) {
		const { newStatus, index } = data
		const todoWithoutStatus = pick(list[index], 'title', 'description')

		list[index] = { ...todoWithoutStatus, ...defaultTodoStatus }
		list[index][newStatus] = true
	}
}

const actions = {
	createTodo({ commit }, todo) {
		commit('createTodo', todo)
	},

	deleteTodo({ commit }, todo) {
		commit('deleteTodo', todo)
	},

	restoreTodo({ commit }, todo) {
		commit('restoreTodo', todo)
	},

	redactTodo({ commit }, todo) {
		commit('redactTodo', todo)
	},

	cancelRedactTodo({ commit }, todo) {
		commit('cancelRedactTodo', todo)
	},

	saveTodoAfterRedact({ commit }, { todo, index }) {
		commit('saveTodoAfterRedact', { todo, index })
		commit('cancelRedactTodo', todo)
	},

	changeStatus({ commit }, data) {
		commit('changeStatus', data)
	}
}

const getters = {
	getList: ({ list }) => list,

	getStatusList: ({ statusList }) => statusList,

	getDefaultStatus: ({ defaultTodoStatus }) => defaultTodoStatus,

	getDeletedList: ({ deletedList }) => deletedList,

	getTrasformedStatusList: ({ statusList }) =>
		reduce(
			statusList,
			(acc, prev) => {
				const { label, value } = prev
				acc[value] = label

				return acc
			},
			{}
		),

	getOnlyTodo: ({ list }) => filter(list, 'isTodo'),

	getOnlyWork: ({ list }) => filter(list, 'isWork'),

	getOnlyDone: ({ list }) => filter(list, 'isDone'),

	makeSortListByTitle: ({ list }, order) => orderBy(list, 'title', order),

	makeSortListByStatusTodo: ({ list }, order) => orderBy(list, 'isTodo', order),

	makeSortListByStatusWork: ({ list }, order) => orderBy(list, 'isWork', order),

	makeSortListByStatusDone: ({ list }, order) => orderBy(list, 'isDone', order)
}

export default createStore({
	state,
	getters,
	actions,
	mutations
})
