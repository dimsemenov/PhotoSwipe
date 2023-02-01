export default UIElement;
export type PhotoSwipe = import('../photoswipe.js').default;
/**
 * <T>
 */
export type Methods<T> = import('../types.js').Methods<T>;
export type UIElementMarkupProps = {
    isCustomSVG?: boolean | undefined;
    inner: string;
    outlineID?: string | undefined;
    size?: string | number | undefined;
};
export type UIElementData = {
    name?: string | undefined;
    className?: string | undefined;
    html?: UIElementMarkup | undefined;
    isButton?: boolean | undefined;
    tagName?: keyof HTMLElementTagNameMap | undefined;
    title?: string | undefined;
    ariaLabel?: string | undefined;
    onInit?: ((element: HTMLElement, pswp: PhotoSwipe) => void) | undefined;
    onClick?: import("../types.js").Methods<import("../photoswipe.js").default> | ((e: MouseEvent, element: HTMLElement, pswp: PhotoSwipe) => void) | undefined;
    appendTo?: "bar" | "wrapper" | "root" | undefined;
    order?: number | undefined;
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
