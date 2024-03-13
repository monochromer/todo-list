import { useState, useCallback, useMemo } from 'react'
import { useLatest } from '@/libs/use-latest'
import { useTodoStore } from '@/stores/todo-store'
import './index.css';
import { Todo } from '@/components/Todo/Todo'
import { Layout } from '@/components/Layout/Layout'
import { Form } from '@/components/Form/Form'
import { List } from '@/components/List/List'
import { FilterItem } from '@/components/FilterItem/FilterItem'
import { FilterGroup } from '@/components/FilterGroup/FilterGroup'
import { Badge } from '@/components/Badge/Badge';

type FilterType = 'all' | 'completed' | 'active'

function App() {
  const { items, addItem, changeItemText, removeItem, toggleItem } = useTodoStore()
  const [filter, setFilter] = useState<FilterType>('all')

  const [text, setText] = useState('')
  const lastText = useLatest(text)

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'active': return items.filter((item) => !item.done)
      case 'completed': return items.filter((item) => item.done)
      case 'all':
      default: return items
    }
  }, [items, filter]);

  const counters = useMemo<{[key in FilterType]: number}>(() => {
    const all = items.length
    let completed = 0;

    for (const item of items) {
      if (item.done) {
        completed++
      }
    }
    return {
      all,
      completed,
      active: all - completed
    }
  }, [items])

  const onSubmit  = useCallback(() => {
    const textValue = lastText.current
    if (!textValue) {
      return
    }
    addItem(textValue)
    setText('')
  }, [addItem, lastText])

  const onFilterChange = useCallback((value: FilterType) => {
    setFilter(value)
  }, [setFilter])

  return (
    <Layout
      title={'Todo List'}
      formSlot={
        <>
          <Form onSubmit={onSubmit} onChange={setText} text={text} />
          <FilterGroup>
           {(['all', 'active', 'completed'] as FilterType[]).map((filterValue) => (
              <FilterGroup.Item key={filterValue}>
                <FilterItem <FilterType> onChange={onFilterChange} value={filterValue} checked={filter === filterValue}>
                  {filterValue}
                </FilterItem>
                <Badge>{counters[filterValue]}</Badge>
              </FilterGroup.Item>
            ))}
          </FilterGroup>
        </>
      }
    >
      <List>
        {filteredItems.map((item) => {
          return (
            <Todo key={item.id} id={item.id} text={item.text} done={item.done} onDelete={removeItem} onToggle={toggleItem} onChangeText={changeItemText}
            />
          )
        })}
      </List>
    </Layout>
  )
}

export default App
