import type { FunctionComponent, InputHTMLAttributes } from "react"
import { memo } from "react"
import clsx from "clsx"
import './Radio.css'

export const Radio: FunctionComponent<InputHTMLAttributes<HTMLInputElement>> = memo((props) => {
  const { className, ...restProps } = props
  return (
    <input className={clsx("Radio", className)} type="radio" {...restProps} />
  )
})