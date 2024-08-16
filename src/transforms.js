import {findIntermediateValue} from "./intermediateValue.js";
import toTimelineValue from "./toTimelineValue.js";
import timelineValueToString from "./timelineValueToString.js";

const transformPartRegex = /\w+\([^)]+\)\s?/gm;
const transformPartExtract = /(\w+)\(([^)]+)\)/;

class TransformPart {
  constructor(name, values) {
    this.name = name;
    this.values = values ? values.split(',') : [];
  }

  get values() {
    return this.m_values;
  }

  set values(list) {
    this.m_values = [];
    list.forEach(value => this.pushValue(value));
  }

  pushValue(value) {
    this.values.push(toTimelineValue(value));
  }
}

export class TransformData {
  static fromString(string) {
    const self = new TransformData();
    const parts = string.match(transformPartRegex);

    parts.forEach(part => {
      const data = part.match(transformPartExtract);
      self.parts.push(new TransformPart(data[1], data[2]));
    });
    return self;
  }

  constructor(string) {
    this.parts = [];
  }

  toString() {
    let result = "";

    this.parts.forEach(part => {
      if (result.length) { result += ' '; }
      result += part.name + '(';
      for (let ii = 0 ; ii < part.values.length ; ++ii) {
        const value = part.values[ii];
        result += (ii > 0 ? ', ' : '') + timelineValueToString(value);
      }
      result += ')';
    });
    return result;
  }

  makeIntermediateTransform(other, progress) {
    if (other) {
      const self = new TransformData();

      for (let i = 0 ; i < this.parts.length ; ++i) {
        const beforePart = this.parts[i];
        const afterPart = other.parts[i];
        const selfPart = new TransformPart(beforePart.name);

        for (let ii = 0 ; ii < beforePart.values.length ; ++ii) {
          const beforeValue = beforePart.values[ii];
          const afterValue = afterPart.values[ii];
          const newValue = typeof beforeValue == "object"
            ? findIntermediateValue(beforeValue.value, afterValue.value, beforeValue.unit || afterValue.unit, progress)
            : findIntermediateValue(beforeValue, afterValue, null, progress);

          selfPart.values.push(newValue);
        }
        self.parts.push(selfPart);
      }
      return self;
    }
    return this;
  }
}

export function findIntermediateTransform(before, after, progress) {
  return before?.makeIntermediateTransform(after, progress).toString();
}
