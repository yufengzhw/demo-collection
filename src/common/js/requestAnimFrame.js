// requestAnimationFrame兼容性处理
export const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.webkitRequestAnimationFrame
})()
