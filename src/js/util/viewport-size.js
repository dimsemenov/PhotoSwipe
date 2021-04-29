export function getViewportSize(options, pswp) {
  if (options.getViewportSizeFn) {
    const newViewportSize = options.getViewportSizeFn(options, pswp);
    if (newViewportSize) {
      return newViewportSize;
    }
  }

  return {
    x: document.documentElement.clientWidth,

    // TODO: height on mobile is very incosistent due to toolbar
    // find a way to improve this
    //
    // document.documentElement.clientHeight - doesn't seem to work well
    y: window.innerHeight
  };
}

export function getPanAreaSize(options, viewportSize/*, pswp*/) {
  return {
    x: viewportSize.x - (options.paddingLeft || 0) - (options.paddingRight || 0),
    y: viewportSize.y - (options.paddingTop || 0) - (options.paddingBottom || 0)
  };
}
