export function convertToPdfCoords(pos, pageWidth, pageHeight) {
  const x = pos.x * pageWidth;

  
  const y =
    pageHeight -
    pos.y * pageHeight -
    pos.height * pageHeight;

  return {
    x,
    y,
    width: pos.width * pageWidth,
    height: pos.height * pageHeight
  };
}
