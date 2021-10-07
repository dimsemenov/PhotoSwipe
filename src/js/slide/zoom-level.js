/**
 * Calculates zoom levels for specific slide.
 * Depends on viewport size and image size.
 */

const MAX_IMAGE_WIDTH = 4000;

class ZoomLevel {
  /**
   * @param {Object} options PhotoSwipe options
   * @param {Object} itemData Slide data
   * @param {Integer} index Slide index
   * @param {PhotoSwipe|undefined} pswp PhotoSwipe instance, can be undefined if not initialized yet
   */
  constructor(options, itemData, index, pswp) {
    this.pswp = pswp;
    this.options = options;
    this.itemData = itemData;
    this.index = index;
  }

  /**
   * Calculate initial, secondary and maximum zoom level for the specified slide.
   *
   * It should be called when either image or viewport size changes.
   *
   * @param {Slide} slide
   */
  update(maxWidth, maxHeight, panAreaSize) {
    this.elementSize = {
      x: maxWidth,
      y: maxHeight
    };

    this.panAreaSize = panAreaSize;

    const hRatio = this.panAreaSize.x / this.elementSize.x;
    const vRatio = this.panAreaSize.y / this.elementSize.y;

    this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
    this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);

    // zoom.vFill defines zoom level of the image
    // when it has 100% of viewport vertical space (height)
    this.vFill = Math.min(1, vRatio);

    this.initial = this._getInitial();
    this.secondary = this._getSecondary();
    this.max = Math.max(
      this.initial,
      this.secondary,
      this._getMax()
    );

    this.min = Math.min(
      this.fit,
      this.initial,
      this.secondary
    );

    if (this.pswp) {
      this.pswp.dispatch('zoomLevelsUpdate', { zoomLevels: this, slideData: this.itemData });
    }
  }

  /**
   * Parses user-defined zoom option.
   *
   * @param {Mixed} optionPrefix Zoom level option prefix (initial, secondary, max)
   */
  _parseZoomLevelOption(optionPrefix) {
    // zoom.initial
    // zoom.secondary
    // zoom.max
    const optionValue = this.options[optionPrefix + 'ZoomLevel'];

    if (!optionValue) {
      return;
    }

    if (typeof optionValue === 'function') {
      return optionValue(this);
    }

    if (optionValue === 'fill') {
      return this.fill;
    }

    if (optionValue === 'fit') {
      return this.fit;
    }

    return Number(optionValue);
  }

  /**
   * Get zoom level to which image will be zoomed after double-tap gesture,
   * or when user clicks on zoom icon,
   * or mouse-click on image itself.
   * If you return 1 image will be zoomed to its original size.
   *
   * @return {Number}
   */
  _getSecondary() {
    let currZoomLevel = this._parseZoomLevelOption('secondary');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // 3x of "fit" state, but not larger than original
    currZoomLevel = Math.min(1, this.fit * 3);

    if (currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH) {
      currZoomLevel = MAX_IMAGE_WIDTH / this.elementSize.x;
    }

    return currZoomLevel;
  }

  /**
   * Get initial image zoom level.
   *
   * @return {Number}
   */
  _getInitial() {
    return this._parseZoomLevelOption('initial') || this.fit;
  }

  /**
   * Maximum zoom level when user zooms
   * via zoom/pinch gesture,
   * via cmd/ctrl-wheel or via trackpad.
   *
   * @return {Number}
   */
  _getMax() {
    const currZoomLevel = this._parseZoomLevelOption('max');

    if (currZoomLevel) {
      return currZoomLevel;
    }

    // max zoom level is x4 from "fit state",
    // used for zoom gesture and ctrl/trackpad zoom
    return Math.max(1, this.fit * 4);
  }
}

export default ZoomLevel;
