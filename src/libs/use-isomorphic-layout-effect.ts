import { useLayoutEffect, useEffect } from 'react';

// For SSR support
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
