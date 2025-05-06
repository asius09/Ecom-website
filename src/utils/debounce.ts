export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
