import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/libs/use-isomorphic-layout-effect';

export const useLatest = <ValueType>(value: ValueType) => {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
