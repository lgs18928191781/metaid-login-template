let timeout
export const debounce =(func, wait, immediate)=>{
    if (timeout) {
        clearTimeout(timeout);
      }
    if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait);
    if(callNow) func();
      } else {
        timeout = setTimeout(() => {
          func();
        }, wait);
      }
}