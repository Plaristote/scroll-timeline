const amountRegex = /^(-?[0-9]*(\.[0-9]+)?)(.*)$/;

export default function (value) {
  if (typeof value == "string") {
    const match = value.trim().match(amountRegex);
    if (match && match[1]) {
      const number = parseFloat(match[1]);
      value = { value: number, unit: match[3] };
    }
  }
  return value;
}
