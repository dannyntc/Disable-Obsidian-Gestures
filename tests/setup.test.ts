import assert from "node:assert/strict";
import test from "node:test";
import { setupIpadGestureBlocker } from "../src/setup";

const ipad = {
  isIosApp: true,
  isTablet: true,
};

test("installs the blocker on iPadOS", () => {
  let forwarded = 0;
  const workspace = {
    trigger(eventName: string, ..._args: unknown[]) {
      if (eventName === "swipe") forwarded++;
      return "original";
    },
  };

  const cleanup = setupIpadGestureBlocker(ipad, { platform: "MacIntel", maxTouchPoints: 5 }, workspace);
  workspace.trigger("swipe", { direction: "x", points: 1 });
  assert.equal(forwarded, 0);
  cleanup();
  workspace.trigger("swipe", { direction: "x", points: 1 });
  assert.equal(forwarded, 1);
});

test("leaves non-iPad platforms unchanged", () => {
  let forwarded = 0;
  const workspace = {
    trigger(..._args: unknown[]) {
      forwarded++;
    },
  };

  const cleanup = setupIpadGestureBlocker(
    { isIosApp: true, isTablet: false },
    { platform: "iPhone", maxTouchPoints: 5 },
    workspace,
  );
  workspace.trigger("swipe", { direction: "x", points: 1 });
  cleanup();
  assert.equal(forwarded, 1);
});

test("reports an unavailable dispatcher without throwing", () => {
  const messages: string[] = [];
  const cleanup = setupIpadGestureBlocker(
    ipad,
    { platform: "MacIntel", maxTouchPoints: 5 },
    {} as { trigger: (...args: unknown[]) => unknown },
    (message: string) => messages.push(message),
  );

  cleanup();
  assert.deepEqual(messages, ["Obsidian did not expose its swipe dispatcher; sidebar swipes remain enabled."]);
});
