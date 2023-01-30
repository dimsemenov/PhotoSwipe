export default UI;
export type PhotoSwipe = import('../photoswipe.js').default;
export type UIElementData = import('./ui-element.js').UIElementData;
declare class UI {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp: PhotoSwipe);
    pswp: import("../photoswipe.js").default;
    isRegistered: boolean;
    /** @type {UIElementData[]} */
    uiElementsData: UIElementData[];
    /** @type {(UIElement | UIElementData)[]} */
    items: (UIElement | UIElementData)[];
    /** @type {() => void} */
    updatePreloaderVisibility: () => void;
    /**
     * @private
     * @type {number | undefined}
     */
    private _lastUpdatedZoomLevel;
    init(): void;
    /**
     * @param {UIElementData} elementData
     */
    registerElement(elementData: UIElementData): void;
    /**
     * Fired each time zoom or pan position is changed.
     * Update classes that control visibility of zoom button and cursor icon.
     *
     * @private
     */
    private _onZoomPanUpdate;
}
import UIElement from "./ui-element.js";
