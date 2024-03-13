import { useCallback, useEffect, useState } from 'react'
import { useLatest } from '@/libs/use-latest'

type TodoItem = {
  id: string;
  done: boolean;
  text: string;
}

const LOCAL_STORAGE_KEY = 'todo-list-items'

function getTodoItemsFromLocalStorage() {
  const rawData = localStorage.getItem(LOCAL_STORAGE_KEY)
  return rawData ? JSON.parse(rawData) as TodoItem[] : null
}

function saveTodoItemsToLocalStorage(data: TodoItem[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return Math.random().toString(16).slice(2)
}

export const useTodoStore = () => {
  const [items, setItems] = useState<TodoItem[]>(() => getTodoItemsFromLocalStorage() ?? [])
  const lastItemsRef = useLatest(items)

  const addItem = useCallback((text: TodoItem['text']) => {
    const newItems = lastItemsRef.current.slice()
    newItems.push({
      id: generateId(),
      done: false,
      text
    })
    setItems(newItems)
  }, [lastItemsRef])

  const removeItem = useCallback((id: TodoItem['id']) => {
    const newItems = lastItemsRef.current.filter((item) => item.id !== id)
    setItems(newItems)
  }, [lastItemsRef])

  const toggleItem = useCallback((id: TodoItem['id']) => {
    const newItems = lastItemsRef.current.map((item) => {
      if (item.id === id) {
        item.done = !item.done
      }
      return item
    })
    setItems(newItems)

  }, [lastItemsRef])

  const changeItemText = useCallback((id: TodoItem['id'], text: TodoItem['text']) => {
    const newItems = lastItemsRef.current.map((item) => {
      if (item.id === id) {
        item.text = text;
      }

      return item;
    })
    setItems(newItems)
  }, [lastItemsRef])

  useEffect(() => {
    function handler() {
      saveTodoItemsToLocalStorage(items)
    }

    window.addEventListener('pagehide', handler)

    return () => {
      window.removeEventListener('pagehide', handler)
    }
  }, [items])

  return {
    items,
    addItem,
    removeItem,
    changeItemText,
    toggleItem
  }
}