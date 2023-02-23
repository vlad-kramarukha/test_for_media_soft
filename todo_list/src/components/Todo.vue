<script setup>
import { NCard, NButton, NTag, NIcon } from 'naive-ui'
import { PencilSharp } from '@vicons/ionicons5'
import { defineProps, defineEmits, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import findKey from 'lodash/findKey'

const { getters } = useStore()

const props = defineProps({
	todo: Object
})
const emit = defineEmits([
	'onDelete',
	'onChangeStatus',
	'onRestore',
	'onRedact'
])

const todo = computed(() => props.todo)
const route = useRoute()

const title = computed(() => todo.value.title)
const description = computed(() => todo.value.description)

/* Параметры для статуса задачи */
const statusTypeMap = {
	// Мапа для перевода статуса
	isTodo: 'warning',
	isWork: 'info',
	isDone: 'success'
}
const statusKey = computed(() => findKey(todo.value, (v) => v === true)) // Получения ключа актуального статуса задачи
const translatedStatus = computed(() => getters.getTrasformedStatusList[statusKey.value]) // Перевод статуса
const computedStatusType = computed(() => statusTypeMap[statusKey.value]) // Рассчет цвета для лейбла

const isDeleted = computed(() => todo.value.isDeleted)
const isRedact = computed(() => (route.params.id ? +route.params.id === +todo.value.id : false))
const isTodo = computed(() => todo.value.isTodo || isDeleted.value || isRedact.value)
const isWork = computed(() => todo.value.isWork || isDeleted.value || isRedact.value)
const isDone = computed(() => todo.value.isDone || isDeleted.value || isRedact.value)

const computedActionButtonType = computed(() => (isDeleted.value ? 'success' : 'error')) // Рассчет цвета кнопки для удаления / восстановления задачи
const computedActionButtonText = computed(() => (isDeleted.value ? 'Восстановить' : 'Удалить')) // Рассчет текста кнопки для удаления / восстановления задачи

function onChangeStatus(newStatus) {
	emit('onChangeStatus', { newStatus, todo: todo.value })
}

function onAction() {
	const name = isDeleted.value ? 'onRestore' : 'onDelete'
	emit(name, todo.value)
}

function onRedact() {
	emit('onRedact', todo.value)
}
</script>

<template>
	<NCard size="huge" hoverable>
		<template #header> {{ title }} </template>

		<template #header-extra>
			<NTag round :type="computedStatusType" :bordered="false">{{ translatedStatus }}</NTag>
		</template>

		<template #default>
			{{ description }}
		</template>

		<template #action>
			<div class="flex justify-between">
				<div class="flex gap-2">
					<NButton
						:disabled="isDeleted"
						size="small"
						secondary
						@click="onRedact()"
					>
						Изменить
						<template #icon>
							<NIcon :component="PencilSharp" />
						</template>
					</NButton>
				</div>

				<div class="flex gap-2">
					<NButton size="small" :disabled="isTodo" secondary @click="onChangeStatus('isTodo')"
						>Выполнить</NButton
					>
					<NButton size="small" :disabled="isWork" secondary @click="onChangeStatus('isWork')"
						>Выполняется</NButton
					>
					<NButton size="small" :disabled="isDone" secondary @click="onChangeStatus('isDone')"
						>Выполнена</NButton
					>
					<NButton
						size="small"
						:disabled="isRedact"
						secondary
						:type="computedActionButtonType"
						@click="onAction()"
					>
						{{ computedActionButtonText }}
					</NButton>
				</div>
			</div>
		</template>
	</NCard>
</template>
