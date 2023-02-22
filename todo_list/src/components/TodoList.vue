<script setup>
import { NButton, NSelect, NIcon, NDivider } from 'naive-ui'
import { ArrowDown, ArrowUp, Filter } from '@vicons/ionicons5'
import Todo from './Todo.vue'

import { useStore } from 'vuex'
import { computed, defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
	showDeleted: Boolean
})
const { getters, dispatch } = useStore()
const router = useRouter()

const todoList = computed(() => {
    if (!filter.value) {
        return !props.showDeleted ? getters.getList : getters.getDeletedList
    } else {
        const getterName = `makeFilterBy${filter.value}`
        return getters[getterName]
    }
})
const computedListLength = computed(() => todoList.value.length)
const sort = ref(null)
const sortList = ref(getters.getSortList)
const order = ref('asc')
const filter = ref(null)
const filterList = ref(getters.getFilterList)

const computedButtonOrderText = computed(() => order.value === 'asc' ? 'По возрастанию' : 'По убыванию')
const computedButtonOrderIcon = computed(() => order.value === 'asc' ? ArrowUp : ArrowDown)

function toggleOrder() {
    order.value = order.value === 'asc' ? 'desc' : 'asc'
}

function onCreate() {
	router.push({ path: '/list/add' })
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

function onSave(todo, index) {
	dispatch('saveTodoAfterRedact', { todo, index })
	router.push({ name: 'List' })
}

function onRedact({ id }) {
	router.push({ name: 'ListWithRedactMode', params: { id } })
}

function onCancelRedact() {
	router.push({ name: 'List' })
}

function toggleList() {
	// Переключение списка задач [Действующий или Удаленные]
	const name = !props.showDeleted ? 'DeletedList' : 'List'
	router.push({ name })
}

watch(sort, (field) => {
    dispatch('makeSortListBy', {order: order.value, field})
})

watch(order, (order) => {
    dispatch('makeSortListBy', {order, field: sort.value})
})

</script>

<template>
	<div class="pt-4 pb-4 sticky top-0 z-10 bg-white">
		<div class="flex gap-2 mb-2">
			<NButton type="primary" @click="onCreate()"> Создать задачу </NButton>

            <NSelect v-model:value="filter" placeholder="Параметр фильтрации" :options="filterList" :disabled="!computedListLength" />

			<NSelect v-model:value="sort" placeholder="Параметр сортировки" :options="sortList" :disabled="!computedListLength" />

			<NButton @click="toggleOrder()" :disabled="!computedListLength">
				{{ computedButtonOrderText }}

				<template #icon>
					<NIcon :component="computedButtonOrderIcon" />
				</template>
			</NButton>

			<NButton :type="!props.showDeleted ? 'default' : 'primary'" @click="toggleList()">
				{{ !props.showDeleted ? 'Показать удаленные' : 'Показать действующие' }}
			</NButton>
		</div>

		<NDivider />
	</div>

	<div class="flex flex-col gap-4 z-0">
		<Todo
			v-for="(todo, index) in todoList"
			:todo="todo"
			@onChangeStatus="onChangeStatus($event)"
			@onDelete="onDelete($event)"
			@onRestore="onRestore($event)"
			@onSave="onSave($event, index)"
			@onRedact="onRedact($event)"
			@onCancelRedact="onCancelRedact($event)"
		></Todo>
	</div>
</template>

<style>
.todo-list {
	max-height: 700px;
	overflow-y: auto;
}
</style>
