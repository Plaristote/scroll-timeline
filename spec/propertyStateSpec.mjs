import PropertyState from "../src/propertyState.js";
import ScrollTimeline from "../src/timeline.js";
import ScrollTarget from "../src/target.js";

const testContext = new class {
  constructor() {
    this.scrollY = 0;
    this.height = 800;
    this.contentHeight = 2000;
  }

  onResize() {}
  onScroll() {}
}

class PseudoElement {
  constructor() {
    this.style = {};
  }
}

describe("PropertyState", function() {
  describe("updateTimeline", function() {
    it("should initialize the beforeStep and afterStep property", function() {
      const timeline = new ScrollTimeline(testContext);

      timeline.context.scrollY = 0;

      timeline.addStep("0%", {
        opacity: 0
      });
      timeline.addStep("100%", {
        opacity: 1
      });

      const propertyState = new PropertyState(timeline, "opacity");

      propertyState.updateTimeline();
      expect(propertyState.beforeStep).toBe(timeline.steps[0]);
      expect(propertyState.afterStep).toBe(timeline.steps[1]);
    });

    it("should update the beforeStep and afterStep property", function() {
      const timeline = new ScrollTimeline(testContext);

      timeline.addStep("0%", {
        top: "0px"
      });
      timeline.addStep("25%", {
        top: "10px"
      });
      timeline.addStep("100%", {
        top: "100px"
      });

      expect(timeline.steps[0].startsAt).toBe(0);
      expect(timeline.steps[1].startsAt).toBe(1200 * 0.25);
      expect(timeline.steps[2].startsAt).toBe(1200);

      const propertyState = new PropertyState(timeline, "top");

      timeline.context.scrollY = 800;
      propertyState.updateTimeline();
      expect(propertyState.beforeStep).toBe(timeline.steps[1]);
      expect(propertyState.afterStep).toBe(timeline.steps[2]);

      timeline.context.scrollY = 250;
      propertyState.updateTimeline();
      expect(propertyState.beforeStep).toBe(timeline.steps[0]);
      expect(propertyState.afterStep).toBe(timeline.steps[1]);

      timeline.context.scrollY = 1201;
      propertyState.updateTimeline();
      expect(propertyState.beforeStep).toBe(timeline.steps[2]);
      expect(propertyState.afterStep).toBe(null);
    });
  });

  describe("progress", function() {
    it("should return the timeline progress between beforeStep and afterStep", function() {
      const timeline = new ScrollTimeline(testContext);

      timeline.addStep("0%", {
        top: "0px"
      });
      timeline.addStep("25%", {
        top: "10px"
      });
      timeline.addStep("100%", {
        top: { value: 100, unit: "px" }
      });

      expect(timeline.steps[0].startsAt).toBe(0);
      expect(timeline.steps[1].startsAt).toBe(1200 * 0.25);
      expect(timeline.steps[2].startsAt).toBe(1200);

      const propertyState = new PropertyState(timeline, "top");

      timeline.context.scrollY = 800;
      propertyState.updateTimeline();
      expect(propertyState.progress).toBe(5/9);

      timeline.context.scrollY = 250;
      propertyState.updateTimeline();
      expect(propertyState.progress).toBe(25/30);

      timeline.context.scrollY = 1201;
      propertyState.updateTimeline();
      expect(propertyState.progress).toBe(1);
    });
  });

  describe("applyOn", function() {
    it("should apply the appropriate intermediate value on an element", function() {
      const timeline = new ScrollTimeline(testContext);

      timeline.addStep("0%", {
        top: { value: 0, unit: "px" }
      });
      timeline.addStep("25%", {
        top: { value: 10, unit: "px" }
      });
      timeline.addStep("100%", {
        top: { value: 100, unit: "px" }
      });
      
      const propertyState = new PropertyState(timeline, "top");
      const el = new PseudoElement();

      timeline.context.scrollY = 800;
      propertyState.updateTimeline();
      propertyState.applyOn(el);
      expect(el.style.top).toBe(`${10+90*(5/9)}px`);

      timeline.context.scrollY = 250;
      propertyState.updateTimeline();
      propertyState.applyOn(el);
      expect(el.style.top).toBe(`${(25/3)}px`);
    });

    it("should apply the appropriate raw value on an element", function() {
      const timeline = new ScrollTimeline(testContext);

      timeline.addStep("0%", {
        display: "none"
      });
      timeline.addStep("25%", {
        display: "block"
      });
      timeline.addStep("100%", {
        display: "flex"
      });
      
      const propertyState = new PropertyState(timeline, "display");
      const el = new PseudoElement();

      timeline.context.scrollY = 800;
      propertyState.updateTimeline();
      propertyState.applyOn(el);
      expect(el.style.display).toBe("block");

      timeline.context.scrollY = 250;
      propertyState.updateTimeline();
      propertyState.applyOn(el);
      expect(el.style.display).toBe("none");

      timeline.context.scrollY = 1200;
      propertyState.updateTimeline();
      propertyState.applyOn(el);
      expect(el.style.display).toBe("flex");
    });
  });
});

