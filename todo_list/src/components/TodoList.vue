<script setup>
import { NButton, NSelect, NIcon, NDivider } from 'naive-ui'
import { ArrowDown, ArrowUp, Filter } from '@vicons/ionicons5'
import Todo from './Todo.vue'
</script>

<template>
	<div class="pt-4 pb-4 sticky top-0 z-10 bg-white">
		<div class="flex gap-2 mb-2">
			<NButton type="primary"> Создать задачу </NButton>

			<NSelect placeholder="Параметр сортировки" />

			<NButton>
				По убыванию

				<template #icon>
					<NIcon size="20" :component="ArrowDown" />
				</template>
			</NButton>

			<NButton>
				Фильтр не активен

				<template #icon>
					<NIcon size="20" :component="Filter" />
				</template>
			</NButton>
		</div>

		<NDivider />
	</div>

	<div class="flex flex-col gap-4 z-0">
		<Todo></Todo>
	</div>
</template>

<style>
.todo-list {
	max-height: 700px;
	overflow-y: auto;
}
</style>
