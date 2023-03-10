<script setup>
import { NModal, NCard, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { reactive, onMounted, ref, shallowRef, defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import clone from 'lodash/clone'
import uniqueId from 'lodash/uniqueId'
import findKey from 'lodash/findKey'
import find from 'lodash/find'

const router = useRouter()
const { dispatch, getters } = useStore()

const props = defineProps({
	id: [String, Number]
})

const formModel = reactive({
	title: '',
	description: '',
	status: 'isTodo'
})

const visible = shallowRef(false)
const form = ref(null)
const rules = {
	title: {
		required: true,
		message: 'Необходимо заполнить поле название задачи',
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

	return { title, description, ...defaultTodoStatus, id: +props.id || uniqueId() }
}

function onSave() {
	const { validate } = form.value

	validate((errors) => {
		if (!errors) {
			dispatch(!props.id ? 'createTodo' : 'saveTodoAfterRedact', makeTodo())
			onClose()
		}
	})
}

function onClose() {
	visible.value = false
}

function onAfterLeave() {
	router.push({ name: 'List' })
}

onMounted(() => {
	visible.value = true

	if (props.id) {
		const todo = find(getters.getList, ['id', +props.id])
		const { title, description } = todo

		formModel.title = title
		formModel.description = description
		formModel.status = findKey(todo, (v) => v === true)
	}
})
</script>

<template>
	<NModal @after-leave="onAfterLeave()" v-model:show="visible" :mask-closable="false" close-on-esc>
		<NCard style="width: 700px" size="huge">
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
