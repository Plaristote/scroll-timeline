export default class {
  constructor() {
    this.timelines = [];
  }

  updateGeometry() {
    this.timelines.forEach(timeline => {
      timeline.updateGeometry();
    });
  }

  updateTimeline() {
    this.timelines.forEach(timeline => {
      timeline.updateTimeline();
    });
  }
}
