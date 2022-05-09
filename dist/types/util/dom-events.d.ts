export default DOMEvents;
export type PoolItem = {
    target: HTMLElement | Window | Document;
    type: string;
    listener: (e: any) => void;
    passive: boolean;
};
/**
 * @typedef {Object} PoolItem
 * @prop {HTMLElement | Window | Document} target
 * @prop {string} type
 * @prop {(e: any) => void} listener
 * @prop {boolean} passive
 */
declare class DOMEvents {
    /**
     * @type {PoolItem[]}
     * @private
     */
    private _pool;
    /**
     * Adds event listeners
     *
     * @param {HTMLElement | Window | Document} target
     * @param {string} type Can be multiple, separated by space.
     * @param {(e: any) => void} listener
     * @param {boolean=} passive
     */
    add(target: HTMLElement | Window | Document, type: string, listener: (e: any) => void, passive?: boolean | undefined): void;
    /**
     * Removes event listeners
     *
     * @param {HTMLElement | Window | Document} target
     * @param {string} type
     * @param {(e: any) => void} listener
     * @param {boolean=} passive
     */
    remove(target: HTMLElement | Window | Document, type: string, listener: (e: any) => void, passive?: boolean | undefined): void;
    /**
     * Removes all bound events
     */
    removeAll(): void;
    /**
     * Adds or removes event
     *
     * @param {HTMLElement | Window | Document} target
     * @param {string} type
     * @param {(e: any) => void} listener
     * @param {boolean} passive
     * @param {boolean=} unbind Whether the event should be added or removed
     * @param {boolean=} skipPool Whether events pool should be skipped
     */
    _toggleListener(target: HTMLElement | Window | Document, type: string, listener: (e: any) => void, passive: boolean, unbind?: boolean | undefined, skipPool?: boolean | undefined): void;
}
