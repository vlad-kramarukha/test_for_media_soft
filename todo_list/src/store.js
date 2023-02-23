import { createStore } from 'vuex'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'
import omit from 'lodash/omit'
import findIndex from 'lodash/findIndex'
import clone from 'lodash/clone'

const state = {
	list: [],
	redactableTodo: null,
	deletedList: [],

	statusList: [
		{ label: 'Выполнить', value: 'isTodo' },
		{ label: 'Выполняется', value: 'isWork' },
		{ label: 'Выполнено', value: 'isDone' }
	],

	sortList: [
		{ label: 'Без сортировки', value: null },
		{ label: 'Сортировка по id', value: 'id' },
		{ label: 'Сортировка по заголовку', value: 'title' },
		{ label: 'Сортировка по статусу Выполнить', value: 'isTodo' },
		{ label: 'Сортировка по статусу Выполняется', value: 'isWork' },
		{ label: 'Сортировка по статусу Выполено', value: 'isDone' }
	],

	filterList: [
		{ label: 'Без фильтрации', value: null },
		{ label: 'Cтатус Выполнить', value: 'IsTodo' },
		{ label: 'Cтатус Выполняется', value: 'IsWork' },
		{ label: 'Cтатус Выполнено', value: 'IsDone' }
	],

	defaultTodoStatus: {
		isTodo: false,
		isWork: false,
		isDone: false,
		isDeleted: false
	}
}

const mutations = {
	createTodo({ list }, todo) {
		list.push(todo)
	},

	deleteTodo(state, todo) {
		todo.isDeleted = true
	},

	restoreTodo(state, todo) {
		todo.isDeleted = false
	},

	redactTodo(state, todo) {
		state.redactableTodo = clone(todo)
	},

	saveTodoAfterRedact(state, todo) {
		const index = findIndex(state.list, state.redactableTodo)
		
		state.list[index] = todo
		state.redactableTodo = null
	},

	changeStatus(state, data) {
		const { newStatus, todo } = data
		const rejectedFields = ['title', 'description', 'id', 'isDeleted']

		for (const key in omit(todo, rejectedFields)) {
			todo[key] = false
		}

		todo[newStatus] = true
	},

	makeSortListBy(state, { order, field }) {
		state.list = orderBy(state.list, field, order)
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

	saveTodoAfterRedact({ commit }, todo) {
		commit('saveTodoAfterRedact', todo)
	},

	changeStatus({ commit }, data) {
		commit('changeStatus', data)
	},

	makeSortListBy: ({ commit }, { order, field }) => commit('makeSortListBy', { order, field }),

	makeFilterListBy: ({ commit }, field) => commit('makeFilterListBy', field)
}

const getters = {
	getList: ({ list }) => reject(list, 'isDeleted'),

	getRedactableTodo: ({ redactableTodo }) => redactableTodo,

	getListOnlyDeleted: ({ list }) => filter(list, 'isDeleted'),

	getStatusList: ({ statusList }) => statusList,

	getDefaultStatus: ({ defaultTodoStatus }) => defaultTodoStatus,

	getSortList: ({ sortList }) => sortList,

	getFilterList: ({ filterList }) => filterList,

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

	makeFilterByIsTodo: (state, { getList }) => filter(getList, 'isTodo'),

	makeFilterByIsWork: (state, { getList }) => filter(getList, 'isWork'),

	makeFilterByIsDone: (state, { getList }) => filter(getList, 'isDone'),

	makeFilterDeletedByIsTodo: (state, { getListOnlyDeleted }) => filter(getListOnlyDeleted, 'isTodo'),

	makeFilterDeletedByIsWork: (state, { getListOnlyDeleted }) => filter(getListOnlyDeleted, 'isWork'),

	makeFilterDeletedByIsDone: (state, { getListOnlyDeleted }) => filter(getListOnlyDeleted, 'isDone')
}

export default createStore({
	state,
	getters,
	actions,
	mutations
})
