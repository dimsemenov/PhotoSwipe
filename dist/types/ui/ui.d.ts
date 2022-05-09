export default UI;
export type PhotoSwipe = import("../photoswipe").default;
export type UIElementData = import("./ui-element").UIElementData;
declare class UI {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    /** @type {() => void} */
    updatePreloaderVisibility: () => void;
    /** @type {number} */
    _lastUpdatedZoomLevel: number;
    pswp: import("../photoswipe").default;
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
