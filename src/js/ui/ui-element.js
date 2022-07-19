import { createElement } from '../util/util.js';

/** @typedef {import('../photoswipe.js').default} PhotoSwipe */

/**
 * @template T
 * @typedef {import('../types.js').Methods<T>} Methods<T>
 */

/**
 * @typedef {Object} UIElementMarkupProps
 * @prop {boolean=} isCustomSVG
 * @prop {string} inner
 * @prop {string=} outlineID
 * @prop {number | string} [size]
 */

/**
 * @typedef {Object} UIElementData
 * @prop {DefaultUIElements | string} [name]
 * @prop {string=} className
 * @prop {UIElementMarkup=} html
 * @prop {boolean=} isButton
 * @prop {keyof HTMLElementTagNameMap} [tagName]
 * @prop {string=} title
 * @prop {string=} ariaLabel
 * @prop {(element: HTMLElement, pswp: PhotoSwipe) => void} [onInit]
 * @prop {Methods<PhotoSwipe> | ((e: MouseEvent, element: HTMLElement, pswp: PhotoSwipe) => void)} [onClick]
 * @prop {'bar' | 'wrapper' | 'root'} [appendTo]
 * @prop {number=} order
 */

/** @typedef {'arrowPrev' | 'arrowNext' | 'close' | 'zoom' | 'counter'} DefaultUIElements */

/** @typedef {string | UIElementMarkupProps} UIElementMarkup */

/**
 * @param {UIElementMarkup} [htmlData]
 */
 //rename create SVG
 function addElementHTML(htmlData) {
  // Icons may contain outline/shadow,
  // to make it we "clone" base icon shape and add border to it.
  // Icon itself and border are styled via CSS.
  //
  // Property shadowID defines ID of element that should be cloned.
  if (typeof htmlData !== 'string'){ 
    const svgData = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    
    svgData.setAttribute("aria-hidden","true");
    svgData.setAttribute("class",htmlData.outlineID);
    var viewBoxSize = (htmlData.size || 32);
    svgData.setAttribute("viewBox",`0 0 ${viewBoxSize} ${viewBoxSize}`);
    svgData.setAttribute("width",`${viewBoxSize}`);
    svgData.setAttribute("height",`${viewBoxSize}`);

    if (htmlData.outlineID) {
      var svgNS = svgData.namespaceURI;
      var useElem = document.createElementNS("http://www.w3.org/2000/svg",'path');
      useElem.setAttribute("class",htmlData.outlineID);
      useElem.setAttribute("xlink:href",`# + ${htmlData.outlineID} + `);
      svgData.appendChild(useElem);
    }
    return svgData;
  }
}

class UIElement {
  /**
   * @param {PhotoSwipe} pswp
   * @param {UIElementData} data
   */
  constructor(pswp, data) {
    const name = data.name || data.className;
    let elementHTML = data.html;

    // @ts-expect-error lookup only by `data.name` maybe?
    if (pswp.options[name] === false) {
      // exit if element is disabled from options
      return;
    }

    // Allow to override SVG icons from options
    // @ts-expect-error lookup only by `data.name` maybe?
    if (typeof pswp.options[name + 'SVG'] === 'string') {
      // arrowPrevSVG
      // arrowNextSVG
      // closeSVG
      // zoomSVG
      // @ts-expect-error lookup only by `data.name` maybe?
      elementHTML = pswp.options[name + 'SVG'];
    }

    pswp.dispatch('uiElementCreate', { data });

    let className = '';
    if (data.isButton) {
      className += 'pswp__button ';
      className += (data.className || `pswp__button--${data.name}`);
    } else {
      className += (data.className || `pswp__${data.name}`);
    }

    /** @type {HTMLElement} */
    let element;
    let tagName = data.isButton ? (data.tagName || 'button') : (data.tagName || 'div');
    tagName = /** @type {keyof HTMLElementTagNameMap} */ (tagName.toLowerCase());
    element = createElement(className, tagName);

    if (data.isButton) {
      // create button element
      element = createElement(className, tagName);
      if (tagName === 'button') {
        /** @type {HTMLButtonElement} */ (element).type = 'button';
      }

      let { title } = data;
      const { ariaLabel } = data;

      // @ts-expect-error lookup only by `data.name` maybe?
      if (typeof pswp.options[name + 'Title'] === 'string') {
        // @ts-expect-error lookup only by `data.name` maybe?
        title = pswp.options[name + 'Title'];
      }

      if (title) {
        element.title = title;
      }

      if (ariaLabel || title) {
        /** @type {HTMLElement} */ (element).setAttribute('aria-label', ariaLabel || title);
      }
    }

    if (elementHTML instanceof TrustedHTML) {
      element.innerHTML = elementHTML.toString();
    } else if (!elementHTML || (typeof elementHTML !== 'string' && !elementHTML.isCustomSVG)) {
      element.innerText = '';
    } else {
        element.append(addElementHTML(elementHTML));
        //element.innerHTML = addElementHTML(elementHTML).toString();
    }



    if (data.onInit) {
      data.onInit(element, pswp);
    }

    if (data.onClick) {
      element.onclick = (e) => {
        if (typeof data.onClick === 'string') {
          pswp[data.onClick]();
        } else {
          data.onClick(e, element, pswp);
        }
      };
    }

    // Top bar is default position
    const appendTo = data.appendTo || 'bar';
    let container;
    if (appendTo === 'bar') {
      if (!pswp.topBar) {
        pswp.topBar = createElement('pswp__top-bar pswp__hide-on-close', 'div', pswp.scrollWrap);
      }
      container = pswp.topBar;
    } else {
      // element outside of top bar gets a secondary class
      // that makes element fade out on close
      element.classList.add('pswp__hide-on-close');

      if (appendTo === 'wrapper') {
        container = pswp.scrollWrap;
      } else {
        // root element
        container = pswp.element;
      }
    }

    container.appendChild(pswp.applyFilters('uiElement', element, data));
  }
}

export default UIElement;
