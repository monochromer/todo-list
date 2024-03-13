import type { FormEventHandler, FunctionComponent } from "react"
import { memo, useEffect, useRef } from "react"
import { Button } from "@/components/Button/Button"
import { TextInput } from "@/components/TextInput/TextInput"
import './Form.css'

type FormProps = {
  onSubmit: () => void
  onChange: (text: string) => void
  text: string
}

export const Form: FunctionComponent<FormProps> = memo((props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    props.onSubmit()
    inputRef.current?.focus()
  }

  useEffect(() => {
    function keyUpHandler(event: KeyboardEvent) {
      const isTextInputInFocus = document.activeElement instanceof HTMLInputElement && document.activeElement?.type === 'text'

      if (event.code === 'Slash' && !(isTextInputInFocus)  ) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keyup', keyUpHandler)

    return () => {
      document.removeEventListener('keyup', keyUpHandler)
    }
  }, [])

  return (
    <form className='Form' onSubmit={submitHandler}>
      <TextInput value={props.text} onChange={props.onChange} placeholder="Enter todo text..." ref={inputRef} />
      <Button type="submit">Create</Button>
    </form>
  )
})