<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/authStore";

onMounted(() => {
  useAuthStore().getUser();
});
</script>
