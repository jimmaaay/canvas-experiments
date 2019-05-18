export const debounce = (fn: Function, duration: number) => {
  let timeout: any;
  
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, duration);
  }

}


export const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}