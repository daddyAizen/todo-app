import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
  }),

  actions: {
    async getUser() {
      const { $supabase } = useNuxtApp();

      const {
        data: { session },
        error,
      } = await $supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }

      this.user = session?.user ?? null;
    },

    async signIn(email: string, password: string) {
      const { $supabase } = useNuxtApp();

      const { error } = await $supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }

      await this.getUser(); // set the user
    },

    async signOut() {
      const { $supabase } = useNuxtApp();
      await $supabase.auth.signOut();
      this.user = null;
    },
  },
});
