<script setup>
import { NCard, NButton, NTag } from 'naive-ui'
</script>

<template>
	<NCard size="huge" hoverable>
		<template #header> Задача </template>

		<template #header-extra>
			<NTag round type="warning" :bordered="false">Выполнить</NTag>
		</template>

		<template #default>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, totam fuga voluptas officia tempora
			doloribus ex, similique non porro eveniet officiis ipsam quaerat? Mollitia nulla vel repellat repudiandae
			distinctio fuga eos atque? Veritatis perspiciatis consequatur assumenda blanditiis ea porro atque similique
			facere magni illo aliquam fugit repudiandae, nihil earum laboriosam saepe quibusdam cum temporibus deserunt
			eveniet iure consequuntur reprehenderit minus neque? Mollitia et corrupti odio facilis ratione labore
			accusamus reiciendis ducimus pariatur tenetur dicta in corporis error perferendis consectetur, quia sapiente
			temporibus, non enim voluptates eos. Deleniti eaque non sit repellendus nihil inventore, nulla voluptatem a
			ad quia hic placeat?
		</template>

		<template #action>
            <div class="flex justify-between">
                <span>Data</span>

                <div class="flex gap-2">
                    <NButton size="small" secondary>Выполнить</NButton>
                    <NButton size="small" secondary>Выполняется</NButton>
                    <NButton size="small" secondary>Выполнена</NButton>
                    <NButton size="small" secondary type="error">Удалить</NButton>
                </div>
            </div>
		</template>
	</NCard>
</template>
