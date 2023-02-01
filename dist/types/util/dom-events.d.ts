export default DOMEvents;
export type PoolItem = {
    target: HTMLElement | Window | Document | undefined | null;
    type: string;
    listener: EventListenerOrEventListenerObject;
    passive?: boolean | undefined;
};
/**
 * @typedef {Object} PoolItem
 * @prop {HTMLElement | Window | Document | undefined | null} target
 * @prop {string} type
 * @prop {EventListenerOrEventListenerObject} listener
 * @prop {boolean} [passive]
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
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type Can be multiple, separated by space.
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     */
    add(target: PoolItem['target'], type: PoolItem['type'], listener: PoolItem['listener'], passive?: PoolItem['passive']): void;
    /**
     * Removes event listeners
     *
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     */
    remove(target: PoolItem['target'], type: PoolItem['type'], listener: PoolItem['listener'], passive?: PoolItem['passive']): void;
    /**
     * Removes all bound events
     */
    removeAll(): void;
    /**
     * Adds or removes event
     *
     * @private
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     * @param {boolean} [unbind] Whether the event should be added or removed
     * @param {boolean} [skipPool] Whether events pool should be skipped
     */
    private _toggleListener;
}
