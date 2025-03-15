import { useCallback, useEffect, useRef } from 'react'
import { useForceUpdate } from '@/libs/use-force-update'
import { debounce } from '@/libs/debounce'

type TodoItem = {
  id: string;
  done: boolean;
  text: string;
}

const LOCAL_STORAGE_KEY = 'todo-list-items'

function getTodoItemsFromLocalStorage() {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY)
    return rawData ? JSON.parse(rawData) as TodoItem[] : []
  } catch {
    return []
  }
}

function prepareItems() {
  return new Map((getTodoItemsFromLocalStorage()).map((item) => [item.id, item]))
}

function saveTodoItemsToLocalStorage(map: Map<TodoItem['id'], TodoItem>) {
  const data = [...map.values()]
  const serializedData = JSON.stringify(data)
  localStorage.setItem(LOCAL_STORAGE_KEY, serializedData)
}

function generateId() {
  return Math.random().toString(16).slice(2)
}

export const useTodoStore = () => {
  const update = useForceUpdate()
  const itemsRef = useRef<Map<TodoItem['id'], TodoItem>>(prepareItems())

  const addItem = useCallback((text: TodoItem['text']) => {
    const id = generateId()
    itemsRef.current.set(id, {
      id,
      done: false,
      text,
    })
    update()
  }, [itemsRef, update])

  const removeItem = useCallback((id: TodoItem['id']) => {
    itemsRef.current.delete(id)
    update()
  }, [itemsRef, update])

  const toggleItem = useCallback((id: TodoItem['id']) => {
    const item = itemsRef.current?.get(id)
    if (!item) {
      return
    }
    item.done = !item.done;
    itemsRef.current.set(id, item)
    update()
  }, [itemsRef, update])

  const changeItemText = useCallback((id: TodoItem['id'], text: TodoItem['text']) => {
    const item = itemsRef.current?.get(id)
    if (!item) {
      return
    }
    item.text = text;
    itemsRef.current.set(id, item)
    update()
  }, [itemsRef, update])

  useEffect(() => {
    function localStorageChangeHandler(event: StorageEvent) {
      if (event.key !== LOCAL_STORAGE_KEY) {
        return
      }
      itemsRef.current = prepareItems()
      update()
    }

    window.addEventListener('storage', localStorageChangeHandler)

    return () => {
      window.removeEventListener('storage', localStorageChangeHandler)
    }
  }, [update])

  useEffect(() => {
    const handler = debounce(() => {
      saveTodoItemsToLocalStorage(itemsRef.current)
    }, 0)

    const controller = new AbortController()

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' ) {
        handler()
      }
    }, { signal: controller.signal })
    window.addEventListener('pagehide', handler, { signal: controller.signal })

    return () => {
      controller.abort()
    }
  }, [itemsRef])

  return {
    get items() {
      const map = itemsRef.current;
      return map ? [...map.values()] : []
    },
    addItem,
    removeItem,
    changeItemText,
    toggleItem
  }
}