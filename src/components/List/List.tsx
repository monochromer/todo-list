import type { PropsWithChildren, ReactElement, ReactNode } from "react"
import { Children, cloneElement, isValidElement } from 'react'
import './List.css'

function filterChildren<ItemProps>(children: ReactNode | undefined): ReactElement<ItemProps>[] {
  const items = Children.toArray(children)
    .filter((childNode) => isValidElement<ItemProps>(childNode))

    return items as ReactElement<ItemProps>[];
}

export const List = <ItemType,>(props: PropsWithChildren) => {
  const items = filterChildren<ItemType>(props.children)

  return (
    <ul className="List">
      {items.map((childNode, index) => {
        const element = cloneElement(childNode)
        return (
          <li key={element.key ?? index}>
            {element}
          </li>
        )
      })}
    </ul>
  )
}