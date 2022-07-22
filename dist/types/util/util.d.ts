/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {undefined | null | false | '' | 0} Falsy */
/** @typedef {keyof HTMLElementTagNameMap} HTMLElementTagName */
/**
 * @template {HTMLElementTagName | Falsy} [T="div"]
 * @template {Node | undefined} [NodeToAppendElementTo=undefined]
 * @param {string=} className
 * @param {T=} [tagName]
 * @param {NodeToAppendElementTo=} appendToEl
 * @returns {T extends HTMLElementTagName ? HTMLElementTagNameMap[T] : HTMLElementTagNameMap['div']}
 */
export function createElement<T extends Falsy | keyof HTMLElementTagNameMap = "div", NodeToAppendElementTo extends Node = undefined>(className?: string | undefined, tagName?: T, appendToEl?: NodeToAppendElementTo): T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLDivElement;
/**
 * @param {Point} p1
 * @param {Point} p2
 */
export function equalizePoints(p1: Point, p2: Point): import("../photoswipe.js").Point;
/**
 * @param {Point} p
 */
export function roundPoint(p: Point): void;
/**
 * Returns distance between two points.
 *
 * @param {Point} p1
 * @param {Point} p2
 */
export function getDistanceBetween(p1: Point, p2: Point): number;
/**
 * Whether X and Y positions of points are qual
 *
 * @param {Point} p1
 * @param {Point} p2
 */
export function pointsEqual(p1: Point, p2: Point): boolean;
/**
 * The float result between the min and max values.
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export function clamp(val: number, min: number, max: number): number;
/**
 * Get transform string
 *
 * @param {number} x
 * @param {number=} y
 * @param {number=} scale
 */
export function toTransformString(x: number, y?: number | undefined, scale?: number | undefined): string;
/**
 * Apply transform:translate(x, y) scale(scale) to element
 *
 * @param {HTMLElement} el
 * @param {number} x
 * @param {number=} y
 * @param {number=} scale
 */
export function setTransform(el: HTMLElement, x: number, y?: number | undefined, scale?: number | undefined): void;
/**
 * Apply CSS transition to element
 *
 * @param {HTMLElement} el
 * @param {string=} prop CSS property to animate
 * @param {number=} duration in ms
 * @param {string=} ease CSS easing function
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
 */
export function specialKeyUsed(e: MouseEvent | KeyboardEvent): boolean;
/**
 * Parse `gallery` or `children` options.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement> | string} option
 * @param {string=} legacySelector
 * @param {HTMLElement | Document} [parent]
 * @returns HTMLElement[]
 */
export function getElementsFromOption(option: HTMLElement | NodeListOf<HTMLElement> | string, legacySelector?: string | undefined, parent?: HTMLElement | Document): HTMLElement[];
/**
 * Check if variable is PhotoSwipe class
 *
 * @param {any} fn
 */
export function isPswpClass(fn: any): any;
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
export type Falsy = undefined | null | false | '' | 0;
export type HTMLElementTagName = keyof HTMLElementTagNameMap;
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
