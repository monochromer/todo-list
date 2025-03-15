import { useReducer } from 'react'

export const useForceUpdate = () => {
  const [, dispatch] = useReducer(() => performance.now(), 0)
  return dispatch
}
