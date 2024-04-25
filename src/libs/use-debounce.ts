import { useEffect, useState } from 'react'

export function useDebounce<ValueType>(value: ValueType, time: number = 0) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setState(value);
    }, time)

    return () => {
      clearTimeout(timerId)
    }
  }, [value, time]);

  return state;
}