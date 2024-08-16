import {findIntermediateValue} from "./intermediateValue.js";
import {findIntermediateTransform} from "./transforms.js";

export default class PropertyState {
  constructor(timeline, name) {
    this.timeline = timeline;
    this.context = this.timeline.context;
    this.name = name;
  }

  updateTimeline() {
    const steps = this.timeline.steps;
    const position = this.context.scrollY;

    this.beforeStep = this.afterStep = null;
    for (let i = 0 ; i < steps.length ; ++i) {
      const step = steps[i];
      if (step.hasProperty(this.name)) {
        if (position >= step.startsAt) {
          this.beforeStep = step;
        } else {
          this.afterStep = step;
          break ;
        }
      }
    }
  }

  get progress() {
    if (this.afterStep && this.beforeStep) {
      const position = this.context.scrollY;
      const distance = this.afterStep.startsAt - this.beforeStep.startsAt;
      const delta    = this.beforeStep.startsAt - position;
      return Math.abs(delta / distance);
    }
    return 1;
  }

  applyOn(element) {
    const beforeValue = this.beforeStep?.property(this.name);
    const afterValue = this.afterStep?.property(this.name);
    let newValue = beforeValue;

    if (this.name == "transform") {
      newValue = findIntermediateTransform(beforeValue, afterValue, this.progress);
    } else {
      switch (typeof beforeValue) {
      case "object":
        newValue = findIntermediateValue(beforeValue.value, afterValue?.value, beforeValue.unit, this.progress);
        break ;
      case "number":
        newValue = findIntermediateValue(beforeValue, afterValue, null, this.progress);
        break ;
      }
    }
    if (element && element.style)
      element.style[this.name] = newValue;
    else 
      console.error("Element is not an element", element);
  }
}
