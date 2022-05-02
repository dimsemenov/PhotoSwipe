export {}

declare global {
  interface Window {
      pswp?: import('./src/js/photoswipe').default;
  }
}
