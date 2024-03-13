import type { ChangeEventHandler, PropsWithChildren } from "react"
import { useCallback } from "react"
import { Radio } from "@/components/Radio/Radio"
import './FilterItem.css'

type FilterItemProps<ItemType extends string> = PropsWithChildren & {
  value: ItemType;
  checked?: boolean;
  onChange: (value: ItemType) => void;
}

export const FilterItem = <ValueType extends string,>(props: FilterItemProps<ValueType>) => {
  const { onChange } = props

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    onChange(event.target.value as ValueType)
  }, [onChange])

  return (
    <label className="FilterItem">
      <Radio className="FilterItem::Control" value={props.value} checked={props.checked} onChange={changeHandler} />
      <span className="FilterItem::Label">{props.children}</span>
    </label>
  )
}