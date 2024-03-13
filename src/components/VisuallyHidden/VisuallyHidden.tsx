import type { ElementType, PropsWithChildren, ComponentProps } from 'react'
import './VisuallyHidden.css'

const defaultComponent = 'span';

type VisuallyHiddenProps<ElementTagType extends ElementType> =
  PropsWithChildren
  & Omit<ComponentProps<ElementTagType>, 'as'>
  & { as?: ElementTagType }

export const VisuallyHidden = <T extends ElementType = typeof defaultComponent>(props: VisuallyHiddenProps<T>) => {
  const { children, as: Tag = defaultComponent, ...restProps } = props

  return (
    <Tag className="VisuallyHidden" {...restProps}>
      {children}
    </Tag>
  )
}
