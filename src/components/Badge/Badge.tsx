import type { FunctionComponent, PropsWithChildren } from 'react'
import './Badge.css'

export const Badge: FunctionComponent<PropsWithChildren> = (props) => {
  return (
    <span className="Badge">{props.children}</span>
  )
}