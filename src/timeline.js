import TimelineTarget from "./target.js";
import PropertyState from "./propertyState.js";
import {WindowScrollContext} from "./context.js";

function sortSteps(a, b) {
  return a.startsAt - b.startsAt;
}

export default class ScrollTimeline {
  constructor(context) {
    this.context = context || (new WindowScrollContext(window));
    this.elements = [];
    this.properties = [];
    this.steps = [];
    this.context.onResize(this.updateGeometry.bind(this));
    this.context.onScroll(this.updateTimeline.bind(this));
    this.m_enabled = true;
  }

  get enabled() { return this.m_enabled; }
  set enabled(value) {
    this.m_enabled = value;
    if (value) { this.updateGeometry(); }
  }

  get offset() {
    return this.context.scrollY;
  }

  get currentStep() {
    for (let i = 0 ; i < this.steps.length ; ++i) {
      if (this.steps.startsAt > this.context.scrollY) {
        return this.steps[Math.max(0, i - 1)];
      }
    }
    return this.steps[this.steps.length - 1];
  }

  addStep(target, style) {
    const newStep = new TimelineTarget(this.context, target, style);

    newStep.properties.forEach(propertyName => {
      if (!this.properties.find(property => property.name === propertyName))
        this.properties.push(new PropertyState(this, propertyName));
    });
    this.steps.push(newStep);
    this.steps.sort(sortSteps);
  }

  addElement(element) {
    this.elements.push(element);
  }

  updateGeometry() {
    if (this.enabled) {
      this.steps.forEach(step => step.updateGeometry());
      this.updateTimeline();
    }
  }

  updateTimeline() {
    if (this.enabled) {
      window.runningTimeline = this;
      this.properties.forEach(property => property.updateTimeline());
      this.elements.forEach(element => {
        this.properties.forEach(property => {
          property.applyOn(element);
        });
      });
    }
  }
}

