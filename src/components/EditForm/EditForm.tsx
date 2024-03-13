import type { FormEventHandler, FunctionComponent, KeyboardEventHandler } from "react"
import { useState } from "react"
import clsx from "clsx";
import { Button } from "@/components/Button/Button"
import { TextInput } from "@/components/TextInput/TextInput"
import './EditForm.css'

type EditFormProps = {
  className?: string;
  initialText: string;
  onEditText: (text: string) => void;
  onCancel: () => void;
}

export const EditForm: FunctionComponent<EditFormProps> = (props) => {
  const [todoText, setTodoText] = useState(props.initialText)

  const sumbitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!todoText) {
      return
    }
    props.onEditText(todoText)
  }

  const resetHandler: FormEventHandler<HTMLFormElement> = () => {
    props.onCancel()
  }

  const onKeyUp: KeyboardEventHandler<HTMLFormElement> = (event) => {
    if (event.code === 'Escape') {
      props.onCancel()
    }
  }

  return (
    <form className={clsx("EditForm", props.className)} onSubmit={sumbitHandler} onReset={resetHandler} onKeyUp={onKeyUp}>
      <TextInput className="EditForm::Input" value={todoText} onChange={setTodoText} autoFocus />
      <Button type="submit">Save</Button>
      <Button type="reset">Cancel</Button>
    </form>
  )
}