import type { FunctionComponent } from 'react'
import { memo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden'
import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import './Todo.css'
import { EditForm } from '../EditForm/EditForm'

export type TodoProps = {
  id: string;
  done: boolean;
  text: string;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onChangeText: (id: string, text: string) => void;
}

export const Todo: FunctionComponent<TodoProps> = memo((props) => {
  const [isEditMode, setEditMode] = useState(false)
  const editButtonRef = useRef<HTMLButtonElement | null>(null)

  const deleteHandler = () => {
    props.onDelete(props.id)
  }

  const toggleHandler = () => {
    props.onToggle(props.id)
  }

  const enterEditMode = () => {
    setEditMode(true)
  }

  const exitEditMode = () => {
    setEditMode(false)
    requestAnimationFrame(() => {
      editButtonRef.current?.focus()
    })
  }

  const onChangeTextSubmit = (text: string) => {
    props.onChangeText(props.id, text)
    exitEditMode()
  }

  return (
    <div className={clsx('Todo', { 'Todo:Completed': props.done, 'Todo:EditMode': isEditMode })}>
      <Checkbox className={'Todo::Checkbox'} checked={props.done} onChange={toggleHandler} />
      <div className={'Todo::Main'}>
        {isEditMode
          ? <EditForm initialText={props.text} onEditText={onChangeTextSubmit} onCancel={exitEditMode} />
          : <p className='Todo::Text'>{props.text}</p>
        }
      </div>
      <Button className={'Todo::Button'} onClick={enterEditMode} ref={editButtonRef} title={'Edit todo'}>
        <VisuallyHidden>Edit todo</VisuallyHidden>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </Button>
      <Button className={'Todo::Button Todo::Delete'} onClick={deleteHandler} title={'Delete todo'}>
        <VisuallyHidden>Delete todo</VisuallyHidden>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </Button>
    </div>
  )
})

Todo.displayName = 'Todo'