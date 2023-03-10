<script setup>
import { NButton, NSelect, NIcon, NDivider } from 'naive-ui'
import { ArrowDown, ArrowUp, CloudOffline } from '@vicons/ionicons5'
import Todo from './Todo.vue'

import { useStore } from 'vuex'
import { computed, defineProps, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
	showDeleted: Boolean
})
const { getters, dispatch } = useStore()
const router = useRouter()

const todoList = computed(() => {
	if (!filter.value) {
		return !props.showDeleted ? getters.getList : getters.getListOnlyDeleted
	} else {
		const getterName = !props.showDeleted ? `makeFilterBy${filter.value}` : `makeFilterDeletedBy${filter.value}`
		return getters[getterName]
	}
})

const sort = shallowRef(null)
const sortList = getters.getSortList
const order = shallowRef('asc')
const filter = shallowRef(null)
const filterList = getters.getFilterList

const computedButtonOrderText = computed(() => (order.value === 'asc' ? 'По возрастанию' : 'По убыванию'))
const computedButtonOrderIcon = computed(() => (order.value === 'asc' ? ArrowUp : ArrowDown))
const computedToggleListButtonText = computed(() =>
	!props.showDeleted ? 'Показать удаленные' : 'Показать действующие'
)
const computedToggleListButtonType = computed(() => (!props.showDeleted ? 'default' : 'primary'))

function toggleOrder() {
	order.value = order.value === 'asc' ? 'desc' : 'asc'
}

function onCreate() {
	router.push({ name: 'Form' })
}

function onChangeStatus({ newStatus, todo }) {
	dispatch('changeStatus', { newStatus, todo })
}

function onDelete(todo) {
	dispatch('deleteTodo', todo)
}

function onRestore(todo) {
	dispatch('restoreTodo', todo)
}

function onRedact({ id }) {
	router.push({ name: 'ListWithRedactMode', params: { id } })
}

function onClear() {
	filter.value = null
	sort.value = null
}

function toggleList() {
	// Переключение списка задач [Действующий или Удаленные]
	const name = !props.showDeleted ? 'DeletedList' : 'List'
	router.push({ name })
}

watch(sort, (field) => {
	dispatch('makeSortListBy', { order: order.value, field })
})

watch(order, (order) => {
	dispatch('makeSortListBy', { order, field: sort.value })
})
</script>

<template>
	<div class="pt-4 pb-4 sticky top-0 z-10 bg-white">
		<div class="flex gap-2 mb-4">
			<NSelect
				v-model:value="filter"
				placeholder="Параметр фильтрации"
				:options="filterList"
				class="flex-3"
			/>

			<NSelect v-model:value="sort" placeholder="Параметр сортировки" :options="sortList" class="flex-3" />

			<NButton @click="toggleOrder()" :disabled="!sort" class="flex-1">
				{{ computedButtonOrderText }}

				<template #icon>
					<NIcon :component="computedButtonOrderIcon" />
				</template>
			</NButton>
		</div>

		<div class="flex justify-between">
			<div>
				<NButton class="mr-2" type="primary" @click="onCreate()"> Создать задачу </NButton>

				<NButton class="mr-2" type="error" @click="onClear()"> Очистить фильтры </NButton>
			</div>

			<NButton :type="computedToggleListButtonType" @click="toggleList()">
				{{ computedToggleListButtonText }}
			</NButton>
		</div>

		<NDivider />
	</div>

	<div class="flex flex-col gap-4 z-0">
		<Todo
			v-for="todo in todoList"
			:todo="todo"
			@onChangeStatus="onChangeStatus($event)"
			@onDelete="onDelete($event)"
			@onRestore="onRestore($event)"
			@onRedact="onRedact($event)"
		></Todo>

		<NIcon class="no-data" size="60" color="#d1d5db" v-if="!todoList.length" :component="CloudOffline" />
	</div>
</template>

<style>
.todo-list {
	max-height: 700px;
	overflow-y: auto;
}

.no-data {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
