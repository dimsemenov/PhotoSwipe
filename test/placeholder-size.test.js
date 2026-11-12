import { test } from 'node:test';
import assert from 'node:assert/strict';
import Placeholder from '../src/js/slide/placeholder.js';

function displayedBox(width, height) {
  const placeholder = Object.create(Placeholder.prototype);
  placeholder.element = { tagName: 'IMG', style: {} };
  placeholder.setDisplayedSize(width, height);

  const { style } = placeholder.element;
  const baseWidth = parseFloat(style.width);
  const baseHeight = parseFloat(style.height);
  const scale = Number(style.transform.match(/scale3d\(([^,]+),/)[1]);
  return {
    style,
    scale,
    boxWidth: baseWidth * scale,
    boxHeight: baseHeight * scale,
  };
}

test('IMG placeholder fills the target box when the thumbnail aspect ratio differs', () => {
  // Cropped 4:3 thumb, 3:2 full image (as in #2185)
  const { boxWidth, boxHeight, style } = displayedBox(1152, 768);
  assert.equal(boxWidth, 1152);
  assert.ok(Math.abs(boxHeight - 768) < 1e-9);
  assert.equal(style.height, `${250 * 768 / 1152}px`);
});

test('IMG placeholder of a matching aspect ratio still fills the target box', () => {
  const { boxWidth, boxHeight } = displayedBox(800, 800);
  assert.equal(boxWidth, 800);
  assert.equal(boxHeight, 800);
});

test('non-IMG placeholders still use width and height directly', () => {
  const placeholder = Object.create(Placeholder.prototype);
  placeholder.element = { tagName: 'DIV', style: {} };
  placeholder.setDisplayedSize(1152, 768);
  assert.equal(placeholder.element.style.width, '1152px');
  assert.equal(placeholder.element.style.height, '768px');
  assert.equal(placeholder.element.style.transform, undefined);
});
