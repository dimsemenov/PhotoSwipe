import assert from 'node:assert/strict';
import Slide from '../src/js/slide/slide.js';
import PanBounds from '../src/js/slide/pan-bounds.js';

// Exercise the real slide and bounds methods; replace only browser/rendering services.
function createSlide({
  width = 800,
  height = 600,
  initial = 1,
  viewport = { x: 1000, y: 800 },
  padding = 0
} = {}) {
  const events = [];
  const transitions = [];
  const displayedSizes = [];
  let stopped = 0;
  const slide = Object.create(Slide.prototype);
  Object.assign(slide, {
    width,
    height,
    data: {},
    index: 0,
    currentResolution: 0,
    currZoomLevel: initial,
    pan: { x: 0, y: 0 },
    panAreaSize: { x: viewport.x - padding * 2, y: viewport.y - padding * 2 },
    zoomLevels: { initial, min: initial, max: 3, fit: initial },
    container: { style: {} },
    content: {
      isZoomable: () => true,
      setDisplayedSize: (...size) => displayedSizes.push(size)
    },
    pswp: {
      options: {
        padding: { top: padding, bottom: padding, left: padding, right: padding },
        easing: 'ease'
      },
      viewportSize: viewport,
      getViewportCenterPoint: () => ({ x: viewport.x / 2, y: viewport.y / 2 }),
      mainScroll: { isShifted: () => false },
      dispatch: (name, detail) => { events.push({ name, detail }); return {}; },
      animations: {
        stopAllPan: () => { stopped += 1; },
        startTransition: transition => transitions.push(transition)
      }
    }
  });
  slide.pswp.currSlide = slide;
  slide.bounds = new PanBounds(slide);
  slide.zoomAndPanToInitial();
  return { slide, events, transitions, displayedSizes, stopped: () => stopped };
}

