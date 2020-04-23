import {
  fetchIcon,
  FetchIconProps,
  iconCache,
  normalizeIconName,
  requestCache,
  scaleToPx
} from "./utils";

describe("utils", () => {
  describe("scaleToPx", () => {
    it("maps scale values to sizes", () => {
      expect(scaleToPx["s"]).toBe(16);
      expect(scaleToPx["m"]).toBe(24);
      expect(scaleToPx["l"]).toBe(32);
    });
  });

  describe("fetchIcon", () => {
    it("avoids fetching if icon data is available", async () => {
      expect(Object.keys(requestCache)).toHaveLength(0);
      expect(Object.keys(iconCache)).toHaveLength(0);

      const smallBanana: FetchIconProps = {
        icon: "banana",
        scale: "s"
      };
      const mediumBanana: FetchIconProps = {
        icon: "banana",
        scale: "m"
      };
      const circle: FetchIconProps = {
        icon: "circleF",
        scale: "s"
      };
      const circleKebab: FetchIconProps = {
        icon: "circle-f",
        scale: "m"
      };
      const circleCamel: FetchIconProps = {
        icon: "circleF",
        scale: "m"
      };

      await fetchIcon(smallBanana);
      expect(Object.keys(requestCache)).toHaveLength(1);
      expect(Object.keys(iconCache)).toHaveLength(1);

      await fetchIcon(mediumBanana);
      expect(Object.keys(requestCache)).toHaveLength(2);
      expect(Object.keys(iconCache)).toHaveLength(2);

      await fetchIcon(circle);
      expect(Object.keys(requestCache)).toHaveLength(3);
      expect(Object.keys(iconCache)).toHaveLength(3);

      await fetchIcon(circleKebab);
      expect(Object.keys(requestCache)).toHaveLength(4);
      expect(Object.keys(iconCache)).toHaveLength(4);

      await fetchIcon(smallBanana);
      await fetchIcon(mediumBanana);
      await fetchIcon(circleCamel);
      expect(Object.keys(requestCache)).toHaveLength(4);
      expect(Object.keys(iconCache)).toHaveLength(4);
    });

    it("normalizes icon name", () => {
      // used internally by fetchIcon
      expect(normalizeIconName("aZ")).toBe("aZ");
      expect(normalizeIconName("a-z")).toBe("aZ");
      expect(normalizeIconName("2d-explore")).toBe("i2DExplore");
      expect(normalizeIconName("2d-explore")).toBe("i2DExplore");
      expect(normalizeIconName("2DExplore")).toBe("i2DExplore");
    });
  });
});
