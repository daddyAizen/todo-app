<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

const title = ref('')
const text = ref('')

onMounted(() => {
  todoStore.loadFromLocalStorage()
})

const addTodo = () => {
  if (title.value.trim() && text.value.trim()) {
    todoStore.addTodo(title.value, text.value)
    title.value = ''
    text.value = ''
  }
}

const archiveTodo = (id: number) => {
  todoStore.archiveTodo(id)
}
</script>

<template>
  <div class="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-2xl mx-auto space-y-6">
      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold"> Todo App</h1>
        </template>
        <div>
        <div class="space-x-6">
          <UInput v-model="title" placeholder="Todo title" />
          <UTextarea v-model="text" placeholder="Todo description" />
          <UButton color="primary" @click="addTodo">Add Todo</UButton>
        </div>
      </div>
      </UCard>

      <UCard v-for="todo in todoStore.activeTodos" :key="todo.id">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold text-lg">{{ todo.title }}</h2>
              <p class="text-gray-500 text-sm">
                {{ new Date(todo.date).toLocaleString() }}
              </p>
            </div>
            <UButton variant="soft" size="sm" color="yellow" @click="archiveTodo(todo.id)">
              Archive
            </UButton>
          </div>
        </template>

        <p class="text-gray-700 dark:text-gray-300">{{ todo.text }}</p>
      </UCard>

      <div class="text-center pt-4">
        <NuxtLink  to="/archived" class="text-primary underline">View Archived Todos</NuxtLink>
      </div>
    </div>
  </div>
</template>
