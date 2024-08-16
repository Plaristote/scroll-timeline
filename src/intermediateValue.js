export function findIntermediateValue(min, max, unit, progress) {
  let result = min;

  if (max !== undefined) {
    const distance = max - min;
    result += distance * progress;
  }
  return unit ? `${result}${unit}` : result;
}
