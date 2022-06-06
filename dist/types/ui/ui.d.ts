export default UI;
export type PhotoSwipe = import('../photoswipe.js').default;
export type UIElementData = import('./ui-element.js').UIElementData;
declare class UI {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("../photoswipe.js").default;
    /** @type {() => void} */
    updatePreloaderVisibility: () => void;
    /** @type {number} */
    _lastUpdatedZoomLevel: number;
    init(): void;
    isRegistered: boolean;
    /** @type {UIElementData[]} */
    uiElementsData: UIElementData[];
    /** @type {(UIElement | UIElementData)[]} */
    items: (UIElement | UIElementData)[];
    /**
     * @param {UIElementData} elementData
     */
    registerElement(elementData: UIElementData): void;
    /**
     * Fired each time zoom or pan position is changed.
     * Update classes that control visibility of zoom button and cursor icon.
     */
    _onZoomPanUpdate(): void;
}
import UIElement from "./ui-element.js";
