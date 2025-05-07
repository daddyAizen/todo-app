import { defineStore } from 'pinia'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export type Todo = {
  id: number
  title: string
  text: string
  date: number
  archived: boolean
  user_id?: string
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
  }),
  getters: {
    activeTodos(state): Todo[] {
      return state.todos.filter(todo => !todo.archived)
    },
    archivedTodos(state): Todo[] {
      return state.todos.filter(todo => todo.archived)
    },
  },
  actions: {
    async addTodo(title: string, text: string) {
      const user = useSupabaseUser()
      const client = useSupabaseClient()
    
      if (!user.value) {
        console.error('User not logged in')
        return
      }
    
      const newTodo = {
        title,
        text,
        date: new Date().toISOString(),
        archived: false,
        user_id: user.value.id,
      }
    
      const { data, error } = await client.from('todos').insert([newTodo])
    
      if (error) {
        console.error('Supabase insert error:', error)
        return
      }
    
      if (data) {
        // Optionally store the inserted todo locally with its UUID
        this.todos.unshift({
          ...newTodo,
          id: data[0].id, // Use UUID returned from Supabase
        })
        this.saveToLocalStorage()
      }
    },
    

    async fetchTodos() {
      const client = useSupabaseClient()
      const user = useSupabaseUser()
      

      if (!user.value) return

      const { data, error } = await client
        .from('todos')
        .select('*')
        .eq('user_id', user.value.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching todos:', error)
        return
      }

      this.todos = data as Todo[]
    },

    async archiveTodo(id: number) {
      const client = useSupabaseClient()

      const { error } = await client
        .from('todos')
        .update({ archived: true })
        .eq('id', id)

      if (error) {
        console.error('Error archiving todo:', error)
        return
      }

      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.archived = true
    },

    async restoreTodo(id: number) {
      const client = useSupabaseClient()
  
      // Update the archived field to false in the database
      const { data, error } = await client
        .from('todos')
        .update({ archived: false })
        .eq('id', id)
  
      if (error) {
        console.error('Error restoring todo:', error)
        return
      }
  
      // Update the todo in the state
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.archived = false
      }
    }
    
  },

})
