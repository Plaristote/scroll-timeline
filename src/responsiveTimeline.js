function timelinesFromData(data) {
  return Array.isArray(data.timeline) ? data.timeline : [data.timeline];
}

export default class ResponsiveTimeline {
  constructor() {
    this.timelines = [];
    window.addEventListener("resize", this.updateGeometry.bind(this));
  }

  addTimeline(timeline, checkFunction) {
    this.timelines.push({ timeline, checkFunction });
    return this;
  }

  updateGeometry() {
    this.timelines.forEach(data => {
      const checked = data.checkFunction();
      const list = timelinesFromData(data);
      list.forEach(timeline => timeline.enabled = checked);
    });
  }

  updateTimeline() {
    this.timelines.forEach(data => {
      const list = timelinesFromData(data);
      list.forEach(timeline => timeline.updateTimeline());
    });
  }
}
