import assert from "node:assert/strict";
import test from "node:test";
import {
  installSwipeBlocker,
  isBlockedSidebarSwipe,
  type SwipePayload,
} from "../src/gesture-filter";

function swipe(overrides: Partial<SwipePayload> = {}): SwipePayload {
  return {
    direction: "x",
    points: 1,
    startX: 100,
    startY: 100,
    x: 220,
    y: 105,
    ...overrides,
  };
}

test("blocks only single-finger horizontal swipe payloads", () => {
  assert.equal(isBlockedSidebarSwipe("swipe", swipe()), true);
  assert.equal(isBlockedSidebarSwipe("swipe", swipe({ direction: "y" })), false);
  assert.equal(isBlockedSidebarSwipe("swipe", swipe({ points: 2 })), false);
  assert.equal(isBlockedSidebarSwipe("layout-change", swipe()), false);
  assert.equal(isBlockedSidebarSwipe("swipe", null), false);
});

test("does not call the original trigger for a blocked swipe", () => {
  const calls: unknown[][] = [];
  const original = function (this: unknown, ...args: unknown[]) {
    calls.push(args);
    return "forwarded";
  };
  const workspace = { trigger: original };

  const cleanup = installSwipeBlocker(workspace);
  const result = workspace.trigger("swipe", swipe());

  assert.equal(result, undefined);
  assert.deepEqual(calls, []);
  cleanup();
});

test("forwards non-target events with the original receiver and return value", () => {
  const receiver = { marker: "workspace" };
  const calls: { receiver: unknown; args: unknown[] }[] = [];
  const original = function (this: unknown, ...args: unknown[]) {
    calls.push({ receiver: this, args });
    return "forwarded";
  };
  const workspace = Object.assign(receiver, { trigger: original });

  const cleanup = installSwipeBlocker(workspace);
  const result = workspace.trigger("swipe", swipe({ points: 2 }));

  assert.equal(result, "forwarded");
  assert.deepEqual(calls, [{ receiver, args: ["swipe", swipe({ points: 2 })] }]);
  cleanup();
});

test("cleanup restores the original trigger", () => {
  const original = function () {
    return "original";
  };
  const workspace = { trigger: original };

  const cleanup = installSwipeBlocker(workspace);
  cleanup();

  assert.equal(workspace.trigger, original);
  assert.equal(workspace.trigger(), "original");
});

test("cleanup removes the instance override when the original trigger was inherited", () => {
  const original = function () {
    return "inherited";
  };
  const prototype = { trigger: original };
  const workspace = Object.create(prototype) as { trigger: typeof original };

  const cleanup = installSwipeBlocker(workspace);
  cleanup();

  assert.equal(Object.prototype.hasOwnProperty.call(workspace, "trigger"), false);
  assert.equal(workspace.trigger, original);
});

test("cleanup leaves a later wrapper installed by another plugin intact", () => {
  const original = function () {
    return "original";
  };
  const workspace = { trigger: original };
  const cleanup = installSwipeBlocker(workspace);
  const ours = workspace.trigger;
  const later = function () {
    return "later";
  };
  workspace.trigger = later;

  cleanup();

  assert.equal(ours === workspace.trigger, false);
  assert.equal(workspace.trigger, later);
});

test("cleanup restores a wrapper that was already installed by another plugin", () => {
  const external = function () {
    return "external";
  };
  const workspace = { trigger: external };

  const cleanup = installSwipeBlocker(workspace);
  cleanup();

  assert.equal(workspace.trigger, external);
});

test("installing twice does not create nested blockers", () => {
  const original = function () {
    return "original";
  };
  const workspace = { trigger: original };

  const firstCleanup = installSwipeBlocker(workspace);
  const firstWrapper = workspace.trigger;
  const secondCleanup = installSwipeBlocker(workspace);

  assert.equal(workspace.trigger, firstWrapper);
  secondCleanup();
  assert.notEqual(workspace.trigger, original);
  firstCleanup();
  assert.equal(workspace.trigger, original);
});
