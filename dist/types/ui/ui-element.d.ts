export default UIElement;
export type PhotoSwipe = import('../photoswipe.js').default;
/**
 * <T>
 */
export type Methods<T> = import('../types.js').Methods<T>;
export type UIElementMarkupProps = {
    isCustomSVG?: boolean;
    inner: string;
    outlineID?: string;
    size?: number | string;
};
export type UIElementData = {
    name?: DefaultUIElements | string;
    className?: string;
    html?: UIElementMarkup;
    isButton?: boolean;
    tagName?: keyof HTMLElementTagNameMap;
    title?: string;
    ariaLabel?: string;
    onInit?: (element: HTMLElement, pswp: PhotoSwipe) => void;
    onClick?: import("../types.js").Methods<import("../photoswipe.js").default> | ((e: MouseEvent, element: HTMLElement, pswp: PhotoSwipe) => void);
    appendTo?: 'bar' | 'wrapper' | 'root';
    order?: number;
};
export type DefaultUIElements = 'arrowPrev' | 'arrowNext' | 'close' | 'zoom' | 'counter';
export type UIElementMarkup = string | UIElementMarkupProps;
declare class UIElement {
    /**
     * @param {PhotoSwipe} pswp
     * @param {UIElementData} data
     */
    constructor(pswp: PhotoSwipe, data: UIElementData);
}
