<template>
  <div class="w-full max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Login to your account</h2>

    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>

    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSupabaseClient } from "#imports";
import { useTodoStore } from "@/stores/todo"; // Import the todo store

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false); // Loading state

const router = useRouter();
const supabase = useSupabaseClient();
const todoStore = useTodoStore(); // Use the todo store

const login = async () => {
  error.value = ""; // Reset previous errors
  loading.value = true; // Set loading to true during the login process

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loading.value = false; // Set loading to false after login attempt

  if (loginError) {
    console.log("Login error:", loginError.message);
    error.value = loginError.message;
    return;
  }

  console.log("Login successful", data);
  
  // Set user in the store
  todoStore.setUser();

  router.push("/"); // Redirect to the home page (or previously intended page)
};
</script>
