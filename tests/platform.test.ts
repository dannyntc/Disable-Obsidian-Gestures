import assert from "node:assert/strict";
import test from "node:test";
import { isIpadOS } from "../src/platform";

test("accepts Obsidian iPad tablet detection", () => {
  assert.equal(
    isIpadOS(
      { isIosApp: true, isTablet: true },
      { platform: "MacIntel", maxTouchPoints: 5, userAgent: "Macintosh" },
    ),
    true,
  );
});

test("accepts iPadOS desktop-mode detection when the tablet flag is unavailable", () => {
  assert.equal(
    isIpadOS(
      { isIosApp: true, isTablet: false },
      { platform: "MacIntel", maxTouchPoints: 5, userAgent: "Macintosh" },
    ),
    true,
  );
});

test("does not activate on iPhone, Android, or desktop", () => {
  assert.equal(
    isIpadOS(
      { isIosApp: true, isTablet: false },
      { platform: "iPhone", maxTouchPoints: 5, userAgent: "iPhone" },
    ),
    false,
  );
  assert.equal(
    isIpadOS(
      { isIosApp: false, isTablet: true },
      { platform: "MacIntel", maxTouchPoints: 5, userAgent: "Macintosh" },
    ),
    false,
  );
});
