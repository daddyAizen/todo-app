<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo";
import { useSupabaseClient } from "#imports";  // Importing supabase client

const todoStore = useTodoStore();
const supabase = useSupabaseClient();

const title = ref("");
const text = ref("");

// Initialize user once the component is mounted
onMounted(() => {
  // Use onAuthStateChange to track the authentication status
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      todoStore.setUser(session.user); // Set user if authenticated
    } else {
      console.log("No authenticated user found");
    }
  });

  // Check if there's an existing session when the component loads
  const { data: { user }, error } = supabase.auth.getSession();

  if (error) {
    console.error("Error fetching user:", error.message);
  } else if (user) {
    todoStore.setUser(user); // Set user if authenticated
  }
});

const addTodo = () => {
  if (title.value.trim() && text.value.trim()) {
    todoStore.addTodo(title.value, text.value);
    title.value = "";
    text.value = "";
  }
};

const archiveTodo = (id: number) => {
  todoStore.archiveTodo(id);
};
</script>

<template>
  <div class="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-2xl mx-auto space-y-6">
      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold">Todo App</h1>
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
            <UButton
              variant="soft"
              size="sm"
              color="yellow"
              @click="archiveTodo(todo.id)"
            >
              Archive
            </UButton>
          </div>
        </template>

        <p class="text-gray-700 dark:text-gray-300">{{ todo.text }}</p>
      </UCard>

      <div class="text-center pt-4">
        <NuxtLink to="/archived" class="text-primary underline"
          >View Archived Todos</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
