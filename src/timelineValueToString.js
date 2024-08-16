export default function (value) {
  if (typeof value == "object")
    return `${value.value}${value.unit}`;
  return value;
}
