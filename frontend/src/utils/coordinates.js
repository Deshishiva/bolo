export function toRelative(box, page) {
  return {
    x: box.left / page.width,
    y: box.top / page.height,
    width: box.width / page.width,
    height: box.height / page.height
  };
}

export function toPixels(pos, page) {
  return {
    left: pos.x * page.width,
    top: pos.y * page.height,
    width: pos.width * page.width,
    height: pos.height * page.height
  };
}
