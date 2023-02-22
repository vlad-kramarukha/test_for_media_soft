<script setup>
import { NButton, NSelect, NIcon, NDivider } from 'naive-ui'
import { ArrowDown, ArrowUp, Filter } from '@vicons/ionicons5'
import Todo from './Todo.vue'

import { useStore } from 'vuex'
import { computed, defineEmits, defineProps, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
	showDeleted: Boolean
})

const { getters, dispatch } = useStore()
const router = useRouter()

const todoList = computed(() => (!props.showDeleted ? getters.getList : getters.getDeletedList))

function onCreate() {
	router.push({ path: '/list/add' })
}

function onChangeStatus(newStatus, index) {
	dispatch('changeStatus', { newStatus, index })
}

function onDelete(todo) {
	dispatch('deleteTodo', todo)
}

function onRestore(todo) {
    dispatch('restoreTodo', todo)
}

function onSave(todo, index) {
    dispatch('saveTodoAfterRedact', {todo, index})
}

function onRedact(todo) {
    dispatch('redactTodo', todo)
}

function onCancelRedact(todo) {
    dispatch('cancelRedactTodo', todo)
}

function toggleList() { // Переключение списка задач [Действующий или Удаленные]
	const name = !props.showDeleted ? 'DeletedList' : 'List'
	router.push({ name })
}
</script>

<template>
	<div class="pt-4 pb-4 sticky top-0 z-10 bg-white">
		<div class="flex gap-2 mb-2">
			<NButton type="primary" @click="onCreate()"> Создать задачу </NButton>

			<NSelect placeholder="Параметр сортировки" />

			<NButton>
				По убыванию

				<template #icon>
					<NIcon :component="ArrowDown" />
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
			@onChangeStatus="onChangeStatus($event, index)"
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
