export interface SwipePayload {
  direction: string;
  points: number;
  startX?: number;
  startY?: number;
  x?: number;
  y?: number;
  [key: string]: unknown;
}

export interface SwipeEmitter {
  trigger: (eventName: string, ...args: unknown[]) => unknown;
  [key: string]: unknown;
}

export function isBlockedSidebarSwipe(eventName: string, payload: unknown): boolean {
  if (eventName !== "swipe" || payload === null || typeof payload !== "object") {
    return false;
  }

  const swipe = payload as Partial<SwipePayload>;
  return swipe.direction === "x" && swipe.points === 1;
}

const installedWrappers = new WeakMap<SwipeEmitter, () => void>();

export function installSwipeBlocker(emitter: SwipeEmitter): () => void {
  const existingCleanup = installedWrappers.get(emitter);
  if (existingCleanup) {
    return () => undefined;
  }

  const originalTrigger = emitter.trigger;
  const hadOwnTrigger = Object.prototype.hasOwnProperty.call(emitter, "trigger");
  const wrappedTrigger = function (this: SwipeEmitter, eventName: string, ...args: unknown[]) {
    if (isBlockedSidebarSwipe(eventName, args[0])) return undefined;
    return originalTrigger.apply(this, [eventName, ...args]);
  };

  emitter.trigger = wrappedTrigger;

  const cleanup = () => {
    if (installedWrappers.get(emitter) !== cleanup) return;
    installedWrappers.delete(emitter);
    if (emitter.trigger !== wrappedTrigger) return;
    if (hadOwnTrigger) {
      emitter.trigger = originalTrigger;
    } else {
      delete (emitter as { trigger?: SwipeEmitter["trigger"] }).trigger;
    }
  };

  installedWrappers.set(emitter, cleanup);
  return cleanup;
}
