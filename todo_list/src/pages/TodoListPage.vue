<script setup>
import { NButton } from 'naive-ui';
import TodoList from '../components/TodoList.vue'
</script>

<template>
	<div class="py-6 w-1/2 mx-auto">
		<div class="px-6 py-4 rounded-md bg-green-100">
			<h1 class="text-xl text-center font-normal m-0">Список задач</h1>
		</div>

        <TodoList></TodoList>
	</div>
</template>
