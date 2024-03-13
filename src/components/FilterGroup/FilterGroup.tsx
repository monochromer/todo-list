import type { FunctionComponent, PropsWithChildren } from "react"
import './FilterGroup.css'

type FilterGroupComponent = FunctionComponent<PropsWithChildren> & {
  Item: FunctionComponent<PropsWithChildren>
}

export const FilterGroup: FilterGroupComponent = (props) => {
  return (
    <div className="FilterGroup">
      {props.children}
    </div>
  )
}

FilterGroup.Item = (props) => {
  return (
    <div className="FilterGroup::Item">
      {props.children}
    </div>
  )
}