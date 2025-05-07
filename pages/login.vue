<template>
    <div class="w-full max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Login to your account</h2>
  
      <form 
      class="space-y-4" @submit.prevent="() => (isSignUp ? signUp() : login())">
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
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          <span v-if="isSignUp"> Sign up </span>
          <span v-else>Login</span>
        </button>
      </form>
      <p class="text-sm mt-4 text-center">
  {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
  <span
    class="text-primary cursor-pointer underline ml-1"
    @click="isSignUp = !isSignUp"
  >
    {{ isSignUp ? 'Login' : 'Sign Up' }}
  </span>
</p>
      
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watchEffect } from "vue";

definePageMeta({
    middleware: ['auth']
  })

  const email = ref('')
  const password = ref('')
  const isSignUp = ref(false)
  const client = useSupabaseClient()

  const signUp = async () => {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) {
    console.error('Signup error:', error.message)
  } else {
    console.log('Signup success:', data)
  }
  }

  const login = async () => {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
      
  })
  if (error) {
    console.error('Login error:', error.message)
  } else {
    console.log('Login success:', data)
    navigateTo('/')
  }
}


const user = useSupabaseUser()
onMounted(() => {
  if (user.value) {
    // Already logged in
    navigateTo('/')
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('Auth state changed: signed in', session.user)
      navigateTo('/')
    }
  })
})

</script>
