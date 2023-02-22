<script setup>
import TodoList from '../components/TodoList.vue'
import { defineProps, watch, computed } from 'vue'

const props = defineProps({
	showDeleted: Boolean,
})

const computedPageText = computed(() => (props.showDeleted ? 'Удаленные задачи' : 'Список задач'))
</script>

<template>
	<div class="py-6 w-1/2 mx-auto">
		<div class="px-6 py-4 rounded-md bg-green-100">
			<h1 class="text-xl text-center font-normal m-0">{{ computedPageText }}</h1>
		</div>

		<TodoList :show-deleted="props.showDeleted" />

		<RouterView></RouterView>
	</div>
</template>
