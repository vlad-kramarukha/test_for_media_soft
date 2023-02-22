import { createStore } from 'vuex'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'
import omit from 'lodash/omit'
import clone from 'lodash/clone'

const state = {
	list: [],
    copyList: [],
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
		isDeleted: false,
		isRedact: false
	}
}

const mutations = {
	createTodo({ list, copyList }, todo) {
		list.push(todo)
	},

	deleteTodo(state, currentTodo) {
		const { list, deletedList } = state
		const todo = clone(currentTodo)
		state.list = reject(list, ['id', todo.id])
		todo.isDeleted = true
		deletedList.push(todo)
	},

	restoreTodo(state, currentTodo) {
		const { list, deletedList } = state
		const todo = clone(currentTodo)
		state.deletedList = reject(deletedList, ['id', todo.id])
		todo.isDeleted = false
		list.push(todo)
	},

	saveTodoAfterRedact({ list }, data) {
		const { todo, index } = data
		list[index] = todo
	},

	changeStatus(state, data) {
		const { newStatus, todo } = data

		for (const key in omit(todo, 'title', 'description', 'id')) {
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

	saveTodoAfterRedact({ commit }, { todo, index }) {
		commit('saveTodoAfterRedact', { todo, index })
	},

	changeStatus({ commit }, data) {
		commit('changeStatus', data)
	},

	makeSortListBy: ({ commit }, { order, field }) => commit('makeSortListBy', { order, field }),

    makeFilterListBy: ({ commit }, field) => commit('makeFilterListBy', field)
}

const getters = {
	getList: ({ list }) => list,

	getStatusList: ({ statusList }) => statusList,

	getDefaultStatus: ({ defaultTodoStatus }) => defaultTodoStatus,

	getDeletedList: ({ deletedList }) => deletedList,

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

	makeFilterByIsTodo: ({ list }) => filter(list, 'isTodo'),

	makeFilterByIsWork: ({ list }) => filter(list, 'isWork'),

    makeFilterByIsDone: ({ list }) => filter(list, 'isDone')
}

export default createStore({
	state,
	getters,
	actions,
	mutations
})
