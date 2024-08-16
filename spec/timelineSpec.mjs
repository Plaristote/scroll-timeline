import ScrollTimeline from "../src/timeline.js";

const testContext = new class {
  constructor() {
    this.scrollY = 0;
    this.height = 800;
    this.contentHeight = 2000;
  }

  onResize() {}
  onScroll() {}
}

describe("ScrollTimeline", function() {
  describe("offset", function() {
    it("should return the context offset", function() {
      const timeline = new ScrollTimeline(testContext);

      testContext.scrollY = 123;
      expect(timeline.offset).toBe(123);
    });
  });

  describe("addStep", function() {
    it("should add a TimelineTarget to the steps", function() {
      const timeline = new ScrollTimeline(testContext);
      
      timeline.addStep("0%", { opacity: 0 });
      expect(timeline.steps.length).toBe(1);
      expect(timeline.steps[0].target).toBe("0%");
    });

    it("should sort the steps by offset", function() {
      const timeline = new ScrollTimeline(testContext);
      
      timeline.addStep("50%", { opacity: 1 });
      timeline.addStep("25%", { opacity: 0.7 });
      timeline.addStep("0%", { opacity: 0 });
      expect(timeline.steps.length).toBe(3);
      expect(timeline.steps[0].target).toBe("0%");
      expect(timeline.steps[1].target).toBe("25%");
      expect(timeline.steps[2].target).toBe("50%");
    });
  });
});
