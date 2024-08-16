import {TransformData} from "./transforms.js";
import toTimelineValue from "./toTimelineValue.js";
const stringToPixelRegex = /^(-?[0-9]*(\.[0-9]+)?)(%|vh|px)$/;

function stringToPixel(context, string) {
  const results = string.match(stringToPixelRegex);  
  const value = parseFloat(results[1]);
  const ratio = value / 100;
  const unit = results[3];

  switch (unit) {
  case "px":
    return value;
  case "vh":
    return context.height * ratio;
  // case "%":
  //  break ;
  }
  return (context.contentHeight - context.height) * ratio;
}

function targetToPixel(context, target) {
  switch (typeof target) {
  case "function":
    return target(context);
  case "string":
    return stringToPixel(context, target);
  case "object":
    return context.elementTop(target);
  case "number":
    return target;
  }
  return 0;
}

export default class TimelineTarget {
  constructor(context, target, style = {}) {
    this.context = context;
    this.target = target;
    this.style = {};
    for (let key in style) {
      if (key == "transform")
        this.style.transform = TransformData.fromString(style.transform);
      else
        this.style[key] = toTimelineValue(style[key]);
    }
    this.updateGeometry();
  }

  updateGeometry() {
    this.startsAt = targetToPixel(this.context, this.target);
  }

  get properties() {
    return Object.keys(this.style);
  }

  hasProperty(name) {
    return this.style[name] !== undefined;
  }

  property(name) {
    return this.style[name];
  }
}

