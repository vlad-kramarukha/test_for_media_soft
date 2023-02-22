<script setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<template>
	<div class="flex flex-col justify-center items-center w-full h-full">
		<h1 class="font-normal text-xl">Тестовый проект для MediaSoft</h1>
		<NButton color="#6366f1" @click="router.push({ name: 'List' })">Перейти к списку задач</NButton>
	</div>
</template>
