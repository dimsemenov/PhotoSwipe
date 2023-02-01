/** @typedef {import('../photoswipe.js').Point} Point */
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {string} className
 * @param {T} tagName
 * @param {Node} [appendToEl]
 * @returns {HTMLElementTagNameMap[T]}
 */
export function createElement<T extends keyof HTMLElementTagNameMap>(className: string, tagName: T, appendToEl?: Node | undefined): HTMLElementTagNameMap[T];
/**
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Point}
 */
export function equalizePoints(p1: Point, p2: Point): Point;
/**
 * @param {Point} p
 */
export function roundPoint(p: Point): void;
/**
 * Returns distance between two points.
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
export function getDistanceBetween(p1: Point, p2: Point): number;
/**
 * Whether X and Y positions of points are equal
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns {boolean}
 */
export function pointsEqual(p1: Point, p2: Point): boolean;
/**
 * The float result between the min and max values.
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val: number, min: number, max: number): number;
/**
 * Get transform string
 *
 * @param {number} x
 * @param {number} [y]
 * @param {number} [scale]
 * @returns {string}
 */
export function toTransformString(x: number, y?: number | undefined, scale?: number | undefined): string;
/**
 * Apply transform:translate(x, y) scale(scale) to element
 *
 * @param {HTMLElement} el
 * @param {number} x
 * @param {number} [y]
 * @param {number} [scale]
 */
export function setTransform(el: HTMLElement, x: number, y?: number | undefined, scale?: number | undefined): void;
/**
 * Apply CSS transition to element
 *
 * @param {HTMLElement} el
 * @param {string} [prop] CSS property to animate
 * @param {number} [duration] in ms
 * @param {string} [ease] CSS easing function
 */
export function setTransitionStyle(el: HTMLElement, prop?: string | undefined, duration?: number | undefined, ease?: string | undefined): void;
/**
 * Apply width and height CSS properties to element
 *
 * @param {HTMLElement} el
 * @param {string | number} w
 * @param {string | number} h
 */
export function setWidthHeight(el: HTMLElement, w: string | number, h: string | number): void;
/**
 * @param {HTMLElement} el
 */
export function removeTransitionStyle(el: HTMLElement): void;
/**
 * @param {HTMLImageElement} img
 * @returns {Promise<HTMLImageElement | void>}
 */
export function decodeImage(img: HTMLImageElement): Promise<HTMLImageElement | void>;
/**
 * Check if click or keydown event was dispatched
 * with a special key or via mouse wheel.
 *
 * @param {MouseEvent | KeyboardEvent} e
 * @returns {boolean}
 */
export function specialKeyUsed(e: MouseEvent | KeyboardEvent): boolean;
/**
 * Parse `gallery` or `children` options.
 *
 * @param {import('../photoswipe.js').ElementProvider} [option]
 * @param {string} [legacySelector]
 * @param {HTMLElement | Document} [parent]
 * @returns HTMLElement[]
 */
export function getElementsFromOption(option?: import("../photoswipe.js").ElementProvider | undefined, legacySelector?: string | undefined, parent?: Document | HTMLElement | undefined): HTMLElement[];
/**
 * Check if variable is PhotoSwipe class
 *
 * @param {any} fn
 * @returns {boolean}
 */
export function isPswpClass(fn: any): boolean;
/**
 * Check if browser is Safari
 *
 * @returns {boolean}
 */
export function isSafari(): boolean;
/** @typedef {LOAD_STATE[keyof LOAD_STATE]} LoadState */
/** @type {{ IDLE: 'idle'; LOADING: 'loading'; LOADED: 'loaded'; ERROR: 'error' }} */
export const LOAD_STATE: {
    IDLE: 'idle';
    LOADING: 'loading';
    LOADED: 'loaded';
    ERROR: 'error';
};
export type Point = import('../photoswipe.js').Point;
export type LoadState = {
    IDLE: "idle";
    LOADING: "loading";
    LOADED: "loaded";
    ERROR: "error";
}[keyof {
    IDLE: "idle";
    LOADING: "loading";
    LOADED: "loaded";
    ERROR: "error";
}];
