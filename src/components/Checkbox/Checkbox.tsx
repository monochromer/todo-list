import type { FunctionComponent, InputHTMLAttributes } from "react"
import { memo } from "react"
import clsx from "clsx"
import './Checkbox.css'

export const Checkbox: FunctionComponent<InputHTMLAttributes<HTMLInputElement>> = memo((props) => {
  const { className, ...restProps } = props
  return (
    <input className={clsx("Checkbox", className)} type="checkbox" {...restProps} />
  )
})