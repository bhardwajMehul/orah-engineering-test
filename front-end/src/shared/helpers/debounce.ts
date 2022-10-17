export function debounce(func: () => void, timeout = 2000) {
  let timer: NodeJS.Timeout | undefined

  clearTimeout(timer)
  timer = setTimeout(() => {
    func()
  }, timeout)
}
