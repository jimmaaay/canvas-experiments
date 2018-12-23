export const debounce = (fn: Function, duration: number) => {
  let timeout: any;
  
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, duration);
  }

}
