/**
 * Dynamically load CSS file.
 *
 * Based on loadCSS by Filament Group:
 * https://github.com/filamentgroup/loadCSS
 * https://filamentgroup.com
 *
 * @param {String} href URL
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // try to find existing CSS with the same href
    let link = document.head.querySelector(`link[href="${href}"]`);

    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'all';
      document.head.appendChild(link);
    } else if (link.dataset.loaded) {
      // already loaded
      resolve();
      return;
    }

    link.onload = () => {
      link.dataset.loaded = true;
      requestAnimationFrame(() => resolve());
    };
    link.onerror = () => {
      link.remove();
      reject();
    };
  });
}
