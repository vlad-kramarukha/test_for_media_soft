<script setup>
import { NCard, NButton, NTag, NIcon, NForm, NFormItem, NInput } from 'naive-ui'
import { PencilSharp } from '@vicons/ionicons5'
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import findKey from 'lodash/findKey'

const { getters } = useStore()

const props = defineProps({
	todo: Object
})
const emit = defineEmits(['onDelete', 'onChangeStatus', 'onRestore', 'onRedact', 'onSave', 'onCancelRedact', 'update:todo'])

const todo = ref(props.todo)
const title = computed(() => todo.value.title)
const description = computed(() => todo.value.description)

// Параметры формы
const formModel = ref({
	description: ''
})
const form = ref(null)
const rules = {
	description: {
		required: true,
		message: 'Необходимо заполнить поле',
		trigger: 'input'
	}
}

/* Параметры для статуса задачи */
const statusTypeMap = { // Мапа для перевода статуса
	isTodo: 'warning',
	isWork: 'info',
	isDone: 'success'
}
const statusKey = computed(() => findKey(todo.value, (v) => v === true)) // Получения ключа актуального статуса задачи
const translatedStatus = computed(() => getters.getTrasformedStatusList[statusKey.value]) // Перевод статуса
const computedStatusType = computed(() => statusTypeMap[statusKey.value]) // Рассчет цвета для лейбла 

const isDeleted = computed(() => todo.value.isDeleted)
const isRedact = computed(() => todo.value.isRedact)
const isTodo = computed(() => todo.value.isTodo || isDeleted.value || isRedact.value)
const isWork = computed(() => todo.value.isWork || isDeleted.value || isRedact.value)
const isDone = computed(() => todo.value.isDone || isDeleted.value || isRedact.value)

const computedActionButtonType = computed(() => (isDeleted.value ? 'success' : 'error')) // Рассчет цвета кнопки для удаления / восстановления задачи
const computedActionButtonText = computed(() => (isDeleted.value ? 'Восстановить' : 'Удалить')) // Рассчет текста кнопки для удаления / восстановления задачи
const computedRedactButtonType = computed(() => (isRedact.value ? 'primary' : 'default')) // Рассчет цвета кнопки для редактирования / сохранения задачи
const computedRedactButtonText = computed(() => (isRedact.value ? 'Сохранить' : 'Изменить')) // Рассчет текста кнопки для редактирования / сохранения задачи

function onChangeStatus(newStatus) {
	emit('onChangeStatus', newStatus)
}

function onAction() {
	const name = isDeleted.value ? 'onRestore' : 'onDelete'
	emit(name, todo.value)
}

function onRedact() {
    if (isRedact.value) {
        form.value.validate((errors) => {
            if (!errors) {
                todo.value.description = formModel.value.description
                emit('onSave', todo.value)
            }
        })
    } else {
        formModel.value.description = todo.value.description
        emit('onRedact', todo.value)
    }

}

function onCancel() {
    emit('onCancelRedact', todo.value)
}

</script>

<template>
	<NCard size="huge" hoverable>
		<template #header> {{ title }} </template>

		<template #header-extra>
			<NTag round :type="computedStatusType" :bordered="false">{{ translatedStatus }}</NTag>
		</template>

		<template #default>
			<NForm v-if="isRedact" ref="form" :rules="rules" :model="formModel">
				<NFormItem path="description" label="Редактирование описания">
					<NInput
						v-model:value="formModel.description"
						autofocus
						type="textarea"
						:autosize="{ maxRows: 8, minRows: 5 }"
						placeholder="Введите текст"
						clearable
					/>
				</NFormItem>
			</NForm>

			<template v-else>
				{{ description }}
			</template>
		</template>

		<template #action>
			<div class="flex justify-between">
				<div class="flex gap-2">
					<NButton
						:disabled="isDeleted"
						size="small"
						secondary
						:type="computedRedactButtonType"
						@click="onRedact()"
					>
						{{ computedRedactButtonText }}
						<template v-if="!isRedact" #icon>
							<NIcon :component="PencilSharp" />
						</template>
					</NButton>

					<NButton v-if="isRedact" size="small" secondary type="error" @click="onCancel()"> Отмена </NButton>
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
