export function fitImage(imgW, imgH, boxW, boxH) {
  const scale = Math.min(boxW / imgW, boxH / imgH);

  return {
    width: imgW * scale,
    height: imgH * scale
  };
}
