<script setup lang="ts">
import { useTodoStore } from "@/stores/todo"; // Pinia store import

const todoStore = useTodoStore();

// Action to restore a todo from the archive
const restoreTodo = (id: number) => {
  todoStore.restoreTodo(id); // Call the Pinia store action
};
</script>

<template>
  <div class="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-2xl mx-auto space-y-6">
      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold">Archived Todos</h1>
        </template>

        <!-- Display archived todos -->
        <div v-if="todoStore.archivedTodos.length" class="space-y-4">
          <UCard
            v-for="todo in todoStore.archivedTodos"
            :key="todo.id"
            class="bg-white dark:bg-gray-800"
          >
            <template #header>
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="font-semibold text-lg">{{ todo.title }}</h2>
                  <p class="text-gray-500 text-sm">
                    {{ new Date(todo.date).toLocaleString() }}
                  </p>
                </div>
                <!-- Restore Button -->
                <UButton
                  color="green"
                  variant="soft"
                  size="sm"
                  @click="restoreTodo(todo.id)"
                >
                  Restore
                </UButton>
              </div>
            </template>

            <p class="text-gray-700 dark:text-gray-300">{{ todo.text }}</p>
          </UCard>
        </div>

        <!-- No archived todos message -->
        <div v-else class="text-center text-gray-500">
          No archived todos yet.
        </div>
      </UCard>

      <div class="text-center pt-4">
        <NuxtLink to="/" class="text-primary underline"
          >← Back to Todos</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
