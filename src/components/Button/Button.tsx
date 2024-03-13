import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { forwardRef } from 'react'
import clsx from "clsx"
import './Button.css'

type ButtonProps = PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, ...restProps } = props

  return (
    <button className={clsx("Button", className)} type="button" {...restProps} ref={ref}>
      {children}
    </button>
  )
})