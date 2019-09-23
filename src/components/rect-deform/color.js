export function colorMapJet (value, min = -1, max = 1) {
  // value (min ~ max) -> color: jet color map
  let color = new Float32Array(3)
  value = 2 * (value - min) / (max - min) - 1
  if (value < -1) {
    color.set([0.0, 0.0, 143.0 / 255.0], 0)
  } else if (value >= -1.0 && value < -0.78125) {
    color.set([0.0, 0.0, (143 + (value + 1) / 0.21875 * 112) / 255.0], 0)
  } else if (value >= -0.78125 && value < -0.28125) {
    color.set([0.0, (value + 0.78125) / 0.5, 1.0], 0)
  } else if (value >= -0.28125 && value < 0.21875) {
    color.set([(value + 0.28125) / 0.5, 1.0, 1 - (value + 0.28125) / 0.5], 0)
  } else if (value > 0.21875 && value < 0.71875) {
    color.set([1.0, 1 - (value - 0.21875) / 0.5, 0.0])
  } else if (value >= 0.71875 && value <= 1.0) {
    color.set([1.0 - 0.5 * (value - 0.71875) / 0.28125, 0.0, 0.0], 0)
  } else {
    color.set([0.5, 0.0, 0.0], 0)
  }
  return color
}
