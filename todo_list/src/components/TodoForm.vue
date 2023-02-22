<script setup>
import { NModal, NCard, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { reactive, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import clone from 'lodash/clone'

const router = useRouter()
const { dispatch, getters } = useStore()

const formModel = reactive({
	title: '',
	description: '',
	status: 'isTodo'
})

const visible = ref(false)
const form = ref(null)
const rules = {
	title: {
		required: true,
		message: 'Необходимо заполнить поле названия задачи',
		trigger: 'input'
	},

	description: {
		required: true,
		message: 'Необходимо заполнить поле описание задачи',
		trigger: 'input'
	}
}

function makeTodo() {
	const { title, description, status } = formModel
    const defaultTodoStatus = clone(getters.getDefaultStatus)

	defaultTodoStatus[status] = true

	return { title, description, ...defaultTodoStatus }
}

function onSave() {
	const { validate } = form.value

	validate((errors) => {
		if (!errors) {
			dispatch('createTodo', makeTodo())
			onClose()
		}
	})
}

function onClose() {
	visible.value = false
}

function onAfterLeave() {
	router.push({ path: '/list' })
}

onMounted(() => {
	visible.value = true
})
</script>

<template>
	<NModal @after-leave="onAfterLeave()" v-model:show="visible" close-on-esc>
		<NCard class="w-1/2" size="huge">
			<template #header> Создание задачи </template>

			<template #default>
				<NForm @submit.prevent="onSave()" ref="form" :model="formModel" :rules="rules">
					<NFormItem label="Название" path="title">
						<NInput v-model:value="formModel.title" autofocus placeholder="Введите текст" clearable />
					</NFormItem>

					<NFormItem label="Описание" path="description">
						<NInput
							v-model:value="formModel.description"
							type="textarea"
							:autosize="{ maxRows: 8, minRows: 5 }"
							placeholder="Введите текст"
							clearable
						/>
					</NFormItem>

					<NFormItem label="Статус">
						<NSelect
							v-model:value="formModel.status"
							placeholder="Выберите статус"
							:options="getters.getStatusList"
						/>
					</NFormItem>
				</NForm>
			</template>

			<template #action>
				<div class="flex gap-2 justify-end">
					<NButton @click="onSave()" secondary type="success">Сохранить</NButton>
					<NButton @click="onClose()" secondary type="error">Отмена</NButton>
				</div>
			</template>
		</NCard>
	</NModal>
</template>
