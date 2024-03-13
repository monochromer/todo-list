import type { ChangeEventHandler, InputHTMLAttributes } from "react"
import { memo, forwardRef } from "react"
import clsx from "clsx";
import './TextInput.css'

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (text: string) => void;
}

export const TextInput = memo(forwardRef<HTMLInputElement, TextInputProps>(function (props, ref) {
  const { onChange, className, ...restProps } = props;

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value)
  }

  return (
    <input className={clsx("TextInput", className)} onChange={changeHandler} {...restProps} ref={ref} />
  )
}))