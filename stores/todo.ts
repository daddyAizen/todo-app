// stores/todo.ts
import { defineStore } from 'pinia'

export type Todo = {
  id: number
  title: string
  text: string
  date: number
  archived: boolean
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
    addTodo(title: string, text: string) {
      const newTodo: Todo = {
        id: Date.now(),
        title,
        text,
        date: Date.now(),
        archived: false,
      }
      this.todos.unshift(newTodo)
      this.saveToLocalStorage()
    },
    archiveTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.archived = true
        this.saveToLocalStorage()
      }
    },
    restoreTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.archived = false
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('todos')
      if (saved) {
        this.todos = JSON.parse(saved)
      }
    },
  },
})
