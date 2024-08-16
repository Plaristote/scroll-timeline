import {TransformData} from "../src/transforms.js";
import toString from "../src/timelineValueToString.js";

describe("TransformData", function() {
  describe("fromString", function() {
    it("should register all the transform operations", function() {
      const v = TransformData.fromString("translate(0px, 0px) scale(0.5)");
      expect(v.parts.length).toBe(2);
      expect(v.parts[0].name).toBe("translate");
      expect(v.parts[1].name).toBe("scale");
    });

    it("should register all the values for each operation", function() {
      const v = TransformData.fromString("translate(0px, 50px) scale(0.5)");
      expect(v.parts.length).toBe(2);
      expect(v.parts[0].values.length).toBe(2);
      expect(v.parts[1].values.length).toBe(1);
      expect(toString(v.parts[0].values[0])).toBe("0px");
      expect(toString(v.parts[0].values[1])).toBe("50px");
      expect(toString(v.parts[1].values[0])).toBe("0.5");
    });
  });

  describe("toString", function() {
    it("should render a CSS transform property value", function() {
      const v = TransformData.fromString("translate(0px, 50px) scale(0.5) translate(1%, 2%)");
      expect(v.toString()).toBe("translate(0px, 50px) scale(0.5) translate(1%, 2%)");
    });
  });

  describe("makeIntermediateTransform", function() {
    it("should return itself when no other Transform is provided", function() {
      const v = TransformData.fromString("translate(0px, 50px)");
    
      expect(v.makeIntermediateTransform(null, 0.5)).toBe(v);
    });

    it("should return a new transform where all parts have had their values replaced with intermediate values", function() {
      const a = TransformData.fromString("translate(0px, 50px)");
      const b = TransformData.fromString("translate(100px, 500px)");
      const c = a.makeIntermediateTransform(b, 0.5);
      expect(c.parts.length).toBe(1);
      expect(c.parts[0].name).toBe("translate");
      expect(c.parts[0].values.length).toBe(2);
      expect(c.toString()).toBe("translate(50px, 275px)");
    });
  });
});
