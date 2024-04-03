import type { FunctionComponent } from 'react'
import './Icon.css'

type IconProps = {
  symbol: string
}

export const Icon: FunctionComponent<IconProps> = (props) => {
  return (
    <svg className="Icon" width="1em" height="1em" aria-hidden="true">
      <use xlinkHref={'#' + props.symbol}></use>
    </svg>
  )
}

export default Icon