function near(actual, expected, tolerance = 1) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${actual} differs from ${expected} by more than ${tolerance}`
  );
}

function imagePoint(slide, point) {
  return { x: (point.x - slide.pan.x) / slide.currZoomLevel, y: (point.y - slide.pan.y) / slide.currZoomLevel };
}

const cases = [];
function test(name, run) { cases.push({ name, run }); }

for (const [name, dimensions, expected] of [
  ['both axes smaller than viewport', { width: 200, height: 100 }, { x: 500, y: 500 }],
  ['one axis smaller than viewport', { width: 200, height: 600 }, { x: 500, y: 0 }],
  ['both axes larger than viewport', { width: 800, height: 600 }, { x: -100, y: 0 }]
]) {
  test(`ignoreBounds preserves pointer anchor with ${name}`, () => {
    const { slide } = createSlide(dimensions);
    slide.zoomTo(2, { x: 300, y: 200 }, 0, true);
    assert.deepEqual(slide.pan, expected);
  });
}

test('ignoreBounds permits whitespace beyond both pan limits', () => {
  const { slide } = createSlide();
  slide.zoomTo(2, { x: 50, y: 50 }, 0, true);
  assert.deepEqual(slide.pan, { x: 150, y: 150 });
  slide.zoomTo(1, { x: 950, y: 750 }, 0, true);
  assert.deepEqual(slide.pan, { x: 550, y: 450 });
  const { slide: opposite } = createSlide();
  opposite.zoomTo(2, { x: 950, y: 750 }, 0, true);
  assert.deepEqual(opposite.pan, { x: -750, y: -550 });
});

for (const ignoreBounds of [false, undefined]) {
  test(`${String(ignoreBounds)} retains pan clamping and small-image centering`, () => {
    const { slide } = createSlide();
    slide.zoomTo(2, { x: 50, y: 50 }, 0, ignoreBounds);
    assert.deepEqual(slide.pan, { x: 0, y: 0 });
    const { slide: small } = createSlide({ width: 200, height: 100 });
    small.zoomTo(2, { x: 300, y: 200 }, 0, ignoreBounds);
    assert.deepEqual(small.pan, { x: 300, y: 300 });
    slide.zoomTo(1, { x: 950, y: 750 }, 0, ignoreBounds);
    assert.deepEqual(slide.pan, { x: 100, y: 100 });
  });
  test(`${String(ignoreBounds)} retains minimum and maximum zoom`, () => {
    const { slide } = createSlide();
    slide.zoomTo(0.25, undefined, 0, ignoreBounds);
    assert.equal(slide.currZoomLevel, 1);
    slide.zoomTo(5, undefined, 0, ignoreBounds);
    assert.equal(slide.currZoomLevel, 3);
  });
}

test('ignoreBounds bypasses both zoom limits', () => {
  const { slide } = createSlide();
  slide.zoomTo(0.25, undefined, 0, true);
  assert.equal(slide.currZoomLevel, 0.25);
  slide.zoomTo(5, undefined, 0, true);
  assert.equal(slide.currZoomLevel, 5);
});

test('omitted pointer defaults to viewport center without recentering a free pan', () => {
  const { slide } = createSlide({ width: 200, height: 100 });
  slide.zoomTo(2, { x: 300, y: 200 }, 0, true);
  slide.zoomTo(3, undefined, 0, true);
  assert.deepEqual(slide.pan, { x: 500, y: 550 });
});

test('portrait wheel level 160 keeps the reported off-center anchor', () => {
  const initial = 780 / 1400;
  const { slide } = createSlide({
    width: 800,
    height: 1400,
    initial,
    viewport: { x: 1280, y: 800 },
    padding: 10
  });
  slide.zoomTo(initial * 1.007 ** 160, { x: 500, y: 300 }, 0, true);
  assert.deepEqual(slide.pan, { x: 247, y: -585 });
  assert.equal(slide.currentResolution, slide.currZoomLevel);
  assert.equal(slide.container.style.transform, slide.getCurrentTransform());
});

test('centered zoom keeps the image centered', () => {
  const { slide } = createSlide();
  slide.zoomTo(2, { x: 500, y: 400 }, 0, true);
  assert.deepEqual(slide.pan, { x: -300, y: -200 });
});

test('portrait reproduction preserves the pointer through repeated zoom across fit', () => {
  const { slide } = createSlide({
    width: 800,
    height: 1400,
    initial: 780 / 1400,
    viewport: { x: 1280, y: 800 },
    padding: 10
  });
  const pointer = { x: 500, y: 300 };
  const anchored = imagePoint(slide, pointer);
  for (const zoom of [0.7, 0.9, 1.3, 1.7, 1.3, 0.9, 0.7, 780 / 1400]) {
    const previous = imagePoint(slide, pointer);
    slide.zoomTo(zoom, pointer, 0, true);
    const current = imagePoint(slide, pointer);
    near(current.x, previous.x, 0.5 / zoom + 1e-9);
    near(current.y, previous.y, 0.5 / zoom + 1e-9);
  }
  const finalPoint = imagePoint(slide, pointer);
  near(finalPoint.x, anchored.x, 1 / slide.currZoomLevel);
  near(finalPoint.y, anchored.y, 1 / slide.currZoomLevel);
});

test('bounded zoom restores fit after an unbounded zoom', () => {
  const { slide } = createSlide({ width: 200, height: 100 });
  slide.zoomTo(2, { x: 300, y: 200 }, 0, true);
  slide.zoomTo(1, { x: 300, y: 200 }, 0, false);
  assert.deepEqual(slide.pan, { x: 400, y: 350 });
  assert.equal(slide.currZoomLevel, 1);
});

test('animated unbounded zoom retains anchor through resolution update', () => {
  const { slide, transitions, displayedSizes, events, stopped } = createSlide({ width: 200, height: 100 });
  slide.zoomTo(2, { x: 300, y: 200 }, 250, true);
  assert.deepEqual(slide.pan, { x: 500, y: 500 });
  assert.equal(stopped(), 1);
  assert.equal(transitions.length, 1);
  assert.equal(transitions[0].duration, 250);
  assert.equal(transitions[0].target, slide.container);
  assert.equal(transitions[0].transform, slide.getCurrentTransform());
  assert.equal(slide.currentResolution, 0);
  assert.equal(displayedSizes.length, 0);
  transitions[0].onComplete();
  assert.equal(slide.currentResolution, 2);
  assert.deepEqual(displayedSizes, [[400, 200]]);
  assert.deepEqual(slide.pan, { x: 500, y: 500 });
  assert.equal(slide.container.style.transform, slide.getCurrentTransform());
  assert.equal(events.filter(event => event.name === 'zoomPanUpdate').length, 1);
});

test('panTo still clamps after an unbounded zoom', () => {
  const { slide } = createSlide();
  slide.zoomTo(2, { x: 50, y: 50 }, 0, true);
  slide.panTo(999, -999);
  assert.deepEqual(slide.pan, { x: 0, y: -400 });
});

let failed = 0;
for (const { name, run } of cases) {
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}\n${error.stack}`);
  }
}
console.log(`${cases.length - failed}/${cases.length} passed`);
if (failed) process.exitCode = 1;
