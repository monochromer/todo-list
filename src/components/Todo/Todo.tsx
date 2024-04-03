import type { FunctionComponent } from 'react'
import { memo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden'
import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { EditForm } from '@/components/EditForm/EditForm'
import { Icon } from '@/components/Icon/Icon'
import './Todo.css'

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
        <Icon symbol="pencil" />
      </Button>
      <Button className={'Todo::Button Todo::Delete'} onClick={deleteHandler} title={'Delete todo'}>
        <VisuallyHidden>Delete todo</VisuallyHidden>
        <Icon symbol="trash" />
      </Button>
    </div>
  )
})

Todo.displayName = 'Todo'