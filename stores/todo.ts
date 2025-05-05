import { defineStore } from "pinia";
// Your Supabase client

export type Todo = {
  id: number;
  title: string;
  text: string;
  date: number;
  archived: boolean;
};

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [] as Todo[], // Array of todos
    user: null as any, // The current authenticated user
  }),

  getters: {
    activeTodos(state): Todo[] {
      return state.todos.filter((todo) => !todo.archived); // Active todos (not archived)
    },
    archivedTodos(state): Todo[] {
      return state.todos.filter((todo) => todo.archived); // Archived todos
    },
  },

  actions: {
    // Fetch todos from Supabase for the current user
    async fetchTodos() {
      if (this.user) {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .eq("user_id", this.user.id) // Fetch todos for the logged-in user
          .order("date", { ascending: true }); // Sort by creation date

        if (error) {
          console.error("Error fetching todos:", error);
        } else {
          this.todos = data; // Store the todos locally
        }
      }
    },

    // Add a new todo to Supabase and local state
    async addTodo(title: string, text: string) {
      if (this.user) {
        const { data, error } = await supabase
          .from("todos")
          .insert([
            {
              title,
              text,
              user_id: this.user.id, // Link the todo to the current user
            },
          ])
          .single();

        if (error) {
          console.error("Error adding todo:", error);
        } else {
          this.todos.unshift(data); // Add the new todo to the local list
        }
      }
    },

    // Archive a todo
    async archiveTodo(id: number) {
      const { data, error } = await supabase
        .from("todos")
        .update({ archived: true })
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error archiving todo:", error);
      } else {
        // Update the todo in the local state
        const todo = this.todos.find((t) => t.id === id);
        if (todo) todo.archived = true;
      }
    },

    // Restore a todo from the archived state
    async restoreTodo(id: number) {
      const { data, error } = await supabase
        .from("todos")
        .update({ archived: false })
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error restoring todo:", error);
      } else {
        // Update the todo locally to reflect the change
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
          todo.archived = false;
        }
      }
    },

    // Set the user once they are authenticated
    async setUser(user: any) {
      const user = supabase.auth.user(); // Get current authenticated user
      if (user) {
        this.user = user;
        await this.fetchTodos(); // Fetch todos for the user after authentication
      }
    },

    // Log out the current user
    async logout() {
      await supabase.auth.signOut(); // Supabase signOut function
      this.user = null; // Reset user data
    },
  },
});
