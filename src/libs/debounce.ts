type AnyFunction = (...args: unknown[]) => unknown

type ReturnedFunction = AnyFunction & {
  cancel: () => void
}

export const debounce = (fn: AnyFunction, delay = 0): ReturnedFunction => {
  let context: unknown
  let args: unknown[]
  let timeoutId: number | null = null

  const wrapper: ReturnedFunction = function(this: unknown, ...newArgs: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    args = newArgs

    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }

  wrapper.cancel = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }
  }

  return wrapper
}